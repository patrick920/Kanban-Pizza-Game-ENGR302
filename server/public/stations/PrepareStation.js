// // PrepareStation.js
// import Phaser from 'phaser';
import Station from './Station.js';
//import { createNavigationTabs } from './Station.js';

export default class PrepareStation extends Station {
    constructor() {
        super({ key: 'PrepareStation' });
    }

    create() {
        this.add.text(100, 100, 'Prepare your pizza!', { fontSize: '32px', fill: '#fff' });
        //const circle = new Pizza(this, "small");
        // Navigation buttons
        this.createNavigationTabs();
    }

    // create tabs at the bottom of the screen to switch to other scenes
    createBaseButton() {
        const buttonY = this.game.config.height - 50;

        // Navigation button to go back to OrderStation
        const orderButton = this.add.text(100, buttonY, 'Back to Order', { fontSize: '20px', fill: '#fff', fontFamily: 'Calibri', backgroundColor: '#007bff' })
            .setInteractive()
            .on('pointerdown', () => this.scene.start('OrderStation'));

        // Button to go to PrepareStation
        const prepareButton = this.add.text(300, buttonY, 'Prepare', { fontSize: '20px', fill: '#fff', fontFamily: 'Calibri', backgroundColor: '#ffc107' })
            .setInteractive()
            .on('pointerdown', () => this.scene.start('PrepareStation'));

        // Button to go to CookStation
        const cookButton = this.add.text(500, buttonY, 'Cook', { fontSize: '20px', fill: '#fff', fontFamily: 'Calibri', backgroundColor: '#28a745' })
            .setInteractive()
            .on('pointerdown', () => this.scene.start('CookStation'));
    }
}
