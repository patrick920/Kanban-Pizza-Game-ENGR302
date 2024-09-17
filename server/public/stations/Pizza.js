// Pizza.js
export default class Pizza extends Phaser.Scene {
    toppings = []; // can be filled with lots of different kind of toppings
    x;
    y;
    radius;
    colour;
    scene;

    constructor(scene, size){
        // construct the circle
        this.scene = scene;
        this.x = x;
        this.y = y;
        if (size == "small"){
            // construct small pizza
            this.radius = 100
        } else {
            // construct large pizza base
            this.radius = 200;
        }

        this.circle = this.scene.add.graphics();
        this.circle.fillStyle (0xffff00, 1);
        this.circle.fillCircle(this.x, this.y, this.radius);
    }

    // add the tomato paste (just click) the base and it will fill
    addTomatoPaste(){

    }

    // add a topping to the topping list

    //
}