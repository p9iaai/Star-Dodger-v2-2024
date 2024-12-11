# Star Dodger V2 2024 Remake

A recreation of Star Dodger, a game concept that appears to trace its origins to N. Silver's "Asterisk Tracker" published in BEEBUG Magazine (December 1984), later independently developed as Star Dodger by Stewart Russell in 1988 and reimagined as Star Dodger V2 by Graham French in 1992. 

The concept's journey through gaming history:
- 1984: N. Silver's "Asterisk Tracker" (BEEBUG Magazine)
- 1988: Stewart Russell's Star Dodger series (Amstrad Computer User):
  - **Stardodger I** (BASIC Version)
  - **Stardodger II** (BCPL Version)
  - **Stardodger III** (Assembler Version)
- 1992: Graham French's Star Dodger V2 (Amstrad Action)
- 2024: This JavaScript remake

This remake is a tribute to the enduring creativity and evolution of this gameplay concept. As a child, I fondly remembered typing in Star Dodger V2 from *Amstrad Action* magazine, unaware of both the earlier versions and the original concept. Revisiting this history has been both enlightening and inspiring.

![Title Screen](screens/01.png)
*gameplay screen with falling stars effect*

![Gameplay](screens/02.png)
*gameplay screen with warp speed effect*

## 🎮 Gameplay

Navigate your ship through a series of levels, each more challenging than the last. The goal is to reach the exit door on the right side of the screen while:
- Avoiding collisions with walls and stars
- Managing your momentum and trajectory
- Staying focused despite the hypnotic starfield background

### Controls
- **SPACE BAR**: Hold to move up, release to move down
- Ship moves at a constant speed from left to right
- **S KEY**: Toggle between classic falling stars and perspective starfield modes
- **F11**: Toggle fullscreen mode (browser)

### Scoring
- +1 point for each close star passed
- +50 points for completing a level
- Three lives per game
- High scores are saved locally

## 🚀 Features

- Smooth, physics-based movement
- Procedurally generated levels
- Dynamic backgrounds that change with each level
- Dual-mode starfield effects:
  - Classic falling stars (default)
  - Perspective-based "warp speed" effect (toggle with 'S')
- Particle effects and smooth transitions
- High score system
- Responsive 16:9 canvas layout
- Collision detection and response
- Visual feedback for all game events

## 🛠️ Technical Details

### Built With
- Pure JavaScript
- HTML5 Canvas (dual-canvas setup for game and starfield)
- Local Storage for high scores

### Resolution
- 1280x720 (16:9 aspect ratio)
- Responsive scaling
- Full-window animated starfield background

### Performance
- Optimized rendering with layered canvases
- Smooth 60 FPS gameplay
- Efficient collision detection
- Background animation independent of game state

## 🎨 Visual Design

- Minimalist aesthetic
- Dynamic trail effects
- Subtle background imagery with hypnotic starfield
- Clean UI elements
- Smooth transitions between states

## 🏆 High Score Challenge

The current known high score is 1288 which happened during development by me with an utterly minimal and unfocused attempt. Can you beat it while maintaining your focus through the mesmerizing star patterns?

## 💝 Dedication

This game is dedicated to:
- N. Silver, whose 1984 "Asterisk Tracker" first introduced this addictive gameplay concept
- Stewart Russell, who developed the Star Dodger series in 1988 for *Amstrad Computer User* magazine
- Graham French, who reimagined Star Dodger in 1992 for *Amstrad Action* magazine as Star Dodger V2

The core mechanics, from avoiding "space acid poisoning" in 1984 to the "fiendishly difficult and very, very addictive" gameplay of later versions, remain compelling to this day. This project aims to celebrate and preserve this fascinating piece of gaming history and its evolution through the 8-bit era.

## 🔄 Game States

1. **Title Screen**
   - Game instructions
   - High score display
   - Press SPACE to start
   - Ambient starfield animation

2. **Playing**
   - Active gameplay
   - Score tracking
   - Lives remaining
   - Current level
   - Dynamic background effects

3. **Game Over**
   - Final score display
   - High score update
   - Press SPACE to restart
   - Continuous starfield animation

## 🎯 Tips for High Scores

1. Plan your route through the stars
2. Stay close to stars without touching them for extra points
3. Time your up/down movements carefully
4. Watch for patterns in star placement
5. Don't rush - steady progress is key
6. Try not to get hypnotized by the background! (Switch modes with 'S' if one is too mesmerizing)

## 🔜 Potential Future Features That Almost Certainly Will Never Happen

- Multiple difficulty modes
- Additional visual effects
- Sound effects and music
- Global high score board
- Achievement system
- Even more starfield patterns
- VR support (just kidding!)
