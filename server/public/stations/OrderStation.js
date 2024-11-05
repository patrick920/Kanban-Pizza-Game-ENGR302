import Station from './Station.js';
import Ticket from './Ticket.js';
// TO-DO:
// - Randomize customer order and save it somewhere to assess correctness
// - small / large pizza options + final toppings
// - Make it look nice


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
        this.orders = [];
        this.currentOrderId = null;
        this.orderInputs = []; // Array to hold input data for orders
    }

    create() {
        const background = this.add.image(300, 380, 'background').setDisplaySize(2000, 1000);
 
        const order_station_sign = this.add.image(160, 130, 'order_station_sign');
    
        // Create the customer shape (moved down to ensure it renders behind other elements)
        this.createCustomer();

        // Navigation buttons
        this.createNavigationTabs();

        //Done button, click to place order
        const done_button = this.add.image(810, 300, 'done_button').setDisplaySize(100, 100)
            .setInteractive()
            .on('pointerdown', () => this.placeOrder());
    
        // Create the order form
        this.createOrderForm();
    
        // Listen for order updates
        this.game.socket.on('orderUpdate', (orders) => {
            this.orders = orders;
        });
    
        // Get initial game state
        this.game.socket.on('initialGameState', (gameState) => {
            this.orders = gameState.orders;
            this.updateOrderDisplay();
        });
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
        const table = this.add.image(300, 450, 'table').setDisplaySize(2000, 400);
    
        // Create and display the speech bubble
        this.speechBubble = this.add.image(540, 150, 'speech_bubble').setDisplaySize(600, 200);
    
        // Generate and display a random order
        this.generateNewOrder();
    }
    
    generateNewOrder() {
        // Generate a random order
        const orderId = Date.now(); // Unique order ID
        const pepperoniCount = Math.floor(Math.random() * 8); // Random number between 0-7
        const mushroomCount = Math.floor(Math.random() * 8); // Random number between 0-7
        const orderText = `I want 1 pizza, with ${pepperoniCount} pepperonis, and ${mushroomCount} mushrooms`;
    
        // Create a new Order object
        const order = new Order(orderId, 'Pizza', [
            { topping: 'Pepperoni', quantity: pepperoniCount },
            { topping: 'Mushroom', quantity: mushroomCount }
        ]);
        this.orders.push(order); // Save the order internally
    
        // Display the order above the customer’s head
        if (this.orderText) this.orderText.destroy(); // Remove old order text if it exists
        this.orderText = this.add.text(550, 140, orderText, {
            fontSize: '18px',
            fill: '#000'
        }).setOrigin(0.5);
    }

    createOrderForm() {
        
        //background for order form
        const order_notepad = this.add.image(630, 330, 'order_notepad').setDisplaySize(300, 300);

        // Add initial input fields for toppings
        this.addOrderInput(505, 270, 'Pepperoni');
        this.addOrderInput(505, 310, 'Mushroom');
        this.addOrderInput(505, 350, 'Pineapple');
    }

    addOrderInput(x, y, toppingName) {
        const orderInput = {
            quantity: '', // Start with an empty string for quantity
            topping: 'Pizza', // Default topping
            graphics: this.add.graphics(),
            quantityText: null,
            selectedText: null
        };

        // Create number input
        orderInput.graphics.fillStyle(0xffffff, 1);
        orderInput.graphics.fillRect(x, y, 50, 30);
        orderInput.quantityText = this.add.text(x + 5, y + 5, orderInput.quantity, { fontSize: '18px', fill: '#000' });

        // Set up interaction for number input
        this.setupNumberInput(orderInput, x, y);

        // Create dropdown
        orderInput.graphics.fillStyle(0xffffff, 1);
        orderInput.graphics.fillRect(x + 55, y, 170, 30);
        orderInput.selectedText = this.add.text(x + 60, y + 5, '', { fontSize: '18px', fill: '#000' });
        orderInput.topping = orderInput.selectedText;

        // Set up dropdown
        this.setupDropdown(orderInput, x + 55, y);

        // Add to order inputs array
        this.orderInputs.push(orderInput);
    }

    setupNumberInput(orderInput, x, y) {
        let focused = false;
        const interactiveBox = this.add.rectangle(x + 25, y + 15, 50, 30, 0x000000, 0).setInteractive()
            .on('pointerdown', () => {
                focused = true; 
                orderInput.quantityText.setStyle({ fill: '#ff0000' });
            });

        this.input.keyboard.on('keydown', (event) => {
            if (focused) {
                if (/^\d$/.test(event.key)) {  //regex for numbers
                    orderInput.quantity += event.key; 
                    orderInput.quantityText.setText(orderInput.quantity);
                } else if (event.key === 'Backspace') {
                    orderInput.quantity = orderInput.quantity.slice(0, -1) || '0';
                    orderInput.quantityText.setText(orderInput.quantity);
                } else if (event.key === 'Enter') {
                    focused = false;  
                    orderInput.quantityText.setStyle({ fill: '#000' });
                }
            }
        });

        this.input.on('pointerdown', (pointer, currentlyOver) => {
            if (!currentlyOver.includes(interactiveBox)) {
                focused = false;
                orderInput.quantityText.setStyle({ fill: '#000' });
            }
        });
    }

    setupDropdown(orderInput, x, y) {
        const options = ['Pizza', 'Pepperoni', 'Mushroom'];

        // Initialize selected option to a placeholder
        orderInput.selectedOption = '(Select Option)';
        orderInput.selectedText.setText(orderInput.selectedOption);
        orderInput.optionTexts = [];
        orderInput.optionBackgrounds = [];

        // Function to toggle the dropdown display
        const toggleDropdown = () => {
            if (orderInput.dropdownOpen) {
                // Close dropdown: remove all option texts and backgrounds
                orderInput.optionTexts.forEach(text => text.destroy());
                orderInput.optionBackgrounds.forEach(background => background.destroy());
                orderInput.optionTexts = [];
                orderInput.optionBackgrounds = [];
                orderInput.dropdownOpen = false;
            } else {
                // Open dropdown: create option texts and background boxes
                options.forEach((option, index) => {
                    // Create a background box for each option
                    const background = this.add.graphics();
                    background.fillStyle(0xffffff, 1); // White background
                    background.fillRect(x, y + 35 + index * 30, 120, 30);
                    orderInput.optionBackgrounds.push(background);

                    // Create text for each option
                    const optionText = this.add.text(x + 5, y + 35 + index * 30, option, { fontSize: '18px', fill: '#000' });
                    optionText.setInteractive();
                    optionText.on('pointerdown', () => {
                        // Set the selected option and update the displayed text only if it's a valid selection
                        orderInput.selectedOption = option;
                        orderInput.selectedText.setText(orderInput.selectedOption);
                        toggleDropdown();  // Close dropdown after selection
                    });
                    orderInput.optionTexts.push(optionText);
                });
                orderInput.dropdownOpen = true;
            }
        };

        // Set interaction for the selected text to toggle the dropdown
        orderInput.selectedText.setInteractive();
        orderInput.selectedText.on('pointerdown', toggleDropdown);
    }

    //The counter for the order ID. It starts at 1 then goes 2, 3, 4...
    orderCounter = 1;

    placeOrder() {
        const pizzaType = 'Pizza';
        const toppings = this.orderInputs.map(orderInput => ({
            topping: orderInput.selectedOption,
            quantity: parseInt(orderInput.quantity, 10) || 0
        })).filter(topping => topping.quantity > 0);
    
        if (toppings.length === 0) {
            console.log('No toppings selected.');
            return;
        }
    
        const orderId = this.orderCounter++; // Increment order ID
        const order = new Order(orderId, pizzaType, toppings);
        this.orders.push(order);
    
        const ticket = new Ticket(order); // Create ticket
    
        const kanbanScene = this.scene.get('KanbanStation');
        kanbanScene.addTicket(ticket);  // Add ticket to kanban board
    
        this.game.socket.emit('newOrder', order);
        console.log('New Order:', order);
        console.log('New Ticket:', ticket);
    
        // Clear dropdowns and quantity inputs after placing order
        this.orderInputs.forEach(orderInput => {
            orderInput.quantity = ''; // Clear quantity
            orderInput.quantityText.setText(''); // Update display
            orderInput.selectedOption = '(Select Option)'; // Reset to placeholder
            orderInput.selectedText.setText(orderInput.selectedOption); // Update display
        }); 
    
        // Show "Order Taken" text briefly in the center of the screen
        const orderTakenText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Order Taken', {
            fontSize: '50px',
            fill: '#ffffff',
            backgroundColor: '#000000'
        }).setOrigin(0.5);
    
        // Fade out after 1 second
        this.time.delayedCall(1000, () => {
            orderTakenText.destroy(); // Remove text after 1 second
        });
    
        // Hide the customer, speech bubble, and order text
        if (this.customer) this.customer.destroy();
        if (this.speechBubble) this.speechBubble.destroy();
        if (this.orderText) this.orderText.destroy();
    
        // Random delay between 1-2 seconds (1000-2000 ms)
        const randomDelay = Phaser.Math.Between(1000, 2000);

        // Recreate the customer and speech bubble after the random delay with a new order
        this.time.delayedCall(randomDelay, () => {
            this.createCustomer();
        })
    }
}

