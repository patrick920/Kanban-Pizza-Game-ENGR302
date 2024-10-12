import Station from './Station.js';
import Pizza from './Pizza.js'; // Import the Pizza class
import ImagePreloader from './ImagePreloader.js';
import GameStateManager from './GameStateManager.js';

/**
 * This is the class for the PrepareStation
 * This is where the player creates and builds their pizza
 */
export default class PrepareStation extends Station {

    tomatoPasteOn = false; // determines whether or not pizza sauce can be applied
    cheeseOn = false;
    pizza = null;
    isCircleActive = false;

    /**
     * Construct the PrepareStation
     */
    constructor() {
        super({ key: 'PrepareStation' });
        this.preparedPizzas = [];
        this.pizzaBaseButtons = []; // Array to hold button references
        this.gameStateManager = new GameStateManager();
        this.currentTicket = null;
    }

    /**
     * Preload images
     */
    preload() {
        ImagePreloader.preloadImages(this);
    }

    /**
     * Setup the scene
     */
    create() {
        this.createBackground();

        // Game logic here
        this.add.text((this.game.config.width/2)-50, 50, 'Make Your Pizza!', { fontSize: '32px', fontFamily: 'Calibri', fill: '#fff' });

        // Navigation buttons (from Station.js)
        this.createNavigationTabs();

        // Create tomato paste image
        this.createTomatoPasteBottle();

        // Create the cheese
        this.createCheese();

        // Create the pepperoni
        this.createPepperoni();

        // Create the mushroom
        this.createMushroom();

        // Display the current ticket
        this.displayCurrentTicket();

        
        this.createSendToCookButton();
        console.log("created send to cook");

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
        this.currentTicket = this.gameStateManager.getCurrentTicket();
        if (this.currentTicket) {
            this.displayTicketInfo();
        } else {
            console.error('No current ticket found in PrepareStation');
        }
    }

    /**
     * Create the background for the scene
     */
    createBackground() {
        // Set a specific background color for the PrepareStation
        this.cameras.main.setBackgroundColor('#996600');
        this.createPizzaBaseButtons(); // Setup pizza base buttons
    }

    /**
     * Create a button with a specified label and position
     * @param {string} label - The text label for the button
     * @param {number} x - The x position for the button
     * @param {number} y - The y position for the button
     * @param {function} onClick - The callback function to execute on click
     */
    createButton(label, x, y, onClick) {
        // Create a rounded rectangle shape for the button background
        const buttonBackground = this.add.graphics()
            .fillStyle(0xffd11a, 1) // Set color to a light yellow
            .fillRoundedRect(x, y, 200, 50, 10); // Width: 200, Height: 50, Radius: 10

        // Create the button label
        const buttonText = this.add.text(x + 100, y + 15, label, {
            fontSize: '20px',
            fill: '#000',
            fontFamily: 'Calibri',
            align: 'center'
        })
        .setOrigin(0.5); // Center the text within the button

        // Set the button background and text as interactive
        buttonBackground.setInteractive({ useHandCursor: true })
            .on('pointerdown', onClick)
            .on('pointerover', () => buttonBackground.setFillStyle(0xffbb33)) // Darker color on hover
            .on('pointerout', () => buttonBackground.setFillStyle(0xffd11a)); // Reset color on hover out

        // Store button references
        this.pizzaBaseButtons.push(buttonBackground, buttonText);
    }

    /**
     * Create buttons for pizza base size options
     */
    createPizzaBaseButtons() {
        const baseSmallButton = this.add.text(50, 200, 'Small Pizza Base', { 
            fontSize: '20px', 
            fill: '#000', 
            fontFamily: 'Calibri', 
            backgroundColor: '#ffd11a',
            align: 'center'
        }).setInteractive().on('pointerdown', () => this.createPizza('small'))
        
        
        const baseLargeButton = this.add.text(50, 250, 'Large Pizza Base', { 
            fontSize: '20px', 
            fill: '#000', 
            fontFamily: 'Calibri', 
            backgroundColor: '#ffd11a',
            align: 'center'
        }).setInteractive().on('pointerdown', () => { this.createPizza('large');

        });
        
        // Store button references in the array
        this.pizzaBaseButtons.push(baseSmallButton, baseLargeButton);
    }



    /**
     * Remove pizza base buttons
     */
    removePizzaBaseButtons() {
        // Iterate over the button references and destroy each one
        this.pizzaBaseButtons.forEach(button => {
            button.destroy(); // Destroy the button
        });
        this.pizzaBaseButtons = []; // Clear the references
    }

    /**
     * Generate the pizza base
     * @param {*} size 
     */
    createPizza(size) {
        this.removePizzaBaseButtons();
    
        const pizzaX = this.game.config.width / 4;
        const pizzaY = this.game.config.height / 2;
    
        // Create and display pizza
        this.pizza = new Pizza(this, pizzaX, pizzaY, size);
        
        // Setup interaction for sauce and cheese
        this.setupSauceInteraction();
        this.setupCheeseInteraction();
        this.currentTicket.setPizza(this.pizza.toJSON());
        this.sendToCookButton.setVisible(true); // Show the button when pizza is created
    }

    setupSauceInteraction() {
        this.input.on('pointerdown', (pointer) => {
            if (this.tomatoPasteOn && this.pizza) {
                this.pizza.addSauce();
                this.tomatoPasteOn = false;
                this.removeCircle();
            }
        });
    }

    setupCheeseInteraction() {
        this.input.on('pointerdown', (pointer) => {
            if (this.cheeseOn && this.pizza) {
                this.pizza.addCheese();
                this.cheeseOn = false;
                this.removeCircle();
            }
        });
    }

    createSendToCookButton() {
        const button = this.add.text(100, 500, 'Send to Cook', { 
            fontSize: '24px', 
            fill: '#fff', 
            backgroundColor: '#4a4a4a' 
        })
        .setInteractive()
        .on('pointerdown', () => this.sendToCook());

        this.sendToCookButton = button;
        this.sendToCookButton.setVisible(true); // Hide initially
    }

    sendToCook() {
        if (this.currentTicket && this.currentTicket.getPizza()) {
            this.gameStateManager.setCurrentTicket(this.currentTicket);
            
            // Reset the prepare station
            this.pizza = null;
            this.currentTicket = null;
            this.sendToCookButton.setVisible(false);
            this.createPizzaBaseButtons();
            
            this.scene.start('CookStation');
        } else {
            console.error('Cannot send to cook: No ticket or pizza available');
        }
    }


    /**
     * ASK HANNING ABOUT THIS TOMORROW
     */
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

    /**
     * Create the pepperoni tub and setup interaction
     * When the tub is clicked a pepperoni image will appear
     * on the mouse. It can then be dragged and dropped onto the pizza .
     * Once on the pizza is cannot be moved
     */
    createPepperoni() {
        const pepperoniImage = this.add.image(670, 500, 'pepperoniTray')
            .setOrigin(0.5, 0.5)
            .setInteractive();
        
        // Set the display size (width, height)
        pepperoniImage.setDisplaySize(350, 350);  // Width and height in pixels
        
        this.createAndMoveTopping(pepperoniImage, 'pepperoniSlice');
    }

    /**
     * Create the mushroom tub and setup interaction
     * When the tub is clicked a mushroom image will appear
     * on the mouse. It can then be dragged and dropped onto the pizza .
     * Once on the pizza is cannot be moved
     */
    createMushroom() {
        const mushroomImage = this.add.image(650, 200, 'mushroomSlice')
            .setOrigin(0.5, 0.5)
            .setInteractive();
        
        // Set the display size (width, height)
        mushroomImage.setDisplaySize(250, 250);  // Width and height in pixels
        
        this.createAndMoveTopping(mushroomImage, 'mushroomSlice');
    }

    /**
     * Create a topping and move it
     * * When the tub is clicked a topping image will appear
     * on the mouse. It can then be dragged and dropped onto the pizza .
     * Once on the pizza is cannot be moved
     */
    createAndMoveTopping(topping, toppingName) {
        topping.on('pointerdown', (pointer) => {
            if (!this.tomatoPasteOn && !this.cheeseOn) {
                this.isDragging = true;

                // Create a new topping slice image at the current mouse position
                this.currentTopping = this.add.image(pointer.x, pointer.y, toppingName)
                    .setDisplaySize(100, 100)
                    .setInteractive();

                // Check if there's an existing topping slice that hasn't been placed on the pizza
                if (this.currentTopping) {
                    this.currentTopping.destroy(); // Destroy the old slice if it exists
                    this.currentTopping = null; // Reset reference to ensure cleanup
                }

                // Create a new topping slice image at the current mouse position
                this.currentTopping = this.add.image(pointer.x, pointer.y, toppingName)
                    .setDisplaySize(100, 100) // Set the size of the topping slice
                    .setInteractive(); // Make it interactive

                // Immediately make the topping slice draggable
                this.input.setDraggable(this.currentTopping);

                // Add drag event listeners specific to this topping slice
                this.currentTopping.on('drag', (pointer, dragX, dragY) => {
                    this.currentTopping.x = dragX; // Update position based on dragging
                    this.currentTopping.y = dragY;
                });

                // Add event listener to stop moving the topping slice on mouse release (for this specific slice)
                this.currentTopping.on('dragend', (pointer) => {
                    if (this.pizza != null && this.pizza.isOnPizza(this.currentTopping)) {
                        // If a pizza exists and the slice is on it, add the topping and make it undraggable
                        this.pizza.addTopping(this.currentTopping); // Add topping to pizza
                        this.input.setDraggable(this.currentTopping, false); // Make it undraggable
                        this.currentTopping.setInteractive(false); // Optionally, make it non-interactive
                    } else {
                        // If there's no pizza or the slice is not on it, destroy the topping slice
                        this.currentTopping.destroy(); // Remove the slice
                    }

                    // Reset the reference to the current topping slice
                    this.currentTopping = null;
                });
            }
        });
        // When topping is placed:
        
    }

    /**
     * Create the tomato paste bottle and set to interactive
     * When the bottle is clicked, a red circle will appear and
     * follow the player's mouse. If the pizza base if clicked during this
     * state the pizza sauce will appear on to[]
     */
    createTomatoPasteBottle() {
        const tomatoPasteImage = this.add.image(900, 450, 'tomatoPaste')
            .setOrigin(0.5, 0.5)
            .setInteractive();
        
        // Set the display size (width, height)
        tomatoPasteImage.setDisplaySize(300, 300);  // Width and height in pixels

        this.addSpread(tomatoPasteImage, 'sauce', '0xff0000');
    }

    /**
     * Create the cheese and setup functionality
     */
    createCheese(){
        const cheeseImage = this.add.image(940, 200, 'cheese')
            .setOrigin(0.5, 0.5)
            .setInteractive();
        
        // Set the display size (width, height)
        cheeseImage.setDisplaySize(250, 250);  // Width and height in pixels

        this.addSpread(cheeseImage, 'cheese', '0xffe680');
    }

    /** 
     * "Spread" refers to a pizza topping which spans the entire pizza base
     * Both cheese and pizza sauces are the "spreads"
     * @param {*} spread
     */
    addSpread(spread, spreadName, colour){
        // Add event listener for click to toggle the circle
        spread.on('pointerdown', (pointer) => {
            this.toggleSpread(spreadName);
            if (this.isCircleActive) {
                this.removeCircle();  // Remove the circle if active
            } else {
                this.isCircleActive = true;  // Activate circle following
                this.createCircle(pointer.x, pointer.y, colour);
            }
        });
        
        // Listen for mouse movements to move the circle while active
        this.input.on('pointermove', (pointer) => {
            if (this.isCircleActive && this.circle) {
                this.circle.setPosition(pointer.x, pointer.y);
            }
        });
    
        // Add event listener to allow drawing on mouse drag
        this.input.on('pointerdown', (pointer) => {
            if (this.isCircleActive) {
                this.isDrawing = true;
            }
        });
    }

     /**
     * Change status of cheese
     */
     toggleSpread(spreadName) {
        if(spreadName === 'sauce'){
            this.tomatoPasteOn = !this.tomatoPasteOn; // Toggle the value of cheeseOn
            //this.cheeseOn = false;
        } else if (spreadName === 'cheese') {
            this.cheeseOn = !this.cheeseOn; // Toggle the value of cheeseOn
            //this.tomatoPasteOn = false;
        }
    }

    /**
     * Create the circle which follows the mouse
     * @param {*} x 
     * @param {*} y 
     * @returns 
     */
    createCircle(x, y, colour) {
        // If a circle already exists with the same color, don't create a new one
        if (this.circle && this.circle.colour === colour) return;
    
        // Create the new circle and set its color
        this.circle = this.add.graphics();
        this.circle.fillStyle(colour);
        this.circle.fillCircle(0, 0, 40); // Draw circle with radius 40
        this.circle.setPosition(x, y);
        this.circle.colour = colour; // Store the color in the circle object
    }  
    
    /**
     * When the sauce bottle is clicked, the circle will be
     * removed from the player's mouse
     */
    removeCircle() {
        if (this.circle) {
            this.circle.destroy(); // Destroy the circle graphic
            this.circle = null;    // Set reference to null
        }
        this.isCircleActive = false;  // Deactivate the circle
    }

    displayCurrentTicket() {
        // Define the position and size of the rectangle
        const x = 1100; // X position of the rectangle
        const y = 0; // Y position of the rectangle
        const width = 200; // Width of the rectangle
        const height = this.game.config.height; // Height of the rectangle
    
        // Create a graphics object for the rectangle
        const ticketBackground = this.add.graphics()
            .fillStyle(0xffffff, 1) // Set the fill color to white
            .fillRect(x, y, width, height); // Draw the rectangle
    
        // Create the text label
        const ticketText = this.add.text(x + width / 2, y + height / 2, 
            'display current ticket', {
                fontSize: '20px',
                fill: '#000', // Text color
                fontFamily: 'Calibri',
                align: 'center'
            })
            .setOrigin(0.5); // Center the text within the rectangle
    }

    displayTicketInfo(){

    }
}
