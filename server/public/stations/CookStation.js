import Station from './Station.js';
import ImagePreloader from './ImagePreloader.js';
import GameStateManager from './GameStateManager.js';
import Pizza from './Pizza.js';

export default class CookStation extends Station {
    constructor() {
        super({ key: 'CookStation' });
        this.gameStateManager = new GameStateManager();
        this.currentTicket = null;
        this.currentPizza = null;
        this.cookingTime = 0;
        this.cookingTimer = null;
    }

    preload() {
        ImagePreloader.preloadImages(this);
    }

    create() {
        this.add.text(400, 100, 'Cook Station', { fontSize: '32px', fill: '#fff' });
        this.createNavigationTabs();

        this.cookButton = this.add.text(700, 200, 'Start Cooking', { 
            fontSize: '24px', 
            fill: '#fff', 
            backgroundColor: '#4a4a4a' 
        })
        .setInteractive()
        .on('pointerdown', () => this.startCooking())
        .setVisible(false);

        this.cookingProgressText = this.add.text(700, 250, '', { fontSize: '18px', fill: '#fff' });

        this.currentTicket = this.gameStateManager.getCurrentTicket();
        if (this.currentTicket) {
            this.receivePizza();
        } else {
            console.error('No current ticket found in CookStation');
        }
    }

    receiveTicket(ticket) {
        this.currentTicket = ticket;
        this.gameStateManager.setCurrentTicket(ticket);
        this.receivePizza();
    }


    receivePizza() {
        if (this.currentTicket) {
            const pizzaData = this.currentTicket.getPizza();
            if (pizzaData) {
                this.currentPizza = Pizza.fromJSON(this, pizzaData);
                this.currentPizza.setPosition(400, 300);
                this.currentPizza.displayInScene();
                this.cookButton.setVisible(true);
            } else {
                console.error('No pizza data found in the current ticket');
            }
        } else {
            console.error('No current ticket available');
        }
    }

    startCooking() {
        if (this.currentPizza && !this.cookingTimer) {
            this.cookingTime = 0;
            this.cookingTimer = this.time.addEvent({
                delay: 1000,
                callback: this.updateCooking,
                callbackScope: this,
                loop: true
            });
            this.cookButton.setText('Stop Cooking');
        } else if (this.cookingTimer) {
            this.stopCooking();
        }
    }

    updateCooking() {
        this.cookingTime++;
        this.cookingProgressText.setText(`Cooking Time: ${this.cookingTime}s`);
        
        if (this.cookingTime === 5) {
            this.currentPizza.cook(); // Cook the pizza
        } else if (this.cookingTime === 10) {
            this.currentPizza.cook(); // Burn the pizza
            this.stopCooking();
        }
    }

    stopCooking() {
        if (this.cookingTimer) {
            this.cookingTimer.remove();
            this.cookingTimer = null;
        }
        this.cookButton.setText('Start Cooking');

        if (this.currentPizza.isBurnt()) {
            this.destroyPizza();
        } else if (this.currentPizza.isCooked()) {
            this.sendToReview();
        }
    }

    destroyPizza() {
        this.add.text(400, 350, 'Pizza burnt! Destroying...', { fontSize: '18px', fill: '#ff0000' });
        this.time.delayedCall(2000, () => {
            if (this.currentPizza) {
                this.currentPizza.destroy();
                this.currentPizza = null;
            }
            this.currentTicket = null;
            this.gameStateManager.clearCurrentTicket();
            this.resetStation();
        });
    }

    sendToReview() {
        /*
        const reviewStation = this.scene.get('ReviewStation');
        reviewStation.receiveTicket(this.currentTicket);
        */
        this.currentTicket = null;
        this.gameStateManager.clearCurrentTicket();
        this.resetStation();
        this.scene.start('ReviewStation');
    
    }

    resetStation() {
        this.cookingTime = 0;
        this.cookingProgressText.setText('');
        this.cookButton.setVisible(false);
    }
}