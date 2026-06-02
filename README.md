# 🎭 RoleDealer

A beautiful, mobile-first Vue.js SPA for distributing roles in Mafia group games. Add roles with custom counts, shuffle them, and let players reveal their roles on their devices.

## Features

✨ **Features**
- 📱 Mobile-optimized UI (phone-only experience)
- 🎯 Easy role management with count support
- 🔀 Automatic role shuffling
- 💫 Smooth flip animations for role reveal
- 🎨 Beautiful gradient design
- 📍 Hosted on GitHub Pages
- ⚡ Fast and responsive

## Setup

### Prerequisites
- Node.js 16+ and npm

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd RoleDealer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   The app will open at `http://localhost:3000`

## Usage

### For Game Master
1. Open the app on any device
2. Enter role names (e.g., Mafia, Doctor, Villager)
3. Set the count for each role using +/- buttons
4. Click **"START GAME"** when all roles are added

### For Players
1. Players take turns tapping a tile
2. The tile flips to reveal their role
3. They tap again to hide it and remove the tile
4. Continue until all roles are distributed

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview the built app locally

### Project Structure

```
RoleDealer/
├── index.html              # Entry point
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Pages deployment
├── src/
│   ├── main.js             # Vue app initialization
│   ├── App.vue             # Main component (game state)
│   ├── style.css           # Global styles
│   └── components/
│       ├── RoleInput.vue   # Role setup page
│       └── GameBoard.vue   # Game playing page
└── dist/                   # Production build (generated)
```

## Deployment to GitHub Pages

### 1. Initial Setup

Ensure your repository is public and you have:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/RoleDealer.git
git branch -M main
git push -u origin main
```

### 2. Enable GitHub Pages

1. Go to your repository on GitHub
2. Settings → Pages
3. Under "Build and deployment"
   - Source: **GitHub Actions**
   - (If you don't see GitHub Actions option, select "Deploy from a branch" → `gh-pages` branch)

### 3. Deploy

The GitHub Actions workflow will automatically build and deploy when you push to the `main` branch.

Your app will be live at: `https://YOUR_USERNAME.github.io/RoleDealer`

### Manual Deployment Alternative

If you prefer to deploy manually:

1. Build the project:
   ```bash
   npm run build
   ```

2. Push the `dist` folder to `gh-pages` branch:
   ```bash
   git add dist -f
   git commit -m "Deploy"
   git subtree push --prefix dist origin gh-pages
   ```

## Customization

### Styling
- Edit `src/style.css` for global styles
- Edit component `<style>` sections for component-specific styles
- Colors can be easily changed in gradient backgrounds and component files

### Game Logic
- Modify `src/components/GameBoard.vue` to change flip behavior
- Modify `src/components/RoleInput.vue` to add more validation or features

## Browser Support

- ✅ Chrome/Chromium (mobile & desktop)
- ✅ Safari (iOS)
- ✅ Firefox (mobile & desktop)
- ✅ Edge

## License

MIT License - Feel free to use and modify for your needs!

## Contributing

Feel free to fork and submit pull requests for any improvements!

---

Enjoy your Mafia games! 🎭🎉
