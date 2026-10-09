/* Start / Sit page: one matchup board per game, with game tabs and prev/next arrows. */
(async function () {
  'use strict';
  const { CONFIG, esc, ordinal, num1, fppgClass, rankClass } = FFK;
  const main = document.getElementById('main');
  let data, games = [], index = 0;

  try {
    const { site } = await FFK.loadCore();
    FFK.renderShell(site);
    data = await FFK.loadJSON(FFK.paths.startSit(site));
    games = data.games || [];
    readState();
    renderPage();
    window.addEventListener('hashchange', () => { readState(); renderGame(); });
  } catch (err) {
    FFK.showError(err);
    return;
  }

  function readState() {
    const m = FFK.readHash().match(/^game-(\d+)$/);
    const n = m ? parseInt(m[1], 10) - 1 : 0;
    index = Math.min(Math.max(n, 0), Math.max(games.length - 1, 0));
  }

  function go(i) {
    index = (i + games.length) % games.length;
    FFK.writeHash(`game-${index + 1}`);
    renderGame();
  }

  function renderPage() {
    const week = data.week || FFK.site.currentWeek;
    document.title = `Week ${week} Start / Sit · Fantasy Football Kingdom`;
    main.innerHTML = `
      <section class="hero">
        <div class="hero-text">
          <p class="eyebrow">${esc(data.eyebrow || `Week ${week} · Matchup overviews`)} ${FFK.sampleBadge(data)}</p>
          <h1 class="display">Start / Sit</h1>
          ${FFK.metaLine(data)}
        </div>
      </section>
      ${games.length ? `
        <div class="game-nav">
          <button type="button" class="arrow-btn" data-step="-1" aria-label="Previous game">‹</button>
          <div class="game-tabs" role="tablist" aria-label="Games">
            ${games.map((g, i) => `<button type="button" role="tab" class="game-tab" data-game="${i}">${esc(g.away.team)} @ ${esc(g.home.team)}</button>`).join('')}
          </div>
          <span class="game-count" id="game-count"></span>
          <button type="button" class="arrow-btn" data-step="1" aria-label="Next game">›</button>
        </div>
        <div id="board"></div>
        <p class="hint">Tap any player for their full card.</p>`
      : '<div class="empty-box">Start / sit calls for this week are coming soon.</div>'}
      ${FFK.sourcesLine(data)}`;

    if (!games.length) return;

    main.querySelector('.game-nav').addEventListener('click', e => {
      const tab = e.target.closest('[data-game]');
      const step = e.target.closest('[data-step]');
      if (tab) go(Number(tab.dataset.game));
      if (step) go(index + Number(step.dataset.step));
    });
    document.getElementById('board').addEventListener('click', e => {
      const el = e.target.closest('[data-id]');
      if (el) FFK.openPlayer(el.dataset.id);
    });
    renderGame();
  }

  function renderGame() {
    if (!games.length) return;
    const g = games[index];
    main.querySelectorAll('.game-tab').forEach(b => {
      const on = Number(b.dataset.game) === index;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', on);
      if (on) b.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });
    document.getElementById('game-count').textContent = `Game ${index + 1} of ${games.length}`;

    const awayColor = FFK.team(g.away.team).color;
    const homeColor = FFK.team(g.home.team).color;
    document.getElementById('board').innerHTML = `
      <div class="ss-board" style="--away:${awayColor};--home:${homeColor}">
        ${side(g, 'away')}
        ${center(g)}
        ${side(g, 'home')}
      </div>`;
  }

  function center(g) {
    return `<div class="ss-center">
      <div class="ss-handle">${esc(FFK.site.handle || '@FantasyFBKingdom')}</div>
      <div class="ss-week">
        <div class="ss-week-num">Week ${esc(data.week || FFK.site.currentWeek)}</div>
        ${g.slot ? `<div class="ss-week-slot">${esc(g.slot)}</div>` : ''}
      </div>
      ${g.ou != null ? `<div class="ss-ou"><span>O/U</span><b>${num1(g.ou)}</b></div>` : ''}
      ${g.weather ? `<div class="ss-pill ss-pill-dark">${esc(g.weather)}</div>` : ''}
      ${g.kickoff ? `<div class="ss-pill">${esc(g.kickoff)}</div>` : ''}
    </div>`;
  }

  function side(g, which) {
    const s = g[which];
    const opp = which === 'away' ? g.home.team : g.away.team;
    const t = FFK.team(s.team);
    const meta = [s.record, s.spread].filter(Boolean).map(esc).join(' · ');
    const groups = (g.groups || []).filter(gr => gr[which] && gr[which].players && gr[which].players.length);
    return `<div class="ss-side ss-${which}" style="${FFK.teamVars(s.team)}">
      <div class="ss-team">
        <div class="ss-logo">${esc(s.team)}</div>
        <div>
          <div class="ss-team-name">${esc(t.name)}</div>
          ${meta ? `<div class="ss-team-meta">${meta}</div>` : ''}
        </div>
      </div>
      ${groups.map(gr => {
        const block = gr[which];
        return `<section class="ss-group">
          <div class="ss-group-head">
            <h3>${esc(CONFIG.positionPlural[gr.pos] || gr.pos)}</h3>
            ${block.oppDefRank != null ? `<span class="ss-def bg-${rankClass(block.oppDefRank).replace('c-', '')}">${esc(opp)} D vs ${esc(gr.pos)}s <b>${ordinal(block.oppDefRank)}</b></span>` : ''}
          </div>
          ${block.players.map(pl => playerCard(pl, gr.pos, which, opp)).join('')}
        </section>`;
      }).join('')}
    </div>`;
  }

  function playerCard(entry, pos, which, opp) {
    const p = FFK.player(entry.id);
    const call = (entry.call || '').toUpperCase();
    const vs = entry.vsOpp || {};
    const vsGames = vs.games != null ? ` · ${vs.games}G` : '';
    const projSource = data.projSource || 'ESPN + Sleeper';
    const ppgCls = fppgClass(entry.ppg, p.pos || pos).replace('c-', '');
    return `<button type="button" class="ss-card" data-id="${esc(entry.id)}" style="${FFK.teamVars(p.team)}" aria-label="${esc(FFK.fullName(p))}: ${esc(call)}">
      <span class="ss-art"><span>${esc(FFK.initials(p))}</span>${FFK.photo(p, 'ss-art-photo')}</span>
      <span class="ss-info">
        <span class="ss-first">${esc(p.first)}</span>
        <span class="ss-last">${esc(p.last)}</span>
        <span class="ss-badges">
          ${call ? `<span class="call call-${call === 'START' ? 'start' : 'sit'}">${esc(call)}</span>` : ''}
          <span class="ppg-box">PPG: <b class="bg-${ppgCls}">${num1(entry.ppg)}</b></span>
        </span>
        <span class="ss-src"><span>${esc(projSource)}</span><i></i><span>Career</span></span>
        <span class="ss-stats">
          <span class="ss-stat"><small>Proj avg</small><b>${num1(entry.projAvg)}</b></span>
          <span class="ss-stat"><small>vs ${esc(opp)}${vsGames}</small><b>${vs.avg != null ? num1(vs.avg) : '—'}</b></span>
          <span class="ss-stat"><small>${which === 'away' ? 'Away' : 'Home'} PPG</small><b>${num1(entry.splitPpg)}</b></span>
        </span>
      </span>
    </button>`;
  }
})();
