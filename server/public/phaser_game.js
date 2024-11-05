//Code copied from ChatGPT:
//Import files using ES6, which is what our project is using:
// import { OrderStation } from './stations/OrderStation.js';
// import { CookStation } from './stations/CookStation.js';
// import { PrepareStation } from './stations/PrepareStation.js';
//Not using default export so no curly braces:
import OrderStation from './stations/OrderStation.js';
import CookStation from './stations/CookStation.js';
import PrepareStation from './stations/PrepareStation.js';
import KanbanStation from './stations/KanbanStation.js';
import ReviewStation from './stations/ReviewStation.js';

//Code copied from ChatGPT:
// Phaser Game Configuration
const config = {
    type: Phaser.AUTO,
    width: 1300,
    height: 650,
    // scene: {
    //     preload,
    //     create,
    //     update
    // },
    scene: [OrderStation, CookStation, PrepareStation, KanbanStation, ReviewStation]
};

class Game extends Phaser.Game {
    constructor(config) {
        super(config);
        
        // Initialize Socket.IO
        this.socket = io('http://localhost:3500');
        
        // Listen for connection
        this.socket.on('connect', () => {
            console.log('Connected to server');
        });
    }
}

//Code from ChatGPT:
export const game = new Game(config);

let labels = []; // Array to hold label objects with references to their positions and columns
let selectedLabel = null; // The label that is being dragged
let offsetX = 0;
let offsetY = 0;

function preload() {
    // Preload assets if needed
}

function create() {
    // Create Kanban columns
    this.columns = createKanbanColumns.call(this);

    // Create initial labels
    createLabels.call(this, this.columns);

    // Enable drag events
    this.input.on('pointerdown', pointerDownHandler, this);
    this.input.on('pointermove', pointerMoveHandler, this);
    this.input.on('pointerup', pointerUpHandler, this);
}

function createKanbanColumns() {
    // Example: Define and render columns
    const columns = [
        { name: 'To Do', x: 100, y: 100 },
        { name: 'In Progress', x: 300, y: 100 },
        { name: 'Done', x: 500, y: 100 }
    ];

    // Draw the columns as rectangles
    columns.forEach(column => {
        const graphics = this.add.graphics();
        graphics.fillStyle(0xe6e6e6); // colour of collumn
        graphics.fillRect(column.x, column.y, 200, 400); // fill the collumn

        // Add column title
        this.add.text(column.x + 60, column.y - 20, column.name, { fontSize: '19px', fontFamily:'Calibri', fill: '#fff' });
    });

    // Draw dividers between columns
    for (let i = 1; i < columns.length; i++) {
        const dividerGraphics = this.add.graphics();
        dividerGraphics.lineStyle(4, 0x000000, 1); // Black line with 4px width
        dividerGraphics.beginPath();
        dividerGraphics.moveTo(columns[i].x - 10, 100); // Start point of the line (adjust the x position slightly to place between columns)
        dividerGraphics.lineTo(columns[i].x - 10, 500); // End point of the line
        dividerGraphics.strokePath();
    }

    return columns;
}

function createLabels(columns) {
    // Create example labels inside the first column
    const tasks = ['Task 1', 'Task 2', 'Task 3'];
    tasks.forEach((task, index) => {
        const label = this.add.text(
            columns[0].x + 20, 
            columns[0].y + 40 + (index * 40), 
            task, 
            { 
                fill: '#000', 
                backgroundColor: '#ffffff', 
                fontFamily: 'Calibri', 
                fontSize: '18px',      
                padding: { left: 10, right: 10, top: 5, bottom: 5 }
            }
        );
        label.setInteractive();
        labels.push({ label, column: columns[0] }); // Track label and its column
    });
}

function pointerDownHandler(pointer, targets) {
    // Logic to handle the pointer down event
    if (targets.length > 0) {
        selectedLabel = targets[0]; // Select the label that was clicked
        offsetX = pointer.x - selectedLabel.x;
        offsetY = pointer.y - selectedLabel.y;

        // Bring the label to the top
        selectedLabel.setDepth(1);
    }
}

function pointerMoveHandler(pointer) {
    if (selectedLabel) {
        // Move the selected label with the pointer
        selectedLabel.x = pointer.x - offsetX;
        selectedLabel.y = pointer.y - offsetY;
    }
}

function pointerUpHandler(pointer) {
    if (selectedLabel) {
        // Check which column the label is dropped in
        let droppedColumn = null;
        this.columns.forEach(column => {
            if (pointer.x > column.x && pointer.x < column.x + 200 && pointer.y > column.y && pointer.y < column.y + 400) {
                droppedColumn = column;
            }
        });

        if (droppedColumn) {
            // Check for overlap with other labels in the same column
            const isOverlapping = labels.some(l => 
                l.column === droppedColumn && 
                l.label !== selectedLabel && 
                Phaser.Geom.Intersects.RectangleToRectangle(selectedLabel.getBounds(), l.label.getBounds())
            );

            if (!isOverlapping) {
                // Snap the label to the new column position
                this.tweens.add({
                    targets: selectedLabel,
                    x: droppedColumn.x + 20,
                    y: droppedColumn.y + 40 + (labels.filter(l => l.column === droppedColumn).length * 40),
                    duration: 300,
                    ease: 'Power2',
                    onComplete: () => {
                        // Update label's column reference
                        const labelObj = labels.find(l => l.label === selectedLabel);
                        labelObj.column = droppedColumn;
                        selectedLabel.setDepth(0);
                        selectedLabel = null;
                    }
                });
            } else {
                // If it overlaps, snap back to the original position
                const originalColumn = labels.find(l => l.label === selectedLabel).column;
                snapBackToOriginalPosition.call(this, selectedLabel, originalColumn);
            }
        } else {
            // If dropped outside, snap back to its original position
            const originalColumn = labels.find(l => l.label === selectedLabel).column;
            snapBackToOriginalPosition.call(this, selectedLabel, originalColumn);
        }
    }
}

function snapBackToOriginalPosition(label, column) {
    this.tweens.add({
        targets: label,
        x: column.x + 20,
        y: column.y + 40 + (labels.filter(l => l.column === column).length * 40),
        duration: 300,
        ease: 'Power2',
        onComplete: () => {
            label.setDepth(0);
            selectedLabel = null;
        }
    });
}


function update() {
    // Optional update logic if needed
}

// Function to dynamically add the image, can be called externally
export function addImageDynamically() {
    if (currentScene) {
        const image = currentScene.add.image(40, 40, 'pizza');
        image.setDisplaySize(80, 80); // Width: 80, Height: 80
        image.x = getRandomInt(100, 700);
        image.y = getRandomInt(100, 700);
    }
}

