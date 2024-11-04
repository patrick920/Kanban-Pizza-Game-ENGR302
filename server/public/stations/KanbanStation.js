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
//import { KanbanBoard } from './kanban/KanbanBoard.js';
import KanbanBoard from './kanban/KanbanBoard.js';
import KanbanLabel from './kanban/KanbanLabel.js';
import Ticket from './Ticket.js';
import { kanbanLabelsList } from './kanban/KanbanBoard.js';

export default class KanbanStation extends Station {
    constructor() {
        super({ key: 'KanbanStation' });
        this.tasks = [];
        this.prepTickets = [];
        this.cookTickets = [];
        this.reviewTickets = [];
        this.serviceTickets = []; 
        this.completedTickets = []; 
        //Create the Kanban board here so it can be accessed throughout the duration of the code.
        this.kanbanBoard = new KanbanBoard(this);
    }

    //const TOP_TO_TITLE_GAP = 10;

    preload() {
        // // load tomato paste image
        // this.load.image('tomatoPaste', 'stations/assets/tomato_paste.png');
    }

    create() {
        this.createBackground();

        //const kanbanBoard = new KanbanBoard(this);
        //this.kanbanBoard = new KanbanBoard(this);
        this.kanbanBoard.createKanbanBoard();

        //Add test labels to the Kanban Board code.
        //For now comment this out, as these are just test labels not labels for pizza orders.
        //this.kanbanBoard.createTestLabels();

        //Display the labels on the Kanban Board.
        this.kanbanBoard.displayLabels();

        //Setup drag functionality for Kanban Board labels.
        this.kanbanBoard.setupDragFunctionality();

        //-----------------------------------------------------------
        //Test object only.
        //-----------------------------------------------------------

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

            this.add.text(1000, this.game.config.height - 50, 'Show Tickets', { fontSize: '20px', fill: '#fff', fontFamily: 'Calibri', backgroundColor: '#000' })
            .setInteractive()
            .on('pointerdown', () => {
            console.log('tickets:', this.prepTickets);
            });
        
        //-----------------------------------------------------------
        //Phaser Draggable Container Object
        //-----------------------------------------------------------

        //Code below from ChatGPT:
        // Create a Phaser Container positioned at (200, 200)
        this.container = this.add.container(500, 700);

        // Create a background rectangle for visual clarity (optional)
        const graphics = this.add.graphics();
        graphics.fillStyle(0x3498db, 1);  // blue color
        graphics.fillRect(-50, -50, 200, 100);  // x, y, width, height

        // Add the rectangle to the container
        this.container.add(graphics);

        // Add two text labels inside the container
        const label1 = this.add.text(0, 0, 'Label 1', { fontSize: '20px', fill: '#ffffff' });
        const label2 = this.add.text(0, 30, 'Label 2', { fontSize: '20px', fill: '#ffffff' });

        // Add text labels to the container
        this.container.add([label1, label2]);

        // Adjust the container's scale
        this.container.setScale(1.5);

        // Adjust container rotation for demonstration
        this.container.setAngle(15);

        //Set the container's size, as otherwise it prevents the Container from being draggable.
        this.container.setSize(200, 100);

        //Code to make the Container draggable, using the draggable.js file which worked successfully
        //for a basic rectangle.
        //Can see the name the below being logged in the log statement in the "destroy" function in draggable.js.
        this.container.name = 'Basic Phaser Container With Text'
        makeDraggable(this.container, true); //true to log.

        // // Enable drag for the container
        // this.input.setDraggable(this.container);

        // // Listen for drag events
        // this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
        //     gameObject.x = dragX;
        //     gameObject.y = dragY;
        // });
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

        //Put the contents of the 6 1D lists for tickets into the 2D list responsible for actually displaying things
        //on the Kanban board. Then, call a function to REDRAW EVERYTHING ON THE KANBAN BOARD.
        // kanbanLabelsList[0] = this.tasks;
        // kanbanLabelsList[1] = this.prepTickets;
        // kanbanLabelsList[2] = this.cookTickets;
        // kanbanLabelsList[3] = this.reviewTickets;
        // kanbanLabelsList[4] = this.serviceTickets;
        // kanbanLabelsList[5] = this.completedTickets;
        //this.putTicketsInKanbanLabelList(0, this.tasks);

        //Redraw everything on the Kanban board.
    }

    //Put tickets in the Kanban label list.
    putTicketsInKanbanLabelList(colIndex, ticketList){
        console.log("putTicketsInKanbanLabelList function called. colIndex = " + colIndex + " | ticketList = " +
                    ticketList);
        //Clear out existing Kanban labels within the Kanban board.
        //TODO: This will likely reset the drag and drop code, so will need a workaround!!!
        kanbanLabelsList[colIndex] = [];

        for(let i = 0; i < ticketList.length; i++){
            //TODO: Will need to get pizza order number, number of pepperoni and number of mushroom.
            kanbanLabelsList[colIndex][i] = new KanbanLabel(this, 100, colIndex, "EXAMPLE TICKET");
        }
    }

    // Adding functionality for tickets 
    // Add ticket to kanban board
    addTicket(ticket) {
        console.log("Add ticket to the Kanban board for pizza order.");
        if (ticket instanceof Ticket) {
            this.prepTickets.push(ticket);
        } else {
            throw new Error('Only Ticket objects can be added.');
        }
        //TODO: This is where the ticket is added.
        //Update the Kanban board.
        //this.updateKanbanDisplay();

        //let currentPizza = ticket.getPizza();
        //Where are the requested topping stored?
        let currentOrder = ticket.getOrder();
        console.log("currentOrder.orderId = " + currentOrder.orderId); //Not relevant for now.
        console.log("currentOrder.pizzaType = " + currentOrder.pizzaType); // Not relevant for now.
        console.log("currentOrder.toppings = " + currentOrder.toppings);
        let currentToppings = currentOrder.toppings;
        for(let i = 0; i < currentToppings.length; i++){
            let topping = currentToppings[i];
            console.log("i = " + i + " | Topping: " + topping);
        }

        //Code below from ChatGPT:
        // Function to get values for a specific key
        // Find the 'Pizza' entry and store its quantity in a variable
        const pizzaEntry = currentToppings.find(item => item.topping === 'Pizza');
        const pizzaQuantity = pizzaEntry ? pizzaEntry.quantity : 0;
        console.log("pizzaQuantity = " + pizzaQuantity);

        const pepperoniEntry = currentToppings.find(item => item.topping === 'Pepperoni');
        const pepperoniQuantity = pepperoniEntry ? pepperoniEntry.quantity : 0;
        console.log("pepperoniQuantity = " + pepperoniQuantity);

        const mushroomEntry = currentToppings.find(item => item.topping === 'Mushroom');
        const mushroomQuantity = mushroomEntry ? mushroomEntry.quantity : 0;
        console.log("mushroomQuantity = " + mushroomQuantity);

        //Need to make sure the code works if the toppings are flipped the wrong way around.

        //For now ignore the fact that there could be multiple pizzas in an order. Could sort this later.

        //New code:
        //Add the ticket to the first column of the 2D "kanbanLabelsList".
        kanbanLabelsList[0].push(new KanbanLabel(this, this.kanbanBoard, 81, 0, [
            "Order #",
            pizzaQuantity + " pizza(s) with:",
            pepperoniQuantity + " pepperoni",
            mushroomQuantity + " mushroom(s)"
        ]));
        this.kanbanBoard.debugPrintKanbalLabelsListContent(0); //Print the first column for debugging purposes.
   }
   
   // Moves ticket to the next stations array
   nextStation(ticket) {
    if (this.prepTickets.includes(ticket)) {
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
