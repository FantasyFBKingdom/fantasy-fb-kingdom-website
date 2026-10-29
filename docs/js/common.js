/* Fantasy Football Kingdom — shared helpers.
   Loads data, draws the header/footer, handles the theme toggle,
   and provides small formatting/avatar helpers used on every page. */
(function () {
  'use strict';

  // ---- Site-wide settings (edit here to change color bands or tier names) ----
  const CONFIG = {
    // FPPG color bands per position: [green at or above, gold at or above]; anything lower is red.
    fppg: {
      QB: [20, 15], RB: [15, 10], WR: [15, 10], TE: [12, 8],
      FLEX: [15, 10], K: [9, 7], DST: [9, 6]
    },
    // Matchup rank vs position: 1–8 toughest (red), 9–24 middle (gold), 25–32 easiest (green).
    rank: { toughMax: 8, easyMin: 25 },
    // Tier names and fallback colors. A color in the rankings file overrides these.
    tiers: {
      S: { name: 'Elite', color: '#f47174' },
      A: { name: 'Strong Start', color: '#f89a4b' },
      B: { name: 'Solid', color: '#f9c440' },
      C: { name: 'Flex', color: '#6fdc8c' },
      D: { name: 'Bench Upside', color: '#34c46a' },
      E: { name: 'Depth', color: '#35d0e0' },
      F: { name: 'Deep Bench', color: '#5ba2f5' },
      G: { name: 'Dart Throw', color: '#3b73e0' }
    },
    // Panic meter (1–10): up to `calm` is green, up to `watch` is gold, above is red.
    panic: { calm: 3, watch: 6 },
    positions: ['QB', 'RB', 'WR', 'TE', 'FLEX', 'K', 'DST'],
    positionNames: {
      QB: 'Quarterback', RB: 'Running Back', WR: 'Wide Receiver',
      TE: 'Tight End', K: 'Kicker', DST: 'Defense / Special Teams'
    },
    positionPlural: {
      QB: 'Quarterbacks', RB: 'Running Backs', WR: 'Wide Receivers',
      TE: 'Tight Ends', K: 'Kickers', DST: 'Defenses'
    }
  };

  // Where each page's data lives (season and week come from data/site.json).
  const paths = {
    ros: s => `data/${s.season}/ros/rankings.json`,
    weekly: s => `data/${s.season}/week-${pad2(s.currentWeek)}/rankings.json`,
    startSit: s => `data/${s.season}/start-sit-week-${pad2(s.currentWeek)}/start-sit.json`
  };

  const cache = {};

  // ---- Data loading ----
  async function loadJSON(path) {
    if (cache[path]) return cache[path];
    const res = await fetch(path, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`Could not load ${path} (${res.status})`);
    try {
      cache[path] = await res.json();
    } catch (e) {
      throw new Error(`${path} has a formatting error: ${e.message}`);
    }
    return cache[path];
  }

  async function loadCore() {
    const [site, teams, players] = await Promise.all([
      loadJSON('data/site.json'),
      loadJSON('data/teams.json'),
      loadJSON('data/players.json')
    ]);
    FFK.site = site;
    FFK.teams = teams;
    FFK.players = players;
    return { site, teams, players };
  }

  function pad2(n) { return String(n).padStart(2, '0'); }

  // ---- Formatting ----
  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function ordinal(n) {
    if (n == null || n === '') return '—';
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  function num1(n) {
    return n == null || n === '' || isNaN(n) ? '—' : Number(n).toFixed(1);
  }

  function fppgClass(value, pos) {
    const bands = CONFIG.fppg[pos] || CONFIG.fppg.FLEX;
    if (value == null) return '';
    if (value >= bands[0]) return 'c-good';
    if (value >= bands[1]) return 'c-mid';
    return 'c-bad';
  }

  function rankClass(rank) {
    if (rank == null) return '';
    if (rank <= CONFIG.rank.toughMax) return 'c-bad';
    if (rank >= CONFIG.rank.easyMin) return 'c-good';
    return 'c-mid';
  }

  // ---- Players & teams ----
  function player(id) {
    const p = FFK.players && FFK.players[id];
    if (p) return Object.assign({ id }, p);
    console.warn(`Player "${id}" is missing from data/players.json`);
    return { id, first: '', last: id, pos: '', team: '' };
  }

  function team(abbr) {
    return (FFK.teams && FFK.teams[abbr]) || { city: abbr, name: abbr, color: '#555555' };
  }

  function fullName(p) { return [p.first, p.last].filter(Boolean).join(' '); }

  function shortName(p) { return p.short || p.last || p.first || p.id; }

  function initials(p) {
    if (p.pos === 'DST') return p.team;
    return ((p.first || '').charAt(0) + (p.last || '').charAt(0)).toUpperCase();
  }

  // Readable text color (dark or light) on top of a team color.
  function textOn(hex) {
    const h = (hex || '#555555').replace('#', '');
    const r = parseInt(h.substr(0, 2), 16), g = parseInt(h.substr(2, 2), 16), b = parseInt(h.substr(4, 2), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) > 160 ? '#14161c' : '#ffffff';
  }

  function teamVars(abbr) {
    const c = team(abbr).color;
    return `--team:${c};--on-team:${textOn(c)}`;
  }

  function headshotSrc(p) {
    return p.headshot || `assets/headshots/${p.id}.png`;
  }

  // Headshot <img> that removes itself if the file doesn't exist, revealing the initials behind it.
  function photo(p, cls) {
    return `<img class="${cls}" src="${esc(headshotSrc(p))}" alt="" loading="lazy" onerror="this.remove()">`;
  }

  function teamChip(abbr) {
    return `<span class="team-chip" style="${teamVars(abbr)}">${esc(abbr)}</span>`;
  }

  // Small round avatar (list rows).
  function avatar(p) {
    return `<span class="avatar" style="${teamVars(p.team)}" aria-hidden="true">
      <span>${esc(initials(p))}</span>${photo(p, 'avatar-photo')}</span>`;
  }

  // Head-and-shoulders silhouette (tier cards).
  function silhouette(p) {
    return `<span class="sil" style="${teamVars(p.team)}" aria-hidden="true">
      <span class="sil-body"></span><span class="sil-head">${esc(initials(p))}</span>
      ${photo(p, 'sil-photo')}</span>`;
  }

  // ---- Rankings files ----
  // Turns a rankings.json (ROS or weekly) into one shape the pages use:
  //   { QB: { tiers: [{ tier, name, color, entries: [...] }], sources }, ... }
  // Reads both layouts:
  //   new: tiers[].ids + a top-level "players" map with each player's numbers
  //   old: tiers[].players[] objects, plus a "games" list for weekly matchups
  function normalizeRankings(data) {
    const info = data.players || {};
    const games = {};
    (data.games || []).forEach(g => {
      games[g.away] = { opp: g.home, home: false, ou: g.ou };
      games[g.home] = { opp: g.away, home: true, ou: g.ou };
    });
    const positions = {};
    Object.entries(data.positions || {}).forEach(([pos, block]) => {
      let n = 0;
      const tiers = (block.tiers || []).map(t => {
        const letter = t.tier || t.label;
        const raw = t.ids ? t.ids.map(id => Object.assign({ id }, info[id])) : (t.players || []);
        const entries = raw.map(e => {
          n += 1;
          const p = player(e.id);
          const m = games[p.team] || {};
          return {
            id: e.id, p, pos, rank: n, tier: letter,
            fppg: e.fppg ?? null,
            matchRank: e.oppRank ?? e.rosSched ?? e.oppDefRank ?? null,
            opp: e.opp ?? m.opp ?? null,
            home: e.home ?? m.home ?? null,
            ou: e.ou ?? m.ou ?? null,
            panic: e.panic ?? null,
            flags: e.flags || [],
            consensus: e.avg != null ? { avg: e.avg, best: e.best, worst: e.worst, sources: e.nSources } : null
          };
        });
        return { tier: letter, name: tierName(letter, t), color: tierColor(letter, t), entries };
      }).filter(t => t.entries.length);
      if (tiers.length) positions[pos] = { tiers, sources: block.sources || null };
    });
    return positions;
  }

  function tierName(letter, t) {
    return (t && (t.name || (t.tier && t.label))) || (CONFIG.tiers[letter] || {}).name || `Tier ${letter}`;
  }

  function tierColor(letter, t) {
    return (t && t.color) || (CONFIG.tiers[letter] || {}).color || '#8a8a96';
  }

  function matchupLabel(e) {
    return e && e.opp ? `${e.home ? 'vs' : '@'} ${e.opp}` : null;
  }

  // Rest-of-season file + a lookup of every ranked player, used by the player card on any page.
  let rosPromise;
  function rosContext() {
    if (!rosPromise) {
      rosPromise = loadJSON(paths.ros(FFK.site)).then(data => {
        const positions = normalizeRankings(data);
        const index = {};
        Object.entries(positions).forEach(([pos, block]) => {
          if (pos === 'FLEX') return;
          block.tiers.forEach(t => t.entries.forEach(e => { if (!index[e.id]) index[e.id] = e; }));
        });
        return { data, positions, index };
      });
    }
    return rosPromise;
  }

  // ---- URL hash state (e.g. #qb-tiers, #game-2) ----
  function readHash() { return decodeURIComponent(location.hash.replace(/^#/, '')).toLowerCase(); }
  function writeHash(value) {
    if (readHash() !== value) history.replaceState(null, '', '#' + value);
  }

  // ---- Theme ----
  function currentTheme() {
    const set = document.documentElement.getAttribute('data-theme');
    if (set) return set;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function toggleTheme() {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('ffk-theme', next); } catch (e) { /* storage unavailable */ }
    updateThemeButton();
  }

  const ICON_SUN = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  const ICON_MOON = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';

  function updateThemeButton() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    const dark = currentTheme() === 'dark';
    btn.innerHTML = dark ? ICON_SUN : ICON_MOON;
    btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  // ---- Site shell ----
  function renderShell(site) {
    const page = document.body.dataset.page;
    const nav = [
      { id: 'ros', href: 'index.html', label: 'ROS Rankings' },
      { id: 'weekly', href: 'weekly.html', label: 'Weekly' },
      { id: 'startsit', href: 'start-sit.html', label: 'Start / Sit' }
    ].filter(n => n.id !== 'startsit' || site.showStartSit !== false); // "showStartSit": false in site.json hides the tab
    const banner = site.banner || `Week ${site.currentWeek} rankings are live`;
    const yt = esc(site.youtubeUrl || '#');

    document.getElementById('site-header').innerHTML = `
      <div class="banner">
        <div class="container banner-inner">
          <span>${esc(banner)}</span>
          <a href="${yt}" target="_blank" rel="noopener">Watch on YouTube <span aria-hidden="true">→</span></a>
        </div>
      </div>
      <header class="site-header">
        <div class="container header-inner">
          <a class="brand" href="index.html" aria-label="Fantasy Football Kingdom home">
            <img class="brand-logo" src="${esc(site.logo || 'assets/youtube_pfp.png')}" alt="" width="64" height="64">
            <span class="brand-text">
              <span class="brand-kicker">Fantasy Football</span>
              <span class="brand-name">Kingdom</span>
            </span>
          </a>
          <nav class="main-nav" aria-label="Main">
            ${nav.map(n => `<a href="${n.href}" class="nav-btn${n.id === page ? ' is-active' : ''}"${n.id === page ? ' aria-current="page"' : ''}>${n.label}</a>`).join('')}
            <button type="button" id="theme-toggle" class="nav-btn icon-btn"></button>
          </nav>
        </div>
      </header>`;

    document.getElementById('site-footer').innerHTML = `
      <footer class="site-footer">
        <div class="container footer-inner">
          <div class="footer-brand">
            <img src="${esc(site.logo || 'assets/youtube_pfp.png')}" alt="" width="40" height="40">
            <span class="footer-name">Fantasy Football Kingdom</span>
            <a href="${yt}" target="_blank" rel="noopener">${esc(site.handle || '@FantasyFBKingdom')}</a>
          </div>
          <p class="footer-note">Rankings are opinion for entertainment. Not affiliated with the NFL.</p>
        </div>
      </footer>`;

    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    updateThemeButton();
  }

  // Shows a "Sample data" badge if any loaded data file still has its sample note.
  function sampleBadge(...files) {
    return files.some(f => f && f._note) ?
      '<span class="sample-badge" title="This page is showing placeholder numbers">Sample data</span>' : '';
  }

  // "Full PPR scoring · Last updated Oct 6, 2026" line shown under each page title.
  function metaLine(file) {
    const parts = [`${(file && file.scoring) || FFK.site.scoring || 'PPR'} scoring`];
    if (file && file.updated) parts.push(`Last updated ${file.updated}`);
    return `<p class="page-meta">${parts.map(esc).join(' · ')}</p>`;
  }

  // Sources list shown at the bottom of each page. Accepts plain names or { label, url, checked }.
  function sourcesLine(file, list) {
    list = list || (file && file.sources) || [];
    const items = list.map(s => {
      if (typeof s === 'string') return esc(s);
      const checked = s.checked ? ` (checked ${esc(s.checked)})` : '';
      return s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>${checked}` : `${esc(s.label)}${checked}`;
    });
    return `<p class="sources"><b>Sources:</b> ${items.length ? items.join(' · ') : 'none listed yet'}</p>`;
  }

  function showError(err) {
    console.error(err);
    const main = document.getElementById('main');
    main.innerHTML = `<div class="error-box">
      <h2>Something went wrong loading this page</h2>
      <p>${esc(err.message || err)}</p>
      <p class="muted">If you're previewing locally, run a local server (see README) instead of opening the file directly.</p>
    </div>`;
  }

  window.FFK = {
    CONFIG, paths, metaLine, sourcesLine, normalizeRankings, tierName, tierColor, matchupLabel, rosContext, loadJSON, loadCore, pad2, esc, ordinal, num1, fppgClass, rankClass,
    player, team, fullName, shortName, initials, textOn, teamVars, photo, teamChip,
    avatar, silhouette, readHash, writeHash, renderShell, sampleBadge, showError
  };
})();
