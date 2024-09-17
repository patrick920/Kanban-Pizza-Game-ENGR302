// MainGame.js
import OrderStation from './OrderStation.js';
import CookStation from './CookStation.js';
import PrepareStation from './PrepareStation.js';

const config = {
    type: Phaser.AUTO,
    width: 1300,
    height: 650,
    scene: [OrderStation, CookStation, PrepareStation],
};

// Create the Phaser game
const game = new Phaser.Game(config);
