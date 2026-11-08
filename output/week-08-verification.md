# Week 8 Verification Report — 2026 Season

- **Week:** 8 (confirmed on ESPN's scoreboard, Oct 31, 2026, 12:30 PM CDT: season 2026, regular season, week 8; CAR @ GB final, 13 games Sun–Mon; byes NO, NYG, SF, HOU)
- **Checked:** Sat, Oct 31, 2026, 12:30–12:40 PM CDT
- **Files checked:** `docs/data/2026/ros/rankings.json`, `docs/data/2026/week-08/rankings.json` (exports from Oct 29), `docs/data/players.json`
- **Start/Sit:** skipped this week (tab hidden, file is still Week 5 sample data)

## Sources
- ESPN scoreboard: https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard (Oct 31, 12:30 PM CDT)
- ESPN player game logs: `site.web.api.espn.com/.../athletes/<espnId>/gamelog?season=2026` (Oct 31, 12:31 PM CDT)
- ESPN game summaries (box scores, scoring plays, play-by-play): `site.api.espn.com/.../summary?event=<id>` (Oct 31)
- ESPN injuries feed: https://site.api.espn.com/apis/site/v2/sports/football/nfl/injuries (feed time Oct 31, 12:35 PM CDT)
- Official NFL injury report, Week 8: https://www.nfl.com/injuries/league/2026/reg8 (Oct 31, 12:36 PM CDT)
- ESPN player pages (team + roster status) for all 204 ranked players (Oct 31)
- News, for conflicts: [ESPN — Patriots rule out A.J. Brown, TreVeyon Henderson](https://www.espn.com/nfl/story/_/id/50337296/patriots-rule-aj-brown-treveyon-henderson-vs-dolphins), [NBC Sports — Brown ruled out](https://www.nbcsports.com/fantasy/football/player-news/2026-10-31/a-j-brown-knee-ruled-out-for-week-8-vs-mia), [NBC Sports — Henderson out](https://www.nbcsports.com/fantasy/football/player-news/2026-10-31/treveyon-henderson-illness-out-for-week-8), [Yahoo Sports — Tyson to IR](https://sports.yahoo.com/articles/orleans-saints-place-first-round-231251600.html), [NBC Sports — Tyson IR](https://www.nbcsports.com/fantasy/football/player-news/2026-08-30/jordyn-tyson-lands-on-ir-out-at-least-four-games), [The Big Lead — Week 8 (Tyson window not opened)](https://thebiglead.com/fantasy-football-week-8-buy-low-trade-targets-chase-brown-justin-jefferson-collins-wilson-kelce-tyson) (all checked Oct 31)

## Stats (step 3)
- **Players checked:** 230 = 204 players (QB/RB/WR/TE/K) + 26 defenses. Every player in ROS (202) and Weekly (188) rankings.
- **Game logs, Weeks 1–7:** every stat listed in the workflow matched ESPN for all 204 players. **0 corrections.**
- **Season totals:** weekly points add up to `prof.tot.pts_ppr` for every player; `prof.g` = games in log; FPPG in both rankings files = points ÷ games. **0 issues.** `statsThrough` = 7 (last completed week); no games marked pending.
- **Fantasy points recomputed (full PPR):** 37 games differ from the export. All 37 are explained and are *not* errors:
  - 33 games: 2-point conversions, each confirmed in ESPN's scoring plays (e.g. Bo Nix Wk 3 and Michael Penix Wk 6 threw two each; Derrick Henry Wk 5, Travis Etienne Wk 2, Dak Prescott Wk 7 and Aaron Rodgers Wk 4 ran one in). Leftover ±0.02–0.04 is the export rounding to one decimal.
  - 4 games: trick plays outside the player's position:
    - Jaxon Smith-Njigba Wk 3 threw a 14-yd pass (+0.6).
    - Josh Allen Wk 3 caught his own pass for 1 yd (+1.1).
    - Michael Wilson Wk 5 threw a 7-yd pass to Jacoby Brissett (+0.3 Wilson, +1.7 Brissett).
- **Kickers:** FG made/attempted, long, 50+, XP made/attempted all match ESPN.
- **Defenses (175 games):** yards allowed, sacks, and interceptions all match ESPN box scores. 22 games with differences (MIN Wk 5 and SEA Wk 5 had both types), all explained by the workflow's defense rules (each confirmed with the play):
  - 10 games: points allowed is 6 lower because the opponent scored a defensive/return TD. Affected: ATL Wk 1–2, BAL Wk 5, CIN Wk 1, LAR Wk 3, MIN Wk 5, PIT Wk 2, SEA Wk 3 & 5, TB Wk 1.
  - 14 games: fumble recoveries exclude special-teams recoveries (muffed punts, kick-return fumbles). Affected: CHI Wk 1 & 6, KC Wk 4, MIN Wk 5, NO Wk 3 & 6, NYG Wk 3, NYJ Wk 1, PIT Wk 3, SEA Wk 4 & 5, SF Wk 4, TB Wk 5 & 7.
- **Schedules:** opponents and results match ESPN. Two labeling differences, not errors:
  - ESPN writes WSH for Washington (we use WAS).
  - In 5 international neutral-site games, ESPN shows both teams as "vs" and we show one team as away: SF–LAR Wk 1, BAL–DAL Wk 3 (Rio), PHI–JAX Wk 5, HOU–JAX Wk 6, PIT–NO Wk 7.
- **Teams:** every ranked player's team matches ESPN's roster.

## Injuries (step 4)
- **Every ranked player now has a status:** 174 Active, 8 Questionable, 8 Out, 6 IR. 8 are left blank with a note: on bye, Monday-night status not out yet, or injured in Thursday's game. Before this check, 198 of 204 statuses were blank.
- **Stale notes removed:** 13 "Week 8 status N/A until the first report" notes, plus Lamar Jackson's "Starter not confirmed" note.
- **Rule used:** official NFL.com report first. ESPN/team news is used only where it's newer (Saturday downgrades) or the official status isn't out yet (Monday game).

| Player | Old status / injury | New status / injury | Source (time) |
|---|---|---|---|
| A.J. Brown (NE) | blank / Ankle | **Out** / Ankle, Knee | Patriots ruled out Sat — ESPN (Oct 31, 12:07 PM CDT). NFL.com still showed Questionable (Fri report) |
| TreVeyon Henderson (NE) | blank / — | **Out** / Illness | Downgraded Sat — ESPN (Oct 31, 12:10 PM CDT). NFL.com still showed Questionable |
| Carnell Tate (TEN) | blank / Shoulder | **Out** / Shoulder | NFL.com (Oct 31); back Week 10 per Paul Kuharsky via ESPN |
| DeVonta Smith (PHI) | blank / Hamstring | **Out** / Hamstring | NFL.com (Oct 31) |
| Dontayvion Wicks (PHI) | blank / Ankle | **Out** / Ankle | NFL.com (Oct 31) |
| Emeka Egbuka (TB) | blank / Concussion | **Out** / Foot | NFL.com (Oct 31) |
| RJ Harvey (DEN) | blank / — | **Out** / Knee | NFL.com (Oct 31); not long-term per Denver Post via ESPN |
| Kyle Monangai (CHI) | blank / Toe | **Out** / Thumb, Toe | HC Ben Johnson, Sat — ESPN (Oct 31, 11:55 AM CDT); CHI plays Monday |
| Breece Hall (NYJ) | blank / Quadriceps | **Questionable** | NFL.com (Oct 31), limited practice |
| Colby Parkinson (LAR) | blank / — | **Questionable** / Ribs | NFL.com (Oct 31), DNP |
| Dalton Kincaid (BUF) | blank / — | **Questionable** / Chest | NFL.com (Oct 31), limited |
| DJ Moore (BUF) | blank / Shoulder | **Questionable** | NFL.com (Oct 31), limited |
| George Pickens (DAL) | blank / — | **Questionable** / Shoulder, Hamstring | NFL.com (Oct 31), limited |
| Jakobi Meyers (JAX) | blank / Hamstring | **Questionable** / Hamstring, Ankle | NFL.com (Oct 31), DNP |
| Jaylen Waddle (DEN) | blank / Undisclosed | **Questionable** / Chest | NFL.com (Oct 31), limited |
| Kenneth Gainwell (TB) | blank / Hip | **Questionable** | NFL.com (Oct 31), full practice |
| Davante Adams, Jadarian Price, Romeo Doubs, Terrance Ferguson, Travis Etienne | IR | IR (confirmed) | ESPN roster status (Oct 31) |
| Jordyn Tyson (NO) | IR | IR (confirmed) | Yahoo Sports / NBC Sports (IR Aug 30, designated to return); The Big Lead (window not opened). ESPN's player page shows "Day-To-Day", which conflicts |
| Lamar Jackson (BAL) | blank / Ankle | **Active** | Cleared to play — Jesse Minter via Baltimore Sun (Oct 30); full practice, NFL.com |
| Jeremiyah Love, Rashee Rice, Tyler Warren | blank | **Active** | No designation / will play — NFL.com; ESPN (Oct 30) |
| Matthew Golden (GB) | blank / Shoulder | **Active** / Shoulder, Foot | Played Thursday (was Questionable on NFL.com) |
| Christian McCaffrey (SF) | blank / Calf | blank / Hamstring (bye) | Hamstring, not calf — SF Standard via ESPN (Oct 26) |
| Deebo Samuel, Mike Evans (SF), David Montgomery (HOU), Cam Skattebo (NYG) | blank | blank (bye, note added) | ESPN (Oct 26–27) |
| Colston Loveland (CHI), Zach Charbonnet (SEA) | blank | blank (Monday game, note added) | Limited practice Fri — NFL.com; The Athletic / Seahawks site via ESPN (Oct 30) |
| Christian Watson (GB) | blank / — | blank / Ribs | Broke a rib Thu vs CAR — Rob Demovsky, ESPN (Oct 30) |

- **Byes:** no players from NO, NYG, SF or HOU are in the Week 8 rankings.
- **Consistency:** nobody ruled Out is in a top tier (S/A/B) of the weekly rankings. Start/Sit was skipped, so the START-call check doesn't apply.

## Headshots (step 6)
- 8 missing headshots downloaded from ESPN and resized to 300 px wide: mason-taylor, demario-douglas, tanner-mckee, kimani-vidal, omar-cooper, roschon-johnson, bam-knight, kendrick-bourne. All ranked players now have photos.

## Needs a decision before publishing
1. **6 players ruled Out are still ranked this week:**
   - WR17 DeVonta Smith (tier D)
   - WR18 A.J. Brown (tier E)
   - WR23 Carnell Tate (tier E)
   - WR26 Emeka Egbuka (tier E)
   - RB33 RJ Harvey (tier G)
   - RB41 TreVeyon Henderson (tier G)

   Each now shows an "Out" note. Remove them from the Week 8 rankings, or leave them with the note?
2. **Monday-night statuses aren't official yet:** Colston Loveland (TE6) and Zach Charbonnet (RB37) were limited Friday. Re-check Saturday evening or Monday, before kickoff.
3. **Puka Nacua (WR2 this week):** the NFL.com row shows "Did Not Participate" Friday but no game designation, and reports say he's expected to play. Set to Active. Worth a glance at the Rams' inactives Sunday (~90 min before kickoff).
4. **Re-check on game day:** inactive lists come out about 90 minutes before each kickoff.
