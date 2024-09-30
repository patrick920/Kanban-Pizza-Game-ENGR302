export default class Pizza {
    constructor(scene, x, y, size) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.size = size;
        this.toppings = [];
        this.hasSauce = false;
        this.hasCheese = false;

        this.radius = size === 'small' ? 150 : 200;

        // Create the pizza base
        this.base = scene.add.graphics();
        this.base.fillStyle(0xffff00, 1); // Yellow color for pizza base
        this.base.fillCircle(this.x, this.y, this.radius);

        // Create a graphics object for the tomato paste
        this.sauce = scene.add.graphics();

        // Create a graphics object for the cheese
        this.cheese = scene.add.graphics();
    }

    addSauce() {
        this.hasSauce = true;
        this.sauce.clear();
        this.sauce.fillStyle(0xff0000, 1); // Red color for tomato sauce
        this.sauce.fillCircle(this.x, this.y, this.radius * 0.95);
    }

    addCheese() {
        this.hasCheese = true;
        this.cheese.clear();
        this.cheese.fillStyle(0xffff99, 1); // Light yellow color for cheese
        this.cheese.fillCircle(this.x, this.y, this.radius * 0.9);
    }

    addTopping(toppingType, x, y) {
        const topping = this.scene.add.graphics();
        if (toppingType === 'pepperoni') {
            topping.fillStyle(0x530000, 1); // Dark red for pepperoni
            topping.fillCircle(x, y, 20);
        } else if (toppingType === 'mushroom') {
            topping.fillStyle(0xd2b48c, 1); // Tan color for mushroom
            topping.fillCircle(x, y, 15);
        }
        this.toppings.push({ type: toppingType, graphic: topping });
    }

    getState() {
        return {
            size: this.size,
            hasSauce: this.hasSauce,
            hasCheese: this.hasCheese,
            toppings: this.toppings.map(t => ({ type: t.type, x: t.graphic.x, y: t.graphic.y }))
        };
    }

    destroy() {
        this.base.destroy();
        this.sauce.destroy();
        this.cheese.destroy();
        this.toppings.forEach(t => t.graphic.destroy());
    }
}