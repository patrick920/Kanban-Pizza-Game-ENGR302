// OrderStation.js
// import Phaser from 'phaser';
import Station from './Station.js';
// import { createNavigationTabs } from './Station.js'; // Import helper function

export default class OrderStation extends Station {
    constructor() {
        super({ key: 'OrderStation' });
    }

    create() {
        this.add.text(100, 100, 'Order your pizza!', { fontSize: '32px', fill: '#000d1a' });

        // Set a specific background color for the OrderStation scene
        this.cameras.main.setBackgroundColor('#cce6ff'); // Example color: light pink

        // Add a rectangle along the bottom
        const graphics = this.add.graphics();
        const rectWidth = this.game.config.width;
        const rectHeight = 200;
        const rectX = 0;
        const rectY = this.game.config.height - rectHeight;

        graphics.fillStyle(0x996600, 1); // Black color
        graphics.fillRect(rectX, rectY, rectWidth, rectHeight);

        // Add your game logic here
        this.add.text(100, 100, 'Order your pizza!', { fontSize: '32px', fill: '#fff' });

        // Navigation buttons
        this.createNavigationTabs();
    }
}
