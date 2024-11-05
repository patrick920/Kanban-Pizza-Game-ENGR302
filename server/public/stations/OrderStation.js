import Station from './Station.js';
import Ticket from './Ticket.js';

class Order {
    constructor(orderId, pizzaType, toppings) {
        this.orderId = orderId;
        this.pizzaType = pizzaType;
        this.toppings = toppings;
    }
}

export default class OrderStation extends Station {

    preload() {
        // load customer image
        this.load.image('customer_one', 'stations/assets/customer_one.png');
        // load table image
        this.load.image('table', 'stations/assets/table.png');
        // load notepad image
        this.load.image('order_notepad', 'stations/assets/order_notepad.png');
        // load order station sign image
        this.load.image('order_station_sign', 'stations/assets/order_station_sign.png');
        // load speech bubble image
        this.load.image('speech_bubble', 'stations/assets/speech_bubble.png');
        // load done button image
        this.load.image('done_button', 'stations/assets/done_button.png');
        // load background image
        this.load.image('background', 'stations/assets/background.png');
    }

    constructor() {
        super({ key: 'OrderStation' });
        this.currentOrderId = 1;
        this.currentOrderText = ''; 
        this.currentOrder = null; 
        this.orderText = '';
        this.generateNewOrder(); // Generates first order
    }

    create() {
        const background = this.add.image(300, 380, 'background').setDisplaySize(2000, 1000);
        const order_station_sign = this.add.image(160, 130, 'order_station_sign');
        const table = this.add.image(300, 450, 'table').setDisplaySize(2000, 400);

        // Create the customer shape (moved down to ensure it renders behind other elements)
        this.createCustomer();
        //Done button, click to place order
        const done_button = this.add.image(810, 300, 'done_button').setDisplaySize(100, 100)
            .setInteractive()
            .on('pointerdown', () => this.placeOrder());
        // Create the order form
        this.createOrderForm();
    }
    
    createCustomer() {
        // Create the customer image and save it as a property
        this.customer = this.add.image(-200, 300, 'customer_one');
    
        // Animate the customer to slide in from the left
        this.tweens.add({
            targets: this.customer,
            x: 150, // Final x position
            duration: 1000,
            ease: 'Power2'
        });
    
        // Create a table below the customer
        this.table = this.add.image(300, 450, 'table').setDisplaySize(2000, 400);
        this.displayOrderText(this.currentOrderText);
        this.createNavigationTabs();
    }

    removeCustomer(){
        // Animate the customer to slide out from the left
        this.tweens.add({
            targets: this.customer,
            x: -300, // Final x position
            duration: 1000,
            ease: 'Power2'
        });
    }
    
    generateNewOrder() {
        // Determine the range for toppings based on order count
        const minToppings = Math.min(0 + this.currentOrderId, 4);
        const maxToppings = Math.min(2 + this.currentOrderId, 10);

        // Random topping counts within the range
        const pepperoniCount = Phaser.Math.Between(minToppings, maxToppings);
        const mushroomCount = Phaser.Math.Between(minToppings, maxToppings);
        const pizzaSize = Phaser.Math.RND.pick(['small', 'large']); // Randomly pick "small" or "large"

        // Create order text
        this.currentOrderText= `I want a ${pizzaSize} pizza, with ${pepperoniCount} pepperonis, and ${mushroomCount} mushrooms.`;
            
        // Save current order to persist it
        this.currentOrder = new Order(this.currentOrderId, pizzaSize, [
            { topping: 'Pepperoni', quantity: pepperoniCount },
            { topping: 'Mushroom', quantity: mushroomCount }
        ]);
    }

    displayOrderText(orderText){
        // Create and display the speech bubble
        this.speechBubble = this.add.image(600, 154, 'speech_bubble').setDisplaySize(700, 200);
        // Display the order above the customer’s head
        orderText = this.add.text(600, 140, orderText, {
            fontSize: '18px',
            fill: '#000'
        }).setOrigin(0.5);
    }

    createOrderForm() {
        // background for order form
        const order_notepad = this.add.image(630, 330, 'order_notepad').setDisplaySize(300, 300);
    
        // Create a text box for entering order details
        this.orderTextBox = this.add.graphics();
        this.orderTextBox.fillStyle(0xffffff, 1);
        this.orderTextBox.fillRect(505, 250, 240, 150);
    
        // Create an invisible but interactive area on top of the text box
        this.interactiveBox = this.add.rectangle(625, 325, 240, 150, 0x000000, 0).setInteractive();
    
        // Initialize orderText only once here
        this.orderText = this.add.text(510, 265, '', {
            fontSize: '18px',
            fill: '#000',
            wordWrap: { width: 210 }  // Wrap text within the text box area
        });
    
        // Enable keyboard input for the text box
        this.setupTextBoxInput();
    }
    
    setupTextBoxInput() {
        const CHARACTER_LIMIT = 50; // Set the character limit here
        let focused = false;
    
        // Focus on the text box when clicked
        this.interactiveBox.on('pointerdown', () => {
            focused = true;
            if (this.orderText) {
                this.orderText.setStyle({ fill: '#ff0000' });  // Optional: change color when focused
            }
        });
    
        // Capture keyboard input when the text box is focused
        this.input.keyboard.on('keydown', (event) => {
            if (focused && this.orderText) { // Ensure orderText exists
                if (event.key === 'Backspace') {
                    // Remove last character on Backspace
                    this.orderText.text = this.orderText.text.slice(0, -1);
                } else if (event.key === 'Enter') {
                    focused = false;  // Unfocus on Enter
                    this.orderText.setStyle({ fill: '#000' });
                } else if (event.key.length === 1) {
                    // Append characters only if below the character limit
                    if (this.orderText.text.length < CHARACTER_LIMIT) {
                        this.orderText.text += event.key;
                    } else {
                        console.log(`Character limit of ${CHARACTER_LIMIT} reached`);
                    }
                }
            }
        });
    
        // Unfocus when clicking outside the text box
        this.input.on('pointerdown', (pointer, currentlyOver) => {
            if (!currentlyOver.includes(this.interactiveBox)) {
                focused = false;
                if (this.orderText) {
                    this.orderText.setStyle({ fill: '#000' });
                }
            }
        });
    }
    
    
    placeOrder() {
        // Ensure orderText exists and get the user’s text input
        const orderDetails = this.orderText ? this.orderText.text.trim() : '';
        
        if (!orderDetails) {
            console.log('No order details entered.');
            return;
        }
    
        const ticket = new Ticket(this.currentOrder, orderDetails); // Create ticket
        
        const kanbanScene = this.scene.get('KanbanStation');
        kanbanScene.addTicket(ticket);  // Add ticket to kanban board
    
        console.log('New Ticket:', ticket);
    
        // Clear text box content without destroying the text object
        if (this.orderText) {
            this.orderText.setText('');
        }
    
        // Remove customer and recreate with new order as in your existing code
        if (this.speechBubble) this.speechBubble.destroy();
    
        this.removeCustomer();
        
        // Delay before showing next customer with a new order
        const randomDelay = Phaser.Math.Between(1000, 2000);
        this.time.delayedCall(randomDelay, () => {
            this.generateNewOrder();
            this.createCustomer();
        });
    }
}

