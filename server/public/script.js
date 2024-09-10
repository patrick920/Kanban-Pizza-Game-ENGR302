const tasks = document.querySelectorAll('.task');
const columns = document.querySelectorAll('.column');

let draggedTask = null;

// Add drag start event listeners to all tasks
tasks.forEach(task => {
    task.addEventListener('dragstart', (e) => {
        draggedTask = e.target;
        setTimeout(() => {
            e.target.style.display = 'none'; // Hide the dragged task temporarily
        }, 0);
    });

    task.addEventListener('dragend', (e) => {
        setTimeout(() => {
            e.target.style.display = 'block'; // Show the dragged task again
            draggedTask = null;
        }, 0);
    });
});

// Allow the columns to accept dropping
columns.forEach(column => {
    column.addEventListener('dragover', (e) => {
        e.preventDefault(); // Prevent default to allow drop
    });

    column.addEventListener('drop', (e) => {
        if (draggedTask) {
            column.appendChild(draggedTask); // Move the task to the new column
        }
    });
});
