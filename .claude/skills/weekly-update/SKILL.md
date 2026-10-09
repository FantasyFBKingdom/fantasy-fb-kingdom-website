---
name: weekly-update
description: Run the weekly website update for Fantasy Football Kingdom — set the current NFL week, bring in the new rankings exports, double-check every ranked player's stats and injury news against sources, fill missing headshots, write a verification report, and preview before publishing. Use when the user asks to update the site for a new week, refresh rankings, or verify stats/injuries.
argument-hint: "[week number (optional)]"
---

# Weekly Update

Follow the step-by-step recipe in `workflows/weekly-update.md`. Read the whole file first — it is the source of truth for every step; this skill only adds how to run it.

If a week number was given ($ARGUMENTS), use it as the target week, but still confirm it against ESPN's scoreboard in step 1 and point out any mismatch.

## How to run it

1. Before changing anything, show a short plan: the target week, which data files will be touched, and roughly how many players will be checked. Ask any clarifying questions (e.g. whether new exports are already in place). Wait for the go-ahead.
2. Work through the workflow steps in order. Do not skip the stat checks (step 3) or the injury checks (step 4) for any ranked player.
3. Never guess. If a stat or injury status can't be verified, or sources disagree, flag it in the report and ask before publishing.
4. Save the verification report to `output/week-NN-verification.md`, citing a source and the date/time checked for every correction and injury change.
5. Preview the site locally and click through every page before saying it's ready.
6. Do not commit or push unless the user asks.

Finish with a concise bullet summary: week set, players checked, stats corrected, injury updates, open questions, and the report's path.
