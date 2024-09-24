// OrderStation.js
// import Phaser from 'phaser';
import Station from './Station.js';
// import { createNavigationTabs } from './Station.js'; // Import helper function

export default class OrderStation extends Station {
    constructor() {
        super({ key: 'OrderStation' });
        this.orders = [];
    }

    create() {
        this.createBackground();

        // Add your game logic here
        this.add.text(100, 100, 'Order your pizza!', { fontSize: '32px', fontFamily: 'Calibri', fill: '#000' });

        // Navigation buttons (from Station.js)
        this.createNavigationTabs();

        // Create order button
        const orderButton = this.add.text(100, 200, 'Place Order', { fontSize: '24px', fill: '#fff', backgroundColor: '#007bff' })
            .setInteractive()
            .on('pointerdown', () => this.placeOrder());

        // Listen for order updates
        this.game.socket.on('orderUpdate', (orders) => {
            this.orders = orders;
            this.updateOrderDisplay();
        });

        // Get initial game state
        this.game.socket.on('initialGameState', (gameState) => {
            this.orders = gameState.orders;
            this.updateOrderDisplay();
        });
    }

    placeOrder() {
        const order = {
            id: Date.now(),
            type: 'Pepperoni', // You can make this dynamic later
            status: 'Ordered'
        };
        this.game.socket.emit('newOrder', order);
    }

    updateOrderDisplay() {
        // Clear previous order display
        if (this.orderTexts) {
            this.orderTexts.forEach(text => text.destroy());
        }
        this.orderTexts = [];

        // Display orders
        this.orders.forEach((order, index) => {
            const text = this.add.text(400, 100 + index * 30, `Order ${order.id}: ${order.type} - ${order.status}`, { fontSize: '18px', fill: '#000' });
            this.orderTexts.push(text);
        });
    }

    createBackground(){
        // Set a specific background color for the OrderStation scene
        this.cameras.main.setBackgroundColor('#cce6ff');

        // Add a rectangle along the bottom, this is the counter to order at
        const graphics = this.add.graphics();
        const rectWidth = this.game.config.width;
        const rectHeight = 200;
        const rectX = 0;
        const rectY = this.game.config.height - rectHeight;

        graphics.fillStyle(0x996600, 1); // Black color
        graphics.fillRect(rectX, rectY, rectWidth, rectHeight);
    }
}
