# Darts Scorer App 🎯

A professional darts scoring web application with multiplayer support, turn-based gameplay, and configurable checkout rules.

## Features

- ✅ Turn-based score entry (only active player can input)
- ✅ Double out vs Single out checkout rules
- ✅ 2-6 player support
- ✅ Standard game formats (301, 501, 701)
- ✅ Bust detection and checkout validation
- ✅ Local and multiplayer modes
- ✅ Automatic game state persistence
- ✅ Mobile-responsive design

## Live Demo

Once deployed, your app will be available at:
`https://YOUR_GITHUB_USERNAME.github.io/darts-scorer-app`

## Deployment to GitHub Pages

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `darts-scorer-app`
3. Make it public (required for GitHub Pages)
4. Don't initialize with README (we already have one)

### Step 2: Update Package.json

Edit `package.json` and replace `YOUR_GITHUB_USERNAME` with your actual GitHub username:

```json
"homepage": "https://YOUR_GITHUB_USERNAME.github.io/darts-scorer-app"
```

### Step 3: Push to GitHub

```bash
cd darts-scorer-app
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/darts-scorer-app.git
git push -u origin main
```

### Step 4: Deploy

```bash
npm install
npm run deploy
```

This will:
- Build your app
- Create a `gh-pages` branch
- Deploy to GitHub Pages

### Step 5: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select `gh-pages` branch
4. Click Save

Your app will be live at `https://YOUR_GITHUB_USERNAME.github.io/darts-scorer-app` in a few minutes!

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

## How to Play

### Local Mode
- All players use the same device
- Players take turns entering scores
- Game state is saved locally

### Multiplayer Mode
- Players can join from different devices
- Share the Game ID with other players
- Game syncs across all devices every 2 seconds
- All players see the same game state

### Scoring
- Enter the total score for your turn (0-180)
- For double checkout, add "d" after the score (e.g., "40d")
- Press Enter or click Submit
- Invalid scores or bust conditions will be handled automatically

## Game Rules

- **Bust**: Score goes below 0 or equals 1
- **Double Out**: Must finish exactly on zero with a double
- **Single Out**: Can finish on any score that reaches exactly zero
- Turn passes to next player after each throw

## Technologies

- React 18
- Tailwind CSS
- Lucide React (icons)
- GitHub Pages (hosting)

## Browser Storage

The app uses the browser's storage API to:
- Save game state across refreshes
- Enable multiplayer synchronization
- Persist player scores and history

## Troubleshooting

**App not loading after deployment?**
- Wait 5-10 minutes for GitHub Pages to update
- Check that GitHub Pages is enabled in repository settings
- Verify the homepage URL in package.json matches your GitHub username

**Multiplayer not syncing?**
- Make sure all players use the same Game ID
- Check that browser storage is enabled
- Refresh the page to force a sync

## License

MIT License - feel free to use and modify!
