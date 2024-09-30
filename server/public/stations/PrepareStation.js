import Station from './Station.js';
import Pizza from './Pizza.js'; // Import the Pizza class

/**
 * This is the class for the PrepareStation
 * This is where the player creates and builds their pizza
 */
export default class PrepareStation extends Station {

    tomatoPasteOn = false; // determines whether or not pizza sauce can be applied
    pizza = null;
    currentPepperoniSlice;

    /**
     * Construct the PrepareStation
     */
    constructor() {
        super({ key: 'PrepareStation' });
        this.preparedPizzas = [];
    }

    /**
     * Preload images
     */
    preload() {
        // load tomato paste image
        this.load.image('tomatoPaste', 'stations/assets/sauce_bucket.png');
        // load pepperoni image
        this.load.image('pepperoniTray', 'stations/assets/pepperoni_tray.png');
        // load cheese image
        this.load.image('cheese', 'stations/assets/cheese_block.png');
        // Load the pizza base image and toppings images
        this.load.image('pizzaBase', 'stations/assets/pizza_base_raw.png');
        this.load.image('pizzaSauce', 'stations/assets/sauce.png');
        this.load.image('pepperoniSlice', 'stations/assets/pepperoni_slice.png');
    }

    /**
     * Setup the scene
     */
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

    /**
     * Create the background for the scene
     */
    createBackground() {
        // Set a specific background color for the PrepareStation
        this.cameras.main.setBackgroundColor('#996600');
        this.createPizzaBaseButton(); // Setup pizza base buttons
    }

    /**
     * Create buttons for pizza base size options
     */
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

    /**
     * Generate the pizza base
     * @param {*} size 
     */
    createPizza(size) {
        const pizzaX = this.game.config.width / 2;
        const pizzaY = this.game.config.height / 2;

        // Create and display pizza
        this.pizza = new Pizza(this, pizzaX, pizzaY, size);
        // Optionally, you can add additional actions on the pizza object
    }

    /**
     * Create the tomato paste bottle and set to interactive
     * When the bottle is clicked, a red circle will appear and
     * follow the player's mouse. If the pizza base if clicked during this
     * state the pizza sauce will appear on to[]
     */
    createTomatoPasteBottle() {
        const tomatoPasteImage = this.add.image(1100, 100, 'tomatoPaste')
            .setOrigin(0.5, 0.5)
            .setInteractive();
        
        // Set the display size (width, height)
        tomatoPasteImage.setDisplaySize(300, 300);  // Width and height in pixels
    
        // Add event listener for click to toggle the red circle
        tomatoPasteImage.on('pointerdown', (pointer) => {
            this.toggleTomatoPaste();
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
    }

    /**
     * Change status of tomato paste
     */
    toggleTomatoPaste() {
        this.tomatoPasteOn = !this.tomatoPasteOn; // Toggle the value of tomatoPasteOn
    }

    /**
     * Create the red circle which follows the mouse
     * @param {*} x 
     * @param {*} y 
     * @returns 
     */
    createRedCircle(x, y) {
        // If a red circle already exists, don't create another one
        if (this.redCircle) return;
    
        // Create a red circle that follows the mouse
        this.redCircle = this.add.graphics();
        this.redCircle.fillStyle(0xff0000); // Red color
        this.redCircle.fillCircle(0, 0, 40); // Draw a circle with radius 40
        this.redCircle.setPosition(x, y); // Set the initial position
    }
    
    /**
     * When the sauce bottle is clicked, the red circle will be
     * removed from the player's mouse
     */
    removeRedCircle() {
        if (this.redCircle) {
            this.redCircle.destroy(); // Destroy the red circle graphic
            this.redCircle = null;    // Set reference to null
        }
        this.isRedCircleActive = false;  // Deactivate the red circle
    }

    /**
     * Create the pepperoni tub and setup interaction
     * When the tub is clicked a pepperoni image will appear
     * on the mouse. It can then be dragged and dropped onto the pizza .
     * Once on the pizza is cannot be moved
     */
    createPepperoni() {
        const pepperoniImage = this.add.image(1100, 400, 'pepperoniTray')
            .setOrigin(0.5, 0.5)
            .setInteractive();
        
        // Set the display size (width, height)
        pepperoniImage.setDisplaySize(300, 300);  // Width and height in pixels
    
        // let currentPepperoniSlice; // Variable to store the current slice being dragged
    
        // // Add event listener for clicking to create a new pepperoni slice
        // pepperoniImage.on('pointerdown', (pointer) => {
        //     this.isDragging = true;
        //     currentPepperoniSlice = this.add.image(30, 30, 'pepperoniSlice').setInteractive();
        //     // currentPepperoniSlice = this.add.graphics();
        //     // currentPepperoniSlice.fillStyle(0x530000); // Red color for pepperoni
        //     // currentPepperoniSlice.fillCircle(pointer.x, pointer.y, 20); // Draw initial circle at click position
        // });
    
        // // Add event listener for mouse dragging to move the pepperoni slice with the mouse
        // this.input.on('pointermove', (pointer) => {
        //     if (this.isDragging && currentPepperoniSlice) {
        //         currentPepperoniSlice.clear(); // Clear the previous position
        //         currentPepperoniSlice.fillStyle(0x530000); // Redraw the red color
        //         currentPepperoniSlice.fillCircle(pointer.x, pointer.y, 20); // Redraw the circle at the new position
        //     }
        // });
    
        // // Add event listener to stop moving the pepperoni slice on mouse release
        // this.input.on('pointerup', () => {
        //     this.isDragging = false;
        //     currentPepperoniSlice = null; // Release the reference to the current slice
        // });
        
        // Add event listener for clicking to create a new pepperoni slice
        pepperoniImage.on('pointerdown', (pointer) => {
            if (!this.tomatoPasteOn) {
                this.isDragging = true;

                // Check if there's an existing pepperoni slice that hasn't been placed on the pizza
                if (this.currentPepperoniSlice) {
                    this.currentPepperoniSlice.destroy(); // Destroy the old slice if it exists
                    this.currentPepperoniSlice = null; // Reset reference to ensure cleanup
                }

                // Create a new pepperoni slice image at the current mouse position
                this.currentPepperoniSlice = this.add.image(pointer.x, pointer.y, 'pepperoniSlice')
                    .setDisplaySize(100, 100) // Set the size of the pepperoni slice
                    .setInteractive(); // Make it interactive

                // Immediately make the pepperoni slice draggable
                this.input.setDraggable(this.currentPepperoniSlice);

                // Add drag event listeners specific to this pepperoni slice
                this.currentPepperoniSlice.on('drag', (pointer, dragX, dragY) => {
                    this.currentPepperoniSlice.x = dragX; // Update position based on dragging
                    this.currentPepperoniSlice.y = dragY;
                });

                // Add event listener to stop moving the pepperoni slice on mouse release (for this specific slice)
                this.currentPepperoniSlice.on('dragend', (pointer) => {
                    if (this.pizza != null && this.pizza.isOnPizza(this.currentPepperoniSlice)) {
                        // If a pizza exists and the slice is on it, add the topping and make it undraggable
                        this.pizza.addTopping(this.currentPepperoniSlice); // Add topping to pizza
                        this.input.setDraggable(this.currentPepperoniSlice, false); // Make it undraggable
                        this.currentPepperoniSlice.setInteractive(false); // Optionally, make it non-interactive
                    } else {
                        // If there's no pizza or the slice is not on it, destroy the pepperoni slice
                        this.currentPepperoniSlice.destroy(); // Remove the slice
                    }

                    // Reset the reference to the current pepperoni slice
                    this.currentPepperoniSlice = null;
                });
            }
        });
    }

    // // Function to add topping to the pizza (implement your logic here)
    // addTopping(slice) {
    //     // Add your topping logic here
    //     console.log('Topping added:', slice);
    // }

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
