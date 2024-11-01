//Code below copied from ChatGPT:
// DraggableObject.js

// DraggableObject.js

export function makeDraggable(gameObject, allowHorizontalDrag = true, allowVerticalDrag = true) {
    // Enable input on the object so it can register pointer events
    gameObject.setInteractive();

    // Variables to hold the initial drag offset
    let offsetX = 0;
    let offsetY = 0;

    // Function to start dragging
    const startDrag = (pointer) => {
        if (gameObject.getBounds().contains(pointer.x, pointer.y)) {
            // Calculate the offset only if the pointer is within the object bounds
            offsetX = pointer.x - gameObject.x;
            offsetY = pointer.y - gameObject.y;
            gameObject.setData('dragging', true);
        }
    };

    // Function to stop dragging
    const stopDrag = () => {
        gameObject.setData('dragging', false);
    };

    // Function to handle dragging
    const handleDrag = (pointer) => {
        if (gameObject.getData('dragging')) {
            // Update position based on the allowed drag directions
            if (allowHorizontalDrag) {
                gameObject.x = pointer.x - offsetX;
            }
            if (allowVerticalDrag) {
                gameObject.y = pointer.y - offsetY;
            }
        }
    };

    // Event listeners for pointer events
    gameObject.on('pointerdown', (pointer) => startDrag(pointer));
    gameObject.scene.input.on('pointerup', stopDrag);
    gameObject.scene.input.on('pointermove', (pointer) => handleDrag(pointer));
}

