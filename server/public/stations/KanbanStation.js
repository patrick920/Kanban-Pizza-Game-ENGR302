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
import KanbanBoard from './kanban/KanbanBoard.js';
import KanbanLabel from './kanban/KanbanLabel.js';
import Ticket from './Ticket.js';
import { kanbanLabelsList } from './kanban/KanbanBoard.js';

export default class KanbanStation extends Station {
    constructor() {
        super({ key: 'KanbanStation' }); 
        //Create the Kanban board here so it can be accessed throughout the duration of the code.
        this.kanbanBoard = new KanbanBoard(this);
    }

    //const TOP_TO_TITLE_GAP = 10;

    preload() {
        
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

        //Draw text with useful info.
        this.add.text(this.scale.width / 2, 550,
        'To create a label on the Kanban board, create and submit an order on the Order Station', {
            align: 'center',
            fontSize: '22px',
            wordWrap: {
                width: this.scale.width - 50,
            },
        }).setOrigin(0.5);
    }

    createBackground() {
        // Set a specific background color for the PrepareStation
        this.cameras.main.setBackgroundColor('#996600');
        //this.createPizzaBaseButton(); // Setup pizza base buttons
    }

    // Adding functionality for tickets 
    // Add ticket to kanban board
    addTicket(ticket) {
        console.log("Add ticket to the Kanban board for pizza order.");
        if (ticket instanceof Ticket) {
            console.log("Valid ticket.");
        } else {
            throw new Error('Only Ticket objects can be added.');
        }
        //TODO: This is where the ticket is added.

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
        kanbanLabelsList[0].push(new KanbanLabel(this, this.kanbanBoard, 81, 0, ticket, [
            "Order #",
            pizzaQuantity + " pizza(s) with:",
            pepperoniQuantity + " pepperoni",
            mushroomQuantity + " mushroom(s)"
        ]));
        this.kanbanBoard.debugPrintKanbalLabelsListContent(0); //Print the first column for debugging purposes.
   }
}
