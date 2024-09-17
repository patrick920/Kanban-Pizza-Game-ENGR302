// CookStation.js
// import Phaser from 'phaser';
import Station from './Station.js';
// import { createNavigationTabs } from './Station.js'; // Import helper function

export default class CookStation extends Station {
    constructor() {
        super({ key: 'CookStation' });
    }

    create() {
        this.add.text(100, 100, 'Cooka da pizza!', { fontSize: '32px', fill: '#fff' });

        // Navigation buttons
        this.createNavigationTabs();
    }
}
