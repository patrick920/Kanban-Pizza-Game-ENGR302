// CookStation.js
// import Phaser from 'phaser';
import Station from './Station.js';
//import Pizza from './Pizza.js';
// import { createNavigationTabs } from './Station.js'; // Import helper function

export default class CookStation extends Station {

    pizzas = [];
    pizza = null;
    cheeseOn = true;
    sauceOn = true;

    constructor() {
        super({ key: 'CookStation' });
        this.cookedPizzas = [];
    }

    init(data) {
        // retrieve pizza data if provided
        this.pizza = data.pizza || null;
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
        this.load.image('cheeseCooked', 'stations/assets/cheese_cooked.png');
        this.load.image('pizzaBaseCooked', 'stations/assets/pizza_base_cooked.png');
        // designed by @ibrandify on FreePik
        this.load.image('button', 'stations/assets/button.png');
        // designed by @upklyak on FreePik
        this.load.image('tableBackground', 'stations/assets/wooden_table_background.jpg')
    }

    /**
     * create the scene
     */
    create() {
        // Add a background image that fills the entire scene
        const background = this.add.image(0, 0, 'tableBackground')
        .setOrigin(0, 0) // Align to the top-left corner
        .setDisplaySize(this.cameras.main.width, this.cameras.main.height); // Scale to fill the scene

        // Navigation buttons (from Station.js)
        this.createNavigationTabs();

        // create cook pizza button
        this.createCookPizzaButton();

        // display the pizza in its current state
        this.displayPizza();

        // THIS WAS HANNINGS ORIGINAL CODE
        // // Create cook button
        // const cookButton = this.add.text(100, 200, 'Cook Pizza', { fontSize: '24px', fill: '#fff', backgroundColor: '#dc3545' })
        //     .setInteractive()
        //     .on('pointerdown', () => this.cookPizza());

        // Listen for cooked pizzas updates
        this.game.socket.on('cookedPizzasUpdate', (cookedPizzas) => {
            this.cookedPizzas = cookedPizzas;
            this.updateCookedPizzasDisplay();
        });

        // Get initial game state
        this.game.socket.on('initialGameState', (gameState) => {
            this.cookedPizzas = gameState.cookedPizzas;
            this.updateCookedPizzasDisplay();
        });
    }

    /**
     * Create the cook pizza button
     */
    createCookPizzaButton() {
        // Store the button in this.cookButton and text in this.cookButtonText
        this.cookButton = this.add.image(650, 300, 'button')
            .setOrigin(0.5)
            .setScale(0.3)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.cookPizza()) // Call cookPizza on click
            .on('pointerover', () => this.cookButton.setTint(0xffbb33)) // Hover effect
            .on('pointerout', () => this.cookButton.clearTint()); // Reset color on hover out
        
        this.cookButtonText = this.add.text(650, 290, 'Cook Pizza', {
            fontSize: '20px',
            fill: '#000',
            fontFamily: 'Calibri',
            align: 'center'
        }).setOrigin(0.5); // Center the text on the button
    }

    /**
     * Pizza will cook for 15 secs then review button will spawn
     */
    cookPizza() {
        if (this.isCooking) {
            this.add.text(100, 100, 'Pizza is already cooking!', { fontSize: '24px', fill: '#fff', fontFamily: 'Calibri' });
            return; // Prevent further action if already cooking
        }

        this.isCooking = true; // Set the flag to true
        let remainingTime = 15; // Set the countdown time in seconds
        // Store reference to the countdown text
        this.countdownText = this.add.text(100, 100, `Cooking pizza for ${remainingTime} seconds...`, { fontSize: '24px', fill: '#fff', fontFamily: 'Calibri' });

        // Destroy the cook button and its text when clicked
        if (this.cookButton) {
            this.cookButton.destroy(); // Remove the button from the screen
        }
        
        if (this.cookButtonText) {
            this.cookButtonText.destroy(); // Remove the button text from the screen
        }

        // Update the countdown every second
        const countdownInterval = setInterval(() => {
            remainingTime -= 1; // Decrease the remaining time by 1 second
            this.countdownText.setText(`Cooking pizza for ${remainingTime} seconds...`); // Update the text to show remaining time

            // If time runs out
            if (remainingTime <= 0) {
                clearInterval(countdownInterval); // Stop the countdown interval
                this.pizza.cooked = true; // Set pizza status to cooked
                this.displayPizza(); // Update the display to show the cooked pizza
                this.isCooking = false; // Reset the flag after cooking is done
                // spawn review button
                this.createReviewButton();

                // Destroy the countdown text after cooking is complete
                if (this.countdownText) {
                    this.countdownText.destroy();
                }
            }
        }, 1000); // Update every 1000 milliseconds (1 second)
    }

    /**
     * Create the review button
     */
    createReviewButton(){
        // Store the button in this.reviewButton and text in this.reviewButtonText
        this.reviewButton = this.add.image(650, 300, 'button')
            .setOrigin(0.5)
            .setScale(0.3)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.movePizzaToReviewStation())
            .on('pointerover', () => this.reviewButton.setTint(0xffbb33)) // Hover effect
            .on('pointerout', () => this.reviewButton.clearTint()); // Reset color on hover out
        
        this.reviewButtonText = this.add.text(650, 290, 'Review Pizza', {
            fontSize: '20px',
            fill: '#000',
            fontFamily: 'Calibri',
            align: 'center'
        }).setOrigin(0.5); // Center the text on the button
    }

    /**
     * take pizza and scene into the review station
     */
    movePizzaToReviewStation(){
        if (this.pizza != null) {
            this.scene.start('ReviewStation', { pizza: this.pizza });
        }
    }




    /**
     * THIS IS ALSO HANNING'S I DO NOT USE IT IN MY IMPLEMENTATION
     */
    updateCookedPizzasDisplay() {
        // Clear previous display
        if (this.cookedTexts) {
            this.cookedTexts.forEach(text => text.destroy());
        }
        this.cookedTexts = [];

        // Display cooked pizzas
        this.cookedPizzas.forEach((pizza, index) => {
            const text = this.add.text(400, 100 + index * 30, `Pizza ${pizza.id}: ${pizza.status}`, { fontSize: '18px', fill: '#fff' });
            this.cookedTexts.push(text);
        });
    }

    /**
     * display the pizza in its current state
     */
    displayPizza() {
        const pizzaX = this.game.config.width / 4;
        const pizzaY = this.game.config.height / 2;
    
        // Ensure the pizza object has the necessary properties
        if (!this.pizza) {
            console.warn('No pizza data provided to CookStation!');
            return;
        }
    
        // Clear existing pizza images
        if (this.baseImage) {
            this.baseImage.destroy();
        }
        if (this.sauceImage) {
            this.sauceImage.destroy();
        }
        if (this.cheeseImage) {
            this.cheeseImage.destroy();
        }
    
        // Load and display the pizza base
        if (!this.pizza.cooked) {
            this.baseImage = this.add.image(pizzaX, pizzaY, 'pizzaBase')
                .setScale(0.5)
                .setOrigin(0.5);
        } else {
            this.baseImage = this.add.image(pizzaX, pizzaY, 'pizzaBaseCooked')
                .setScale(0.5)
                .setOrigin(0.5);
        }
    
        // Add sauce if defined in the pizza object
        if (this.pizza.sauce) {
            this.sauceImage = this.add.image(pizzaX, pizzaY, 'pizzaSauce')
                .setScale(0.5 * 3)
                .setOrigin(0.5);
        }
    
        // Add cheese if defined in the pizza object
        if (this.pizza.cheese && !this.pizza.cooked) {
            this.cheeseImage = this.add.image(pizzaX, pizzaY, 'cheeseUncooked')
                .setScale(0.5 * 2.3)
                .setOrigin(0.5);
        } else {
            this.cheeseImage = this.add.image(pizzaX, pizzaY, 'cheeseCooked')
                .setScale(0.5 * 1.7)
                .setOrigin(0.5);
        }
    
        // Display a message indicating the pizza is being displayed
        this.add.text(100, 50, 'Pizza is ready to cook!', { fontSize: '32px', fill: '#fff' });
    }
}
