/* Rankings pages (ROS + Weekly): position tabs, tiers/list views, player pop-up. */
(async function () {
  'use strict';
  const { CONFIG, esc, ordinal, num1, fppgClass, rankClass } = FFK;
  const mode = document.body.dataset.page; // 'ros' or 'weekly'
  const main = document.getElementById('main');
  const ICON_GRID = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>';
  const ICON_LIST = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>';

  let data, positions = {}, available = [];
  const state = { pos: 'QB', view: 'tiers' };
  let entriesById = {}; // player id -> ranking entry shown in the pop-up

  try {
    const { site } = await FFK.loadCore();
    FFK.renderShell(site);
    data = await FFK.loadJSON(mode === 'ros' ? FFK.paths.ros(site) : FFK.paths.weekly(site));
    positions = FFK.normalizeRankings(data);
    available = CONFIG.positions.filter(p => positions[p]);
    readState();
    renderPage();
    window.addEventListener('hashchange', () => { readState(); renderControls(); renderBoard(); });
  } catch (err) {
    FFK.showError(err);
    return;
  }

  // "Wk 5-18" style label for ROS rankings.
  function weeksLabel() {
    if (data.weeksLabel) return data.weeksLabel;
    return data.fromWeek ? `Wk ${data.fromWeek}-18` : 'ROS';
  }

  function readState() {
    const [pos, view] = FFK.readHash().split('-');
    const upper = (pos || '').toUpperCase();
    state.pos = available.includes(upper) ? upper : (available[0] || 'QB');
    state.view = view === 'list' ? 'list' : 'tiers';
  }

  function setState(changes) {
    Object.assign(state, changes);
    FFK.writeHash(`${state.pos.toLowerCase()}-${state.view}`);
    renderControls();
    renderBoard();
  }

  // ---- Page layout ----
  function renderPage() {
    const week = data.week;
    const eyebrow = data.eyebrow || (mode === 'ros'
      ? (data.fromWeek ? `Weeks ${data.fromWeek}-18` : 'Rest of season')
      : `Week ${week}`);
    const title = data.title || (mode === 'ros' ? 'Rest of Season' : `Week ${week} Rankings`);
    document.title = `${title} · Fantasy Football Kingdom`;

    main.innerHTML = `
      <section class="hero">
        <div class="hero-text">
          <p class="eyebrow">${esc(eyebrow)} ${FFK.sampleBadge(data)}</p>
          <h1 class="display">${esc(title)}</h1>
          ${FFK.metaLine(data)}
        </div>
        <div class="hero-controls">
          <div class="pos-tabs" role="tablist" aria-label="Position"></div>
          <div class="view-toggle" role="group" aria-label="View">
            <button type="button" data-view="tiers">${ICON_GRID}<span>Tiers</span></button>
            <button type="button" data-view="list">${ICON_LIST}<span>List</span></button>
          </div>
        </div>
      </section>
      <div class="legend" id="legend"></div>
      <div id="board"></div>
      <p class="hint">Tap any player for their full card.</p>
      <div id="sources"></div>`;

    main.querySelector('.pos-tabs').innerHTML = available
      .map(p => `<button type="button" role="tab" class="pos-tab" data-pos="${p}">${p}</button>`).join('');

    main.querySelector('.pos-tabs').addEventListener('click', e => {
      const b = e.target.closest('[data-pos]');
      if (b) setState({ pos: b.dataset.pos });
    });
    main.querySelector('.view-toggle').addEventListener('click', e => {
      const b = e.target.closest('[data-view]');
      if (b) setState({ view: b.dataset.view });
    });
    const board = document.getElementById('board');
    const open = id => FFK.openPlayer(id, { entry: entriesById[id], page: mode });
    board.addEventListener('click', e => {
      const el = e.target.closest('[data-id]');
      if (el) open(el.dataset.id);
    });
    board.addEventListener('keydown', e => {
      const el = e.target.closest('tr[data-id]');
      if (el && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        open(el.dataset.id);
      }
    });

    renderControls();
    renderBoard();
  }

  function renderControls() {
    main.querySelectorAll('.pos-tab').forEach(b => {
      const on = b.dataset.pos === state.pos;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', on);
    });
    main.querySelectorAll('.view-toggle button').forEach(b => {
      b.classList.toggle('is-active', b.dataset.view === state.view);
      b.setAttribute('aria-pressed', b.dataset.view === state.view);
    });
    renderLegend();
    const block = positions[state.pos];
    document.getElementById('sources').innerHTML = FFK.sourcesLine(data, block && block.sources);
  }

  function renderLegend() {
    const pos = state.pos;
    const [hi, lo] = CONFIG.fppg[pos] || CONFIG.fppg.FLEX;
    const t = CONFIG.rank.toughMax, e = CONFIG.rank.easyMin;
    const rankLabel = mode === 'ros'
      ? `ROS schedule vs ${pos} (${weeksLabel()})`
      : (pos === 'DST' ? 'Opp. offense matchup vs DST' : `Opp. defense rank vs ${pos}`);
    document.getElementById('legend').innerHTML = `
      <span class="legend-group"><b>FPPG</b>
        <span class="sw c-good">${hi}+</span><span class="sw c-mid">${lo}–${hi}</span><span class="sw c-bad">under ${lo}</span></span>
      <span class="legend-group"><b>${esc(rankLabel)}</b>
        <span class="sw c-bad">1–${t} toughest</span><span class="sw c-mid">${t + 1}–${e - 1}</span><span class="sw c-good">${e}–32 easiest</span></span>
      ${mode === 'weekly' ? '<span class="legend-group"><span class="sw c-blue">O/U game total</span></span>' : ''}`;
  }

  // ---- Board ----
  function currentTiers() {
    const block = positions[state.pos];
    const tiers = block ? block.tiers : [];
    entriesById = {};
    tiers.forEach(t => t.entries.forEach(e => {
      e.sub = mode === 'ros' ? weeksLabel() : (FFK.matchupLabel(e) || 'Bye');
      e.rankLabel = `${state.pos}${e.rank}`;
      entriesById[e.id] = e;
    }));
    return tiers;
  }

  function renderBoard() {
    const board = document.getElementById('board');
    const tiers = currentTiers();
    if (!tiers.length) {
      board.innerHTML = `<div class="empty-box">${state.pos} rankings are coming soon.</div>`;
      return;
    }
    board.innerHTML = state.view === 'tiers' ? tiersView(tiers) : listView(tiers);
  }

  // Small "!" marker when a player has injury or data notes.
  function flagMark(e) {
    if (!e.flags.length) return '';
    return `<span class="flag-mark" title="${esc(e.flags.join(' • '))}" aria-label="Has notes">!</span>`;
  }

  function tiersView(tiers) {
    return `<div class="tier-board">${tiers.map(t => `
      <div class="tier-row">
        <div class="tier-label" style="background:${esc(t.color)}" title="${esc(t.name)}">${esc(t.tier)}</div>
        <div class="tier-cards">${t.entries.map(tierCard).join('')}</div>
      </div>`).join('')}</div>`;
  }

  function tierCard(r) {
    const posKey = r.p.pos || state.pos;
    return `<button type="button" class="tcard" data-id="${esc(r.id)}" aria-label="${esc(FFK.fullName(r.p))}, rank ${r.rank}">
      <span class="tcard-left">
        <span class="tcard-rank">${r.rank}.${flagMark(r)}</span>
        <span class="tcard-sub">${esc(r.sub)}</span>
        ${FFK.teamChip(r.p.team)}
      </span>
      <span class="tcard-stats">
        <span class="${fppgClass(r.fppg, posKey)}">${num1(r.fppg)}</span>
        <span class="${rankClass(r.matchRank)}">${ordinal(r.matchRank)}</span>
        ${mode === 'weekly' ? `<span class="c-blue">${num1(r.ou)}</span>` : ''}
      </span>
      ${r.p.pos === 'DST' ? `<span class="tcard-badge">${FFK.avatar(r.p)}</span>` : FFK.silhouette(r.p)}
      <span class="tcard-name">${esc(FFK.shortName(r.p))}</span>
    </button>`;
  }

  function listView(tiers) {
    const cols = mode === 'ros'
      ? '<th class="num">ROS Sched</th><th class="num">FPPG</th>'
      : '<th class="num">Opp D</th><th class="num">O/U</th><th class="num">FPPG</th>';
    const span = mode === 'ros' ? 4 : 5;
    return `<div class="list-wrap"><table class="rank-table">
      <thead><tr><th class="rank-col">#</th><th>Player</th>${cols}</tr></thead>
      <tbody>${tiers.map(t => `
        <tr class="tier-head"><td colspan="${span}">
          <span class="tier-pill" style="background:${esc(t.color)}">${esc(t.tier)}</span>
          <span class="tier-name">${esc(t.name)}</span>
          <span class="tier-count">${t.entries.length} player${t.entries.length === 1 ? '' : 's'}</span>
        </td></tr>
        ${t.entries.map(listRow).join('')}`).join('')}
      </tbody></table></div>`;
  }

  function listRow(r) {
    const posKey = r.p.pos || state.pos;
    const extra = mode === 'weekly' ? `<td class="num c-blue">${num1(r.ou)}</td>` : '';
    return `<tr data-id="${esc(r.id)}" tabindex="0">
      <td class="rank-col">${r.rank}</td>
      <td><span class="player-cell">${FFK.avatar(r.p)}
        <span><span class="player-name">${esc(FFK.fullName(r.p))}${flagMark(r)}</span>
        <span class="player-sub">${esc(r.p.team)}${state.pos === 'FLEX' ? ' · ' + esc(r.p.pos) : ''} ${esc(r.sub)}</span></span>
      </span></td>
      <td class="num ${rankClass(r.matchRank)}">${ordinal(r.matchRank)}</td>
      ${extra}
      <td class="num ${fppgClass(r.fppg, posKey)}">${num1(r.fppg)}</td>
    </tr>`;
  }
})();
