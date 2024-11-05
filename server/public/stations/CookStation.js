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
        // designed by @ibrandify on FreePik
        this.load.image('button', 'stations/assets/button.png');
        // designed by @upklyak on FreePik
        this.load.image('tableBackground', 'stations/assets/wooden_table_background.jpg')
    }

    create() {
        this.add.text(100, 100, 'Cooka da pizza!', { fontSize: '32px', fill: '#fff' });

        // Navigation buttons (from Station.js)
        this.createNavigationTabs();

        // create cook pizza button
        this.createCookPizzaButton();

        // display the pizza in its current state
        this.displayPizza();

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

    // create cook pizza button
    createCookPizzaButton() {
        // Small Pizza Base Button
        const cookButton = this.add.image(300, 170, 'button') // Use your button image key here
            .setOrigin(0.5)
            .setScale(0.3)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.createPizza('small'))
            .on('pointerover', () => cookButton.setTint(0xffbb33)) // Hover effect
            .on('pointerout', () => cookButton.clearTint()); // Reset color on hover out
        
        const cookButtonText = this.add.text(300, 160, 'Cook Pizza', {
            fontSize: '20px',
            fill: '#000',
            fontFamily: 'Calibri',
            align: 'center'
        }).setOrigin(0.5); // Center the text on the button
    }

    cookPizza() {
        const cookedPizza = {
            id: Date.now(),
            status: 'Cooked'
        };
        this.game.socket.emit('pizzaCooked', cookedPizza);
    }

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

    // displayPizza() {
    //     // Display a test text to verify the function is being called
    //     this.add.text(100, 50, 'Display Pizza', { fontSize: '32px', fill: '#fff' });

    //     this.pizza.fillCheese(300, 300);
    
    //     // // Ensure the pizza object has the necessary properties
    //     // if (!this.pizza) {
    //     //     console.warn('No pizza data provided to CookStation!');
    //     //     return;
    //     // }
    
    //     // // Load and display the pizza base
    //     // this.baseImage = this.add.image(100, 100, 'pizzaBase')
    //     //     .setScale(this.scale)
    //     //     .setOrigin(0.5); // Center the base
    
    //     // // Add sauce if defined in the pizza object
    //     // if (this.pizza.sauce) {
    //     //     this.sauceImage = this.add.image(100, 100, 'pizzaSauce')
    //     //         .setScale(this.scale * 3)
    //     //         .setOrigin(0.5); // Center sauce on base
    //     // }
    
    //     // // Add cheese if defined in the pizza object
    //     // if (this.pizza.cheese) {
    //     //     this.cheeseImage = this.add.image(100, 100, 'cheeseUncooked')
    //     //         .setScale(this.scale * 2.3)
    //     //         .setOrigin(0.5); // Center cheese on sauce
    //     // }
    // }

    displayPizza() {
        // Ensure the pizza object has the necessary properties
        if (!this.pizza) {
            console.warn('No pizza data provided to CookStation!');
            return;
        }
    
        // Load and display the pizza base
        this.baseImage = this.add.image(100, 100, 'pizzaBase')
            .setScale(1) // Adjust scale as needed
            .setOrigin(0.5); // Center the base
    
        // Add sauce if defined in the pizza object
        if (this.pizza.sauce) {
            this.sauceImage = this.add.image(100, 100, 'pizzaSauce')
                .setScale(1) // Adjust scale as needed
                .setOrigin(0.5); // Center sauce on base
        }
    
        // Add cheese if defined in the pizza object
        if (this.pizza.cheese) {
            this.cheeseImage = this.add.image(100, 100, 'cheeseUncooked')
                .setScale(1) // Adjust scale as needed
                .setOrigin(0.5); // Center cheese on sauce
        }
    
        // Display a message indicating the pizza is being displayed
        this.add.text(100, 50, 'Pizza is ready to cook!', { fontSize: '32px', fill: '#fff' });
    }
    
    
}
