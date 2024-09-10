const tasks = document.querySelectorAll('.task');
const columns = document.querySelectorAll('.column');

// Add event listeners for drag and drop
tasks.forEach(task => {
    task.addEventListener('dragstart', dragStart);
    task.addEventListener('dragend', dragEnd);
});

columns.forEach(column => {
    column.addEventListener('dragover', dragOver);
    column.addEventListener('drop', dragDrop);
});

let draggedTask = null;

function dragStart(event) {
    draggedTask = event.target;
    setTimeout(() => {
        event.target.style.display = 'none';
    }, 0);
}

function dragEnd(event) {
    setTimeout(() => {
        draggedTask.style.display = 'block';
        draggedTask = null;
    }, 0);
}

function dragOver(event) {
    event.preventDefault(); // Necessary to allow dropping
}

function dragDrop(event) {
    if (draggedTask) {
        event.target.appendChild(draggedTask);
    }
}
