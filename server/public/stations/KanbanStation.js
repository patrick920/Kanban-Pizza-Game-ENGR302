/*
* Kanban Board Station.
* Patrick started working on this code. It was copied and pasted from Gabbie's "PrepareStation.js" code and then modified.
* 
* TODO: Need a custom amount of columns, and the ability to add or remove them as the game progresses, with a scrollbar.
* TODO: Each column should be able to have an arbitrary number of rectangles.
* TODO: Go on Trello to see inspiration for how they've done it.
*/
import Station from './Station.js';
import Pizza from './Pizza.js'; // Import the Pizza class

export default class KanbanStation extends Station {
    constructor() {
        super({ key: 'KanbanStation' });
        this.tasks = [];
    }

    preload() {
        // // load tomato paste image
        // this.load.image('tomatoPaste', 'stations/assets/tomato_paste.png');
    }

    create() {
        this.createBackground();

        // Game logic here
        this.add.text(100, 100, 'Kanban Board', { fontSize: '32px', fontFamily: 'Calibri', fill: '#fff' });

        // Navigation buttons (from Station.js)
        this.createNavigationTabs();

        // Create tomato paste image
        //this.createTomatoPasteBottle();

        // Create add task button
        const addTaskButton = this.add.text(100, 200, 'Add Task', { fontSize: '24px', fill: '#fff', backgroundColor: '#17a2b8' })
            .setInteractive()
            .on('pointerdown', () => this.addTask());

        // Listen for kanban tasks updates
        this.game.socket.on('kanbanTasksUpdate', (tasks) => {
            this.tasks = tasks;
            this.updateKanbanDisplay();
        });

        // Get initial game state
        this.game.socket.on('initialGameState', (gameState) => {
            this.tasks = gameState.kanbanTasks;
            this.updateKanbanDisplay();
        });
    }

    createBackground() {
        // Set a specific background color for the PrepareStation
        this.cameras.main.setBackgroundColor('#996600');
        //this.createPizzaBaseButton(); // Setup pizza base buttons
    }

    addTask() {
        const newTask = {
            id: Date.now(),
            description: 'New Task',
            status: 'To Do'
        };
        this.tasks.push(newTask);
        this.game.socket.emit('kanbanUpdate', this.tasks);
    }

    updateKanbanDisplay() {
        // Clear previous display
        if (this.taskTexts) {
            this.taskTexts.forEach(text => text.destroy());
        }
        this.taskTexts = [];

        // Display tasks
        this.tasks.forEach((task, index) => {
            const text = this.add.text(400, 100 + index * 30, `Task ${task.id}: ${task.description} - ${task.status}`, { fontSize: '18px', fill: '#fff' });
            this.taskTexts.push(text);
        });
    }

    /*
    createPizzaBaseButton() {
        const baseSmallButton = this.add.text(50, 200, 'Small Pizza Base', { fontSize: '20px', fill: '#000', fontFamily: 'Calibri', backgroundColor: '#ffd11a' })
            .setInteractive()
            .on('pointerdown', () => {
                this.createPizza('small');
            });
        const baseLargeButton = this.add.text(50, 250, 'Large Pizza Base', { fontSize: '20px', fill: '#000', fontFamily: 'Calibri', backgroundColor: '#ffd11a' })
            .setInteractive()
            .on('pointerdown', () => {
                this.createPizza('large');
            });
    }
    */
}
