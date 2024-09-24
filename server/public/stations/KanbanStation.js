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
import { makeDraggable } from './kanban/draggable.js';

//Source: https://www.w3schools.com/js/js_const.asp
const TOP_TO_TITLE_GAP = 10;
const TITLE_TEXT_HEIGHT = 40;
const TITLE_TO_COLUMN_TITLES_HEIGHT = 10;
const COLUMN_TITLES_TEXT_HEIGHT = 15;
//The width of the Kanban board column.
const COLUMN_RECTANGLE_WIDTH = 200;
//The gap between the Kanban board column and the menu at the bottom of the screen.
const COLUMN_RECTANGLES_TO_MENU_GAP = 10;
//Y position for the start of the buttons for the menu at the bottom of the screen.
const Y_MENU_START = 100;

export default class KanbanStation extends Station {
    constructor() {
        super({ key: 'KanbanStation' });
        this.tasks = [];
        this.orderTickets = [];
        this.prepTickets = [];
        this.cookTickets = [];
        this.reviewTickets = [];
        this.serviceTickets = []; 
        this.completedTickets = []; 
    }

    //const TOP_TO_TITLE_GAP = 10;

    preload() {
        // // load tomato paste image
        // this.load.image('tomatoPaste', 'stations/assets/tomato_paste.png');
    }

    create() {
        this.createBackground();

        // Game logic here
        //Changed from 100, 100 to 800, 100
        //Source: https://newdocs.phaser.io/docs/3.80.0/focus/Phaser.GameObjects.GameObjectFactory-text
        //Source: https://newdocs.phaser.io/docs/3.80.0/Phaser.Types.GameObjects.Text.TextStyle
        //Some code from ChatGPT:
        //650 as this is the middle.
        const titleText = this.add.text(650, TOP_TO_TITLE_GAP, 'Kanban Board', { fontSize: '40px', fontFamily: 'Calibri', fill: '#fff' });

         //Set the X origin to the center of the text. This makes it easier to centre it. Keep the Y origin to the top.
        titleText.setOrigin(0.5, 0);

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

        //Add rectangle to the screen. This rectangle can be dragged around if you hold click and move your mouse.
        //The code to update the rectangle's position when it is dragged is in "draggable.js".
        //Code below from: https://www.youtube.com/watch?v=jWglIBp4usY&ab_channel=ScottWestover
        const rectangle = this.add.rectangle(this.scale.width / 2, this.scale.height / 2, 250, 50, 0xffff00);
        rectangle.name = 'test' //Can see the name "test" being logged in the log statement in the "destroy" function in draggable.js.
        makeDraggable(rectangle, true); //true to log.
        this.add
            .text(this.scale.width / 2, 550, 'try dragging the rectangle around the scene', {
                align: 'center',
                fontSize: '22px',
                wordWrap: {
                    width: this.scale.width - 50,
                },
            })
            .setOrigin(0.5);
            // setTimeout(() => {
            //   this.scene.restart();
            // }, 3000)
        
        //Add the 6 rectangles or other objects to represent the columns on the Kanban board.
        //Source: https://newdocs.phaser.io/docs/3.80.0/focus/Phaser.GameObjects.GameObjectFactory-rectangle
        // this.orderTickets = [];
        // this.prepTickets = [];
        // this.cookTickets = [];
        // this.reviewTickets = [];
        // this.serviceTickets = []; 
        // this.completedTickets = []; 
        //rectangle([x], [y], [width], [height], [fillColor], [fillAlpha])
        //TODO: Height should be x top minus x bottom.

        //The Y position for the TOP of the Kanban board column rectangle.
        const Y_TOP_COLUMN_RECTANGLES = TOP_TO_TITLE_GAP + TITLE_TEXT_HEIGHT + TITLE_TO_COLUMN_TITLES_HEIGHT + COLUMN_TITLES_TEXT_HEIGHT;
        console.log("Y_TOP_COLUMN_RECTANGLES = " + Y_TOP_COLUMN_RECTANGLES);
        
        //Some stuff from ChatGPT.
        const Y_BOTTOM_COLUMN_RECTANGLES = this.scale.height - (COLUMN_RECTANGLES_TO_MENU_GAP + Y_MENU_START);
        console.log("Y_BOTTOM_COLUMN_RECTANGLES = " + Y_BOTTOM_COLUMN_RECTANGLES);
        //The height of the column rectangles for the Kanban board.
        const COLUMN_RECTANGLE_HEIGHT = Y_BOTTOM_COLUMN_RECTANGLES - Y_TOP_COLUMN_RECTANGLES;
        console.log("COLUMN_RECTANGLE_HEIGHT = " + COLUMN_RECTANGLE_HEIGHT);

        let current_X_start_pos = 0; //TODO: FINISH THIS!!! //Will increment as you move over.

        const orderColumnRectangle = this.add.rectangle(20, Y_TOP_COLUMN_RECTANGLES, COLUMN_RECTANGLE_WIDTH, COLUMN_RECTANGLE_HEIGHT, 0x4fa632);
        orderColumnRectangle.setOrigin(0, 0);

        //cureentXStartPos += ___ + ___;

        //From ChatGPT:
        //To create labels, use the "Container" object.
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

    // Adding functionality for tickets 
    // Add ticket to kanban board
    addTicket(ticket) {
        if (ticket instanceof Ticket) {
            this.orderTickets.push(ticket);
        } else {
            throw new Error('Only Ticket objects can be added.');
        }
   }
   
   // Moves ticket to the next stations array
   nextStation(ticket) {
    if (this.orderTickets.includes(ticket)) {
        // Move from Order to Prep
        this.orderTickets.splice(this.orderTickets.indexOf(ticket), 1);
        this.prepTickets.push(ticket);
        // ticket.getPizza().nextStation(); 
    } else if (this.prepTickets.includes(ticket)) {
        // Move from Prep to Cook
        this.prepTickets.splice(this.prepTickets.indexOf(ticket), 1);
        this.cookTickets.push(ticket);
        // ticket.getPizza().nextStation();  
    } else if (this.cookTickets.includes(ticket)) {
        // Move from Cook to Review
        this.cookTickets.splice(this.cookTickets.indexOf(ticket), 1);
        this.reviewTickets.push(ticket);
        // ticket.getPizza().nextStation(); 
    } else if (this.reviewTickets.includes(ticket)) {
        // Move from Review to Service
        this.reviewTickets.splice(this.reviewTickets.indexOf(ticket), 1);
        this.serviceTickets.push(ticket);
        // ticket.getPizza().nextStation(); 
    } else if (this.serviceTickets.includes(ticket)) {
        // Move from Service to Completed
        this.serviceTickets.splice(this.serviceTickets.indexOf(ticket), 1);
        this.completedTickets.push(ticket);
        // ticket.getPizza().nextStation(); 
    } else {
        // Ticket not found in any array
        throw new Error('Ticket not found in any station.');
    }

    // Update the display after moving the ticket
    this.updateKanbanDisplay();
}

    // Complete ticket
    completeTicket(ticket) {
        const index = this.serviceTickets.indexOf(ticket);
        if (index > -1) {
            this.tickets.splice(index, 1); // Remove the ticket if found
            this.completedTickets.push(ticket);
        } else {
            throw new Error('Ticket not found.');
        }
    }

}
