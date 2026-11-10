# Week 10 Verification Report — 2026 Season

- **Week:** 10. ESPN's scoreboard still showed Week 9 at 1:10 PM CT Nov 10, but all 15 Week 9 games were final (BUF @ MIN ended Monday night), so the Tuesday rollover applies. ESPN's Week 10 schedule: 14 games, byes CHI, DEN, PHI, TB. First game: WSH @ NYG, Thu Nov 12, 7:15 PM CT.
- **Checked:** Tue, Nov 10, 2026, 1:10–1:20 PM CT.
- **Files:** `ros/rankings.json` and new `week-10/rankings.json` (your exports from Nov 10, ~11:00 AM CT), `players.json` (merged from both exports; 13 new players). Old ROS saved as `ros-history/week-09.json`. `site.json`: currentWeek 10, weeks [5, 8, 9, 10], rosHistory [5, 8, 9].
- **Note:** the ROS rankings were built Nov 8 (before Sunday night/Monday games); their stats were refreshed Nov 10.
- **Start/Sit:** skipped (tab hidden, per your decision).

## Sources (all checked Nov 10, 2026)
- ESPN scoreboard (Weeks 1–10), player game logs (207 players), game summaries for all 136 Week 1–9 games (box scores, scoring plays, play-by-play)
- ESPN injuries feed, feed time 1:14 PM CT: https://site.api.espn.com/apis/site/v2/sports/football/nfl/injuries
- ESPN player pages (team and roster status) for all 207 players, 1:14 PM CT
- Official NFL injury report: https://www.nfl.com/injuries/ — **Week 10 not posted yet** (page still shows Week 9 at 1:14 PM CT). NFL.com headlines used where noted.
- [ESPN/Yahoo via FanSided — Colts trade Keenan Allen to 49ers](https://fansided.com/nfl/nfl-trade-deadline-instant-grades-and-analysis-for-every-deal-made) (Tom Pelissero, Adam Schefter reports)
- [ClutchPoints — 2026 trade deadline tracker](https://clutchpoints.com/nfl/nfl-stories/2026-nfl-trade-deadline-tracker-every-move-rumor)
- [Rams — Davante Adams placed on IR](https://www.therams.com/news/rams-sign-kicker-brandon-mcmanus-place-poona-ford-and-davante-adams-on-injured-reserve); [CBS Sports](https://www.cbssports.com/fantasy/football/news/rams-davante-adams-placed-on-injured-reserve-by-rams/)
- [ESPN — Tank Dell, 105 yards in 2nd game back](https://espn.com/nfl/story/_/id/50428998/grateful-tank-dell-105-receiving-yards-2nd-game-back-knee-injury)

## Stats
- **Players checked:** 230 = 207 players (QB/RB/WR/TE/K) + 23 defenses, Weeks 1–9. Everyone in ROS (202) and Weekly (188).
- **Stats corrected:** 0.
- **Game logs:** every workflow stat matches ESPN for all 207 players. Fumbles lost also match ESPN box scores.
- **Season totals:** weekly points add up to `prof.tot.pts_ppr` (within 0.1) and `prof.g` matches the log for everyone. `statsThrough` is 9 and no game is pending.
- **Fantasy points recomputed:** 47 games differ from the stats alone; all 47 are 2-point conversions confirmed in ESPN scoring plays. (Trick plays such as a QB catching a pass now match because ESPN box scores include them.)
- **Kickers:** made/attempted, long, 40–49, 50+ and extra points all match ESPN.
- **Defenses (194 games):** yards allowed, sacks and interceptions match ESPN. 23 games differ, all under the workflow's defense rules, each confirmed in ESPN play-by-play:
  - 10 games: points allowed leaves out the opponent's defensive/return TD (BAL Wk5, CIN Wk1, IND Wk8, LAR Wk3, MIN Wk5, PIT Wk2, SEA Wk3, SEA Wk5, TB Wk1, TB Wk9).
  - 14 games: fumble recoveries leave out special-teams recoveries (kickoff fumbles, muffed punts).
  - JAX Wk 9: ESPN's box score credits BAL with a lost fumble, but play-by-play shows only a kickoff fumble that was reversed on review. Ours (0) is right.
  - MIN Wk5 and SEA Wk5 had both, so 10 + 15 − 2 = 23.
- **Defense TDs:** all 194 games match. SEA Wk 3 only looks different because ESPN labels a Seahawks receiving TD as a "fumble recovery"; it's an offensive TD.
- **Schedules:** 544 entries (both files, Weeks 1–9) match ESPN on opponent, final score and home/away.
- **Season stat tiles:** 1,212 tiles agree with the game logs.
- **FPPG:** 14 players show a 0.1 difference that is only rounding at an exact half (e.g. Gibbs 26.15 → 26.2). Not errors.

## Injuries
- **Final statuses (207 players):** 173 Active, 22 Questionable, 3 Doubtful, 4 Out, 5 IR, 0 blank.
- **Important:** the official NFL Week 10 report isn't out yet (it's Tuesday). Per your instruction, statuses use ESPN's injury feed and player pages as of 1:14 PM CT; each note says so. Washington and the Giants (Thursday game) have Monday estimated practice reports, reflected for Okonkwo.
- **Notes removed:** 19 outdated "Ruled out of Week 9 / Week 10 game status not posted yet" notes, replaced with the Week 10 status.
- **Byes:** no CHI, DEN, PHI or TB players are in the Week 10 rankings.
- **Weekly checks:** nobody Out or on IR is in the Weekly rankings. The highest-ranked player with a designation is in tier D (Garrett Wilson, George Pickens). None of last week's removed players (McKee, Kendre Miller, Elijah Mitchell, Carlson) came back in the export.

### Out, IR, Doubtful
| Player | Old status / injury | New status / injury | What happened and source |
|---|---|---|---|
| Sam Darnold (SEA) | Out / Quadriceps | Out / Quadriceps | Out for Week 10; Drew Lock expected to start — NFL.com, ESPN, Nov 10 |
| Josh Jacobs (GB) | Active / Finger | **Out** / Finger | Finger surgery; ESPN estimates Nov 25 return — ESPN, Nov 10 |
| DeVonta Smith (PHI) | Out / Hamstring | Out / Hamstring | Hamstring; PHI on bye — ESPN, Nov 9 |
| Kyle Monangai (CHI) | Questionable / Toe | **Out** / Toe | Toe sprain; CHI on bye — ESPN, Nov 9 |
| Puka Nacua (LAR) | Active / Knee | **Doubtful** / Knee | MCL/PCL sprains, turf toe; IR expected — ESPN, NFL.com, Nov 10 |
| Rhamondre Stevenson (NE) | Active / Knee | **Doubtful** / Knee | ESPN, Nov 10 (Weekly RB35, tier G) |
| Gardner Minshew (ARI) | Active / Elbow | **Doubtful** / Elbow | Feared torn UCL, likely season-ending surgery — Adam Schefter, ESPN, Nov 9 |
| Lamar Jackson (BAL) | IR / Thumb | IR / Thumb | ESPN estimates Dec 13 return — ESPN, Nov 8 |
| Jeremiyah Love (ARI) | IR / Ankle | IR / Ankle | On IR since Nov 3 — ESPN |
| Travis Etienne Jr. (NO) | IR / Hamstring | IR / Hamstring | Practice window not opened — ESPN, Nov 4 |
| Terrance Ferguson (LAR) | IR / Ankle | IR / Hamstring, Ankle | Coach hopeful on return — ESPN, Nov 10 |
| Davante Adams (LAR) | IR / Hamstring | IR / Hamstring | No longer in ESPN's injury feed, but no activation reported; on IR since Oct 20 — Rams, CBS Sports |

### Questionable (ESPN, Nov 9–10; official report not out yet)
| Player | Old | New | Note / source |
|---|---|---|---|
| A.J. Brown (NE) | Out / Knee | Questionable / Knee | ESPN, Nov 10 |
| Bam Knight (ARI) | Active / Concussion | Questionable / Concussion | ESPN, Nov 10 |
| Cam Skattebo (NYG) | Doubtful / Hamstring | Questionable / Hamstring | Coach says full go for Thursday — ESPN, Yahoo, Nov 9 |
| Carnell Tate (TEN) | blank / Shoulder | Questionable / Shoulder | ESPN, Nov 10 |
| Chig Okonkwo (WAS) | Active / Hip | Questionable / Hip | Limited on Monday's estimated report — John Keim, ESPN, Nov 9 |
| David Montgomery (HOU) | Out / Groin | Questionable / Groin | ESPN, Nov 10 |
| Deebo Samuel (SF) | Out / Hamstring | Questionable / Hamstring | ESPN, Nov 10 |
| Deshaun Watson (CLE) | Questionable / Concussion | Questionable / Concussion | Browns plan to start him — ESPN, Yahoo, Nov 9 |
| Drew Lock (SEA) | blank / Oblique | Questionable / Oblique | Tests good, expected to manage it — ESPN, Nov 9 |
| Garrett Wilson (NYJ) | Out / Concussion | Questionable / Concussion | ESPN, Nov 10 |
| George Pickens (DAL) | Questionable / Hamstring | Questionable / Hamstring | ESPN, Nov 10 |
| Jaylen Waddle (DEN) | Active / Head | Questionable / Concussion | DEN on bye; possible Nov 22 return — NFL.com, ESPN, Nov 8 |
| J.J. McCarthy (NYG) | Active / Undisclosed | Questionable / Hip | Seen at Tuesday practice — Art Stapleton via ESPN, Nov 10 |
| Justin Herbert (LAC) | Active / Finger | Questionable / Finger | Coach: "should be good to go" — ESPN, Nov 10 |
| Kyler Murray (MIN) | Out / Hamstring | Questionable / Hamstring | ESPN, Nov 10 |
| Ladd McConkey (LAC) | Active / Back | Questionable / Back | Day-to-day — ESPN, Nov 9 |
| Luther Burden (CHI) | Active / Undisclosed | Questionable / Concussion | CHI on bye — ESPN, Nov 9 |
| Malik Willis (MIA) | Active / Groin | Questionable / Groin | ESPN, Nov 8 |
| Mike Evans (SF) | Out / Achilles | Questionable / Achilles | Tendinitis — ESPN, Nov 10 |
| Patrick Mahomes (KC) | Active / Elbow | Questionable / Elbow | Day-to-day — ESPN, Nov 9 |
| TreVeyon Henderson (NE) | Out / Illness | Questionable / Illness | ESPN, Nov 10 |
| Xavier Worthy (KC) | Active / Hamstring | Questionable / Hamstring | Day-to-day — ESPN, Nov 9 |

### Cleared to Active (no ESPN designation, Nov 10)
- Amon-Ra St. Brown (was Questionable), Emeka Egbuka (was Questionable), Hunter Henry (was Questionable), Jordyn Tyson (was Questionable), KC Concepcion (old "Leg" injury cleared).
- 12 new or previously blank players set to Active: Audric Estime, Austin Ekeler, Carson Beck, Carson Wentz, Corey Kiner, DeMarcus Robinson, Emmett Johnson, Jacoby Brissett, Justice Hill, Mack Hollins, Seth McGowan, Tank Dell (ESPN page says "Day-To-Day" but the injury feed lists him Active and recent coverage says he's healthy — ESPN, Nov 9).

### Transactions
- **Keenan Allen: Colts → 49ers** (Nov 10, for a 2027 sixth-round pick — Tom Pelissero, Adam Schefter; ESPN roster). Updated his team to SF. His Weekly game changed from vs MIA to @ DAL (opp rank vs WR 4 → 25, O/U 40.5 → 55.5). His rank (WR30 Weekly, WR50 ROS) is unchanged.

## Headshots
- 9 added from ESPN at 300 px wide: audric-estime, austin-ekeler, carson-wentz, corey-kiner, demarcus-robinson, drew-lock, emmett-johnson, mack-hollins, seth-mcgowan. Every ranked player now has a photo.

## Preview (1:17 PM CT)
- Clicked every position tab in Tiers and List on ROS, Weekly (Week 10) and Week 9, and opened 8 player cards (Keenan Allen, Carson Beck, Drew Lock, Rhamondre Stevenson, Corey Kiner, Josh Allen, Austin Ekeler, Miami D/ST).
- "Last updated Nov 10, 2026" and sources show on each page; week picker lists 10, 9, 8, 5; rank changes compare against Week 9.
- The only browser errors are missing photos for defenses, which fall back to the team circle by design.

## Needs a decision before publishing
1. **Trade deadline is 3 PM CT today.** These checks were done before it. Jonathan Taylor (ranked in Weekly and ROS) is in trade rumors. Recommend a quick team check after 3 PM.
2. **Keenan Allen's rank** still reflects the Colts; re-rank him for the 49ers if you want.
3. **Rhamondre Stevenson** is Doubtful but still in the Weekly rankings (RB35, tier G). He isn't Out, so your removal rule doesn't apply yet.
4. **Puka Nacua** (ROS WR) is Doubtful with IR expected; if he goes on IR, he'd be out at least 4 games.
5. **Gardner Minshew's FPPG:** ROS shows 8.8 (3 games, counting a zero-stat Wk 7 on ESPN) vs 13.2 from his game log (2 games). Sources still disagree; left as exported.
6. **Games counted differently:** Dylan Sampson and Jonah Coleman have a Week 1 game in our log (kick returns only), which ESPN's game log leaves out. Sampson's FPPG is 7.9 with it, 10.5 without. Wentz, Lock, Jadarian Price and Minshew have zero-stat games on ESPN that aren't in our log (no effect on points).
7. **Carson Beck** (Weekly QB28) has no NFL games yet, so his card shows "—" for points per game.
8. **Re-check needed:** the official NFL report starts Wednesday (Monday's estimated report for WSH/NYG). Statuses here are ESPN's until then.
