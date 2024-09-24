import Station from './Station.js';
import Pizza from './Pizza.js'; // Import the Pizza class

export default class PrepareStation extends Station {
    constructor() {
        super({ key: 'PrepareStation' });
        this.preparedPizzas = [];
    }

    preload() {
        // load tomato paste image
        this.load.image('tomatoPaste', 'stations/assets/sauce_bucket.png');
        // load pepperoni image
        this.load.image('pepperoni', 'stations/assets/pepperoni_tray.png');
        // load cheese image
        this.load.image('cheese', 'stations/assets/cheese_block.png');
    }

    create() {
        this.createBackground();

        // Game logic here
        this.add.text(100, 100, 'Prepare your pizza!', { fontSize: '32px', fontFamily: 'Calibri', fill: '#fff' });

        // Navigation buttons (from Station.js)
        this.createNavigationTabs();

        // Create tomato paste image
        this.createTomatoPasteBottle();

        // Create the pepperoni
        this.createPepperoni();

        // Create the cheese
        this.createCheese();

        // Create prepare button
        const prepareButton = this.add.text(100, 500, 'Prepare Pizza', { fontSize: '24px', fill: '#fff', backgroundColor: '#28a745' })
            .setInteractive()
            .on('pointerdown', () => this.preparePizza());

        // Listen for prepared pizzas updates
        this.game.socket.on('preparedPizzasUpdate', (preparedPizzas) => {
            this.preparedPizzas = preparedPizzas;
            this.updatePreparedPizzasDisplay();
        });

        // Get initial game state
        this.game.socket.on('initialGameState', (gameState) => {
            this.preparedPizzas = gameState.preparedPizzas;
            this.updatePreparedPizzasDisplay();
        });
    }

    createBackground() {
        // Set a specific background color for the PrepareStation
        this.cameras.main.setBackgroundColor('#996600');
        this.createPizzaBaseButton(); // Setup pizza base buttons
    }

    createPizzaBaseButton() {
        const baseSmallButton = this.add.text(50, 200, 'Small Pizza Base', { fontSize: '20px', fill: '#000', fontFamily: 'Calibri', backgroundColor: '#ffd11a' })
            .setInteractive()
            .on('pointerdown', () => {
                this.createPizza('small');
            });
        const baseLargeButton = this.add.text(50, 250, 'Large Pizza Base', { fontSize: '20px', fill: '#000', fontFamily: 'Calibri', backgroundColor: '#ffd11a' })
            .setInteractive()
            .on('pointerdown', () => {
                this.createPizza('large');
            });
    }

    createPizza(size) {
        const pizzaX = this.game.config.width / 2;
        const pizzaY = this.game.config.height / 2;

        // Create and display pizza
        const pizza = new Pizza(this, pizzaX, pizzaY, size);
        // Optionally, you can add additional actions on the pizza object
    }

    // when clicked a red circle will appear and follow the mouse
    // the mouse is released and the red circle WILL CONTINUE TO FOLLOW IT
    // while the red circle is ont the mouse, if the mouse in clicked and dragged
    // it will draw red
    // to get rid of the red circle on the mouse, the user must click the tomato paste again
    // or another interactable object
    createTomatoPasteBottle() {
        const tomatoPasteImage = this.add.image(1100, 100, 'tomatoPaste')
            .setOrigin(0.5, 0.5)
            .setInteractive();
        
        // Set the display size (width, height)
        tomatoPasteImage.setDisplaySize(300, 300);  // Width and height in pixels
    
        // Add event listener for click to toggle the red circle
        tomatoPasteImage.on('pointerdown', (pointer) => {
            if (this.isRedCircleActive) {
                this.removeRedCircle();  // Remove the red circle if active
            } else {
                this.isRedCircleActive = true;  // Activate red circle following
                this.createRedCircle(pointer.x, pointer.y);
            }
        });
        
        // Listen for mouse movements to move the red circle while active
        this.input.on('pointermove', (pointer) => {
            if (this.isRedCircleActive && this.redCircle) {
                this.redCircle.setPosition(pointer.x, pointer.y);
            }
        });
    
        // Add event listener to allow drawing on mouse drag
        this.input.on('pointerdown', (pointer) => {
            if (this.isRedCircleActive) {
                this.isDrawing = true;
            }
        });
    
        // Add event listener for mouse dragging to draw red as long as the red circle is active
        this.input.on('pointermove', (pointer) => {
            if (this.isDrawing && this.isRedCircleActive) {
                this.drawRedCircle(pointer.x, pointer.y);
            }
        });
    
        // Add event listener to stop drawing when the mouse is released
        this.input.on('pointerup', () => {
            this.isDrawing = false;
        });
    }
    
    createRedCircle(x, y) {
        // If a red circle already exists, don't create another one
        if (this.redCircle) return;
    
        // Create a red circle that follows the mouse
        this.redCircle = this.add.graphics();
        this.redCircle.fillStyle(0xff0000); // Red color
        this.redCircle.fillCircle(0, 0, 40); // Draw a circle with radius 40
        this.redCircle.setPosition(x, y); // Set the initial position
    }
    
    drawRedCircle(x, y) {
        // Create a new red circle where the mouse is dragged
        const redCircle = this.add.graphics();
        redCircle.fillStyle(0xff0000); // Red color
        redCircle.fillCircle(x, y, 40); // circle for drawing
    }
    
    // Function to remove the red circle when another object is clicked
    removeRedCircle() {
        if (this.redCircle) {
            this.redCircle.destroy(); // Destroy the red circle graphic
            this.redCircle = null;    // Set reference to null
        }
        this.isRedCircleActive = false;  // Deactivate the red circle
    }
    

    // when clicked single pepperoni will appear when dragged, pepperoni will
    // follow the mouse when droped, the pepperoni will remain where it is
    createPepperoni() {
        const pepperoniImage = this.add.image(1100, 400, 'pepperoni')
            .setOrigin(0.5, 0.5)
            .setInteractive();
        
        // Set the display size (width, height)
        pepperoniImage.setDisplaySize(300, 300);  // Width and height in pixels
    
        let currentPepperoniSlice; // Variable to store the current slice being dragged
    
        // Add event listener for clicking to create a new pepperoni slice
        pepperoniImage.on('pointerdown', (pointer) => {
            this.isDragging = true;
            currentPepperoniSlice = this.add.graphics();
            currentPepperoniSlice.fillStyle(0x530000); // Red color for pepperoni
            currentPepperoniSlice.fillCircle(pointer.x, pointer.y, 20); // Draw initial circle at click position
        });
    
        // Add event listener for mouse dragging to move the pepperoni slice with the mouse
        this.input.on('pointermove', (pointer) => {
            if (this.isDragging && currentPepperoniSlice) {
                currentPepperoniSlice.clear(); // Clear the previous position
                currentPepperoniSlice.fillStyle(0x530000); // Redraw the red color
                currentPepperoniSlice.fillCircle(pointer.x, pointer.y, 20); // Redraw the circle at the new position
            }
        });
    
        // Add event listener to stop moving the pepperoni slice on mouse release
        this.input.on('pointerup', () => {
            this.isDragging = false;
            currentPepperoniSlice = null; // Release the reference to the current slice
        });
    }

    // cheese
    createCheese(){
        const cheeseImage = this.add.image(800, 550, 'cheese')
            .setOrigin(0.5, 0.5)
            .setInteractive();
        
        // // Set the display size (width, height)
        cheeseImage.setDisplaySize(200, 200);  // Width and height in pixels
    }

    preparePizza() {
        const pizza = new Pizza(this, this.game.config.width / 2, this.game.config.height / 2, 'small');
        // Add toppings based on user interactions
        const preparedPizza = {
            id: Date.now(),
            size: 'small',
            toppings: ['cheese', 'pepperoni'] // Example toppings
        };
        this.game.socket.emit('pizzaPrepared', preparedPizza);
    }

    updatePreparedPizzasDisplay() {
        // Clear previous display
        if (this.preparedTexts) {
            this.preparedTexts.forEach(text => text.destroy());
        }
        this.preparedTexts = [];

        // Display prepared pizzas
        this.preparedPizzas.forEach((pizza, index) => {
            const text = this.add.text(600, 100 + index * 30, `Pizza ${pizza.id}: ${pizza.size} with ${pizza.toppings.join(', ')}`, { fontSize: '18px', fill: '#fff' });
            this.preparedTexts.push(text);
        });
    }
    
}
