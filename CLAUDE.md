# Project Context

This my fantasy football website project for YouTube. This website will contain all of my rankings and start sits for fantasy football season. This will be a github pages website so front end only.

# About Me

I create content about fantasy football updates. My audience is people who want stats and news updates about the most recent developments in fantasy football. I prefer clear, presentable and jargon-free output.

# Rules

- Always ask clarifying questions before starting a complex task
- Show your plan and steps before executing
- Keep reports and summaries concise - bullet points over paragraphs
- Save all outputs to the output folder
- Cite sources when doing research
- Confirm that all stats and news are 100% accurate before presenting them

# Tech Stack
- Plain HTML, CSS, and JavaScript. No frameworks unless I approve.
- Site files live in /docs (GitHub Pages source). Reports and drafts go in /output.
- No backend, no API keys in code — everything in this repo is public.

# Content Rules
- Show the week number, scoring format, and "last updated" date on every page.
- Every stat or injury note needs a source and the date it was checked.
- If something can't be verified, flag it. Don't guess.

# Project Structure
- docs/ - The website (GitHub Pages source): index.html (ROS), weekly.html, start-sit.html, css/, js/, assets/, data/
- workflows/ - Workflow instruction files (plain English recipes the agent follows)
- output/ - Any required outputs (reports, drafts — not part of the site)
- resources/ - Reference docs and templates

# Data (all under docs/data/)
- site.json - season, currentWeek, scoring, YouTube link. currentWeek controls which week loads.
- players.json - every player keyed by id (e.g. jalen-hurts). teams.json - team names and colors.
- Weekly rankings live in data/<season>/week-<NN>/rankings.json.
- Rest of season rankings live in data/<season>/ros/rankings.json.
- Start sit details in data/<season>/start-sit-week-<NN>/start-sit.json.
- Each page data file has "updated" and "sources" fields; both show on the page.
- rankings.json can be the exported layout (positions.<POS>.tiers[].ids + a top-level "players" map with fppg, oppRank, panic, flags, expert ranks; plus schedule/teams/oppRanks) or the older hand-written layout (tiers[].players[]). js/common.js normalizeRankings() reads both.
- players.json stats for the player card come from "prof" (season stats + ranks) and "log" (week-by-week); IDs drop name suffixes (kenneth-walker, not kenneth-walker-iii). Headshot files must match these IDs.
- Pages read from data files; never hardcode players in HTML/JS.
- Files with "_note": "SAMPLE DATA..." show a "Sample data" badge — remove the line once real data is in.
- Weekly steps: workflows/weekly-update.md