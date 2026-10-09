/* Player card pop-up. Call FFK.openPlayer(id, context).
   Every section is optional: if a player has no detailed stats in players.json,
   the card shows the basics and a "coming soon" note. */
(function () {
  'use strict';
  const { CONFIG, esc, ordinal, num1, fppgClass, rankClass } = FFK;
  let dialog;

  function ensureDialog() {
    if (dialog) return dialog;
    dialog = document.createElement('dialog');
    dialog.className = 'pc-dialog';
    dialog.setAttribute('aria-label', 'Player card');
    document.body.appendChild(dialog);
    // Clicking the dark backdrop (outside the card) closes it.
    dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => { dialog.innerHTML = ''; });
    return dialog;
  }

  function openPlayer(id, ctx) {
    ctx = ctx || {};
    const p = FFK.player(id);
    if (ctx.rosSched != null) p.rosSched = ctx.rosSched;
    const d = ensureDialog();
    d.innerHTML = card(p, ctx);
    d.querySelector('.pc-close').addEventListener('click', () => d.close());
    d.showModal();
    d.querySelector('.pc-close').focus();
  }

  // ---- Sections ----
  function card(p, ctx) {
    const fppg = ctx.fppg != null ? ctx.fppg : p.fppg;
    const hasDetail = p.tiles || p.gameLog || p.volume || p.redZone || p.upcoming;
    return `
      <article class="pc" style="${FFK.teamVars(p.team)}">
        <header class="pc-head">
          <div class="pc-photo"><span>${esc(FFK.initials(p))}</span>${FFK.photo(p, 'pc-photo-img')}</div>
          <div class="pc-id">
            ${p.first ? `<div class="pc-first">${esc(p.first)}</div>` : ''}
            <h2 class="pc-last">${esc(p.last)}</h2>
            <div class="pc-bio">${bio(p)}</div>
          </div>
          <div class="pc-head-right">
            <div class="pc-chips">
              ${ctx.tier ? `<span class="chip tier-${esc(ctx.tier)}">Tier ${esc(ctx.tier)}</span>` : ''}
              ${ctx.rankLabel ? `<span class="chip chip-outline">${esc(ctx.rankLabel)}</span>` : ''}
              ${statusChip(p.status)}
              <button type="button" class="pc-close" aria-label="Close player card">✕</button>
            </div>
            <div class="pc-head-boxes">
              ${panic(p.panic)}
              ${ppgBox(fppg, p)}
            </div>
          </div>
        </header>
        <div class="pc-body">
          ${hasDetail ? `
            <div class="pc-main">${tiles(p)}${gameLog(p)}</div>
            <div class="pc-side">${volume(p)}${redZone(p)}${upcoming(p)}</div>`
          : '<p class="pc-empty">Full stat card coming soon.</p>'}
        </div>
      </article>`;
  }

  function bio(p) {
    const t = FFK.team(p.team);
    const parts = [CONFIG.positionNames[p.pos] || p.pos, `${p.team} · ${t.city}`];
    const body = [p.height, p.weight, p.age ? `Age ${p.age}` : ''].filter(Boolean).join(' · ');
    if (body) parts.push(body);
    return parts.map(esc).join(' <span class="sep">/</span> ');
  }

  function statusChip(status) {
    const s = (status || 'N/A').toUpperCase();
    const cls = { ACTIVE: 'ok', HEALTHY: 'ok', QUESTIONABLE: 'warn', DOUBTFUL: 'bad', OUT: 'bad', IR: 'bad' }[s] || 'na';
    return `<span class="chip chip-status ${cls}"><i></i>Status ${esc(s)}</span>`;
  }

  function panic(pn) {
    if (!pn || pn.score == null) return '';
    const score = Math.max(0, Math.min(10, pn.score));
    const level = score <= 3 ? 'good' : score <= 6 ? 'mid' : 'bad';
    const label = pn.label || { good: "Don't panic", mid: 'Keep an eye on it', bad: 'Panic' }[level];
    const segs = Array.from({ length: 10 }, (_, i) => `<i class="${i < score ? 'on' : ''}"></i>`).join('');
    return `<div class="pc-panic lvl-${level}">
      <div class="pc-panic-top"><span>Panic meter</span><b>${score}<small>/10</small></b></div>
      <div class="pc-panic-bar">${segs}</div>
      <div class="pc-panic-label">${esc(label)}</div>
    </div>`;
  }

  function ppgBox(fppg, p) {
    const ls = p.lastSeason;
    let compare = '';
    if (ls && ls.ppg != null && fppg != null) {
      const diff = fppg - ls.ppg;
      const up = diff >= 0;
      compare = `<div class="pc-ppg-cmp">
        <span class="pc-ppg-cmp-label">vs ${esc(ls.year)}</span>
        <span class="pc-ppg-diff ${up ? 'c-good' : 'c-bad'}">${up ? '▲ +' : '▼ '}${num1(diff)}</span>
        <span class="pc-ppg-last">${esc(ls.year)}: ${num1(ls.ppg)} PPG${ls.total != null ? ` · ${num1(ls.total)} total` : ''}</span>
      </div>`;
    }
    return `<div class="pc-ppg">
      <div><div class="pc-ppg-num ${fppgClass(fppg, p.pos)}">${num1(fppg)}</div>
      <div class="pc-ppg-label">${esc(FFK.site.scoring || 'PPR')} pts / game</div></div>
      ${compare}
    </div>`;
  }

  function tiles(p) {
    if (!p.tiles || !p.tiles.length) return '';
    return `<div class="pc-tiles">${p.tiles.map(t => {
      let bar = t.bar;
      if (bar == null && t.rank && t.of) bar = (t.of - t.rank + 1) / t.of;
      const note = t.note || (t.rank ? `${ordinal(t.rank)} among ${p.pos}s` : '');
      return `<div class="pc-tile">
        <div class="pc-tile-label">${esc(t.label)}</div>
        <div class="pc-tile-value">${esc(t.value)}</div>
        ${bar != null ? `<div class="meter"><i style="width:${Math.round(Math.max(0, Math.min(1, bar)) * 100)}%"></i></div>` : ''}
        ${note ? `<div class="pc-tile-note">${esc(note)}</div>` : ''}
      </div>`;
    }).join('')}</div>`;
  }

  function gameLog(p) {
    const log = p.gameLog;
    if (!log || !log.games || !log.games.length) return '';
    const cols = log.columns || [];
    const totals = cols.map((_, i) => log.games.reduce((sum, g) => sum + (Number(g.stats[i]) || 0), 0));
    const fptsTotal = log.games.reduce((s, g) => s + (Number(g.fpts) || 0), 0);
    const maxF = Math.max(30, ...log.games.map(g => g.fpts || 0));
    return `<section class="pc-section">
      <div class="pc-section-head"><h3>${esc(FFK.site.season)} Game Log</h3><span>${esc(FFK.site.scoring || 'PPR')} scoring</span></div>
      <div class="pc-log-wrap"><table class="pc-log">
        <thead><tr><th>Wk</th><th>Opp</th><th>Result</th>${cols.map(c => `<th class="num">${esc(c)}</th>`).join('')}<th class="num">FPTS</th><th class="bar-col"></th></tr></thead>
        <tbody>${log.games.map(g => `<tr>
          <td><b>${esc(g.wk)}</b></td><td><b>${esc(g.opp)}</b></td><td class="muted">${esc(g.result)}</td>
          ${cols.map((_, i) => `<td class="num">${esc(g.stats[i])}</td>`).join('')}
          <td class="num ${fppgClass(g.fpts, p.pos)}"><b>${num1(g.fpts)}</b></td>
          <td class="bar-col"><div class="meter meter-green"><i style="width:${Math.round((g.fpts || 0) / maxF * 100)}%"></i></div></td>
        </tr>`).join('')}</tbody>
        <tfoot><tr><td colspan="3">Season</td>${totals.map(t => `<td class="num">${Math.round(t * 10) / 10}</td>`).join('')}<td class="num">${num1(fptsTotal)}</td><td></td></tr></tfoot>
      </table></div>
    </section>`;
  }

  function volume(p) {
    const v = p.volume;
    if (!v || !v.weeks || !v.weeks.length) return '';
    const max = Math.max(...v.weeks);
    const avg = v.weeks.reduce((a, b) => a + b, 0) / v.weeks.length;
    const total = v.weeks.reduce((a, b) => a + b, 0);
    return `<section class="pc-panel">
      <div class="pc-section-head"><h3>${esc(v.label)}</h3><span>Season ${total}</span></div>
      <div class="pc-bars">${v.weeks.map((n, i) => `
        <div class="pc-bar">
          <span class="pc-bar-track">
            <span class="pc-bar-num">${n}</span>
            <span class="pc-bar-fill ${n >= avg ? 'hi' : 'lo'}" style="height:${Math.round(n / max * 140)}px"></span>
          </span>
          <span class="pc-bar-wk">Wk ${i + 1}</span>
        </div>`).join('')}
      </div>
    </section>`;
  }

  function redZone(p) {
    const rz = p.redZone;
    if (!rz) return '';
    return `<section class="pc-panel">
      <div class="pc-section-head"><h3>${esc(rz.title || 'Red Zone')}</h3></div>
      <div class="pc-rz">${(rz.stats || []).map(s => `
        <div><div class="pc-rz-num">${esc(s.value)}</div><div class="pc-rz-label">${esc(s.label)}</div></div>`).join('')}
      </div>
      ${rz.pct ? `<div class="pc-rz-pct"><span>${esc(rz.pct.label)}</span><b>${esc(rz.pct.value)}%</b></div>
        <div class="meter"><i style="width:${Math.max(0, Math.min(100, rz.pct.value))}%"></i></div>` : ''}
    </section>`;
  }

  function upcoming(p) {
    const up = p.upcoming;
    if (!up || !up.length) return '';
    const avg = up.reduce((s, g) => s + g.rank, 0) / up.length;
    const outlook = avg <= 10 ? ['Tough', 'bad'] : avg >= 23 ? ['Favorable', 'good'] : ['Neutral', 'mid'];
    return `<section class="pc-panel">
      <div class="pc-section-head"><h3>Upcoming</h3><span>Opp rank vs ${esc(p.pos)}</span></div>
      <div class="pc-upcoming">${up.map(g => `
        <div class="pc-up">
          <span class="pc-up-wk">Wk ${esc(g.wk)}</span>
          <span class="pc-up-opp">${esc(g.opp)}</span>
          <span class="pc-up-rank ${rankClass(g.rank)}">${ordinal(g.rank)}</span>
        </div>`).join('')}
      </div>
      <div class="pc-up-foot">
        <span>Next ${up.length} games${p.rosSched ? ` · ROS schedule ${ordinal(p.rosSched)}` : ''}</span>
        <span class="outlook outlook-${outlook[1]}">${outlook[0]}</span>
      </div>
    </section>`;
  }

  FFK.openPlayer = openPlayer;
})();
