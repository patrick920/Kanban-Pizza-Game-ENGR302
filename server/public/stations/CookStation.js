// CookStation.js
// import Phaser from 'phaser';
import Station from './Station.js';
// import { createNavigationTabs } from './Station.js'; // Import helper function

export default class CookStation extends Station {
    constructor() {
        super({ key: 'CookStation' });
        this.cookedPizzas = [];
    }

    create() {
        this.add.text(100, 100, 'Cooka da pizza!', { fontSize: '32px', fill: '#fff' });

        // Navigation buttons (from Station.js)
        this.createNavigationTabs();

        // Create cook button
        const cookButton = this.add.text(100, 200, 'Cook Pizza', { fontSize: '24px', fill: '#fff', backgroundColor: '#dc3545' })
            .setInteractive()
            .on('pointerdown', () => this.cookPizza());

        // Listen for cooked pizzas updates
        this.game.socket.on('cookedPizzasUpdate', (cookedPizzas) => {
            this.cookedPizzas = cookedPizzas;
            this.updateCookedPizzasDisplay();
        });

        // Get initial game state
        this.game.socket.on('initialGameState', (gameState) => {
            this.cookedPizzas = gameState.cookedPizzas;
            this.updateCookedPizzasDisplay();
        });
    }
    cookPizza() {
        const cookedPizza = {
            id: Date.now(),
            status: 'Cooked'
        };
        this.game.socket.emit('pizzaCooked', cookedPizza);
    }

    updateCookedPizzasDisplay() {
        // Clear previous display
        if (this.cookedTexts) {
            this.cookedTexts.forEach(text => text.destroy());
        }
        this.cookedTexts = [];

        // Display cooked pizzas
        this.cookedPizzas.forEach((pizza, index) => {
            const text = this.add.text(400, 100 + index * 30, `Pizza ${pizza.id}: ${pizza.status}`, { fontSize: '18px', fill: '#fff' });
            this.cookedTexts.push(text);
        });
    }
}
