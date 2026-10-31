/* Rankings pages (ROS + Weekly): position tabs, tiers/list views, player search,
   week picker, rank changes and player pop-up. */
(async function () {
  'use strict';
  const { CONFIG, esc, ordinal, num1, fppgClass, rankClass } = FFK;
  const mode = document.body.dataset.page; // 'ros' or 'weekly'
  const main = document.getElementById('main');
  const ICON_GRID = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>';
  const ICON_LIST = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>';
  const ICON_SEARCH = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';

  let site, data, week, weeks = [], positions = {}, available = [];
  const state = { pos: 'QB', view: 'tiers', player: null };
  let entriesById = {}; // player id -> ranking entry for the position on screen
  const lookup = {};    // player id -> ranking entry in their own position (search + shared links)
  let prev = null;      // { label, ranks } from the previous week's file, for ▲/▼ changes

  try {
    ({ site } = await FFK.loadCore());
    FFK.renderShell(site);
    weeks = (site.weeks || [site.currentWeek]).slice().sort((a, b) => a - b);
    const asked = Number(new URLSearchParams(location.search).get('week'));
    week = mode === 'weekly' && weeks.includes(asked) ? asked : site.currentWeek;
    data = await FFK.loadJSON(mode === 'ros' ? FFK.paths.ros(site) : FFK.paths.weekly(site, week));
    positions = FFK.normalizeRankings(data);
    available = CONFIG.positions.filter(p => positions[p]);
    prepareEntries();
    prev = await loadPrevious();
    readState();
    renderPage();
    if (state.player) openCard(state.player);
    window.addEventListener('hashchange', () => {
      readState();
      renderControls();
      renderBoard();
      if (state.player) openCard(state.player);
    });
  } catch (err) {
    FFK.showError(err);
    return;
  }

  // "Wk 5-18" style label for ROS rankings.
  function weeksLabel() {
    if (data.weeksLabel) return data.weeksLabel;
    return data.fromWeek ? `Wk ${data.fromWeek}-18` : 'ROS';
  }

  // Labels every entry once, and indexes each player under their own position (FLEX skipped).
  function prepareEntries() {
    Object.entries(positions).forEach(([pos, block]) => block.tiers.forEach(t => t.entries.forEach(e => {
      e.sub = mode === 'ros' ? weeksLabel() : (FFK.matchupLabel(e) || 'Bye');
      e.rankLabel = `${pos}${e.rank}`;
      if (pos !== 'FLEX' && !lookup[e.id]) lookup[e.id] = e;
    })));
  }

  // Previous rankings to compare against: last published week (weekly) or last saved ROS snapshot.
  async function loadPrevious() {
    const before = mode === 'ros'
      ? FFK.weekBefore(site.rosHistory, data.week || site.currentWeek)
      : FFK.weekBefore(weeks, week);
    if (before == null) return null;
    const path = mode === 'ros' ? FFK.paths.rosHistory(site, before) : FFK.paths.weekly(site, before);
    try {
      return { week: before, ranks: FFK.rankMap(await FFK.loadJSON(path)) };
    } catch (e) {
      console.warn(`Rank changes unavailable: ${e.message}`);
      return null;
    }
  }

  // ---- URL hash state: #rb-tiers or #rb-tiers/bijan-robinson ----
  function readState() {
    const [board, player] = FFK.readHash().split('/');
    const [pos, view] = (board || '').split('-');
    const upper = (pos || '').toUpperCase();
    state.pos = available.includes(upper) ? upper : (available[0] || 'QB');
    state.view = view === 'list' ? 'list' : 'tiers';
    state.player = player && FFK.players[player] ? player : null;
  }

  function hashValue() {
    return `${state.pos.toLowerCase()}-${state.view}${state.player ? '/' + state.player : ''}`;
  }

  function setState(changes) {
    Object.assign(state, changes);
    FFK.writeHash(hashValue());
    renderControls();
    renderBoard();
  }

  function openCard(id) {
    state.player = id;
    FFK.writeHash(hashValue());
    FFK.openPlayer(id, {
      entry: entriesById[id] || lookup[id],
      page: mode,
      shareUrl: location.href,
      onClose: () => { state.player = null; FFK.writeHash(hashValue()); }
    });
  }

  // ---- Page layout ----
  function renderPage() {
    const eyebrow = data.eyebrow || (mode === 'ros'
      ? (data.fromWeek ? `Weeks ${data.fromWeek}-18` : 'Rest of season')
      : `Week ${data.week}`);
    const title = data.title || (mode === 'ros' ? 'Rest of Season' : `Week ${data.week} Rankings`);
    const past = mode === 'weekly' && week !== site.currentWeek;
    document.title = `${title} · Fantasy Football Kingdom`;

    main.innerHTML = `
      <section class="hero">
        <div class="hero-text">
          <p class="eyebrow">${esc(eyebrow)} ${past ? '<span class="past-badge">Past week</span>' : ''} ${FFK.sampleBadge(data)}</p>
          <h1 class="display">${esc(title)}</h1>
          ${FFK.metaLine(data)}
          ${mode === 'weekly' && weeks.length > 1 ? weekPicker() : ''}
        </div>
        <div class="hero-controls">
          <div class="pos-tabs" role="tablist" aria-label="Position"></div>
          <div class="view-toggle" role="group" aria-label="View">
            <button type="button" data-view="tiers">${ICON_GRID}<span>Tiers</span></button>
            <button type="button" data-view="list">${ICON_LIST}<span>List</span></button>
          </div>
          <div class="search">
            <label class="search-box">${ICON_SEARCH}
              <input type="search" placeholder="Find a player" autocomplete="off" aria-label="Find a player"
                role="combobox" aria-expanded="false" aria-controls="search-results" aria-autocomplete="list">
            </label>
            <ul class="search-results" id="search-results" role="listbox" hidden></ul>
          </div>
        </div>
      </section>
      <div class="legend" id="legend"></div>
      <div id="board"></div>
      <p class="hint">Tap any player for their full card and notes.</p>
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
    const picker = main.querySelector('.week-picker select');
    if (picker) {
      picker.addEventListener('change', () => {
        const w = Number(picker.value);
        const hash = `#${state.pos.toLowerCase()}-${state.view}`;
        location.href = w === site.currentWeek ? `weekly.html${hash}` : `weekly.html?week=${w}${hash}`;
      });
    }
    const board = document.getElementById('board');
    board.addEventListener('click', e => {
      const el = e.target.closest('[data-id]');
      if (el) openCard(el.dataset.id);
    });
    board.addEventListener('keydown', e => {
      const el = e.target.closest('tr[data-id]');
      if (el && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        openCard(el.dataset.id);
      }
    });
    setupSearch();

    renderControls();
    renderBoard();
  }

  function weekPicker() {
    const options = weeks.slice().reverse().map(w =>
      `<option value="${w}"${w === week ? ' selected' : ''}>Week ${w}${w === site.currentWeek ? ' (current)' : ''}</option>`).join('');
    return `<label class="week-picker"><span>Showing</span><select>${options}</select></label>`;
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
      ${mode === 'weekly' ? '<span class="legend-group"><span class="sw c-blue">O/U game total</span></span>' : ''}
      ${prevRanks() ? `<span class="legend-group"><b>Rank change vs Week ${prev.week}</b>
        <span class="move move-up">▲ up</span><span class="move move-down">▼ down</span><span class="move move-new">New</span></span>` : ''}`;
  }

  // ---- Rank changes ----
  function prevRanks() {
    return prev && prev.ranks[state.pos];
  }

  function moveBadge(r) {
    const ranks = prevRanks();
    if (!ranks) return '';
    const before = ranks[r.id];
    if (before == null) return `<span class="move move-new" title="Not ranked in Week ${prev.week}">New</span>`;
    const diff = before - r.rank;
    if (!diff) return `<span class="move move-same" title="Same rank as Week ${prev.week}">–</span>`;
    const up = diff > 0;
    return `<span class="move ${up ? 'move-up' : 'move-down'}" title="${up ? 'Up' : 'Down'} ${Math.abs(diff)} since Week ${prev.week} (was ${state.pos}${before})">${up ? '▲' : '▼'}${Math.abs(diff)}</span>`;
  }

  // ---- Board ----
  function currentTiers() {
    const block = positions[state.pos];
    const tiers = block ? block.tiers : [];
    entriesById = {};
    tiers.forEach(t => t.entries.forEach(e => { entriesById[e.id] = e; }));
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
        <span class="tcard-rank">${r.rank}.${flagMark(r)}${moveBadge(r)}</span>
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
    const moves = prevRanks() ? `<th class="num move-col">vs Wk ${prev.week}</th>` : '';
    const cols = mode === 'ros'
      ? '<th class="num">ROS Sched</th><th class="num">FPPG</th>'
      : '<th class="num">Opp D</th><th class="num">O/U</th><th class="num">FPPG</th>';
    const span = (mode === 'ros' ? 4 : 5) + (moves ? 1 : 0);
    return `<div class="list-wrap"><table class="rank-table">
      <thead><tr><th class="rank-col">#</th><th>Player</th>${moves}${cols}</tr></thead>
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
    const move = prevRanks() ? `<td class="num move-col">${moveBadge(r)}</td>` : '';
    const extra = mode === 'weekly' ? `<td class="num c-blue">${num1(r.ou)}</td>` : '';
    return `<tr data-id="${esc(r.id)}" tabindex="0">
      <td class="rank-col">${r.rank}${move ? `<span class="rank-move">${moveBadge(r)}</span>` : ''}</td>
      <td><span class="player-cell">${FFK.avatar(r.p)}
        <span><span class="player-name">${esc(FFK.fullName(r.p))}${flagMark(r)}</span>
        <span class="player-sub">${esc(r.p.team)}${state.pos === 'FLEX' ? ' · ' + esc(r.p.pos) : ''} ${esc(r.sub)}</span>
        ${r.flags.length ? `<span class="player-note">${esc(r.flags[0])}</span>` : ''}</span>
      </span></td>
      ${move}
      <td class="num ${rankClass(r.matchRank)}">${ordinal(r.matchRank)}</td>
      ${extra}
      <td class="num ${fppgClass(r.fppg, posKey)}">${num1(r.fppg)}</td>
    </tr>`;
  }

  // ---- Player search ----
  function setupSearch() {
    const input = main.querySelector('.search input');
    const list = main.querySelector('.search-results');
    const players = Object.values(lookup);
    let matches = [], active = 0;

    const simple = s => s.toLowerCase().replace(/[^a-z0-9 ]/g, '');

    function find(q) {
      q = simple(q.trim());
      if (!q) return [];
      return players
        .map(e => {
          const name = simple(FFK.fullName(e.p));
          const starts = name.startsWith(q) || simple(e.p.last || '').startsWith(q);
          return { e, score: starts ? 0 : name.includes(q) ? 1 : 2 };
        })
        .filter(m => m.score < 2)
        .sort((a, b) => a.score - b.score || a.e.rank - b.e.rank)
        .slice(0, 8)
        .map(m => m.e);
    }

    function show() {
      const open = matches.length > 0 || input.value.trim() !== '';
      list.hidden = !open;
      input.setAttribute('aria-expanded', open);
      list.innerHTML = matches.length ? matches.map((e, i) => `
        <li role="option" id="sr-${i}" class="sr-item${i === active ? ' is-active' : ''}" data-pick="${esc(e.id)}" aria-selected="${i === active}">
          ${FFK.avatar(e.p)}
          <span class="sr-name">${esc(FFK.fullName(e.p))}</span>
          <span class="sr-meta">${esc(e.rankLabel)} · ${esc(e.p.team)}</span>
        </li>`).join('') : '<li class="sr-empty">No ranked player by that name</li>';
      input.setAttribute('aria-activedescendant', matches.length ? `sr-${active}` : '');
    }

    function close() {
      matches = [];
      list.hidden = true;
      input.setAttribute('aria-expanded', 'false');
    }

    function pick(id) {
      const e = lookup[id];
      input.value = '';
      close();
      setState({ pos: e.pos });
      const el = document.querySelector(`#board [data-id="${CSS.escape(id)}"]`);
      if (el) {
        el.classList.add('is-found');
        el.scrollIntoView({ block: 'center' });
      }
      openCard(id);
    }

    input.addEventListener('input', () => { matches = find(input.value); active = 0; show(); });
    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown' && matches.length) { active = (active + 1) % matches.length; show(); e.preventDefault(); }
      else if (e.key === 'ArrowUp' && matches.length) { active = (active - 1 + matches.length) % matches.length; show(); e.preventDefault(); }
      else if (e.key === 'Enter' && matches.length) { pick(matches[active].id); e.preventDefault(); }
      else if (e.key === 'Escape') { input.value = ''; close(); }
    });
    // mousedown (not click) so the pick lands before the input loses focus
    list.addEventListener('mousedown', e => {
      const li = e.target.closest('[data-pick]');
      if (li) { e.preventDefault(); pick(li.dataset.pick); }
    });
    input.addEventListener('blur', close);
  }
})();
