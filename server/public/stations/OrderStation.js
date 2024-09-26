import Station from './Station.js';

// TO-DO:
// - have input rows all be apart of the same order
// - make sure customer dialog fits screen
// - Ranomize cutomer order and save it somewhere to assess correctness
// - Make input rows more dynamic - lets you start with 2 and add more as nessesary
// - small / large pizza options + final toppings
// - Make it look nice
// - Don't let order input appear until after cutomer dialog disappears (Adds challenge)

//orderNumber = 0;

// Order class to represent the order details
class Order {
    constructor(orderId, pizzaType, toppings) {
        this.orderId = orderId;
        this.pizzaType = pizzaType;
        this.toppings = toppings;
    }
}

export default class OrderStation extends Station {
    constructor() {
        super({ key: 'OrderStation' });
        this.orders = [];
        this.currentOrderId = null; // Store the current order ID
        this.orderInputs = []; // Array to hold input data for orders
    }

    create() {
        this.createBackground();

        console.log('OrderStation: create() called');

        // Add a title
        this.add.text(50, 50, 'Take Customer Order', { fontSize: '32px', fontFamily: 'Calibri', fill: '#000' });

        // Navigation buttons (from Station.js)
        this.createNavigationTabs();

        // Create order button
        //const orderButton = this.add.text(100, 200, 'Place Order', { fontSize: '24px', fill: '#000', backgroundColor: '#007bff' })
        const orderButton = this.add.text(800, 300, 'Place Order', { fontSize: '24px', fill: '#fff', backgroundColor: '#007bff' })
            .setInteractive()
            .on('pointerdown', () => this.placeOrder());

        // Create the customer shape (a rectangle with text)
        this.createCustomer();

        // Create the order form (a rectangle with input elements)
        this.createOrderForm();

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

    createCustomer() {
        // Add a rectangle to represent the customer
        //const customer = this.add.rectangle(150, 300, 150, 100, 0xffcc00);
        const customer = this.add.circle(150, 300, 75, 0xffcc00); // Circle with radius 75
        this.add.text(120, 280, 'Customer', { fontSize: '15px', fill: '#000' });

        // Add a speech bubble for the customer
        this.add.text(210, 240, 'Give me one pizza with five pepperoni', {
            fontSize: '18px',
            backgroundColor: '#ffffff',
            padding: { x: 10, y: 5 },
            fill: '#000'
        }).setOrigin(0.5);
    }

    createOrderForm() {
        // Create a rectangle for the order form
        const form = this.add.rectangle(600, 300, 200, 150, 0xdddddd);
        
        // Add initial input fields
        this.addOrderInput(505, 270);
        this.addOrderInput(505, 300);
        this.addOrderInput(505, 330);
    }

    addOrderInput(x, y) {
        const orderInput = {
            quantity: '0',
            selectedOption: 'Pizza',
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
        orderInput.graphics.fillRect(x + 55, y, 120, 30);
        orderInput.selectedText = this.add.text(x + 60, y + 5, orderInput.selectedOption, { fontSize: '18px', fill: '#000' });
        
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
                if (/^\d$/.test(event.key)) {  //regex
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
        const toggleDropdown = () => {
            if (orderInput.dropdownOpen) {
                orderInput.optionTexts.forEach(text => text.destroy());
                orderInput.dropdownOpen = false;
            } else {
                orderInput.optionTexts = options.map((option, index) => {
                    const optionText = this.add.text(x + 5, y + 35 + index * 30, option, { fontSize: '18px', fill: '#000' });
                    optionText.setInteractive();
                    optionText.on('pointerdown', () => {
                        orderInput.selectedOption = option;  
                        orderInput.selectedText.setText(option);
                        toggleDropdown();  
                    });
                    return optionText;
                });
                orderInput.dropdownOpen = true;
            }
        };

        orderInput.graphics.setInteractive(new Phaser.Geom.Rectangle(x, y, 120, 30), Phaser.Geom.Rectangle.Contains);
        orderInput.graphics.on('pointerdown', toggleDropdown);
    }

    placeOrder() {
        // Create a new order for each input in orderInputs
        this.orderInputs.forEach(orderInput => {
            const qty = orderInput.quantity; 
            const pizzaType = orderInput.selectedOption;  

            // Generate a unique order ID
            const orderId = Date.now(); // For unique orders

            // Create a new order
            const order = new Order(orderId, pizzaType, `Qty: ${qty}`);
            this.orders.push(order); // Keep track of orders in local array

            // Send the order to the server
            this.game.socket.emit('newOrder', order);
        });

        // Reset the order inputs for the next orders
        this.orderInputs = [];
        this.createOrderForm(); // Re-create the form for new entries
    }

    updateOrderDisplay() {
        // Clear previous order display
        if (this.orderTexts) {
            this.orderTexts.forEach(text => text.destroy());
        }
        this.orderTexts = [];

        // Display orders
        this.orders.forEach((order, index) => {
            const text = this.add.text(400, 100 + index * 30, `Order ${order.orderId}: ${order.pizzaType} - ${order.toppings}`, { fontSize: '18px', fill: '#000' });
            this.orderTexts.push(text);
        });
    }

    createBackground() {
        // Set a specific background color for the OrderStation scene
        this.cameras.main.setBackgroundColor('#cce6ff');

        // Add a rectangle along the bottom, this is the counter to order at
        const graphics = this.add.graphics();
        const rectWidth = this.game.config.width;
        const rectHeight = 200;
        const rectX = 0;
        const rectY = this.game.config.height - rectHeight;

        graphics.fillStyle(0x996600, 1); // Brown color
        graphics.fillRect(rectX, rectY, rectWidth, rectHeight);
    }
}
