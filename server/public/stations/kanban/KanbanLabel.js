/*
 * This class will be used to store labels on the Kanban board.
 * Each label will be stored as a Phaser Container.
 * There will be a button on each Kanban label to go the corresponding station of the column it's
 * currently in.
 * 
 * Sources:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
 */

import { makeDraggable } from './draggable.js';
//From ChatGPT:
import { GAP_BETWEEN_COLUMN_RECTANGLES, ADDITIONAL_GAP_BESIDE_COLUMN_RECTANGLES_LEFT_RIGHT_SCREEN,
    GAP_BETWEEN_COLUMN_AND_LABELS, LABEL_WIDTH, COLUMN_RECTANGLE_WIDTH } from './KanbanBoard.js';
//import KanbanBoard from './KanbanBoard.js';

export default class KanbanLabel {
    //TODO: Add the Ticket/Label object that will be created by the Pizza order.
    //For now, maybe have a test constructor that initialises dummy things such as text.

    container;

    //constructor(){
    //    //This constructor will take the ticket/label object for the Pizza order.
    //}

    /**
     * This is a TEST constructor. The proper one will take the ticket/label object for the Pizza order, and will be
     * instantiated when a pizza order is submitted (when the player takes the order from the customer.)
     * @param {*} kanbanStation Reference to the KanbanStation object.
     * @param {*} height The height can be set, but the width is fixed to the column width.
     * @param {*} columnIndex Index of the column on the Kanban board, can be 0 to 5 (as there are 6 columns.)
     * @param {*} labelList List of text labels to be displayed (not currently implemented fully.)
     */
    constructor(kanbanStation, height, columnIndex, labelList){
        this.kanbanStation = kanbanStation
        this.labelList = labelList
        this.columnIndex = columnIndex
        this.height = height
        console.log("DEBUG: KanbanLabel object created.");

        //-----------------------------------------
        //Some code from ChatGPT taken and modified.
        //Create the Phaser Container which contains all elements for this.
        this.container = kanbanStation.add.container(200, height);
        const graphics = kanbanStation.add.graphics();
        //Source: Google RGB color picker.
        graphics.fillStyle(0x3e81e6, 1);  // blue color
        graphics.fillRect(0, 0, LABEL_WIDTH, height);  // x, y, width, height
        //TODO: Do the dimensions for items in the container need to be relative to the container or the entire screen?

        //Add the rectangle for the label to the container.
        this.container.add(graphics);

        //Add text labels inside the container.
        const label1 = kanbanStation.add.text(0, 0, 'Label 1', { fontSize: '20px', fill: '#ffffff' });
        const label2 = kanbanStation.add.text(0, 30, 'Label 2', { fontSize: '20px', fill: '#ffffff' });

        // Add text labels to the container
        this.container.add([label1, label2]);

        //Set the container's size, as otherwise it prevents the Container from being draggable.
        this.container.setSize(LABEL_WIDTH, height);

        //Code to make the Container draggable, using the draggable.js file which worked successfully
        //for a basic rectangle.
        this.container.name = 'Kanban Label'
        //Can see the name above being logged in the log statement in the "destroy" function in draggable.js.
        //makeDraggable(this.container, true); //true to log.
        makeDraggable(this.container, false); //False to not log any messages in the console.

        //TODO: Create the button that leads to a particular scene.
    }

    /**
     * Display the label on the specified y position on the Kanban board.
     */
    drawLabelOnKanbanBoard(yPos){
        this.container.x = GAP_BETWEEN_COLUMN_RECTANGLES + 
                            ADDITIONAL_GAP_BESIDE_COLUMN_RECTANGLES_LEFT_RIGHT_SCREEN +
                            GAP_BETWEEN_COLUMN_AND_LABELS +
                            this.columnIndex * (COLUMN_RECTANGLE_WIDTH + GAP_BETWEEN_COLUMN_RECTANGLES);
        //Only need to set the container's y because everything else will move with the container.
        this.container.y = yPos;
    }

    //TODO: Create list of buttons to each of the stations. These will changed based on which column the label is on.

    //TODO: Create a function to change classes. This could be static as the functionality will be the same everywhere.
    //But for simplicity, might be easier not to make it static at this stage. No, don't make it static.

    //TODO: Create a KanbanBoard class and copy and pasted the KanbanStation code to there for layout and positioning.
}