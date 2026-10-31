# Weekly Update Workflow

Follow these steps every week to publish new rankings and start/sit calls.
Nothing gets published until steps 3 and 4 (stat and injury checks) pass.

- All site data lives in `docs/data/`. Paths below are relative to that folder.
- Save every check report to `output/` (e.g. `output/week-06-verification.md`).
- Cite a source and the date/time checked for every stat or injury change.

## 1. Set the current week
- Find the current NFL week from ESPN's scoreboard: https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard (`season.year`, `season.type` 2 = regular season, `week.number`).
- NFL weeks roll over on Tuesday. Monday night's game still belongs to the previous week.
- In `site.json`, set `currentWeek` to that number (and `season` in a new year). The banner and page links follow it automatically.
- If the week changed, create the new folders (always two digits):
  - `2026/week-NN/rankings.json` (weekly rankings export)
  - `2026/start-sit-week-NN/start-sit.json`
  - Old weeks stay. Add the new week number to `weeks` in `site.json` (e.g. `[5, 8, 9]`) so it shows in the Weekly page's week picker and the ▲/▼ rank changes compare against the previous week in that list.
- Before replacing the ROS file, save the old one as a snapshot for ROS rank changes:
  - Copy `2026/ros/rankings.json` to `2026/ros-history/week-NN.json`, where NN is the `week` inside that old file.
  - Add that week number to `rosHistory` in `site.json` (e.g. `[5, 8]`).

## 2. Bring in the new exports
- Replace `2026/ros/rankings.json`, `2026/week-NN/rankings.json` and `players.json` with the latest exports.
- Trim the new files (removes data the site never reads, cuts load time): from the repo root run `python tools/trim-export.py`.
- In each rankings file, confirm `week` is the current week and `updated` is today's date.
- Every player ID in the rankings and start/sit files must exist in `players.json`.

## 3. Double-check player stats (every ranked player)
Check every player listed in the ROS rankings, the weekly rankings and the start/sit file. Skip nobody.

**Compare against an independent source.**
- Use ESPN's game log for each player: `https://site.web.api.espn.com/apis/common/v3/sports/football/nfl/athletes/<espnId>/gamelog?season=<season>`. The `espnId` is in `players.json`.
- Week by week, match the `log` in `players.json` against ESPN:
  - QB: completions, attempts, pass yards, pass TDs, INTs, rush yards, rush TDs
  - RB: carries, rush yards, rush TDs, targets, catches, receiving yards, receiving TDs
  - WR/TE: targets, catches, yards, TDs
  - K: field goals made/attempted, longest, extra points
  - DST: points allowed, yards allowed, sacks, interceptions, fumble recoveries, TDs
- Confirm the opponent, home/away and final score for each week against the `schedule` in the ROS file.

**Recompute fantasy points (full PPR) from the raw stats.**
- Pass yd 0.04 · pass TD 4 · INT −1 · rush/rec yd 0.1 · rush/rec TD 6 · catch 1 · fumble lost −2 · 2-pt conversion 2. (Matches the export's Sleeper scoring, confirmed Week 5.)
- Each week's `fpts` must match within 0.1. Kicker and defense scoring varies by league, so compare those to the export's totals instead.
- Known reasons a game won't match, which are not errors:
  - 2-point conversions aren't in the game logs; confirm them in the game's ESPN scoring plays.
  - Trick plays outside the player's position (e.g. a QB catching his own pass, a WR throwing) count in points but aren't listed in the log.
- Defense stat rules (not errors):
  - Points allowed leaves out points scored by the other team's defense or special teams (pick-sixes, fumble returns, safeties).
  - Fumble recoveries count only those made by the defense, not special-teams recoveries (muffed punts, kickoff fumbles).
- Kicker and defense points per game in the rankings use FantasyPros scoring, so they won't match the game log average. Leave them as is.

**Check the totals line up.**
- The sum of weekly `fpts` = `prof.tot.pts_ppr`.
- The `fppg` in the rankings = season points ÷ games played.
- `prof.g` = the number of games in `log`.
- Season stat tiles (`prof.vals`) agree with the game log, e.g. snap share vs `off_snp ÷ tm_off_snp`.
- `statsThrough` matches the last completed week. Any game marked `pending` must be final before publishing.

**Fix or flag.**
- If a number is wrong and the source is clear, correct it and note the source in the report.
- If sources disagree, don't guess. List it in the report and ask before publishing.

## 4. Double-check injury news (as current as possible)
Check this as close to publishing as possible, and again before game day if rankings go up early.

**Sources, most official first:**
1. Official NFL injury report: https://www.nfl.com/injuries/ (practice reports Wed–Fri, game statuses Friday; for Thursday games, earlier in the week).
2. Team announcements and transactions: IR moves, activations, releases, trades.
3. ESPN injuries: https://www.espn.com/nfl/injuries (data feed: https://site.api.espn.com/apis/site/v2/sports/football/nfl/injuries). Each entry has a status, a date and a player link with the ESPN ID.
4. Inactive lists, released about 90 minutes before kickoff, for any last-minute update.

**For every ranked player:**
- Set `status` in `players.json`: Active, Questionable, Doubtful, Out or IR. Leave it blank only if no report exists yet, and say so in the notes.
- Update the injury in `prof.inj` (e.g. "Ankle").
- Update the player's `flags` note in the rankings files with what happened, the date and the source, e.g. "Questionable (ankle), limited practice Thu — NFL.com, Oct 9".
- Remove notes that are no longer true (e.g. "Week 5 status N/A until Wednesday" once the report is out).
- Check for byes. Players on bye should show "Bye" on the weekly page.

**Consistency checks:**
- Nobody ruled Out or on IR gets a START call.
- Nobody ruled Out sits in a top tier of the weekly rankings without a note explaining why.
- If sources conflict, use the official NFL report and note the conflict.

## 5. Start / Sit (`2026/start-sit-week-NN/start-sit.json`)
- One entry per featured game: teams, records, spreads, O/U, `slot` (e.g. "Sunday Night"), kickoff, weather.
- Records, spreads and kickoff times must match a current source (ESPN scoreboard or a sportsbook). Note the time checked.
- Each player: `call` (START or SIT), `ppg`, `projAvg`, `vsOpp` (career average and games vs this opponent; `null` if they've never faced them) and `splitPpg` (home or away PPG).

## 6. Headshots
- Every ranked player needs `docs/assets/headshots/<id>.png`. Defenses use the team circle and need no photo.
- Download any missing ones from https://a.espncdn.com/i/headshots/nfl/players/full/<espnId>.png and resize to 300px wide.
- Player IDs drop suffixes like Jr. and III (e.g. `kenneth-walker`), so file names must match the IDs exactly.

## 7. Write the check report
Save `output/week-NN-verification.md` with:
- the week, the date/time checked and the sources used
- how many players were checked, and how many stats were corrected (what, old → new, source)
- injury status changes (player, old → new, source, time)
- anything unresolved that needs a decision before publishing

## 8. Preview, then publish
- Preview locally (see README). Click through every position tab on ROS and Weekly, every Start/Sit game, and a few player cards.
- Confirm the "Last updated" date and the sources show at the bottom of each page.
- Commit and push to `main`. GitHub Pages updates within a minute or two.

**Tip:** if a page shows "Something went wrong", a JSON file usually has a missing comma or quote. The error message names the file.
