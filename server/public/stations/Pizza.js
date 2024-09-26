export default class Pizza {
    toppings = []; // Array to store toppings
    base;
    sauce;
    filledSauceGraphics;
    scene;

    constructor(scene, x, y, size) {
        this.scene = scene;
        this.x = x;
        this.y = y;

        // Define the size of the pizza base based on the size parameter
        let scale;
        if (size === 'small') {
            scale = 0.5;  // Small size scale
        } else if (size === 'large') {
            scale = 0.75;  // Large size scale
        } else {
            throw new Error('Invalid pizza size');
        }

        // Add the pizza base image
        this.base = this.scene.add.image(this.x, this.y, 'pizzaBase').setScale(scale);

        // Add the sauce image
        this.sauce = this.scene.add.image(this.x, this.y, 'pizzaSauce').setScale(scale*3);

        // Enable input for the sauce image
        this.sauce.setInteractive();

        // Create a graphics object to act as the mask
        this.filledSauceGraphics = this.scene.add.graphics();

        // Listen for mouse movements to fill in the sauce
        this.scene.input.on('pointermove', (pointer) => {
            // Check if the pointer is over the sauce
            if (this.sauce.getBounds().contains(pointer.x, pointer.y)) {
                this.fillSauce(pointer.x - this.x, pointer.y - this.y); // Fill the sauce at the relative mouse position
            }
        });
    }

    fillSauce(mouseX, mouseY) {
        // Clear previous graphics
        this.filledSauceGraphics.clear();

        // Define the radius of the reveal area
        const radius = 20;

        // Draw a filled circle at the mouse position
        this.filledSauceGraphics.fillStyle(0xffffff); // White color for the reveal (or use any color if needed)
        this.filledSauceGraphics.fillCircle(mouseX, mouseY, radius); // Fill circle at mouse position

        // Create a mask to reveal the sauce
        const maskTexture = this.filledSauceGraphics.generateTexture('maskTexture', radius * 2, radius * 2);
        const mask = this.scene.make.graphics({ x: 0, y: 0 });
        mask.fillStyle(0xffffff);
        mask.fillCircle(mouseX, mouseY, radius);

        // Set the mask to the pizzaSauce sprite
        this.sauce.setMask(mask.createGeometryMask());

        // Clean up the graphics object after creating the mask
        this.filledSauceGraphics.clear();
    }

    addTopping(toppingKey) {
        // Add a topping at a random position within the pizza
        const randomX = Phaser.Math.Between(this.x - this.base.displayWidth / 2, this.x + this.base.displayWidth / 2);
        const randomY = Phaser.Math.Between(this.y - this.base.displayHeight / 2, this.y + this.base.displayHeight / 2);
        const topping = this.scene.add.image(randomX, randomY, toppingKey).setScale(0.3);
        this.toppings.push(topping);
    }
}
