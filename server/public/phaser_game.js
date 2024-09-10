// Phaser Game Configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload,
        create,
        update
    }
};

const game = new Phaser.Game(config);

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
        graphics.fillStyle(0x808080);
        graphics.fillRect(column.x, column.y, 200, 400);

        // Add column title
        this.add.text(column.x + 70, column.y - 20, column.name, { fontSize: '16px', fill: '#000' });
    });

    return columns;
}

function createLabels(columns) {
    // Create example labels inside the first column
    const tasks = ['Task 1', 'Task 2', 'Task 3'];
    tasks.forEach((task, index) => {
        const label = this.add.text(columns[0].x + 20, columns[0].y + 40 + (index * 40), task, { fill: '#000', backgroundColor: '#ffffff' });
        label.setInteractive();
        label.setPadding(10);
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
            // If dropped outside, snap it back to its original position
            const originalColumn = labels.find(l => l.label === selectedLabel).column;
            this.tweens.add({
                targets: selectedLabel,
                x: originalColumn.x + 20,
                y: originalColumn.y + 40 + (labels.filter(l => l.column === originalColumn).length * 40),
                duration: 300,
                ease: 'Power2',
                onComplete: () => {
                    selectedLabel.setDepth(0);
                    selectedLabel = null;
                }
            });
        }
    }
}

function update() {
    // Optional update logic if needed
}
