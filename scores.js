// Star Dodger V2 2024 Remake
// by p9iaai (c) 2024 (score.js)

class ScoreManager {
    constructor() {
        this.highScore = localStorage.getItem('highScore') || 0;
    }
    
    updateHighScore(score) {
        if (score > this.highScore) {
            this.highScore = score;
            localStorage.setItem('highScore', score);
        }
    }
}