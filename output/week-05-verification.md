# Week 5 Verification Report — 2026 Season

- **Checked:** Friday, Oct 9, 2026, about 5:00 PM ET (ESPN injury feed timestamp 20:58 UTC)
- **Week:** 5 (regular season), confirmed on the ESPN scoreboard; `site.json` already set to 5, no change
- **Players checked:** 244 unique players across ROS, Weekly and Start/Sit
  - 211 players: every week of stats compared with ESPN game logs (692 games)
  - 27 defenses: compared with ESPN box scores
  - 6 Start/Sit sample players: no ESPN ID or stats, so not verifiable (see Open items)
- **Files changed:** `docs/data/players.json`, `docs/data/2026/ros/rankings.json`, `docs/data/2026/week-05/rankings.json`. Start/Sit was not touched.

## Sources
- ESPN scoreboard (weeks 1–5): https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard
- ESPN player game logs: https://site.web.api.espn.com/apis/common/v3/sports/football/nfl/athletes/{id}/gamelog?season=2026
- ESPN box scores and play-by-play: https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event={id}
- ESPN player pages (latest injury entry): https://site.web.api.espn.com/apis/common/v3/sports/football/nfl/athletes/{id}
- NFL.com official Week 5 injury report: https://www.nfl.com/injuries/league/2026/reg5

## Stats — result
- **No player stats needed correcting.** Every week of every player matched ESPN.
- **Your export scores interceptions at −1**, not −2 (Sleeper default PPR). With that rule, all 692 games match except the 17 below, and all 17 are explained:
  - 15 games include 2-point conversions, which ESPN game logs don't list (e.g. Bo Nix Week 3: two 2-pt passes, +4)
  - Josh Allen Week 3: caught his own deflected pass for 1 yard (+1.1)
  - Jaxon Smith-Njigba Week 3: threw a 14-yard pass (+0.6)
- **Defenses: 16 differences from ESPN, all explained by standard fantasy rules (no change needed):**
  - 8 points-allowed gaps: points scored by the other team's defense or special teams (pick-sixes, fumble returns, a safety) don't count against the defense
  - 8 fumble-recovery gaps: recoveries on special teams (muffed punts, kickoff fumbles) aren't counted as defensive recoveries
- Season totals, games played and snap share all agree with the game logs (some differ by 0.1 from rounding).

## Corrections applied
- **Week 4 ATL @ NO is final** (ATL 45, NO 24 — ESPN scoreboard). The ROS file still listed it as unfinished:
  - Schedule result set for ATL ("W 45-24") and NO ("L 24-45"); removed from the unfinished-games list
  - Removed the "Week 4 ATL @ NO not final when built" note from 12 players
  - Points per game updated to include Week 4 (same values as the Week 5 export, which matches ESPN):
    - Tyler Shough: 24.1 → 22.1
    - Michael Penix Jr.: 15 → 13.9
    - Bijan Robinson: 25.9 → 26.3
    - Alvin Kamara: 6.2 → 11.7
    - Chris Olave: 23.5 → 22.5
    - Drake London: 14.3 → 14.4
    - Devaughn Vele: 12.7 → 13.9
    - Juwan Johnson: 16.1 → 15
    - Kyle Pitts Sr.: 1.3 → 2.9
    - New Orleans Saints: 3.7 → 2
- Added "ESPN stats & injuries (checked Oct 9)" and "NFL.com injury report (Oct 9)" to the sources shown on each rankings page.

## Injury updates
- 192 status updates in `players.json` (most were blank → Active). Every rankings note now shows the status, the injury, the latest practice and the source with its date.
- **Official Friday game statuses weren't posted on NFL.com yet** for Sunday and Monday games. "Out" players were ruled out by their teams (reported on ESPN). "Questionable" is ESPN's current listing; each site note says the official status hasn't been posted yet. Practice participation comes from NFL.com.
- **Out (10):**
  - Baker Mayfield (QB, TB) — Thumb · NFL.com official injury report
  - Lamar Jackson (QB, BAL) — Ankle · ESPN player page + NFL.com practice report
  - Breece Hall (RB, NYJ) — Quadriceps · ESPN player page + NFL.com practice report
  - Kyle Monangai (RB, CHI) — Toe · ESPN player page + NFL.com practice report
  - Saquon Barkley (RB, PHI) — Hamstring · ESPN player page + NFL.com practice report
  - Adonai Mitchell (WR, NYJ) — Finger · ESPN player page + NFL.com practice report
  - DeVonta Smith (WR, PHI) — Hamstring · ESPN player page + NFL.com practice report
  - Michael Pittman Jr. (WR, PIT) — Foot · ESPN player page + NFL.com practice report
  - Quentin Johnston (WR, LAC) — Chest · ESPN player page + NFL.com practice report
  - Stefon Diggs (WR, WAS) — Hamstring · ESPN player page + NFL.com practice report
- **Questionable (18):**
  - Caleb Williams (QB, CHI) — Hamstring · ESPN player page + NFL.com practice report
  - Alvin Kamara (RB, NO) — Back · ESPN player page + NFL.com practice report
  - Ashton Jeanty (RB, LV) — Ankle · ESPN player page + NFL.com practice report
  - Jaylen Wright (RB, MIA) — Foot · ESPN player page + NFL.com practice report
  - Jeremiyah Love (RB, ARI) — Ankle · ESPN player page + NFL.com practice report
  - Rhamondre Stevenson (RB, NE) — Knee · ESPN player page + NFL.com practice report
  - Rico Dowdle (RB, PIT) — Toe · ESPN player page + NFL.com practice report
  - Carnell Tate (WR, TEN) — Back · ESPN player page + NFL.com practice report
  - DJ Moore (WR, BUF) — Shoulder - AC Joint · ESPN player page + NFL.com practice report
  - Ja'Marr Chase (WR, CIN) — Concussion · ESPN player page + NFL.com practice report
  - Jordan Addison (WR, MIN) — Hamstring · ESPN player page + NFL.com practice report
  - Justin Jefferson (WR, MIN) — Ankle · ESPN player page + NFL.com practice report
  - Keenan Allen (WR, IND) — Groin · ESPN player page + NFL.com practice report
  - Ladd McConkey (WR, LAC) — Foot · ESPN player page + NFL.com practice report
  - Mike Evans (WR, SF) — Ribs · ESPN player page + NFL.com practice report
  - Tee Higgins (WR, CIN) — Groin · ESPN player page + NFL.com practice report
  - Terry McLaurin (WR, WAS) — Hamstring · ESPN player page + NFL.com practice report
  - Zay Flowers (WR, BAL) — Foot · ESPN player page + NFL.com practice report
- **Injured reserve (6):**
  - Jadarian Price (RB, SEA) — Chest · ESPN player page
  - Jordan Mason (RB, MIN) — Thumb · ESPN player page
  - Travis Etienne Jr. (RB, NO) — Hamstring · ESPN player page
  - Terrance Ferguson (TE, LAR) — Ankle · ESPN player page
  - A.J. Brown (WR, NE) — Ankle · ESPN player page
  - Jordyn Tyson (WR, NO) · UNVERIFIED
- **On the injury report, game status not posted yet (status left blank) (13):**
  - Aaron Jones Sr. (RB, MIN) · NFL.com practice report
  - Cam Skattebo (RB, NYG) · NFL.com practice report
  - D'Andre Swift (RB, CHI) · NFL.com practice report
  - Jacory Croskey-Merritt (RB, WAS) · NFL.com practice report
  - Rachaad White (RB, WAS) · NFL.com practice report
  - Dallas Goedert (TE, PHI) · NFL.com practice report
  - Isaiah Likely (TE, NYG) · NFL.com practice report
  - Chris Bell (WR, MIA) · NFL.com practice report
  - Chris Olave (WR, NO) · NFL.com practice report
  - Davante Adams (WR, LAR) · NFL.com practice report
  - Dontayvion Wicks (WR, PHI) · NFL.com practice report
  - Malik Nabers (WR, NYG) · NFL.com practice report
  - Nico Collins (WR, HOU) · NFL.com practice report
- **Byes this week:** Carolina and Kansas City; their players show "Bye". Rashee Rice (hamstring, called "relatively minor") and Jalen Coker (quadriceps) are noted as hopeful to return after the bye.
- **Thursday game already played:** TB 24, DAL 16. TB/DAL players are noted "Week 5 game already played"; Baker Mayfield was out (thumb).
- **Tyler Huntley:** note updated. Lamar Jackson was ruled out Friday (ankle — ESPN, Oct 9), and Huntley took first-team reps (BaltimoreRavens.com, Oct 7).
- Removed outdated notes like "Week 5 status N/A until the first report Wednesday" from every player.

## Open items — need a decision before publishing
1. **Re-check injuries Saturday.** Friday game statuses weren't on NFL.com yet; BUF/LAR (Monday night) statuses come out Saturday. Players currently marked "status not posted yet" may change.
2. **Jordyn Tyson (NO) — IR not confirmed.** Your export says IR, but ESPN shows no injury and NFL.com doesn't list him. Left as IR with a note; please confirm.
3. **Kicker and defense points per game use FantasyPros scoring**, while the game logs on player cards use Sleeper scoring, so a kicker card can show a different average than the rankings (e.g. Brandon Aubrey 10.3 vs 9.2). Your export already notes this. Not changed.
4. **Players with games but no stats** (Tyler Huntley, Tyson Bagent, Jadarian Price): the weekly file counts their zero-stat appearances in points per game (e.g. Huntley 2.1 vs 4.1 per game with stats). Pick one rule and keep it consistent.
5. **Start/Sit is still sample data** (you chose to leave it). It gives Saquon Barkley a START call, but he's ruled out (hamstring), and its games don't match the real Week 5 schedule.
6. **Not verifiable from ESPN game logs:** QB fumbles lost and 2-point conversions. Kept as exported. All 15 games where 2-point conversions explained a point gap were confirmed in ESPN's scoring plays.
7. **Workflow fix:** `workflows/weekly-update.md` listed INT as −2. Updated to match your scoring (INT −1, 2-pt conversions counted, defense rules above).

_Raw check data (ESPN responses, findings, and the full change log) was saved during the run; backups of the three original data files were kept before any change._
