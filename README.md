# Fantasy Football Kingdom — Website

Read-only rankings site for the [@FantasyFBKingdom](https://www.youtube.com/@FantasyFBKingdom) YouTube channel.

- **ROS Rankings** (`docs/index.html`): rest-of-season tiers by position
- **Weekly** (`docs/weekly.html`): this week's rankings with matchups and game totals
- **Start / Sit** (`docs/start-sit.html`): game-by-game start/sit calls

Plain HTML/CSS/JavaScript. No build step. All content comes from the JSON files in `docs/data/`.

## Preview locally
```
cd docs
python -m http.server 8000
```
Then open http://localhost:8000. Opening the HTML file directly won't work, because browsers block loading data files that way.

## Publish (one-time setup)
GitHub repo → **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main`, folder `/docs`.

## Updating each week
See [workflows/weekly-update.md](workflows/weekly-update.md).

## Folders
| Path | What it is |
|---|---|
| `docs/` | The website (GitHub Pages serves this folder) |
| `docs/data/` | Rankings, start/sit calls, players and teams (edit these) |
| `docs/data/<season>/` | `ros/`, `week-NN/`, `start-sit-week-NN/` |
| `docs/assets/` | Logo and player headshots |
| `docs/css/`, `docs/js/` | Site design and behavior (rarely need changing) |
| `workflows/` | Step-by-step guides |
| `output/` | Reports and drafts (not part of the site) |
