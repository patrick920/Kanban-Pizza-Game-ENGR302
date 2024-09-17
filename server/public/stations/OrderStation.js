// OrderStation.js
export default class OrderStation extends Phaser.Scene {
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
