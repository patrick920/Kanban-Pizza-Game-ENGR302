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

        // load table image
        this.load.image('table', 'stations/assets/table.png');
    }

    create() {
        this.createBackground();

        // Game logic here

        // Add review title to top of screen
        this.add.text(100, 100, 'Review', { fontSize: '32px', fontFamily: 'Calibri', fill: '#fff'});

        // Add button to go back to kanban board in bottom right
        this.add.text(50, this.game.config.height - 100, 'Back to Kanban Board', { fontSize: '20px', fill: '#fff', fontFamily: 'Calibri', backgroundColor: '#996600' })
            .setInteractive()
            .on('pointerdown', () => this.scene.start('KanbanStation'));

        //Add a text box on right side of screen people can type in
        this.createTextBox();

        //Add button to restart order - needs functionality
        this.add.text(500, this.game.config.height - 100, 'Reject', { fontSize: '20px', fill: '#fff', fontFamily: 'Calibri', backgroundColor: '#f44336' })
            .setInteractive()
            .on('pointerdown', () => this.rejectOrder());

        //Add button to allow order through - needs functionality
        this.add.text(700, this.game.config.height - 100, 'Serve', { fontSize: '20px', fill: '#fff', fontFamily: 'Calibri', backgroundColor: '#8fce00' })
            .setInteractive()
            .on('pointerdown', () => serveOrder());
    }

    createTextBox() {
        const inputBox = document.createElement('input');
        inputBox.type = 'text';
        inputBox.id = 'playerInput';
        inputBox.placeholder = 'Type your review...';

        // Style the input box
        inputBox.style.position = 'absolute';
        inputBox.style.bottom = '20px';  
        inputBox.style.right = '120px';
        inputBox.style.width = '250px';
        inputBox.style.height = '40px';
        inputBox.style.fontSize = '18px';

        // Add an event listener to handle input submission
        inputBox.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                const inputValue = inputBox.value;
                if (inputValue.trim()) {
                    // Handle the input submission (validate order)
                    this.handlePlayerInput(inputValue);
                    inputBox.value = ''; // Clear the text box after submitting
                }
            }
        });

        document.body.appendChild(inputBox);
    }

    handlePlayerInput(inputValue) {
        console.log('Player typed review:', inputValue);
        // Review logic
    }

    createBackground() {
        // Set a specific background color for the ReviewStation
        this.cameras.main.setBackgroundColor('#a7288a');

        // Add functionality here to display the pizza image
    }

    validateOrder(playerOrder, customerOrder) {
        let score = 0;

        // Calculate score for the pizza base and toppings
        score += -5; // Base cost
        score += -1 * playerOrder.toppings.length; // Toppings cost
    
        // Update the player's score
        this.score = Math.max(0, score);
        console.log('Player score:', this.score);

        // If all checks pass, the order matches
        return score > 0;

        // Add functionality here to validateOrder ....
    }

    rejectOrder() {
        // Logic to handle rejecting the order
        console.log('Order has been rejected.');
    }

    serveOrder() {
        // Logic to handle serving the order
        if (this.validateOrder()) {
            console.log('Order has been served successfully.');
            this.score += Math.abs(this.score);
            this.ticket.completeTicket();
        } else {
            console.log('Order validation failed. Please review the order.');
        }
    }
}
