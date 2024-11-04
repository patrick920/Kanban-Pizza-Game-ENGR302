/*
 * This class will be used to store labels on the Kanban board.
 * Each label will be stored as a Phaser Container.
 * There will be a button on each Kanban label to go the corresponding station of the column it's
 * currently in.
 * 
 * Sources:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
 */

//import { makeDraggable } from './draggable.js';
//From ChatGPT:
import { makeDraggable } from './DraggableObject.js';

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
     * Code from ChatGPT.
     * Draw rectangle with the specified colour.
     * @param {*} dragColor false if the regular color, true if for the drag color.
     */
    drawRectangle(dragColor) {
        // Clear previous graphics
        this.graphics.clear();
    
        // Set the new color
        //graphics.fillStyle(newColor, 1);
    
        // Redraw the rectangle
        //graphics.fillRect(100, 100, 200, 150);

        //Source: Google RGB color picker.
        if(dragColor){
            this.graphics.fillStyle(0x091447, 1); //Darker blue color used for when dragging the label on the column.
        } else{
            this.graphics.fillStyle(0x3e81e6, 1); //Regular blue color.
        }
        this.graphics.fillRect(0, 0, LABEL_WIDTH, this.height);  // x, y, width, height
        //TODO: Do the dimensions for items in the container need to be relative to the container or the entire screen?

        //Add the rectangle for the label to the container.
        this.container.add(this.graphics);
    }

    /**
     * Set up and draw label components on the Kanban board.
     * The code here used to be in the constructor.
     */
    initialCreateComponents(){
        console.log("initialCreateComponents() function called.")
        //-----------------------------------------
        //Some code from ChatGPT taken and modified.
        //Create the Phaser Container which contains all elements for this.
        //this.container = this.kanbanStation.add.container(LABEL_WIDTH, this.height); //Is this x and y or width/height?

        //New code added for integration with pizza tickets.
        //The positioning code is probably causing issues. Set it to 0,0, then call mehtod in KanbanBoard.js which
        //handles redrawing all the labels.
        //Code from ChatGPT.
        //if(!this.container){ //Need this to prevent endless containers which leads to stack overflow error.
        this.container = this.kanbanStation.add.container(0, 0);
        //}
        //this.kanbanBoard.displayLabels(); //Redraw all labels (which sets their positions.)
        //ANOTHER ISSUE: You're adding a container, what if that leads to a duplicate if this is called twice. Maybe
        //remove one of the function calls or modify how this function handles things.

        this.graphics = this.kanbanStation.add.graphics();
        this.drawRectangle(false);

        //Add text labels inside the container.
        //const label1 = kanbanStation.add.text(0, 0, 'Label 1', { fontSize: '20px', fill: '#ffffff' });
        //const label2 = kanbanStation.add.text(0, 30, 'Label 2', { fontSize: '20px', fill: '#ffffff' });

        // Add text labels to the container
        //this.container.add([label1, label2]);
        
        let currentTextYPos = 0; //This will be incremented to update the position to draw the next text label.
        for(let i = 0; i < this.labelTextList.length; i++){
            const label = this.kanbanStation.add.text(0, currentTextYPos, this.labelTextList[i], { fontSize: '20px', fill: '#ffffff' });
            this.container.add(label);
            currentTextYPos += 30;
        }

        //Set the container's size, as otherwise it prevents the Container from being draggable.
        this.container.setSize(LABEL_WIDTH, this.height);

        //Code to make the Container draggable, using the draggable.js file which worked successfully
        //for a basic rectangle.
        this.container.name = 'Kanban Label'
        //Can see the name above being logged in the log statement in the "destroy" function in draggable.js.
        //makeDraggable(this.container, false); //False to not log any messages in the console.

        //Code from ChatGPT.
        //Make the rectangle draggable vertically only.
        //makeDraggable(this.container, false, true);

        //TODO: Create the button that leads to a particular scene.
    }

    /**
     * This is a TEST constructor. The proper one will take the ticket/label object for the Pizza order, and will be
     * instantiated when a pizza order is submitted (when the player takes the order from the customer.)
     * @param {*} kanbanStation Reference to the KanbanStation object.
     * @param {*} kanbanBoard Reference to the KanbanBoard object used for storing and displaying the Kanban board.
     * @param {*} height The height can be set, but the width is fixed to the column width.
     * @param {*} columnIndex Index of the column on the Kanban board, can be 0 to 5 (as there are 6 columns.)
     * @param {*} labelTextList List of text strings for text to be displayed on the Kanban label.
     */
    constructor(kanbanStation, kanbanBoard, height, columnIndex, labelTextList){
        this.kanbanStation = kanbanStation
        this.kanbanBoard = kanbanBoard
        this.labelTextList = labelTextList
        this.columnIndex = columnIndex
        this.height = height
        console.log("DEBUG: KanbanLabel object created.");

        //Don't draw the label right away, as it might not be inside the Kanban board when it gets created.
    }

    /**
     * Calculate the x position where this label should be displayed on the Kanban board.
     * @returns x position of the label on the Kanban board.
     */
    calculateLabelXPos(){
        return GAP_BETWEEN_COLUMN_RECTANGLES + 
                ADDITIONAL_GAP_BESIDE_COLUMN_RECTANGLES_LEFT_RIGHT_SCREEN +
                GAP_BETWEEN_COLUMN_AND_LABELS +
                this.columnIndex * (COLUMN_RECTANGLE_WIDTH + GAP_BETWEEN_COLUMN_RECTANGLES);
    }

    /**
     * Display the label on the specified y position on the Kanban board.
     */
    drawLabelOnKanbanBoard(yPos){
        this.container.x = this.calculateLabelXPos();
        //Only need to set the container's y because everything else will move with the container.
        this.container.y = yPos;

        //TODO: This is only updating x and y pos, I don't think it actually draws it.

        //New code for integration into pizza tickets: try drawing the rectangle.
        console.log("drawLabelOnKanbanBoard() function called.");
        ///this.drawRectangle(false); //False as a drag operation is probably not active.
        //TODO: Maybe try drawing everything here and not in the constructor.
        //TODO: You might even be able to fix the bug where the labels are displayed in the wrong place when leaving
        //the Kanban Station and returning to it.

        //Draw the label components: this code used to be in the constructor but was moved to a function.
        //this.drawLabelComponents();
    }

    //TODO: Create list of buttons to each of the stations. These will changed based on which column the label is on.

    //TODO: Create a function to change classes. This could be static as the functionality will be the same everywhere.
    //But for simplicity, might be easier not to make it static at this stage. No, don't make it static.

    //TODO: Create a KanbanBoard class and copy and pasted the KanbanStation code to there for layout and positioning.

    //----------------------------------------------------------------------
    /*
     * Code to drag Kanban Board labels up and down.
     */

    //TODO: Make code triggered by mouse events.

    beginDragOperation(){

    }

    endDragOperation(){

    }
}