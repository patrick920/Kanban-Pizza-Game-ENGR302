//Code copied from ChatGPT:
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
let orderNum = 1;

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

    // Start scheduling tasks for the first column
    scheduleTask.call(this);  // Make sure to call the scheduling function here
}

function createKanbanColumns() {
    // Example: Define and render columns
    const columns = [
        { name: 'Take Orders Station', x: 100, y: 100 },
        { name: 'Toppings Station', x: 300, y: 100 },
        { name: 'Cooking Station', x: 500, y: 100 }
    ];

    // Draw the columns as rectangles
    columns.forEach(column => {
        const graphics = this.add.graphics();
        graphics.fillStyle(0xe6e6e6); // colour of collumn
        graphics.fillRect(column.x, column.y, 200, 400); // fill the collumn

        // Add column title
        this.add.text(column.x + 20, column.y - 20, column.name, { fontSize: '19px', fontFamily:'Calibri', fill: '#fff' });
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
    const tasks = ['Order 1', 'Order 2', 'Order 3'];
    //Remove this if you remove the set 3 tasks above
    orderNum = 3;
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

// Function to schedule a new task at random intervals
function scheduleTask() {
    // Change these to set max and min time to add random new task
    const secondsMin = 3000; // 3 seconds
    const secondsMax = 10000; // 10 seconds
    
    const randomTime = Phaser.Math.Between(secondsMin, secondsMax); // Random time between
    this.time.addEvent({
        delay: randomTime,
        callback: () => {
            addTaskToFirstColumn.call(this);
            scheduleTask.call(this); // Schedule the next task after this one
        },
        loop: false // This event should run once per call
    });
}

// Function to add a new task to the first column
function addTaskToFirstColumn() {
    // Change this to limit number of tasks
    const taskLimit = 9;

    const firstColumn = this.columns[0];
    const existingTasks = labels.filter(l => l.column === firstColumn).length; // Count existing tasks

    // Check if the task limit is reached
    if (existingTasks >= taskLimit) {
        return; // Stop adding new tasks if the task limit is reached
    }
    
    orderNum++;
    //const taskName = 'Order ' + (existingTasks + 1); // Create task name
    const taskName = 'Order ' + (orderNum); // Create task name

    const newLabel = this.add.text(
        firstColumn.x + 20,
        firstColumn.y + 40 + (existingTasks * 40), // Place new task below existing ones
        taskName,
        {
            fill: '#000',
            backgroundColor: '#ffffff',
            fontFamily: 'Calibri',
            fontSize: '18px',
            padding: { left: 10, right: 10, top: 5, bottom: 5 }
        }
    );

    newLabel.setInteractive();
    labels.push({ label: newLabel, column: firstColumn }); // Add a new label to the labels array
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
