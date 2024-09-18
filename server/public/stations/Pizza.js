export default class Pizza {
    toppings = []; // Array to store toppings
    x;
    y;
    radius;
    circle;
    scene;

    constructor(scene, x, y, size) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        
        // Define the radius based on size
        if (size === 'small') {
            this.radius = 150;
        } else if (size === 'large') {
            this.radius = 200;
        } else {
            throw new Error('Invalid pizza size');
        }

        // Create the pizza base
        this.circle = this.scene.add.graphics();
        this.circle.fillStyle(0xffff00, 1); // Yellow color for pizza base
        this.circle.fillCircle(this.x, this.y, this.radius);

        // Create a graphics object for the tomato paste (if needed later)
        this.tomatoPaste = this.scene.add.graphics();
    }

    // Add the tomato paste to the pizza
    addTomatoPaste() {
        // Clear any existing tomato paste
        this.tomatoPaste.clear();
        
        // Draw the tomato paste on top of the pizza
        this.tomatoPaste.fillStyle(0xff0000, 1); // Red color for tomato paste
        this.tomatoPaste.fillCircle(this.x, this.y, this.radius * 0.8); // Slightly smaller than the pizza base
    }

    // Add a topping to the pizza
    addTopping(topping, xOffset, yOffset) {
        // Position the topping relative to the pizza's x and y coordinates
        const toppingX = this.x + xOffset;
        const toppingY = this.y + yOffset;

        // Create the topping graphic (this is an example, you can change the appearance)
        const toppingGraphic = this.scene.add.graphics();
        toppingGraphic.fillStyle(0x530000); // Red for pepperoni or other toppings
        toppingGraphic.fillCircle(toppingX, toppingY, 20); // Topping size

        // Add the topping to the array to keep track of it
        this.toppings.push(toppingGraphic);
    }
}
