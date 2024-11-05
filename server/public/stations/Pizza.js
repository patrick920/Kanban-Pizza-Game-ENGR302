import PrepareStation from './PrepareStation.js'; // Import the PrepareStation class

export default class Pizza {
    base;
    sauce;
    toppings = []; // Array to store toppings
    cheese;
    
    filledSauceGraphics;
    scene;

    /**
     * Make the pizza object
     * @param {*} scene 
     * @param {*} x 
     * @param {*} y 
     * @param {*} size 
     */
    constructor(scene, x, y, size) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.size = size;

        // Initialize sauce as null to track if it has been added
        this.sauce = null;
        this.cheese = null;

        // load the base of the pizza 
        //this.loadBase();
        // Define the size of the pizza base based on the size parameter
        if (this.size === 'small') {
            this.scale = 0.5;  // Small size scale
        } else if (size === 'large') {
            this.scale = 0.75;  // Large size scale
        } else {
            throw new Error('Invalid pizza size');
        }

        // Add the pizza base image and make it interactive
        console.log(this.scene);
        this.base = this.scene.add.image(this.x, this.y, 'pizzaBase')
            .setScale(this.scale)
            .setInteractive();

        // Add click event to the pizza base
        this.base.on('pointerdown', (pointer) => {
            this.fillSauce(pointer.x, pointer.y);  // Pass mouse position
            this.fillCheese(pointer.x, pointer.y);
        });  
    }

    /**
     * Preload images
     */
    preload() {
        // load tomato paste image
        this.load.image('tomatoPaste', 'stations/assets/sauce_bucket.png');
        // Load the pizza base image and toppings images
        this.load.image('pizzaBase', 'stations/assets/pizza_base_raw.png');
        this.load.image('pepperoniSlice', 'stations/assets/pepperoni_slice.png');
        this.load.image('mushroomSlice', 'stations/assets/mushroom_slice.png');
        this.load.image('cheeseUncooked', 'stations/assets/cheese_uncooked.png');
        // designed by @ibrandify on FreePik
        this.load.image('button', 'stations/assets/button.png');
        // designed by @upklyak on FreePik
        this.load.image('tableBackground', 'stations/assets/wooden_table_background.jpg')
    }

    /**
     * load the base of the pizza
     */
    loadBase(){
        // Define the size of the pizza base based on the size parameter
        if (this.size === 'small') {
            this.scale = 0.5;  // Small size scale
        } else if (size === 'large') {
            this.scale = 0.75;  // Large size scale
        } else {
            throw new Error('Invalid pizza size');
        }
    }

    /**
     * Fill the sauce in
     * @param {*} mouseX 
     * @param {*} mouseY 
     */
    fillSauce(mouseX, mouseY) {
        // Check if sauce should be added (e.g., check condition from a station class)
        if (this.scene.tomatoPasteOn && this.sauce === null) {
            // Add the sauce image if it doesn't exist yet
            this.sauce = this.scene.add.image(this.x, this.y, 'pizzaSauce').setScale(this.scale * 3);
            this.scene.removeCircle();
            this.scene.tomatoPasteOn = false;
        }
    }

    /**
     * Fill the cheese in
     * @param {*} mouseX 
     * @param {*} mouseY 
     */
    fillCheese(mouseX, mouseY) {
        // Check if sauce should be added (e.g., check condition from a station class)
        if (this.scene.cheeseOn && this.cheese === null) {
             // Add the sauce image if it doesn't exist yet
             this.cheese = this.scene.add.image(this.x, this.y, 'cheeseUncooked').setScale(this.scale * 2.3);
             this.scene.removeCircle();
             this.scene.cheeseOn = false;
        }
    }

     /**
     * Checks if topping is on pizza
     * @param {Phaser.GameObjects.Image} topping - The topping image to check
     * @returns {boolean} - True if the topping is on the pizza, false otherwise
     */
    isOnPizza(topping){
        // check if the placement of the pepperoni overlaps the pizza base image
        // Get the bounds of the topping and the pizza base
        const toppingBounds = topping.getBounds(); // Get the bounds of the topping
        const pizzaBounds = this.base.getBounds(); // Get the bounds of the pizza base

        // Check if the rectangles intersect (i.e., if they overlap)
        return Phaser.Geom.Intersects.RectangleToRectangle(toppingBounds, pizzaBounds);
    }

    /**
     * Add a topping to the pizza
     * @param {*} toppingKey 
     */
    addTopping(topping) {
        // Add a topping at a random position within the pizza
        // const randomX = Phaser.Math.Between(this.x - this.base.displayWidth / 2, this.x + this.base.displayWidth / 2);
        // const randomY = Phaser.Math.Between(this.y - this.base.displayHeight / 2, this.y + this.base.displayHeight / 2);
        // const topping = this.scene.add.image(randomX, randomY, toppingKey).setScale(0.3);
        this.toppings.push(topping);
        console.log(this.toppings);
    }

    displayPizza(){
        const button = this.add.text(100, 500, 'TEST TEXT', { fontSize: '24px', fill: '#000', backgroundColor: '#28a745' })

        this.loadBase();
        this.base = this.scene.add.image(this.x, this.y, 'pizzaBase')
        .setScale(this.scale);

        //if(this.sauce!=null){
            this.sauce = this.scene.add.image(this.x, this.y, 'pizzaSauce').setScale(this.scale * 3);
        //}

        //if(this.cheese!=null){
            this.cheese = this.scene.add.image(this.x, this.y, 'cheeseUncooked').setScale(this.scale * 2.3);
        //}
    }
}