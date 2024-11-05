/*
* Review Station.
* Max started working on this code. It was copied and pasted from Gabbie's "PrepareStation.js" code and then modified.
*/

/*
* Review class will display the pizza, the instructions given to make the pizza 
* and have two buttons to either remake the pizza or allow it to be served. 
* Review can't be completed without some notes being taken in the review section. 
* At the end of the day could display review notes to help demonstrate 
* what sections went well or didn't.
* Station should be called from ticket on kanban board. 
*/

import Station from './Station.js';
import Pizza from './Pizza.js'; // Import the Pizza class

export default class ReviewStation extends Station {
    
    
    constructor(ticket) {
        super({ key: 'ReviewStation' });
        this.ticket = ticket; 
        this.score = 0;
    }

    preload() {
        // load customer image
        this.load.image('customer_one', 'stations/assets/customer_one.png');
        this.load.image('speech_bubble', 'stations/assets/speech_bubble.png');

        // load table image
        this.load.image('table', 'stations/assets/table.png');

        // load background image
        this.load.image('background', 'stations/assets/background.png');

        // load logo image 
        this.load.image('logo', 'stations/assets/kanban_logo.png');

    }


    create() {
        this.createBackground();

        // Game logic here
        const background = this.add.image(300, 380, 'background').setDisplaySize(2000, 1000);
        const customer_one = this.add.image(300, 300, 'customer_one');
        const table = this.add.image(300, 500, 'table').setDisplaySize(2000, 400);
        const speech_bubble = this.add.image(600, 150, 'speech_bubble').setVisible(false);
        // Tween animation for customer slide-in
        this.tweens.add({
            targets: customer_one,
            x: 300, // Center x-coordinate
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                // Make the speech bubble visible after customer slides in
                speech_bubble.setVisible(true);
            }
        });

        // Add review title to top of screen
        this.add.text(25, 25, 'Review Station', { fontSize: '32px', fontFamily: 'Calibri', fill: '#000000'});

        // Add logo to the top of screen
        const logo = this.add.image(1150, 70, 'logo').setScale(0.5);

        // Add navigation buttons for Reject and Serve at the bottom
        this.createNavigationButtons();

        // Display Order Text
        this.displayCustomerOrder();
    }

    createNavigationButtons() {
        // Add button to go back to kanban board in bottom right
        this.add.text(50, this.game.config.height - 100, 'Back to Kanban Board', { fontSize: '20px', fill: '#fff', fontFamily: 'Calibri', backgroundColor: '#996600', padding: { x: 1, y: 1 } })
            .setInteractive()
            .on('pointerdown', () => this.scene.start('KanbanStation'));

        // Button to reject the order
        this.add.text(600, this.game.config.height - 100, 'Reject', { fontSize: '20px', fill: '#fff', fontFamily: 'Calibri', backgroundColor: '#f44336', padding: { x: 1, y: 1 } })
            .setInteractive()
            .on('pointerdown', () => this.rejectOrder());

        // Button to serve the order
        this.add.text(700, this.game.config.height - 100, 'Serve', { fontSize: '20px', fill: '#fff', fontFamily: 'Calibri', backgroundColor: '#8fce00', padding: { x: 1, y: 1 } })
            .setInteractive()
            .on('pointerdown', () => this.serveOrder());
    }

    createBackground() {
        // Add the background image to cover the scene
        this.add.image(300, 380, 'background').setDisplaySize(2000, 1000);
        this.add.image(300, 450, 'table').setDisplaySize(2000, 400);

        // Add functionality here to display the pizza image
    }

    displayCustomerOrder() {
        const order = this.ticket.getOrder();
        let orderText = `Order #${order.orderId}:\nPizza Type: ${order.pizzaType}\nToppings:\n`;
        
        // Format topping details
        order.toppings.forEach(topping => {
            orderText += `${topping.quantity}x ${topping.topping}\n`;
        });

        // Display order details in a text box within the scene
        this.add.text(600, 150, orderText, {
            fontSize: '16px',
            fill: '#000000',
            fontFamily: 'Calibri',
            wordWrap: { width: 300 },
            align: 'center'
        }).setVisible(true);
    }    

    validateOrder() {
        const customerOrder = this.ticket.getOrder();
        const playerPizza = this.ticket.getPizza();
    
        let score = 10; // Base score
    
        // Compare pizza type
        if (playerPizza.type !== customerOrder.pizzaType) {
            score -= 5;
        }
    
        // Compare toppings by matching each topping and quantity
        const unmatchedToppings = customerOrder.toppings.filter(custTop => {
            return !playerPizza.toppings.some(playerTop => 
                playerTop.topping === custTop.topping && 
                playerTop.quantity === custTop.quantity);
        });
    
        score -= unmatchedToppings.length * 2; // Deduct for each mismatch
    
        // Final score is calculated, positive score means order is correct
        this.score = Math.max(0, score);
        console.log('Order score:', this.score);
        return this.score > 0;
    }    

    showTemporaryMessage(message) {
        const messageText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, message, {
            fontSize: '50px',
            fill: '#ffffff',
            backgroundColor: '#000000'
        }).setOrigin(0.5);

        // Fade out the message after 1 second
        this.time.delayedCall(1000, () => {
            orderTakenText.destroy(); // Remove text after 1 second
        });
    }

    serveOrder() {
        if (this.validateOrder()) {
            console.log('Order served successfully with score:', this.score);
            this.showTemporaryMessage('Order Served');
            this.ticket.completeTicket();
            this.time.delayedCall(1200, () => this.scene.start('KanbanStation')); // Return to Kanban Board
        } else {
            console.log('Order validation failed.');
        }
    }
    
    rejectOrder() {
        this.ticket.setReviewNotes('Rejected: Order did not meet customer requirements');
        console.log('Order rejected and sent back.');
        this.showTemporaryMessage('Order Rejected');
        this.time.delayedCall(1200, () => this.scene.start('KanbanStation')); // Return to Kanban Board
    }
    
}
