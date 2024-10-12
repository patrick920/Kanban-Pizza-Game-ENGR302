import PrepareStation from './PrepareStation.js'; // Import the PrepareStation class

export default class Pizza extends Phaser.GameObjects.Container{
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
        super(scene, x, y);
        this.scene = scene;
        this.x = x;
        this.y = y;

        // Initialize sauce as null to track if it has been added
        this.sauce = null;
        this.cheese = null;

        // Define the size of the pizza base based on the size parameter
        this.size = size;
        // Add the pizza base image and make it interactive
        console.log(this.scene);
        this.base = null;
        this.toppings = [];
        this.cookingState = 'raw'; // 'raw', 'cooked', or 'burnt'
        this.createBase();  
        scene.add.existing(this);
    }

    createBase() {
        const scale = this.size === 'small' ? 0.5 : 0.75;
        this.base = this.scene.add.image(0, 0, 'pizzaBase')
            .setScale(scale)
            .setInteractive();
        this.add(this.base);
    }

    addSauce() {
        if (!this.sauce) {
            const scale = this.size === 'small' ? 1.5 : 2.25;
            this.sauce = this.scene.add.image(0, 0, 'pizzaSauce').setScale(scale);
            this.add(this.sauce);
        }
    }

    addCheese() {
        if (!this.cheese) {
            const scale = this.size === 'small' ? 1.15 : 1.725;
            this.cheese = this.scene.add.image(0, 0, 'cheeseUncooked').setScale(scale);
            this.add(this.cheese);
        }
    }

    addTopping(toppingKey) {
        const scale = this.size === 'small' ? 0.15 : 0.225;
        const randomX = Phaser.Math.Between(this.x - this.base.displayWidth / 2, this.x + this.base.displayWidth / 2);
        const randomY = Phaser.Math.Between(this.y - this.base.displayHeight / 2, this.y + this.base.displayHeight / 2);
        const topping = this.scene.add.image(randomX, randomY, toppingKey).setScale(scale);
        this.add(topping);
        this.toppings.push(topping);
        
    }

    isOnPizza(item) {
        const itemBounds = item.getBounds();
        const pizzaBounds = this.getBounds();
        return Phaser.Geom.Intersects.RectangleToRectangle(itemBounds, pizzaBounds);
    }

    displayInScene() {
        this.setVisible(true);
    }

    hideInScene() {
        this.setVisible(false);
    }

    cook() {
        if (this.cookingState === 'raw') {
            this.cookingState = 'cooked';
            this.updateAppearance();
        } else if (this.cookingState === 'cooked') {
            this.cookingState = 'burnt';
            this.updateAppearance();
        }
    }

    updateAppearance() {
        if (this.cookingState === 'cooked') {
            this.base.setTexture('pizzaBaseCooked');
            if (this.cheese) {
                this.cheese.setTexture('cheeseCooked');
            }
        } else if (this.cookingState === 'burnt') {
            this.base.setTexture('pizzaBaseBurnt');
        }
    }

    isBurnt() {
        return this.cookingState === 'burnt';
    }

    isCooked() {
        return this.cookingState === 'cooked';
    }

    toJSON() {
        return {
            x: this.x,
            y: this.y,
            size: this.size,
            hasSauce: !!this.sauce,
            hasCheese: !!this.cheese,
            toppings: this.toppings.map(t => t.texture.key),
            cookingState: this.cookingState
        };
    }

    static fromJSON(scene, data) {
        const pizza = new Pizza(scene, data.x, data.y, data.size);
        if (data.hasSauce) pizza.addSauce();
        if (data.hasCheese) pizza.addCheese();
        data.toppings.forEach(topping => pizza.addTopping(topping));
        pizza.cookingState = data.cookingState;
        return pizza;
    }
/*
    destroy() {
        this.base.destroy();
        if (this.sauce) this.sauce.destroy();
        if (this.cheese) this.cheese.destroy();
        this.toppings.forEach(topping => topping.destroy());
    } */ 
    /**
     * Fill the sauce in
     * @param {*} mouseX 
     * @param {*} mouseY 
     */
    fillSauce(mouseX, mouseY) {
        // Check if sauce should be added (e.g., check condition from a station class)
        if (this.sauce === null) {
            const scale = this.size === 'small' ? 1.5 : 2.25;
            this.sauce = this.scene.add.image(this.x, this.y, 'pizzaSauce').setScale(scale);
        }
    }

    /**
     * Fill the cheese in
     * @param {*} mouseX 
     * @param {*} mouseY 
     */
    fillCheese(mouseX, mouseY) {
        // Check if cheese should be added (e.g., check condition from a station class)
        if (this.cheese === null) {
            const scale = this.size === 'small' ? 1.15 : 1.725;
            this.cheese = this.scene.add.image(this.x, this.y, 'cheeseUncooked').setScale(scale);
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
}


// class Pizza {
//     constructor(scene, x, y, size) {
//         this.scene = scene;
//         this.x = x;
//         this.y = y;

//         // Define the size of the pizza base based on the size parameter
//         if (size === 'small') {
//             this.scale = 0.5;  // Small size scale
//         } else if (size === 'large') {
//             this.scale = 0.75;  // Large size scale
//         } else {
//             throw new Error('Invalid pizza size');
//         }

//         // Add the pizza base image
//         this.base = this.scene.add.image(this.x, this.y, 'pizzaBase')
//             .setScale(this.scale)
//             .setInteractive();

//         // Initialize the sauce but keep it hidden (we'll reveal it with the mask)
//         this.sauce = this.scene.add.image(this.x, this.y, 'pizzaSauce')
//             .setScale(this.scale * 3)
//             .setAlpha(1);  // Sauce is fully visible, but we will mask it

//         // Create a graphics object to use as a mask (initially empty)
//         this.sauceMask = this.scene.make.graphics({
//             x: 0,
//             y: 0,
//             add: false  // We don't need to render this directly
//         });

//         // Apply the mask to the sauce image
//         this.sauce.mask = new Phaser.Display.Masks.GeometryMask(this.scene, this.sauceMask);

//         // Add mouse input to reveal sauce as you move/click
//         this.scene.input.on('pointermove', (pointer) => {
//             this.revealSauce(pointer.x, pointer.y);
//         });

//         this.scene.input.on('pointerdown', (pointer) => {
//             this.revealSauce(pointer.x, pointer.y);  // Also reveal sauce on click
//         });
//     }

//     revealSauce(mouseX, mouseY) {
//         // Draw a filled circle in the mask to reveal a part of the sauce
//         const radius = 30;  // You can change the size of the "revealed" area here

//         // Use graphics to draw a filled circle at the mouse position in the mask
//         this.sauceMask.fillStyle(0xffffff);  // The mask is drawn in white
//         this.sauceMask.beginPath();
//         this.sauceMask.arc(mouseX, mouseY, radius, 0, Math.PI * 2);  // Reveal circle
//         this.sauceMask.closePath();
//         this.sauceMask.fillPath();
//     }
// }

