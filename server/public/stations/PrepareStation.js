import Station from './Station.js';
import Pizza from './Pizza.js'; // Import the Pizza class
//import DisplayTicket from './DisplayTicket.js'; //Class to display current ticket on the screen.
import { displayTicket } from './DisplayTicket.js';

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
    }

    /**
     * This method is called from KanbanLabel.js when the "Go to Station" button is clicked on the label.
     * It setups the necessary objects needed.
     */
    initialSetupFromKanbanBoard(ticket){
        this.ticket = ticket;
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
        this.load.image('mushroomSlice', 'stations/assets/mushroom_slice.png');
        this.load.image('cheeseUncooked', 'stations/assets/cheese_uncooked.png');
        // designed by @ibrandify on FreePik
        this.load.image('button', 'stations/assets/button.png');
        // designed by @upklyak on FreePik
        this.load.image('tableBackground', 'stations/assets/wooden_table_background.jpg')
    }

    /**
     * Setup the scene
     */
    create() {
        console.log("PrepareStation.js create() method execution.");

        this.createBackground();

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
        this.currentTicket();

        // Create prepare button
        const prepareButton = this.add.text(100, 500, 'Prepare Pizza', { fontSize: '24px', fill: '#fff', backgroundColor: '#28a745' })
            .setInteractive()
            .on('pointerdown', () => this.createPizza());

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
        //this.cameras.main.setBackgroundColor('#996600');

        // Add a background image that fills the entire scene
        const background = this.add.image(0, 0, 'tableBackground')
        .setOrigin(0, 0) // Align to the top-left corner
        .setDisplaySize(this.cameras.main.width, this.cameras.main.height); // Scale to fill the scene

        // Setup credit to background and button artists
        const creditText = this.add.text(10, this.cameras.main.height - 30, 
            "Button art by: @ibrandify on FreePik   Background art by: @upklyak on FreePik", {
            fontSize: '14px',
            fill: '#000',
            fontFamily: 'Calibri',
            wordWrap: { width: this.cameras.main.width - 20 } // Wrap text if it exceeds the scene width
        });

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
        // Small Pizza Base Button
        const baseSmallButton = this.add.image(300, 170, 'button') // Use your button image key here
            .setOrigin(0.5)
            .setScale(0.3)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.createPizza('small'))
            .on('pointerover', () => baseSmallButton.setTint(0xffbb33)) // Hover effect
            .on('pointerout', () => baseSmallButton.clearTint()); // Reset color on hover out
        
        const smallButtonText = this.add.text(300, 160, 'Small Pizza Base', {
            fontSize: '20px',
            fill: '#000',
            fontFamily: 'Calibri',
            align: 'center'
        }).setOrigin(0.5); // Center the text on the button
    
        // Large Pizza Base Button
        const baseLargeButton = this.add.image(300, 400, 'button') // Use your button image key here
            .setOrigin(0.5)
            .setScale(0.3)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.createPizza('large'))
            .on('pointerover', () => baseLargeButton.setTint(0xffbb33)) // Hover effect
            .on('pointerout', () => baseLargeButton.clearTint()); // Reset color on hover out
        
        const largeButtonText = this.add.text(300, 390, 'Large Pizza Base', {
            fontSize: '20px',
            fill: '#000',
            fontFamily: 'Calibri',
            align: 'center'
        }).setOrigin(0.5); // Center the text on the button
    
        // Store button references
        this.pizzaBaseButtons.push(baseSmallButton, smallButtonText, baseLargeButton, largeButtonText);
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
        this.removePizzaBaseButtons(); // remove pizza base after after choosing a size

        const pizzaX = this.game.config.width / 4;
        const pizzaY = this.game.config.height / 2;

        // Create and display pizza
        this.pizza = new Pizza(this, pizzaX, pizzaY, size);
        //Set the order in the Ticket in the KanbanLabel to this pizza.
        this.ticket.setPizza(pizza);
        
        // // something to hold information about the pizza object
        // // ASK HANNING ABOUT THIS TOMORROW, HOW DOES HE WANT IT TO BE USED?
        // const preparedPizza = {
        //     id: Date.now(),
        //     size: 'small',
        //     toppings: ['cheese', 'pepperoni'] // Example toppings
        // };
        // this.game.socket.emit('pizzaPrepared', preparedPizza);
        // if i use this suddenly toppings stop working
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
        const pepperoniImage = this.add.image(670, 450, 'pepperoniTray')
            .setOrigin(0.5, 0.5)
            .setInteractive()
            .setScale(0.5);
        
        // Set the display size (width, height)
        //pepperoniImage.setDisplaySize(350, 350);  // Width and height in pixels
        
        this.createAndMoveTopping(pepperoniImage, 'pepperoniSlice');
    }

    /**
     * Create the mushroom tub and setup interaction
     * When the tub is clicked a mushroom image will appear
     * on the mouse. It can then be dragged and dropped onto the pizza .
     * Once on the pizza is cannot be moved
     */
    createMushroom() {
        const mushroomImage = this.add.image(650, 150, 'mushroomSlice')
            .setOrigin(0.5, 0.5)
            .setInteractive()
            .setScale(1.3);
        
        // Set the display size (width, height)
        //mushroomImage.setDisplaySize(250, 250);  // Width and height in pixels
        
        this.createAndMoveTopping(mushroomImage, 'mushroomSlice');
    }

    /**
     * Create a topping and move it
     * * When the tub is clicked a topping image will appear
     * on the mouse. It can then be dragged and dropped onto the pizza .
     * Once on the pizza is cannot be moved
     */
    createAndMoveTopping(topping, toppingName){
        // Add event listener for clicking to create a new topping slice
        topping.on('pointerdown', (pointer) => {
            if (!this.tomatoPasteOn && !this.cheeseOn) {
                this.isDragging = true;

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
    }

    /**
     * Create the tomato paste bottle and set to interactive
     * When the bottle is clicked, a red circle will appear and
     * follow the player's mouse. If the pizza base if clicked during this
     * state the pizza sauce will appear on to[]
     */
    createTomatoPasteBottle() {
        const tomatoPasteImage = this.add.image(940, 400, 'tomatoPaste')
            .setOrigin(0.5, 0.5)
            .setInteractive()
            .setScale(0.7);
        
        // Set the display size (width, height)
        //tomatoPasteImage.setDisplaySize(300, 300);  // Width and height in pixels

        this.addSpread(tomatoPasteImage, 'sauce', '0xff0000');
    }

    /**
     * Create the cheese and setup functionality
     */
    createCheese(){
        const cheeseImage = this.add.image(980, 150, 'cheese')
            .setOrigin(0.5, 0.5)
            .setInteractive()
            .setScale(0.8);
        
        // Set the display size (width, height)
        //cheeseImage.setDisplaySize(250, 250);  // Width and height in pixels

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

    currentTicket() {
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
        
        
        //Display a view of the order requirements and the state of the current pizza object:
        //(this, this.ticket, x, y)
        displayTicket(this, this.ticket, x, y);
    }
}
