/* Player card pop-up. Call FFK.openPlayer(id, { entry, page }).
   Reads the player's stats from players.json (season profile "prof" + weekly "log")
   and their ranking details (tier, panic, notes, schedule) from the rankings files.
   Players without the newer stats fall back to the older hand-written fields. */
(function () {
  'use strict';
  const { CONFIG, esc, ordinal, num1, fppgClass, rankClass } = FFK;
  let dialog;
  let onClose = null; // set by the page that opened the card (e.g. to clear the player from the URL)

  // ---- Labels for season stats in players.json ("prof.vals"), in plain English ----
  const STAT_LABELS = {
    cmpPct: ['Completion %', '%'], passYpg: ['Pass yds / game', ''], rushApg: ['Carries / game', ''],
    rushYpg: ['Rush yds / game', ''], sackRate: ['Sack rate', '%'], tdRate: ['TD rate', '%'],
    snapPct: ['Snap share', '%'], rushShare: ['Team carry share', '%'], tgtShare: ['Team target share', '%'],
    ypc: ['Yds / carry', ''], catchPct: ['Catch rate', '%'], btkl: ['Broken tackles', ''],
    adot: ['Avg target depth', ' yds'], airYd: ['Air yards', ''], ypt: ['Yds / target', ''],
    fgPct: ['Field goal %', '%'], fg50: ['50+ yd field goals', ''], xpPct: ['Extra point %', '%'],
    fgaPg: ['FG attempts / game', ''], long: ['Longest field goal', ' yds'],
    sacks: ['Sacks', ''], takeaways: ['Takeaways', ''], paPg: ['Points allowed / game', ''],
    yaPg: ['Yards allowed / game', ''], defTd: ['Defensive TDs', '']
  };

  // ---- Game log columns per position: [header, stat key, how to total] ----
  const RECEIVING = [['TGT', 'rec_tgt'], ['REC', 'rec'], ['YDS', 'rec_yd'], ['TD', 'rec_td'], ['SNAP %', 'snap']];
  const LOG_COLUMNS = {
    QB: [['CMP', 'pass_cmp'], ['ATT', 'pass_att'], ['YDS', 'pass_yd'], ['TD', 'pass_td'], ['INT', 'pass_int'], ['RUSH', 'rush_yd'], ['RTD', 'rush_td']],
    RB: [['CAR', 'rush_att'], ['RUSH YDS', 'rush_yd'], ['RTD', 'rush_td'], ['TGT', 'rec_tgt'], ['REC', 'rec'], ['REC YDS', 'rec_yd'], ['REC TD', 'rec_td'], ['SNAP %', 'snap']],
    WR: RECEIVING,
    TE: RECEIVING,
    K: [['FGM', 'fgm'], ['FGA', 'fga'], ['LONG', 'fgm_lng', 'max'], ['50+', 'fgm_50p'], ['XPM', 'xpm'], ['XPA', 'xpa']],
    DST: [['PTS ALLOWED', 'pts_allow'], ['YDS ALLOWED', 'yds_allow'], ['SACKS', 'sack'], ['INT', 'int'], ['FUM REC', 'fum_rec'], ['TD', 'def_tds']]
  };

  // ---- Weekly volume chart per position ----
  const VOLUME = {
    QB: ['Pass attempts by week', s => s.pass_att],
    RB: ['Carries + targets by week', s => (s.rush_att || 0) + (s.rec_tgt || 0)],
    WR: ['Targets by week', s => s.rec_tgt],
    TE: ['Targets by week', s => s.rec_tgt],
    K: ['Field goal attempts by week', s => s.fga],
    DST: ['Fantasy points by week', null]
  };

  // ---- Red zone stats per position ("prof.rz") ----
  const RED_ZONE = {
    QB: ['Red Zone', [['pass_rz_att', 'RZ pass attempts'], ['rzPassTd', 'RZ pass TDs'], ['rzCar', 'RZ carries'], ['rzTd', 'Total RZ TDs']]],
    RB: ['Red Zone Rushing', [['rzCar', 'RZ carries'], ['in5Car', 'Carries inside the 5'], ['rzTd', 'RZ TDs']]],
    WR: ['Red Zone Receiving', [['rzTgt', 'RZ targets'], ['in10Tgt', 'Targets inside the 10'], ['rzTd', 'RZ TDs']]],
    TE: ['Red Zone Receiving', [['rzTgt', 'RZ targets'], ['in10Tgt', 'Targets inside the 10'], ['rzTd', 'RZ TDs']]]
  };

  function ensureDialog() {
    if (dialog) return dialog;
    dialog = document.createElement('dialog');
    dialog.className = 'pc-dialog';
    dialog.setAttribute('aria-label', 'Player card');
    document.body.appendChild(dialog);
    dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => {
      dialog.innerHTML = '';
      if (onClose) onClose();
      onClose = null;
    });
    return dialog;
  }

  // ctx: { entry, page, onClose }
  async function openPlayer(id, ctx) {
    ctx = ctx || {};
    const p = FFK.player(id);
    let ros = null;
    try { ros = await FFK.rosContext(); } catch (e) { console.warn('Rest-of-season rankings unavailable for the player card', e); }
    const info = cardInfo(p, ctx, ros);
    const d = ensureDialog();
    d.innerHTML = card(p, info, ros);
    d.querySelector('.pc-close').addEventListener('click', () => d.close());
    onClose = ctx.onClose || null;
    if (!d.open) d.showModal();
    d.querySelector('.pc-close').focus();
  }

  // Merges the page's ranking entry with the ROS entry (page values win when present).
  function cardInfo(p, ctx, ros) {
    const page = ctx.entry || {};
    const rosEntry = (ros && ros.index[p.id]) || {};
    const pick = key => (page[key] != null && !(Array.isArray(page[key]) && !page[key].length)) ? page[key] : rosEntry[key];
    const tier = pick('tier');
    let rankLabel = page.rankLabel;
    if (!rankLabel && rosEntry.rank) rankLabel = `ROS ${rosEntry.pos}${rosEntry.rank}`;
    const legacyPanic = p.panic && p.panic.score;
    return {
      tier,
      tierColor: tier ? FFK.tierColor(tier, tierFromRos(ros, rosEntry)) : null,
      rankLabel,
      fppg: pick('fppg') ?? seasonPpg(p),
      panic: pick('panic') ?? legacyPanic ?? null,
      flags: pick('flags') || [],
      consensus: pick('consensus'),
      myRank: rosEntry.rank ? `${rosEntry.pos}${rosEntry.rank}` : null,
      rosSched: rosEntry.matchRank ?? null
    };
  }

  function tierFromRos(ros, entry) {
    if (!ros || !entry.pos) return null;
    const block = ros.positions[entry.pos];
    return block && block.tiers.find(t => t.tier === entry.tier);
  }

  function seasonPpg(p) {
    const games = p.log ? Object.values(p.log) : [];
    if (!games.length) return null;
    return games.reduce((s, g) => s + (g.fpts || 0), 0) / games.length;
  }

  // ---- Card ----
  function card(p, info, ros) {
    const vm = p.prof || p.log ? fromStats(p, info, ros) : fromLegacy(p, info);
    const hasDetail = vm.tiles.length || vm.log || vm.volume || vm.redZone || vm.upcoming;
    const jersey = p.bio && p.bio.jersey;
    return `
      <article class="pc" style="${FFK.teamVars(p.team)}">
        <header class="pc-head">
          ${jersey ? `<span class="pc-jersey" aria-hidden="true">${esc(jersey)}</span>` : ''}
          <div class="pc-photo"><span>${esc(FFK.initials(p))}</span>${FFK.photo(p, 'pc-photo-img')}</div>
          <div class="pc-id">
            ${p.first ? `<div class="pc-first">${esc(p.first)}</div>` : ''}
            <h2 class="pc-last">${esc(p.last)}</h2>
            <div class="pc-bio">${bio(p)}</div>
          </div>
          <div class="pc-head-right">
            <div class="pc-chips">
              ${info.tier ? `<span class="chip" style="background:${esc(info.tierColor)}">Tier ${esc(info.tier)}</span>` : ''}
              ${info.rankLabel ? `<span class="chip chip-outline">${esc(info.rankLabel)}</span>` : ''}
              ${statusChip(p)}
              <button type="button" class="pc-close" aria-label="Close player card">✕</button>
            </div>
            <div class="pc-head-boxes">
              ${panic(info.panic)}
              ${ppgBox(info.fppg, vm.lastSeason, p)}
            </div>
          </div>
        </header>
        <div class="pc-body">
          ${notes(info)}
          ${hasDetail ? `
            <div class="pc-main">${tiles(vm.tiles)}${gameLog(vm.log, p)}</div>
            <div class="pc-side">${volume(vm.volume)}${rankingsPanel(info)}${redZone(vm.redZone)}${upcoming(vm.upcoming, info, p)}</div>`
          : emptyBody(info)}
        </div>
      </article>`;
  }

  // Players with no stats yet: a full-width note, plus any ranking details we do have.
  function emptyBody(info) {
    const side = rankingsPanel(info);
    const note = '<p class="pc-empty">Full stat card coming soon.</p>';
    return side
      ? `<div class="pc-main">${note}</div><div class="pc-side">${side}</div>`
      : `<div class="pc-main pc-full">${note}</div>`;
  }

  // ---- View model from the newer players.json stats ----
  function fromStats(p, info, ros) {
    const prof = p.prof || {};
    const pos = p.pos;
    const season = FFK.site.season;
    const vm = { tiles: [], log: null, volume: null, redZone: null, upcoming: null, lastSeason: null };

    // Season stat tiles, ranked against the position
    const vals = prof.vals || {}, rk = prof.rk || {};
    const noun = pos === 'DST' ? 'defenses' : `${pos}s`;
    vm.tiles = Object.keys(vals).map(k => {
      const [label, unit] = STAT_LABELS[k] || [k, ''];
      const rank = rk[k], of = prof.pool;
      return {
        label, value: `${fmt(vals[k])}${unit}`,
        bar: rank && of ? (of - rank + 1) / of : null,
        note: rank ? `${ordinal(rank)}${of ? ` of ${of}` : ''} ${noun}` : ''
      };
    });

    // Last season comparison
    if (prof.ly && prof.ly.g) vm.lastSeason = { year: season - 1, ppg: prof.ly.pts / prof.ly.g, total: prof.ly.pts };

    // Weekly game log, with opponent and result from the rankings schedule
    const weeks = Object.keys(p.log || {}).map(Number).sort((a, b) => a - b);
    const schedule = (ros && ros.data.schedule) || {};
    const cols = LOG_COLUMNS[pos] || [];
    if (weeks.length) {
      const rows = weeks.map(wk => {
        const g = p.log[wk];
        const s = statValues(g.stats || {});
        const game = (schedule[g.team || p.team] || {})[wk];
        return {
          wk,
          opp: game ? `${game.home ? 'vs' : '@'} ${game.opp}` : '—',
          result: game ? (game.pending ? 'Pending' : game.result) : '',
          cells: cols.map(([, key]) => cell(s, key)),
          raw: s,
          fpts: g.fpts
        };
      });
      const totals = cols.map(([, key, how]) => {
        if (key === 'snap') {
          const off = rows.reduce((t, r) => t + (r.raw.off_snp || 0), 0);
          const tm = rows.reduce((t, r) => t + (r.raw.tm_off_snp || 0), 0);
          return tm ? `${Math.round(off / tm * 100)}%` : '—';
        }
        if (how === 'max') return Math.max(0, ...rows.map(r => r.raw[key] || 0)) || '—';
        return rows.reduce((t, r) => t + (r.raw[key] || 0), 0);
      });
      vm.log = {
        columns: cols.map(c => c[0]), rows, totals,
        fptsTotal: rows.reduce((t, r) => t + (r.fpts || 0), 0),
        through: p.statsThrough
      };

      const [label, fn] = VOLUME[pos] || [];
      if (label) {
        vm.volume = {
          label,
          bars: rows.map(r => ({ wk: r.wk, n: Math.round((fn ? fn(r.raw) : r.fpts) || 0) }))
        };
      }
    }

    // Red zone
    const rzDef = RED_ZONE[pos];
    if (rzDef && prof.rz && Object.keys(prof.rz).length) {
      const source = Object.assign({}, prof.tot || {}, prof.rz);
      const stats = rzDef[1].filter(([key]) => source[key] != null).map(([key, label]) => ({ label, value: source[key] }));
      let pct = null;
      if ((pos === 'WR' || pos === 'TE') && prof.rz.rzTgt != null && prof.tm && prof.tm.rzTgt) {
        pct = { label: "Share of team's red zone targets", value: Math.round(prof.rz.rzTgt / prof.tm.rzTgt * 100) };
      }
      if (stats.length) vm.redZone = { title: rzDef[0], stats, pct };
    }

    // Next games with the opponent's rank vs this position
    const teamInfo = ros && ros.data.teams && ros.data.teams[p.team];
    const oppRanks = (ros && ros.data.oppRanks && ros.data.oppRanks[pos]) || {};
    if (teamInfo && teamInfo.upcoming && teamInfo.upcoming.length) {
      vm.upcoming = teamInfo.upcoming.map(g => ({ wk: g.week, opp: `${g.home ? 'vs' : '@'} ${g.opp}`, rank: oppRanks[g.opp] ?? null }));
    }
    return vm;
  }

  // Splits combined keys (snap share, all defensive TDs) out of a week's raw stats.
  function statValues(stats) {
    const s = Object.assign({}, stats);
    s.def_tds = (stats.def_td || 0) + (stats.def_st_td || 0);
    return s;
  }

  function cell(s, key) {
    if (key === 'snap') return s.tm_off_snp ? `${Math.round((s.off_snp || 0) / s.tm_off_snp * 100)}%` : '—';
    return s[key] != null ? s[key] : 0;
  }

  function fmt(v) {
    if (typeof v !== 'number') return v;
    return Number.isInteger(v) ? String(v) : v.toFixed(1);
  }

  // ---- View model from the older hand-written fields ----
  function fromLegacy(p) {
    const vm = { tiles: [], log: null, volume: null, redZone: null, upcoming: null, lastSeason: p.lastSeason || null };
    vm.tiles = (p.tiles || []).map(t => {
      let bar = t.bar;
      if (bar == null && t.rank && t.of) bar = (t.of - t.rank + 1) / t.of;
      return { label: t.label, value: t.value, bar, note: t.note || (t.rank ? `${ordinal(t.rank)} among ${p.pos}s` : '') };
    });
    const log = p.gameLog;
    if (log && log.games && log.games.length) {
      const cols = log.columns || [];
      vm.log = {
        columns: cols,
        rows: log.games.map(g => ({ wk: g.wk, opp: g.opp, result: g.result, cells: g.stats, fpts: g.fpts })),
        totals: cols.map((_, i) => Math.round(log.games.reduce((s, g) => s + (Number(g.stats[i]) || 0), 0) * 10) / 10),
        fptsTotal: log.games.reduce((s, g) => s + (Number(g.fpts) || 0), 0)
      };
    }
    if (p.volume && p.volume.weeks) vm.volume = { label: p.volume.label, bars: p.volume.weeks.map((n, i) => ({ wk: i + 1, n })) };
    if (p.redZone) vm.redZone = { title: p.redZone.title || 'Red Zone', stats: p.redZone.stats || [], pct: p.redZone.pct || null };
    if (p.upcoming) vm.upcoming = p.upcoming;
    return vm;
  }

  // ---- Header pieces ----
  function bio(p) {
    const t = FFK.team(p.team);
    const parts = [CONFIG.positionNames[p.pos] || p.pos, `${p.team} · ${t.city}`];
    const b = p.bio || {};
    const height = (b.ht || p.height || '').replace(/'\s+/, "'");
    const weight = b.wt || p.weight;
    const age = b.age || p.age;
    const body = [height, weight ? `${weight} lbs` : '', age ? `Age ${age}` : ''].filter(Boolean).join(' · ');
    if (body) parts.push(body);
    return parts.map(esc).join(' <span class="sep">/</span> ');
  }

  function statusChip(p) {
    const s = (p.status || '').toUpperCase();
    const inj = p.prof && p.prof.inj;
    const cls = { ACTIVE: 'ok', HEALTHY: 'ok', QUESTIONABLE: 'warn', DOUBTFUL: 'bad', OUT: 'bad', IR: 'bad' }[s] || (inj ? 'warn' : 'na');
    const label = s || 'N/A';
    return `<span class="chip chip-status ${cls}"><i></i>Status ${esc(label)}</span>
      ${inj ? `<span class="chip chip-status warn" title="Most recent injury listed"><i></i>${esc(inj)}</span>` : ''}`;
  }

  function panicLevel(score) {
    return score <= CONFIG.panic.calm ? 'good' : score <= CONFIG.panic.watch ? 'mid' : 'bad';
  }

  function panic(score) {
    if (score == null) return '';
    score = Math.max(0, Math.min(10, score));
    const level = panicLevel(score);
    const label = { good: "Don't panic", mid: 'Keep an eye on it', bad: 'Panic' }[level];
    const segs = Array.from({ length: 10 }, (_, i) => `<i class="${i < score ? 'on' : ''}"></i>`).join('');
    return `<div class="pc-panic lvl-${level}">
      <div class="pc-panic-top"><span>Panic meter</span><b>${score}<small>/10</small></b></div>
      <div class="pc-panic-bar">${segs}</div>
      <div class="pc-panic-label">${esc(label)}</div>
    </div>`;
  }

  function ppgBox(fppg, ls, p) {
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

  // ---- Body sections ----
  function notes(info) {
    if (!info.flags.length) return '';
    return `<div class="pc-notes" role="note"><b>Notes</b><ul>${info.flags.map(f => `<li>${esc(f)}</li>`).join('')}</ul></div>`;
  }

  function tiles(list) {
    if (!list.length) return '';
    return `<div class="pc-tiles">${list.map(t => `<div class="pc-tile">
        <div class="pc-tile-label">${esc(t.label)}</div>
        <div class="pc-tile-value">${esc(t.value)}</div>
        ${t.bar != null ? `<div class="meter"><i style="width:${Math.round(Math.max(0, Math.min(1, t.bar)) * 100)}%"></i></div>` : ''}
        ${t.note ? `<div class="pc-tile-note">${esc(t.note)}</div>` : ''}
      </div>`).join('')}</div>`;
  }

  function gameLog(log, p) {
    if (!log) return '';
    const maxF = Math.max(30, ...log.rows.map(r => r.fpts || 0));
    const through = log.through ? ` · Through week ${esc(log.through)}` : '';
    return `<section class="pc-section">
      <div class="pc-section-head"><h3>${esc(FFK.site.season)} Game Log</h3><span>${esc(FFK.site.scoring || 'PPR')} scoring${through}</span></div>
      <div class="pc-log-wrap"><table class="pc-log">
        <thead><tr><th>Wk</th><th>Opp</th><th>Result</th>${log.columns.map(c => `<th class="num">${esc(c)}</th>`).join('')}<th class="num">FPTS</th><th class="bar-col"></th></tr></thead>
        <tbody>${log.rows.map(r => `<tr>
          <td><b>${esc(r.wk)}</b></td><td><b>${esc(r.opp)}</b></td><td class="muted">${esc(r.result)}</td>
          ${r.cells.map(c => `<td class="num">${esc(c)}</td>`).join('')}
          <td class="num ${fppgClass(r.fpts, p.pos)}"><b>${num1(r.fpts)}</b></td>
          <td class="bar-col"><div class="meter meter-green"><i style="width:${Math.round(Math.max(0, r.fpts || 0) / maxF * 100)}%"></i></div></td>
        </tr>`).join('')}</tbody>
        <tfoot><tr><td colspan="3">Season</td>${log.totals.map(t => `<td class="num">${esc(t)}</td>`).join('')}<td class="num">${num1(log.fptsTotal)}</td><td></td></tr></tfoot>
      </table></div>
    </section>`;
  }

  function volume(v) {
    if (!v || !v.bars.length) return '';
    const values = v.bars.map(b => b.n);
    const max = Math.max(1, ...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const total = values.reduce((a, b) => a + b, 0);
    return `<section class="pc-panel">
      <div class="pc-section-head"><h3>${esc(v.label)}</h3><span>Season ${total}</span></div>
      <div class="pc-bars">${v.bars.map(b => `
        <div class="pc-bar">
          <span class="pc-bar-track">
            <span class="pc-bar-num">${b.n}</span>
            <span class="pc-bar-fill ${b.n >= avg ? 'hi' : 'lo'}" style="height:${Math.round(Math.max(0, b.n) / max * 140)}px"></span>
          </span>
          <span class="pc-bar-wk">Wk ${esc(b.wk)}</span>
        </div>`).join('')}
      </div>
    </section>`;
  }

  function rankingsPanel(info) {
    const c = info.consensus;
    if (!info.myRank && !c) return '';
    return `<section class="pc-panel">
      <div class="pc-section-head"><h3>Rankings</h3><span>Rest of season</span></div>
      <div class="pc-rz">
        ${info.myRank ? `<div><div class="pc-rz-num">${esc(info.myRank)}</div><div class="pc-rz-label">My rank</div></div>` : ''}
        ${c ? `<div><div class="pc-rz-num">${num1(c.avg)}</div><div class="pc-rz-label">Experts' avg rank</div></div>
               <div><div class="pc-rz-num">${esc(c.best)}–${esc(c.worst)}</div><div class="pc-rz-label">Best–worst</div></div>` : ''}
      </div>
      ${c && c.sources ? `<p class="pc-small">Expert ranks from ${esc(c.sources)} sources.</p>` : ''}
    </section>`;
  }

  function redZone(rz) {
    if (!rz) return '';
    return `<section class="pc-panel">
      <div class="pc-section-head"><h3>${esc(rz.title)}</h3></div>
      <div class="pc-rz">${rz.stats.map(s => `
        <div><div class="pc-rz-num">${esc(s.value)}</div><div class="pc-rz-label">${esc(s.label)}</div></div>`).join('')}
      </div>
      ${rz.pct ? `<div class="pc-rz-pct"><span>${esc(rz.pct.label)}</span><b>${esc(rz.pct.value)}%</b></div>
        <div class="meter"><i style="width:${Math.max(0, Math.min(100, rz.pct.value))}%"></i></div>` : ''}
    </section>`;
  }

  function upcoming(up, info, p) {
    if (!up || !up.length) return '';
    const ranks = up.map(g => g.rank).filter(r => r != null);
    const basis = info.rosSched ?? (ranks.length ? ranks.reduce((s, r) => s + r, 0) / ranks.length : null);
    const outlook = basis == null ? null
      : basis <= CONFIG.rank.toughMax ? ['Tough', 'bad'] : basis >= CONFIG.rank.easyMin ? ['Favorable', 'good'] : ['Neutral', 'mid'];
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
        <span>Next ${up.length} games${info.rosSched ? ` · ROS schedule ${ordinal(info.rosSched)}` : ''}</span>
        ${outlook ? `<span class="outlook outlook-${outlook[1]}">${outlook[0]}</span>` : ''}
      </div>
    </section>`;
  }

  FFK.openPlayer = openPlayer;
})();
