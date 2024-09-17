// PrepareStation.js
export default class PrepareStation extends Phaser.Scene {
    constructor() {
        super({ key: 'PrepareStation' });
    }

    create() {
        this.add.text(100, 100, 'Prepare your pizza!', { fontSize: '32px', fill: '#fff' });

        // Navigation buttons
        this.createTabs();
    }

    createTabs() {
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
