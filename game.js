// Star Dodger V2 2024 Remake
// by p9iaai (c) 2024 (game.js)

class Starfield {
    constructor() {
        this.canvas = document.getElementById('backgroundCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.numStars = 250;
        this.numPerspectiveStars = 2000;
        this.speed = 0.5;
        
        this.isPerspective = false;
        this.maxDepth = 32;
        this.centerX = window.innerWidth / 2;
        this.centerY = window.innerHeight / 2;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        window.addEventListener('keydown', (e) => {
            if (e.code === 'KeyS') {
                this.isPerspective = !this.isPerspective;
                this.initStars();
            }
        });
        
        this.initStars();
        this.animate();
    }
    
    initStars() {
        this.stars = [];
        const starCount = this.isPerspective ? this.numPerspectiveStars : this.numStars;
        
        for (let i = 0; i < starCount; i++) {
            if (this.isPerspective) {
                this.stars.push({
                    x: Math.random() * this.canvas.width * 2 - this.canvas.width,
                    y: Math.random() * this.canvas.height * 2 - this.canvas.height,
                    z: Math.random() * this.maxDepth,
                    size: Math.random() * 2
                });
            } else {
                this.stars.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    size: Math.random() * 2,
                    speed: Math.random() * this.speed + 0.1
                });
            }
        }
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
    }
    
    animate() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'white';
        
        for (let star of this.stars) {
            if (this.isPerspective) {
                star.z -= this.speed;
                
                if (star.z <= 0) {
                    star.z = this.maxDepth;
                    star.x = Math.random() * this.canvas.width - this.centerX;
                    star.y = Math.random() * this.canvas.height - this.centerY;
                }
                
                let k = 128.0 / star.z;
                let px = star.x * k + this.centerX;
                let py = star.y * k + this.centerY;
                
                let size = (1 - star.z / this.maxDepth) * 3;
                
                if (px >= 0 && px <= this.canvas.width && 
                    py >= 0 && py <= this.canvas.height) {
                    this.ctx.beginPath();
                    this.ctx.arc(px, py, size, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            } else {
                this.ctx.beginPath();
                this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                this.ctx.fill();
                
                star.y += star.speed;
                
                if (star.y > this.canvas.height) {
                    star.y = 0;
                    star.x = Math.random() * this.canvas.width;
                }
            }
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.canvas.width = 1280;
        this.canvas.height = 720;
        
        this.isSpacePressed = false;
        this.playerX = 50;
        this.playerY = this.canvas.height / 2;
        this.level = 1;
        
        this.speed = 4;
        this.downwardSpeed = 4;
        this.upwardSpeed = 6;
        
        this.trail = [{x: this.playerX, y: this.playerY}];
        this.maxTrailLength = 20;
        
        this.margin = 40;
        this.doorWidth = 60;
        this.doorHeight = 100;

        this.obstacleSize = 21; // Increased from 12 to 21 (75% bigger)
        
        this.playerX = this.margin;
        this.playerY = this.canvas.height / 2;
        
        this.obstacles = [];
        this.generateObstacles();
        
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') this.isSpacePressed = true;
        });
        
        window.addEventListener('keyup', (e) => {
            if (e.code === 'Space') this.isSpacePressed = false;
        });
        
        this.lastTime = 0;
        
        this.states = {
            TITLE: 'title',
            PLAYING: 'playing',
            GAME_OVER: 'gameOver'
        };
        this.currentState = this.states.TITLE;
        
        this.scoreManager = new ScoreManager();
        this.score = 0;
        this.lives = 3;
        
        this.stateTransitionCooldown = 0;
        
        this.backgrounds = [
            ...Array.from({length: 7}, (_, i) => `bg/bg${i + 1}.jpg`),
            ...Array.from({length: 7}, (_, i) => `bg/bg${i + 9}.jpg`)
        ];
        this.backgroundImages = [];
        
        this.backgrounds.forEach(src => {
            const img = new Image();
            img.src = src;
            this.backgroundImages.push(img);
        });
        
        this.backgroundOpacity = 0.2;
        
        this.cropAmount = 10;
        
        this.transitionState = {
            active: false,
            type: null, // 'collision', 'victory', etc.
            timer: 0,
            duration: 30, // frames (0.5 seconds at 60fps)
            alpha: 1
        };
        
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    
    gameLoop(timestamp) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.stateTransitionCooldown > 0) {
            this.stateTransitionCooldown--;
        }
        
        switch(this.currentState) {
            case this.states.TITLE:
                this.drawTitle();
                if (this.isSpacePressed && this.stateTransitionCooldown === 0) {
                    this.currentState = this.states.PLAYING;
                    this.resetGame();
                }
                break;
                
            case this.states.PLAYING:
                this.update(timestamp);
                this.draw();
                this.drawHUD();
                break;
                
            case this.states.GAME_OVER:
                this.drawGameOver();
                if (this.isSpacePressed && this.stateTransitionCooldown === 0) {
                    this.stateTransitionCooldown = 30; // 0.5s at 60fps
                    this.currentState = this.states.TITLE;
                }
                break;
        }
        
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    
    generateObstacles() {
        const numObstacles = 5 * this.level;
        const playableWidth = this.canvas.width - (this.margin + this.doorWidth) * 2;
        const playableHeight = this.canvas.height - this.margin * 2;
        
        this.obstacles = [];
        for (let i = 0; i < numObstacles; i++) {
            this.obstacles.push({
                x: this.margin + this.doorWidth + Math.random() * playableWidth,
                y: this.margin + Math.random() * playableHeight,
                radius: this.obstacleSize/2,
                collected: false
            });
        }
    }
    
    checkCollisions() {
        if (this.playerY < this.margin || this.playerY > this.canvas.height - this.margin) {
            if (this.playerX < this.margin + this.doorWidth && 
                this.playerY > this.canvas.height / 2 - this.doorHeight/2 && 
                this.playerY < this.canvas.height / 2 + this.doorHeight/2) {
            } else {
                console.log('Hit boundary!');
                return true; // Hit top/bottom boundary
            }
        }
        
        for (const obstacle of this.obstacles) {
            const dx = this.playerX - obstacle.x;
            const dy = this.playerY - obstacle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.obstacleSize/2) {
                return true;
            }
        }
        
        return false;
    }
    
    update(deltaTime) {
        if (this.transitionState.active) {
            this.transitionState.timer++;
            this.transitionState.alpha = 1 - (this.transitionState.timer / this.transitionState.duration);
            
            if (this.transitionState.timer >= this.transitionState.duration) {
                this.transitionState.active = false;
                
                if (this.lives > 0) {
                    this.playerX = this.margin;
                    this.playerY = this.canvas.height / 2;
                    this.trail = [{x: this.playerX, y: this.playerY}];
                }
            }
            return;
        }
        
        if (this.currentState !== this.states.PLAYING) return;
        
        this.playerX += this.speed;
        
        if (this.isSpacePressed) {
            this.playerY -= this.upwardSpeed;
        } else {
            this.playerY += this.downwardSpeed;
        }
        
        this.trail.push({x: this.playerX, y: this.playerY});
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
        
        for (const obstacle of this.obstacles) {
            if (!obstacle.collected && 
                this.playerX > obstacle.x && 
                Math.abs(this.playerY - obstacle.y) < this.obstacleSize) {
                this.score++;
                obstacle.collected = true;
            }
        }
        
        if (this.checkCollisions()) {
            this.handleCollision();
            return;
        }
        
        if (this.playerX >= this.canvas.width - this.margin) {
            if (this.playerY > this.canvas.height/2 - this.doorHeight/2 && 
                this.playerY < this.canvas.height/2 + this.doorHeight/2) {
                this.transitionState = {
                    active: true,
                    type: 'victory',
                    timer: 0,
                    duration: 60,  // 1 second at 60fps
                    alpha: 0,
                    level: this.level
                };
                
                this.score += 50;  // Bonus for completing level
                this.level++;
                this.playerX = this.margin;
                this.playerY = this.canvas.height / 2;
                this.trail = [{x: this.playerX, y: this.playerY}];
                this.generateObstacles();
            } else {
                this.handleCollision();
            }
        }
    }
    
    draw() {
        const bgIndex = (this.level - 1) % this.backgroundImages.length;
        const currentBg = this.backgroundImages[bgIndex];
        
        if (currentBg && currentBg.complete) {
            this.ctx.globalAlpha = this.backgroundOpacity;
            
            const sourceX = this.cropAmount;
            const sourceY = this.cropAmount;
            const sourceWidth = currentBg.width - (this.cropAmount * 2);
            const sourceHeight = currentBg.height - (this.cropAmount * 2);
            
            this.ctx.drawImage(
                currentBg,
                sourceX, sourceY,           // Source X, Y
                sourceWidth, sourceHeight,  // Source Width, Height
                0, 0,                       // Destination X, Y
                this.canvas.width,          // Destination Width
                this.canvas.height          // Destination Height
            );
            
            this.ctx.globalAlpha = 1.0;
        }
        
        this.ctx.strokeStyle = '#444';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(this.margin, this.margin, 
                          this.canvas.width - this.margin * 2, 
                          this.canvas.height - this.margin * 2);
        
        this.ctx.strokeStyle = '#666';
        this.ctx.strokeRect(1, this.canvas.height/2 - this.doorHeight/2,
                          this.margin - 1, this.doorHeight);
        
        this.ctx.strokeRect(this.canvas.width - this.margin, 
                          this.canvas.height/2 - this.doorHeight/2,
                          this.margin, this.doorHeight);
        
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.font = `${this.obstacleSize}px Arial`;
        
        for (const obstacle of this.obstacles) {
            this.ctx.fillStyle = '#000';
            this.ctx.fillText('★', obstacle.x, obstacle.y);
            
            this.ctx.fillStyle = '#fff';
            this.ctx.font = `${this.obstacleSize - 1}px Arial`;
            this.ctx.fillText('★', obstacle.x, obstacle.y);
        }
        
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        if (this.trail.length > 1) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.trail[0].x, this.trail[0].y);
            
            for (let i = 1; i < this.trail.length; i++) {
                const xc = (this.trail[i].x + this.trail[i - 1].x) / 2;
                const yc = (this.trail[i].y + this.trail[i - 1].y) / 2;
                this.ctx.quadraticCurveTo(
                    this.trail[i - 1].x, 
                    this.trail[i - 1].y, 
                    xc, 
                    yc
                );
            }
            
            this.ctx.stroke();
        }
        
        if (this.transitionState.active) {
            if (this.transitionState.type === 'victory') {
                this.ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, this.transitionState.timer / 15)})`;
                this.ctx.textAlign = 'center';
                this.ctx.font = '48px Arial';
                this.ctx.fillText(`Level ${this.transitionState.level} Complete!`, this.canvas.width/2, this.canvas.height/2 - 40);
                this.ctx.font = '24px Arial';
                this.ctx.fillText(`+50 Points!`, this.canvas.width/2, this.canvas.height/2 + 20);
            } else if (this.transitionState.type === 'collision') {
                this.ctx.fillStyle = `rgba(255, 255, 255, ${this.transitionState.alpha * 0.5})`;
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.fillStyle = `rgba(255, 0, 0, ${this.transitionState.alpha * 0.3})`;
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            }
        }
    }
    
    drawTitle() {
        this.ctx.fillStyle = '#fff';
        this.ctx.textAlign = 'center';
        
        this.ctx.font = '48px Arial';
        this.ctx.fillText('Star Dodger V2 2024 Remake', this.canvas.width/2, this.canvas.height/5);
        
        this.ctx.font = '24px Arial';
        this.ctx.fillText('Navigate through the obstacles to reach the exit door', this.canvas.width/2, this.canvas.height/2 - 50);
        this.ctx.fillText('Hold `SPACE` to move up, release to move down. `S` toggles starfield mode. `F11` fullscreen.', this.canvas.width/2, this.canvas.height/2 - 10);
        this.ctx.fillText('Score points by passing near obstacles. Avoid hitting them!', this.canvas.width/2, this.canvas.height/2 + 30);
        
        this.ctx.fillText('Press SPACE to Start', this.canvas.width/2, this.canvas.height * 6/8.5);
        this.ctx.fillText(`High Score: ${this.scoreManager.highScore}`, this.canvas.width/2, this.canvas.height * 6/8.5 + 40);
        
        this.ctx.fillText('©2024 p9iaai - ©1988 Stewart Russell (Original) - ©1992 Graham French (V2)', this.canvas.width/2, this.canvas.height - 30);
    }
    
    drawGameOver() {
        this.ctx.fillStyle = '#fff';
        this.ctx.textAlign = 'center';
        this.ctx.font = '48px Arial';
        this.ctx.fillText('GAME OVER', this.canvas.width/2, this.canvas.height/3);
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width/2, this.canvas.height/2);
        this.ctx.fillText('Press SPACE to Play Again', this.canvas.width/2, this.canvas.height * 2/3);
    }
    
    drawHUD() {
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '20px Arial';
        
        const section = this.canvas.width / 4;
        
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Score: ${this.score}`, 20, 30);
        
        this.ctx.fillText(`Lives: ${this.lives}`, section + 20, 30);
        
        this.ctx.fillText(`Level: ${this.level}`, section * 2 + 20, 30);

        this.ctx.textAlign = 'right';
        this.ctx.fillText(`High Score: ${this.scoreManager.highScore}`, this.canvas.width - 20, 30);
    }
    
    handleCollision() {
        if (!this.transitionState.active) {
            this.transitionState = {
                active: true,
                type: 'collision',
                timer: 0,
                duration: 30,
                alpha: 1
            };
            
            this.lives--;
            if (this.lives <= 0) {
                this.currentState = this.states.GAME_OVER;
                this.scoreManager.updateHighScore(this.score);
            }
        }
    }
    
    resetGame() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.playerX = this.margin;
        this.playerY = this.canvas.height / 2;
        this.trail = [{x: this.playerX, y: this.playerY}];
        this.generateObstacles();
    }
    
    checkObstacleCollision(obstacle) {
        const dx = this.playerX - obstacle.x;
        const dy = this.playerY - obstacle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.obstacleSize/2) {
            if (!obstacle.collected) {
                this.score++;
                obstacle.collected = true;
            }
        }
    }
}

window.onload = () => {
    new Starfield();
    new Game();
};
