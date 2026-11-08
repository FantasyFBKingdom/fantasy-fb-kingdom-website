# Week 9 Verification Report — 2026 Season

- **Week:** 9, confirmed on ESPN's scoreboard (Nov 4, 2026, 11:12 PM CT). Byes: TEN, PIT. First game: JAX @ BAL, Thu Nov 5, 7:15 PM CT.
- **Checked:** Wed, Nov 4, 2026, 11:15–11:25 PM CT.
- **Files checked:** `ros/rankings.json`, `week-09/rankings.json` and `players.json` (exports from Nov 4, about 11:12 PM CT).
- **Start/Sit:** skipped (tab hidden, per your decision).

## Sources (all checked Nov 4, 2026)
- ESPN scoreboard, player game logs, game summaries (box scores, scoring plays, play-by-play) and player pages
- ESPN injuries feed, 11:18 PM CT: https://site.api.espn.com/apis/site/v2/sports/football/nfl/injuries
- Official NFL injury report, Week 9, 11:18 PM CT: https://www.nfl.com/injuries/league/2026/reg9
- [ESPN — Saints release Daniel Carlson](https://www.espn.com/nfl/story/_/id/50372284/saints-release-veteran-kicker-daniel-carlson-7-games)
- [Pro Football Rumors — Saints release Carlson](https://www.profootballrumors.com/2026/11/saints-release-k-daniel-carlson-claim-rb-audric-estime)
- [Baltimore Ravens — Brissett trade](https://www.baltimoreravens.com/news/jacoby-brissett-ravens-trade-quarterback-cardinals-2026)
- [CBS Sports — Brissett trade](https://www.cbssports.com/nfl/news/jacoby-brissett-trade-ravens-cardinals-lamar-jackson/)
- [Yahoo Sports — James Mitchell's fumble-recovery TD](https://sports.yahoo.com/articles/former-panthers-te-scores-wildly-192639539.html)
- [Arizona Cardinals — Week 8 scoring summary](https://www.azcardinals.com/game-day/2026/week8/cardinals-at-cowboys/scoring-summary)

## Stats
- **Players checked:** 228 = 206 players (QB/RB/WR/TE/K) + 22 defenses, Weeks 1–8. Everyone in ROS (202) and Weekly (190).
- **Stats corrected:** 0.
- **Game logs:** every workflow stat matches ESPN for all 206 players.
- **Season totals:** weekly points add up to `prof.tot.pts_ppr`, and `prof.g` matches the log for every player. `statsThrough` is 8 and no game is pending.
- **FPPG:** matches points ÷ games for everyone except Gardner Minshew (see decisions).
- **Fantasy points recomputed:** 44 games differ from the export, and all are explained:
  - 40 games: 2-point conversions, confirmed in ESPN scoring plays.
  - 4 games: known trick plays — Smith-Njigba Wk 3, Josh Allen Wk 3, Michael Wilson and Jacoby Brissett Wk 5.
- **Kickers:** made/attempted, long, 50+ and extra points all match ESPN.
- **Defenses (166 games):** yards allowed, sacks and interceptions match ESPN. 19 games differ on other stats, all under the workflow's defense rules and all from Weeks 1–7, with the plays confirmed in the Week 8 check:
  - 8 games: points allowed leaves out the opponent's defensive/return TDs.
  - 13 games: fumble recoveries leave out special-teams recoveries.
  - MIN Wk 5 and SEA Wk 5 had both, so 8 + 13 − 2 = 19.
- **Defense TDs:** 166 games checked against ESPN scoring plays. One difference, not an error: Dallas Wk 8. TE James Mitchell recovered teammate Javonte Williams's fumble in the end zone, so it's an offensive TD and the defense correctly has 0.
- **Schedules:** 484 entries (both rankings files, Weeks 1–8) match ESPN on opponent, final score and home/away. ESPN marks both teams "vs" in 6 neutral-site games, where we list one team as away: SF–LAR Wk 1, BAL–DAL Wk 3, IND–WAS Wk 4, PHI–JAX Wk 5, HOU–JAX Wk 6, PIT–NO Wk 7.
- **Season stat tiles:** 811 tiles agree with the game logs.
- **One data fix:** Daniel Carlson had no ESPN ID in the export. Added `3051909` from ESPN's player search; his game log then matched. A new export may blank it again.

### Corrections to the Week 8 report
- It said results matched ESPN, but that check only compared opponents and home/away. Final scores are now checked for Weeks 1–8, with no errors.
- It didn't check defense TDs or season stat tiles. Both are now checked for Weeks 1–8, with no errors.
- It listed 5 neutral-site games. The correct count is 6 (IND–WAS Wk 4 was missing).

## Injuries
- **Final statuses (206 players):** 159 Active, 1 Questionable, 3 Out, 8 IR, 35 blank.
- **Why 35 are blank:** it's Wednesday night, and most game statuses come out Friday. A blank means no official status yet (or on bye, or a roster issue), and each has a dated note.
- **Active:** 159 players have no injury designation on ESPN or NFL.com, or practiced in full. 154 of them needed only their blank status filled in.
- **Teams not on the report yet:** Bears, Bills, Seahawks, Vikings. Players on these teams rely on ESPN alone for now.
- **Notes removed:** 26 outdated or duplicate notes.
- **Byes:** no TEN or PIT players are in the Week 9 rankings.
- **On the card:** a blank status shows as "Status N/A", with the note beneath it.

### Settled: Out, IR, Questionable
| Player | Old status / injury | New status / injury | What happened and source |
|---|---|---|---|
| Bhayshul Tuten (JAX) | Q / Ankle | Questionable / Ankle, Foot | Ankle and foot injuries; Questionable for Thursday (official report, Nov. 4) |
| Davante Adams (LAR) | IR / Hamstring | IR / Hamstring | On IR after hamstring surgery (6–10 week timeline) — Sean McVay via ESPN, Oct 28 |
| David Montgomery (HOU) | blank / Groin | Out / Groin | Out for Week 9 (groin) — DeMeco Ryans via Houston Chronicle, ESPN, Nov 4 |
| Jordyn Tyson (NO) | IR / — | IR / — | On IR (hamstring), limited practice Wed — NFL.com, Nov 4; Adam Schefter via ESPN |
| Lamar Jackson (BAL) | OUT / Thumb | Out / Thumb | Out for Thursday (thumb); surgery, going on IR, could miss the rest of the season — NFL.com, ESPN, Nov 4 |
| RJ Harvey (DEN) | IR / Knee | IR / Knee | On IR (knee) since Oct 31 — Ian Rapoport via ESPN |
| Romeo Doubs (NE) | IR / Shoulder | IR / Shoulder | On IR since Oct 19 — ESPN, checked Nov 4 |
| Sam Darnold (SEA) | blank / Quadriceps | Out / Quadriceps | Out for Week 9 (quad, ribs), week to week; Drew Lock in line to start (NFL.com, CBS Sports, Nov. 4) |
| Terrance Ferguson (LAR) | IR / Ankle | IR / Ankle | On IR (ankle), limited practice Wed — NFL.com, Nov 4; ESPN |
| Travis Etienne Jr. (NO) | IR / Hamstring | IR / Hamstring | On IR (hamstring), practice window not opened — Kellen Moore via WWL, ESPN, Nov 4 |
| Tyler Loop (BAL) | IR / Groin | IR / Groin | On IR (groin) since Nov 3 — ESPN, checked Nov 4 |

### Not settled yet: blank status, re-check after Friday's reports
| Player | Old status / injury | New status / injury | What happened and source |
|---|---|---|---|
| A.J. Brown (NE) | blank / Ankle | blank / Ankle, Knee | Did not practice Wed (ankle/knee); game status not out yet — NFL.com, Nov 4 |
| Alvin Kamara (NO) | blank / Back | blank / Back | Did not practice Wed (rest/back); game status not out yet — NFL.com, Nov 4 |
| Amon-Ra St. Brown (DET) | blank / Ribs | blank / Ribs | Limited practice Wed (ribs); game status not out yet — NFL.com, Nov 4 |
| Breece Hall (NYJ) | blank / Quadriceps | blank / Quadriceps | Limited practice Wed (quadriceps); game status not out yet — NFL.com, Nov 4 |
| Cam Skattebo (NYG) | blank / Hamstring | blank / Hamstring | Did not practice Wed (hamstring); game status not out yet — NFL.com, Nov 4 |
| Carnell Tate (TEN) | blank / Shoulder | blank / Shoulder | On bye Week 9; shoulder, expected back Week 10 — ESPN, Nov 3 |
| Christian McCaffrey (SF) | blank / Calf | blank / Hamstring | Did not practice Wed (hamstring); game status not out yet — NFL.com, Nov 4; says he has a chance to play, Nick Wagoner via ESPN |
| Christian Watson (GB) | blank / Undisclosed | blank / Ribs | Limited practice Wed (broken rib); game status not out yet — NFL.com, Nov 4 |
| Courtland Sutton (DEN) | blank / — | blank / — | Limited practice Wed (reason not listed); game status not out yet — NFL.com, Nov 4 |
| Daniel Carlson (NO) | blank / — | blank / — | Released by the Saints Nov 3; currently a free agent — ESPN, checked Nov 4 |
| Deebo Samuel Sr. (SF) | blank / Hamstring | blank / Hamstring | Did not practice Wed (hamstring); game status not out yet — NFL.com, Nov 4 |
| Denzel Boston (CLE) | blank / Calf | blank / Calf | Limited practice Wed (calf); game status not out yet — NFL.com, Nov 4 |
| Deshaun Watson (CLE) | blank / Concussion | blank / Concussion | In the concussion protocol and missed Wednesday's practice; Shedeur Sanders is next up (ESPN, NBC Sports, Nov. 4) |
| DeVonta Smith (PHI) | blank / Hamstring | blank / Hamstring | Did not practice Wed (hamstring); game status not out yet — NFL.com, Nov 4 |
| DJ Moore (BUF) | blank / Undisclosed | blank / Knee | Left Week 8 with a knee issue, says he is OK; not on the NFL.com report yet — NFL Network via ESPN, Nov 1 |
| Elijah Mitchell (PHI) | blank / — | blank / — | Back on the Eagles practice squad since Nov 2; must be elevated to play — NFL transaction log via ESPN |
| Emeka Egbuka (TB) | blank / Foot | blank / Foot | Did not practice Wed (foot); game status not out yet — NFL.com, Nov 4 |
| Garrett Wilson (NYJ) | blank / Concussion | blank / Concussion | Did not practice Wed (concussion protocol); game status not out yet — NFL.com, Nov 4; Aaron Glenn via The Athletic, ESPN |
| George Pickens (DAL) | blank / Hamstring | blank / Hamstring | Limited practice Wed (hamstring); game status not out yet — NFL.com, Nov 4 |
| Hunter Henry (NE) | blank / Foot | blank / Foot | Did not practice Wed (foot); game status not out yet — NFL.com, Nov 4 |
| Jacoby Brissett (ARI) | blank / — | blank / — | Being traded to the Ravens, deal expected this weekend; did not practice Wed — NFL.com, Nov 4; Adam Schefter via ESPN |
| Jake Ferguson (DAL) | blank / Ankle | blank / Ankle | Did not practice Wed (ankle); game status not out yet — NFL.com, Nov 4 |
| Jonathan Taylor (IND) | blank / — | blank / — | Limited practice Wed (reason not listed); game status not out yet — NFL.com, Nov 4 |
| Keenan Allen (IND) | blank / — | blank / — | Did not practice Wed (reason not listed); game status not out yet — NFL.com, Nov 4 |
| Kenny Gainwell (TB) | blank / Hip | blank / Hip | Limited practice Wed (hip); game status not out yet — NFL.com, Nov 4 |
| Kyle Monangai (CHI) | blank / Toe | blank / Thumb, Toe | Did not take part in Wed walkthrough (thumb/toe); game status not out yet — ESPN, Nov 4 |
| Kyler Murray (MIN) | blank / Hamstring | blank / Hamstring | Starter not confirmed: Sore hamstring; Kevin O'Connell hasn't decided, and Carson Wentz starts if he can't play (ESPN, SI, Nov. 2-4) |
| Mason Taylor (NYJ) | blank / Back | blank / Back | Limited practice Wed (back); game status not out yet — NFL.com, Nov 4 |
| Michael Wilson (ARI) | blank / Ribs | blank / Ribs | Limited practice Wed (broken ribs); game status not out yet — NFL.com, Nov 4 |
| Mike Evans (SF) | blank / Achilles | blank / Achilles, Ribs | Did not practice Wed (Achilles/ribs); game status not out yet — NFL.com, Nov 4 |
| Rashee Rice (KC) | blank / Hamstring | blank / Hamstring, Knee | Limited practice Wed (hamstring/knee); game status not out yet — NFL.com, Nov 4 |
| Saquon Barkley (PHI) | blank / Hamstring | blank / Hamstring, Back | Did not practice Wed (hamstring/back); game status not out yet — NFL.com, Nov 4 |
| Stefon Diggs (WAS) | blank / — | blank / — | Did not practice Wed (reason not listed); game status not out yet — NFL.com, Nov 4 |
| Travis Kelce (KC) | blank / Ankle | blank / Ankle | Limited practice Wed (ankle); game status not out yet — NFL.com, Nov 4 |
| TreVeyon Henderson (NE) | blank / Illness | blank / Illness | Did not practice Wed (illness); game status not out yet — NFL.com, Nov 4 |

### Active, with a note
| Player | Old status / injury | New status / injury | What happened and source |
|---|---|---|---|
| Chris Rodriguez Jr. (JAX) | blank / — | Active / Hand | No designation for Thursday (hand), limited practice — NFL.com, Nov 4; ESPN |
| Gardner Minshew II (ARI) | blank / — | Active / — | Named Cardinals starter beginning Week 9 — Mike LaFleur via NFL Network, ESPN, Nov 4 |
| Jakobi Meyers (JAX) | blank / — | Active / — | No designation for Thursday (hamstring/ankle), limited practice — NFL.com, Nov 4; ESPN |
| Joe Fagnano (BAL) | blank / — | Active / — | Projected Ravens starter for Week 9; Brissett not expected until Week 10 — Adam Schefter via ESPN, Nov 4 |
| Tanner McKee (PHI) | blank / — | Active / — | Benched: Joe Milton starts Week 9 (CBS Sports, NFL.com, ESPN, Nov. 4) |

## Headshots
- 6 added from ESPN at 300 px wide: kaelon-black, eli-raridon, joe-fagnano, devin-singletary, elijah-mitchell, gardner-minshew. Every ranked player now has a photo.

## Preview
- Clicked every position tab in Tiers and List on ROS, Weekly and Week 8, and opened 7 player cards.
- "Last updated" and sources show on each page, the week picker works, and rank changes compare against Week 8.
- The only browser errors are missing-photo requests for defenses, which fall back to the team circle by design.

## Needs a decision before publishing
1. **Weekly rankings that may no longer be right:**
   - **Sam Darnold (QB16):** ruled Out. His note names Drew Lock in line to start, but Lock isn't in your data.
   - **Tanner McKee (QB27):** benched for Joe Milton, who also isn't in your data.
   - **Elijah Mitchell (RB42):** back on the practice squad, so he can't play unless elevated.
2. **ROS rankings:**
   - **Daniel Carlson (K17):** released Nov 3, but still listed on NO.
   - **Jacoby Brissett (QB31):** still listed on ARI until the trade to BAL completes.
3. **Gardner Minshew's FPPG:** shows 9.8 (FantasyPros: two games, including a zero-stat Wk 7 on ESPN) vs 19.5 (Sleeper: one game). Sources disagree, so I left it as exported with its note.
4. **Top-tier players without a game status:** Christian McCaffrey (RB4) and Amon-Ra St. Brown (WR5).
5. **Starters not confirmed:** Deshaun Watson (CLE, concussion) and Kyler Murray (MIN, hamstring).
6. **Re-check needed:** Friday's reports will settle most of the 35 blanks, and Saturday's for the Monday game.


---

# Game-day update — Sat, Nov 7, 2026, 9:27–9:35 PM CT

**Sources (all checked Nov 7):**
- ESPN injuries feed (feed time 9:28 PM CT)
- NFL.com Week 9 injury report, including the final Friday game statuses and Saturday statuses for the Monday game
- ESPN player pages
- [NFL.com — Saturday news roundup (Kendre Miller waived)](https://nfl.com/news/nfl-news-roundup-latest-league-updates-from-saturday-nov-7)
- [NBC Sports — Saints release Kendre Miller](https://www.nbcsports.com/nfl/profootballtalk/rumor-mill/news/saints-release-rb-kendre-miller)
- [WWL — Saints cut Miller; Tyson activated](https://www.audacy.com/wwl/local-sports/saints/saints-cut-rb-kendre-miller-with-tyson-banks-slated-to-return-report)

## Stats re-check
- **Result:** fresh ESPN data for all 228 players and Weeks 1–8 gives the same results as Wednesday. 0 corrections.
- **Thursday's JAX @ BAL (Week 9):** not in the export yet, so not checked.

## Final statuses (206 players)
- 175 Active, 9 Questionable, 1 Doubtful, 9 Out, 8 IR, 4 blank.
- **Blank:** Carnell Tate (bye), plus Daniel Carlson, Kendre Miller and Jacoby Brissett (roster moves).
- **Teams on the NFL.com report:** all 30 teams playing this week now have their reports up.

| Player | Wednesday | Now | What happened and source |
|---|---|---|---|
| A.J. Brown (NE) | blank | **Out** | Out for Week 9 (ankle/knee), did not practice Fri — NFL.com, checked Nov 7 |
| Deebo Samuel Sr. (SF) | blank | **Out** | Out for Week 9 (hamstring), did not practice Fri — NFL.com, checked Nov 7 |
| DeVonta Smith (PHI) | blank | **Out** | Out for Week 9 (hamstring), did not practice Fri — NFL.com, checked Nov 7 |
| Garrett Wilson (NYJ) | blank | **Out** | Out for Week 9 (concussion), did not practice Fri — NFL.com, checked Nov 7 |
| Kyler Murray (MIN) | blank | **Out** | Out for Monday (hamstring) — Kevin O'Connell via ESPN; NFL.com, Nov 7 |
| Mike Evans (SF) | blank | **Out** | Out for Week 9 (achilles), did not practice Fri — NFL.com, checked Nov 7 |
| Sam Darnold (SEA) | Out | **Out** | Out for Week 9 (quadriceps), week to week — NFL.com, checked Nov 7; ESPN |
| TreVeyon Henderson (NE) | blank | **Out** | Out for Week 9 (illness), did not practice Fri — NFL.com, checked Nov 7 |
| Lamar Jackson (BAL) | Out | **IR** | On IR after right thumb surgery (placed Nov 7) — ESPN |
| Terrance Ferguson (LAR) | IR | **IR** | On IR; was set to return but ruled out for Week 9 after hurting his hamstring in Friday practice — NFL.com; ESPN, Nov 6 |
| Cam Skattebo (NYG) | blank | **Doubtful** | Doubtful for Week 9 (hamstring), limited practice Fri — NFL.com, checked Nov 7 |
| Amon-Ra St. Brown (DET) | blank | **Questionable** | Questionable for Week 9 (ribs), limited practice Fri — NFL.com, checked Nov 7 |
| Deshaun Watson (CLE) | blank | **Questionable** | Cleared the concussion protocol Sat but is Questionable for Week 9 — NFL.com, checked Nov 7; ESPN |
| Emeka Egbuka (TB) | blank | **Questionable** | Questionable for Week 9 (foot), full practice Fri — NFL.com, checked Nov 7 |
| George Pickens (DAL) | blank | **Questionable** | Questionable for Week 9 (hamstring), limited practice Fri — NFL.com, checked Nov 7 |
| Hunter Henry (NE) | blank | **Questionable** | Questionable for Week 9 (foot), limited practice Fri — NFL.com, checked Nov 7 |
| Jake Ferguson (DAL) | blank | **Questionable** | Questionable for Week 9 (ankle), limited practice Fri — NFL.com, checked Nov 7 |
| Jordyn Tyson (NO) | IR | **Questionable** | Activated from IR Sat; Questionable for Week 9 (hamstring) — NFL.com, checked Nov 7; ESPN |
| Kyle Monangai (CHI) | blank | **Questionable** | Questionable for Week 9 (thumb/toe), limited practice Fri — NFL.com, checked Nov 7 |
| Tanner McKee (PHI) | Active | **Questionable** | Questionable for Week 9 (ribs), limited practice Fri — NFL.com, checked Nov 7 |
| Jacoby Brissett (ARI) | blank | **blank** | Traded to the Ravens Nov 6; expected to start for them in Week 10 — ESPN |
| Kendre Miller (NO) | Active | **blank** | Waived by the Saints Nov 7 — NFL.com, ESPN |
| Alvin Kamara (NO) | blank | **Active** | No game designation for Week 9 (back); full practice Fri — NFL.com, checked Nov 7 |
| Bhayshul Tuten (JAX) | Questionable | **Active** | Played Thursday despite a Questionable tag (ankle/foot) — ESPN, Nov 6 |
| Breece Hall (NYJ) | blank | **Active** | Medically cleared and expected to play Week 9 (quadriceps) — Ian Rapoport via ESPN, Nov 6; NFL.com |
| Christian McCaffrey (SF) | blank | **Active** | No game designation for Week 9 (hamstring); full practice Fri — NFL.com, checked Nov 7 |
| Christian Watson (GB) | blank | **Active** | No game designation for Week 9 (ribs); limited practice Fri — NFL.com, checked Nov 7 |
| Courtland Sutton (DEN) | blank | **Active** | No game designation for Week 9; full practice Fri — NFL.com, checked Nov 7 |
| Denzel Boston (CLE) | blank | **Active** | No game designation for Week 9 (calf); full practice Fri — NFL.com, checked Nov 7 |
| DJ Moore (BUF) | blank | **Active** | No game designation for Monday (shoulder); limited practice Fri — NFL.com, checked Nov 7 |
| Elijah Mitchell (PHI) | blank | **Active** | Elevated from the Eagles practice squad for Week 9 on Nov 7 — ESPN |
| Harold Fannin Jr. (CLE) | Active | **Active** | Will play Week 9 (groin) — Daniel Oyefusi, ESPN, Nov 6 |
| Jonathan Taylor (IND) | blank | **Active** | No game designation for Week 9; full practice Fri — NFL.com, checked Nov 7 |
| Keenan Allen (IND) | blank | **Active** | No game designation for Week 9; full practice Fri — NFL.com, checked Nov 7 |
| Kenny Gainwell (TB) | blank | **Active** | No game designation for Week 9 (hip); full practice Fri — NFL.com, checked Nov 7 |
| Keon Coleman (BUF) | Active | **Active** | No game designation for Monday (shoulder); limited practice Fri — NFL.com, checked Nov 7 |
| Mason Taylor (NYJ) | blank | **Active** | No game designation for Week 9 (back); full practice Fri — NFL.com, checked Nov 7 |
| Michael Wilson (ARI) | blank | **Active** | No game designation for Week 9 (ribs); limited practice Fri — NFL.com, checked Nov 7 |
| Puka Nacua (LAR) | Active | **Active** | No game designation for Week 9; did not practice Fri — NFL.com, checked Nov 7 |
| Rashee Rice (KC) | blank | **Active** | No game designation for Week 9 (hamstring/knee); full practice Fri — NFL.com, checked Nov 7 |
| Saquon Barkley (PHI) | blank | **Active** | No game designation for Week 9 (hamstring/back); limited practice Fri — NFL.com, checked Nov 7 |
| Stefon Diggs (WAS) | blank | **Active** | No game designation for Week 9; did not practice Fri — NFL.com, checked Nov 7 |
| Travis Kelce (KC) | blank | **Active** | No game designation for Week 9 (ankle); full practice Fri — NFL.com, checked Nov 7 |
| Tyler Higbee (LAR) | Active | **Active** | No game designation for Week 9; did not practice Fri — NFL.com, checked Nov 7 |

## Removed from the rankings (your decisions, Nov 7)
- **Out for Week 9:** removed from the Weekly rankings (and FLEX), kept in ROS: QB16 sam-darnold (tier E), QB19 kyler-murray (tier E), WR16 mike-evans (tier D), WR19 garrett-wilson (tier D), WR22 devonta-smith (tier D), WR28 aj-brown (tier F).
- **Your removal list, Weekly:** QB27 tanner-mckee (tier G), RB37 kendre-miller (tier G), RB42 elijah-mitchell (tier G).
  - Kendre Miller wasn't on your list. He was waived Saturday and can't play, so I treated him like an Out player.
- **Your removal list, ROS:** QB30 tanner-mckee (tier G), QB31 jacoby-brissett (tier G), K17 daniel-carlson (tier G).
- **Sam Darnold:** he was on your removal list, but he's Out with an injury, so I followed your Out rule. Removed from Weekly, kept in ROS.

## Still open
1. **Elijah Mitchell:** removed per your instruction, but ESPN reports the Eagles elevated him Saturday, so he can play Week 9. I didn't find a second source yet.
2. **Teams with no ranked QB this week:** SEA (Drew Lock expected), MIN (Carson Wentz expected) and PHI (Joe Milton starting). None of the three is in your data.
3. **Questionable in a top tier:** Amon-Ra St. Brown (WR, tier A).
4. **Gardner Minshew's FPPG:** still a sources disagreement (9.8 vs 19.5), unchanged.
5. **Re-check on game day:** inactive lists come out about 90 minutes before each kickoff.
6. **Next export:** the next export will bring removed players back in unless they're removed upstream too.
