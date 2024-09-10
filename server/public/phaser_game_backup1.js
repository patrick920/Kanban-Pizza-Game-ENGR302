//Code below from ChatGPT:
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

const game = new Phaser.Game(config);

// Store reference to the scene globally
let currentScene;

function preload() {
    this.load.image('pizza', 'assets/pizza.png');
}

function create() {
    currentScene = this;  // Store a reference to the scene for later use
}

//Code below from ChatGPT:
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to dynamically add the image, can be called externally
function addImageDynamically() {
    if (currentScene) {
        const image = currentScene.add.image(40, 40, 'pizza');
        image.setDisplaySize(80, 80); // Width: 80, Height: 80
        image.x = getRandomInt(100, 700);
        image.y = getRandomInt(100, 700);
    }
}

// class Example extends Phaser.Scene {
//     preload() {
//         // this.load.setBaseURL('https://labs.phaser.io');

//         // this.load.image('sky', 'assets/skies/space3.png');
//         // this.load.image('logo', 'assets/sprites/phaser3-logo.png');
//         // this.load.image('red', 'assets/particles/red.png');

//         //Code below from ChatGPT:
//         // Load the image with a key and the file path
//         this.load.image('pizza', 'assets/pizza.png');
//     }

//     create() {
//         // this.add.image(400, 300, 'sky');

//         // const particles = this.add.particles(0, 0, 'red', {
//         //     speed: 100,
//         //     scale: { start: 1, end: 0 },
//         //     blendMode: 'ADD'
//         // });

//         // const logo = this.physics.add.image(400, 100, 'logo');

//         // logo.setVelocity(100, 200);
//         // logo.setBounce(1, 1);
//         // logo.setCollideWorldBounds(true);

//         // particles.startFollow(logo);

//         // Add the image to the scene at position (400, 300)
//         this.add.image(400, 300, 'pizza');
//     }
// }

// const config = {
//     type: Phaser.AUTO,
//     width: 800,
//     height: 600,
//     scene: Example,
//     physics: {
//         default: 'arcade',
//         arcade: {
//             gravity: { y: 200 }
//         }
//     }
// };

// const game = new Phaser.Game(config);