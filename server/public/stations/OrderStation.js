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
        this.orderId = 0;
        this.currentOrderText = ''; 
        this.currentOrder = null; 
        this.pizzaSize = '  small'; // Default pizza size
        this.pepperoniCount = 0; // Default pepperoni count
        this.mushroomCount = 0; // Default mushroom count
    }

    create() {
        this.socket = io('http://localhost:3500'); // Connect explicitly to the server on port 3500


        // Listen for new orders from other players
        this.socket.on('orderUpdate', (orders) => {
            const latestOrder = orders[orders.length - 1];
            this.currentOrder = latestOrder;
            this.currentOrderText = `I want a ${latestOrder.pizzaType} pizza, with ${latestOrder.toppings[0].quantity} pepperonis, and ${latestOrder.toppings[1].quantity} mushrooms.`;
            this.displayOrderText(this.currentOrderText);
         });

        const background = this.add.image(300, 380, 'background').setDisplaySize(2000, 1000);
        const order_station_sign = this.add.image(160, 130, 'order_station_sign');
        const table = this.add.image(300, 450, 'table').setDisplaySize(2000, 400);

        if(this.orderId == 0){this.generateNewOrder();}

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
        const minToppings = Math.min(1 + this.orderId, 4);
        const maxToppings = Math.min(2 + this.orderId, 10);

        // Random topping counts within the range
        const pCount = Phaser.Math.Between(minToppings, maxToppings);
        const mCount = Phaser.Math.Between(minToppings, maxToppings);
        const pSize = Phaser.Math.RND.pick(['small', 'large']); // Randomly pick "small" or "large"

        // Create order text
        this.currentOrderText= `I want a ${pSize} pizza, with ${pCount} pepperonis, and ${mCount} mushrooms.`;
            
        // Save current order to persist it
        this.currentOrder = new Order(this.orderId, pSize, [
            { topping: 'Pepperoni', quantity: pCount },
            { topping: 'Mushroom', quantity: mCount }
        ]);
        this.socket.emit('newOrder', this.currentOrder);
        this.orderId++;
    }

    displayOrderText(orderText){
        // Create and display the speech bubble
        this.speechBubble = this.add.image(600, 154, 'speech_bubble').setDisplaySize(700, 200);
        // Display the order above the customer’s head
        this.orderText = this.add.text(600, 140, orderText, {
            fontSize: '18px',
            fill: '#000'
        }).setOrigin(0.5);
    }

    createOrderForm() {
        // Order pad background
        this.add.image(630, 330, 'order_notepad').setDisplaySize(300, 300);
    
        // Dropdown for pizza size
        this.createPizzaSizeDropdown(535, 260);
    
        // Text input fields for toppings
        this.createToppingInput(540, 340, 'Pepperoni', (value) => {
            this.pepperoniCount = value;
        });
        this.createToppingInput(540, 385, 'Mushroom', (value) => {
            this.mushroomCount = value
        });
    }

    createPizzaSizeDropdown(x, y) {
        // Create text and options for pizza size selection
        const sizeText = this.add.text(x, y, 'Size:', { fontSize: '18px', fill: '#000' });
        const options = ['  small', '  large'];
        let dropdownOpen = false;

        // Default selected option
        const selectedText = this.add.text(x + 50, y, this.pizzaSize, { fontSize: '18px', fill: '#000' });
        selectedText.setInteractive();

        // Toggle dropdown on click
        selectedText.on('pointerdown', () => {
            if (dropdownOpen) {
                optionTexts.forEach(text => text.destroy());
                dropdownOpen = false;
            } else {
                const optionTexts = options.map((option, index) => {
                    const optionText = this.add.text(x + 50, y + 20 + index * 20, option, { fontSize: '18px', fill: '#000' });
                    optionText.setInteractive();
                    optionText.on('pointerdown', () => {
                        this.pizzaSize = option;
                        selectedText.setText(option);
                        dropdownOpen = false;
                        optionTexts.forEach(text => text.destroy());
                    });
                    return optionText;
                });
                dropdownOpen = true;
            }
        });
    }

    createToppingInput(x, y, label, onChange) {
        // Create label and input graphics for the topping count
        this.add.text(x, y, label + ':', { fontSize: '18px', fill: '#000' });
        const inputBox = this.add.graphics();
        inputBox.fillStyle(0xffffff, 1);
        //inputBox.fillRect(x + 120, y - 10, 50, 30);
    
        // Display the count as text, defaulting to '0'
        let countText = this.add.text(x + 130, y, '0', { fontSize: '18px', fill: '#000' });
        countText.setInteractive();
        
        // Focus flag to control when to accept input
        let isFocused = false;
    
        // Click to enable typing in the input box
        countText.on('pointerdown', () => {
            isFocused = true;
            countText.setStyle({ fill: '#ff0000' }); // Highlight text to show it’s selected
        });
    
        // Handle keyboard input while focused
        this.input.keyboard.on('keydown', (event) => {
            if (isFocused) {
                if (/^\d$/.test(event.key)) {  // Only accept digits
                    if (countText.text === '0') {
                        countText.setText(event.key); // Replace '0' with first digit
                    } else {
                        countText.setText(countText.text + event.key); // Append digit
                    }
                    onChange(parseInt(countText.text, 10)); // Update count
                } else if (event.key === 'Backspace') {
                    // Remove last character, revert to '0' if empty
                    countText.setText(countText.text.slice(0, -1) || '0');
                    onChange(parseInt(countText.text, 10));
                } else if (event.key === 'Enter') {
                    // Deselect text when Enter is pressed
                    isFocused = false;
                    countText.setStyle({ fill: '#000' }); // Reset text color
                }
            }
        });
    
        // Unfocus if clicked outside
        this.input.on('pointerdown', (pointer, currentlyOver) => {
            if (!currentlyOver.includes(countText)) {
                isFocused = false;
                countText.setStyle({ fill: '#000' });
            }
        });
    }
    
    placeOrder() {
        if(this.mushroomCount == 0 ){ return; }
        if(this.pepperoniCount == 0 ){ return; }

        const order = new Order(this.orderId, this.pizzaSize.trim(), [
            { topping: 'Pepperoni', quantity: this.pepperoniCount },
            { topping: 'Mushroom', quantity: this.mushroomCount }
        ]);
    
        const ticket = new Ticket(order, this.currentOrder); // Create ticket
        
        const kanbanScene = this.scene.get('KanbanStation');
        kanbanScene.addTicket(ticket);  // Add ticket to kanban board
    
        console.log('New Ticket:', ticket);
        
        this.resetScreen();
        
    }

    resetScreen() {
        // Reset values for the next order
        this.pizzaSize = '  small';
        this.pepperoniCount = 0;
        this.mushroomCount = 0;

        this.createOrderForm();

        // Remove customer and recreate with new order as in your existing code
        if (this.speechBubble) this.speechBubble.destroy();
        if (this.orderText) this.orderText.destroy();

        this.removeCustomer();
        
        // Delay before showing next customer with a new order
        const randomDelay = Phaser.Math.Between(1000, 2000);
        this.time.delayedCall(randomDelay, () => {
            this.generateNewOrder();
            this.createCustomer();
        });
    }
}

