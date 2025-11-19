# 🐱 Cat Adventure Game

A complete platformer game built with HTML5 Canvas and JavaScript.

## Features

### ✨ Complete Game Mechanics
- **Movement System**: Move left/right with A/D keys
- **Jump System**: Press W to jump (double jump enabled!)
- **Sprint System**: Collect Fish item for 1.6x speed boost
- **Camera System**: Smooth camera follow for extended level

### 🎮 Gameplay Features
- **Platform Navigation**: 8 platforms at varying heights
- **Coin Collection**: 10 gold coins scattered across the level (need 7+ to win)
- **Monster Obstacles**: 7 monsters to avoid
- **Respawn System**: Hit a monster? Respawn at start without losing progress!
- **Dialog Triggers**: 3 treasure chests offering magical items
- **Item System**: 4 different items with 5-second effects
  - 🌟 **Spring**: Super jump boost
  - 🐟 **Fish**: Sprint speed (1.6x multiplier)
  - 🎈 **Balloon**: Reduced gravity for floating
  - 📯 **Horn**: Time bonus (+10 seconds)

### ⏱️ Game Rules
- **Time Limit**: 90 seconds to complete the game
- **Win Condition**: Reach x > 3000 with at least 7 coins
- **Base Speed**: 3 (as requested)
- **Double Jump**: Press W twice to perform double jump

## How to Run

### Option 1: Direct File Open
1. Open `index.html` in a modern web browser (Chrome, Firefox, Safari, Edge)

### Option 2: Local Server (Recommended for GitHub Pages)
```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js (if you have http-server)
npx http-server
```

Then navigate to `http://localhost:8000`

### Option 3: GitHub Pages
This game is ready to deploy on GitHub Pages:
1. Push to your repository
2. Go to Settings > Pages
3. Select your branch as the source
4. Your game will be available at `https://[username].github.io/[repo-name]`

## Game Controls

| Key | Action |
|-----|--------|
| A | Move Left |
| D | Move Right |
| W | Jump (press again in air for double jump) |

## Technical Details

- **Canvas Size**: 800x500 px
- **Physics**: Custom gravity system (0.6 default, 0.2 with Balloon)
- **Collision Detection**: AABB (Axis-Aligned Bounding Box)
- **Frame Rate**: ~60 FPS via requestAnimationFrame
- **Game Loop**: Delta time based updates (0.016s per frame)

## File Structure

```
/
├── index.html          # Main game HTML with embedded CSS
├── game.js            # Complete game logic
├── assets/
│   ├── image1.png     # Cat sprite (SVG)
│   ├── image2.png     # Monster sprite (SVG)
│   └── image3.png     # Coin sprite (SVG)
└── README.md          # This file
```

## Game Features Checklist

- ✅ Move / Jump / Sprint
- ✅ Two-step (double) jump
- ✅ Platform system
- ✅ Respawn after encountering monsters
- ✅ 10 gold coins (7 required to win)
- ✅ Dialogue trigger points (3 treasure chests)
- ✅ Prop/Item system (5-second effects)
- ✅ Game time: 90 seconds
- ✅ Speed = 3
- ✅ Fully functional in GitHub environment

## Tips for Playing

1. **Collect items wisely**: Each treasure chest appears once
2. **Time your jumps**: Use double jump to reach high platforms
3. **Avoid monsters**: They'll send you back to the start (but you keep your coins!)
4. **Manage your time**: Use the Horn item if running low on time
5. **Explore thoroughly**: Coins are scattered at different heights

## Browser Compatibility

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

Requires ES6+ support (modern browsers from 2017+)

---

**Enjoy your cat adventure!** 🐱✨
