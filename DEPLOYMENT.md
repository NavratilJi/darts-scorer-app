# Quick Deployment Guide for Darts Scorer App

## What You Have
A complete React app ready to deploy to GitHub Pages. The app will be accessible from any device via a public URL.

## Prerequisites
- GitHub account
- Git installed on your computer
- Node.js installed (download from nodejs.org)

## Deployment Steps (5 minutes)

### 1. Create GitHub Repository
```
- Go to github.com
- Click "New Repository"
- Name: darts-scorer-app
- Public repository
- Don't initialize with README
- Click "Create repository"
```

### 2. Edit package.json
Open `package.json` and replace:
```json
"homepage": "https://YOUR_GITHUB_USERNAME.github.io/darts-scorer-app"
```
With your actual GitHub username, for example:
```json
"homepage": "https://john-doe.github.io/darts-scorer-app"
```

### 3. Deploy from Terminal/Command Prompt

```bash
# Navigate to the project folder
cd path/to/darts-scorer-app

# Initialize git
git init
git add .
git commit -m "Initial commit"
git branch -M main

# Connect to your GitHub repo (replace YOUR_GITHUB_USERNAME)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/darts-scorer-app.git

# Push to GitHub
git push -u origin main
```

### 4. Enable GitHub Pages

Two options:

**Option A: Automatic (Recommended)**
1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Build and deployment", select **GitHub Actions**
4. The app will automatically build and deploy on every push!

**Option B: Manual**
```bash
npm install
npm run deploy
```
Then go to Settings → Pages and select `gh-pages` branch.

### 5. Access Your App

Your app will be live at:
```
https://YOUR_GITHUB_USERNAME.github.io/darts-scorer-app
```

Wait 2-3 minutes after deployment, then visit the URL!

## Using the App Across Devices

### Local Mode
- Everyone uses the same device
- Pass it around for each turn

### Multiplayer Mode
1. Start a game on one device
2. Select "Multiplayer" mode
3. Note the Game ID that's generated
4. On other devices, go to the same URL
5. Enter the same Game ID
6. Everyone sees the same game!

## Updating the App

After making changes:
```bash
git add .
git commit -m "Update description"
git push
```

With GitHub Actions, it will automatically redeploy!

## Troubleshooting

**App shows 404?**
- Wait 5 minutes for GitHub Pages to activate
- Check Settings → Pages is enabled
- Verify the URL matches your homepage in package.json

**Multiplayer not syncing?**
- All players must use the exact same Game ID
- Refresh the page to force sync
- Game syncs every 2 seconds automatically

**Can't push to GitHub?**
- Make sure you're logged into GitHub on your computer
- May need to set up SSH key or personal access token
- See: https://docs.github.com/en/authentication

## Need Help?

- Check README.md for detailed instructions
- GitHub Pages docs: https://pages.github.com
- React docs: https://react.dev

---

**Pro tip**: Bookmark the live URL on all your devices for quick access!
