// Phaser Game Configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload,
        create,
    }
};

const game = new Phaser.Game(config);

let labels = []; // Array to hold labels/cards

function preload() {
    // Preload assets if needed
}

function create() {
    // Create columns
    createKanbanColumns.call(this);  // Pass the scene context using call()

    // Create initial labels/cards
    createLabels.call(this);  // Pass the scene context using call()

    // Enable input and drag events
    this.input.on('pointerdown', pointerDownHandler, this);
    this.input.on('pointermove', pointerMoveHandler, this);
    this.input.on('pointerup', pointerUpHandler, this);
}

function createKanbanColumns() {
    // Example: Create columns
    const columns = [
        { name: 'To Do', x: 100, y: 100 },
        { name: 'In Progress', x: 300, y: 100 },
        { name: 'Done', x: 500, y: 100 }
    ];

    // Render columns on the screen
    columns.forEach(column => {
        const graphics = this.add.graphics();  // Now 'this' refers to the scene
        graphics.fillStyle(0x808080);
        graphics.fillRect(column.x, column.y, 200, 400);
    });
}

function createLabels() {
    const columns = [
        { name: 'To Do', x: 100, y: 100 },
        { name: 'In Progress', x: 300, y: 100 },
        { name: 'Done', x: 500, y: 100 }
    ];

    columns.forEach(column => {
        const label = this.add.text(column.x + 20, column.y + 20, 'Task 1', { fill: '#000' });
        label.setInteractive();
        labels.push({ label, column });
    });
}

function pointerDownHandler(pointer) {
    // Logic for handling pointer down event
    // Check if pointer is on a label
}

function pointerMoveHandler(pointer) {
    // Logic for handling pointer move event
    // Implement drag functionality
}

function pointerUpHandler(pointer) {
    // Logic for handling pointer up event
    // Implement drop functionality
    // Snap label to nearest column and update data structure
}
