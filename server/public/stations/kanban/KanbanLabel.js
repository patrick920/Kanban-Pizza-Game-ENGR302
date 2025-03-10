/*
 * This class will be used to store labels on the Kanban board.
 * Each label will be stored as a Phaser Container.
 * There will be a button on each Kanban label to go the corresponding station of the column it's
 * currently in.
 * 
 * Sources:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
 */

//From ChatGPT:
import { GAP_BETWEEN_COLUMN_RECTANGLES, ADDITIONAL_GAP_BESIDE_COLUMN_RECTANGLES_LEFT_RIGHT_SCREEN,
    GAP_BETWEEN_COLUMN_AND_LABELS, LABEL_WIDTH, COLUMN_RECTANGLE_WIDTH } from './KanbanBoard.js';
//import KanbanBoard from './KanbanBoard.js';
import { kanbanLabelsList } from './KanbanBoard.js';

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

        //---------------------------------------------------------------------------------
        // this.buttonGraphics = this.kanbanStation.add.graphics();
        // this.graphics.fillStyle(0x091447, 1); //Dark blue color.
        // const goToStationButton = this.buttonGraphics.fillRect(3, 65, LABEL_WIDTH - 6, 16);
        // //Add the button rectangles to the container.
        // this.container.add(this.buttonGraphics);
    }

    /**
     * Create a button on the Kanban board.
     * @param {*} xPos x position of button.
     * @param {*} yPos y position of button.
     * @param {*} width width of button.
     */
    createButton(xPos, yPos, width, text){
        //Code below from ChatGPT:
        // Create a rectangle to act as the button's background
        //const orderButton = this.kanbanStation.add.rectangle(3, 65, LABEL_WIDTH - 6, 16, 0x091447);
        const REGULAR_COLOR = 0x091447;
        const HOVER_COLOR = 0x357ac4;

        const button = this.kanbanStation.add.rectangle(0, 0, width, 16, REGULAR_COLOR);
        button.setInteractive();
        button.setOrigin(0, 0); // Set origin to top-left //New code after further ChatGPT prompt.

        // Add text on top of the button
        //const orderButtonText = this.kanbanStation.add.text(3, 65, 'Go to Station', {
        const buttonText = this.kanbanStation.add.text(0, 0, text, {
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0, 0);
        //}).setOrigin(0.5, 0.5); // Center the text horizontally and vertically //New after further ChatGPT prompt.
        //}).setOrigin(0.5); // Center the text

        // Create a container to hold the rectangle and the text
        const buttonContainer = this.kanbanStation.add.container(xPos, yPos, [button, buttonText]);

        // Event listener for hover effect when the pointer is over the button
        button.on('pointerover', () => {
            button.setFillStyle(HOVER_COLOR); // Change color to a lighter shade on hover
        });

        // Event listener for when the pointer leaves the button
        button.on('pointerout', () => {
            button.setFillStyle(REGULAR_COLOR); // Change back to the original color
        });

        //Add the button container to the label container.
        this.container.add(buttonContainer);

        return button;
    }

    /**
     * Move the current KanbanLabel (referenced by "this") to the next column on the "kanbanLabelsList" which
     * is used to store the labels on the Kanban board.
     */
    moveLabelToNextColumnOnKanbanLabelsList(){
        //If the size of the "kanbanLabelsList" on the next column is 5 or more, cancel the move operation.
        if(kanbanLabelsList[this.columnIndex + 1].length >= 5){
            alert("Can't move the label as the next column is full.");
            return;
        }

        this.columnIndex++; //Move the label's column index to the next column.

        //Update the list of all Kanban Board labels.
        //First print it:
        console.log("Column " + (this.columnIndex - 1) + " before removing:")
        this.kanbanBoard.debugPrintKanbalLabelsListContent(this.columnIndex - 1);
        
        //Then remove from the initial list.
        //kanbanLabelsList[columnIndex] = 
        //Find index of this KanbanLabel within the list for all the Kanban labels.
        let index = kanbanLabelsList[this.columnIndex - 1].indexOf(this);

        //If this KanbanLabel is found in the array, remove it.
        if (index !== -1) {
            kanbanLabelsList[this.columnIndex - 1].splice(index, 1);
        } else{
            console.log("ERROR: Can't remove this KanbanLabel from the list.");
        }

        //Print after removing:
        console.log("Column " + (this.columnIndex - 1) + " after removing:")
        this.kanbanBoard.debugPrintKanbalLabelsListContent(this.columnIndex - 1);

        //this.columnIndex++; //Move the label's column index to the next column.

        console.log("Column " + this.columnIndex + " before adding:")
        this.kanbanBoard.debugPrintKanbalLabelsListContent(this.columnIndex);

        //Add the label to the new column on the Kanban labels list:
        kanbanLabelsList[this.columnIndex].push(this);

        console.log("Column " + this.columnIndex + " after adding:")
        this.kanbanBoard.debugPrintKanbalLabelsListContent(this.columnIndex);
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
        
        let currentTextYPos = 1; //This will be incremented to update the position to draw the next text label.
        for(let i = 0; i < this.labelTextList.length; i++){
            const label = this.kanbanStation.add.text(0, currentTextYPos, this.labelTextList[i], { fontSize: '16px', fill: '#ffffff' });
            this.container.add(label);
            currentTextYPos += 16;
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

        //----------------------------
        //Create the buttons.
        //Go to Station button.
        //Code from ChatGPT:

        const goToStationButton = this.createButton(3, 65, LABEL_WIDTH - 6, 'Go to Station');

        //Event listener for the "Go to Station" button interaction (click).
        goToStationButton.on('pointerdown', () => {
            console.log('NEW Order Button clicked!!!!!');
            if(this.columnIndex == 0){
                this.kanbanStation.scene.start('OrderStation');
                //TODO: Replace this code so that the label moves to the next one (this should be the start button.)
            } else if(this.columnIndex == 1){
                //TODO: Get a reference to the prepare station.
                //const kanbanScene = this.scene.get('KanbanStation');
                const prepareStation = this.kanbanStation.scene.get('PrepareStation');
                console.log("prepareStation = " + prepareStation);

                prepareStation.initialSetupFromKanbanBoard(this.ticket);

                //Changing the scene should be the last thing.
                //This triggers the create() function, but do test this.
                console.log("Just before changing the scene to PrepareStation.");
                this.kanbanStation.scene.start('PrepareStation');
            } else if(this.columnIndex == 2){
                //TODO: Get a reference to the cook station.
                //const kanbanScene = this.scene.get('KanbanStation');
                const cookStation = this.kanbanStation.scene.get('CookStation');
                console.log("cookStation = " + cookStation);

                cookStation.initialSetupFromKanbanBoard(this.ticket);

                //Changing the scene should be the last thing.
                //This triggers the create() function, but do test this.
                console.log("Just before changing the scene to CookStation.");
                this.kanbanStation.scene.start('CookStation');
            } else if(this.columnIndex == 3){
                //TODO: Get a reference to the review station.
                //const kanbanScene = this.scene.get('KanbanStation');
                const reviewStation = this.kanbanStation.scene.get('ReviewStation');
                console.log("reviewStation = " + reviewStation);

                reviewStation.initialSetupFromKanbanBoard(this.ticket);

                //Changing the scene should be the last thing.
                //This triggers the create() function, but do test this.
                console.log("Just before changing the scene to ReviewStation.");
                this.kanbanStation.scene.start('ReviewStation');
            } else if(this.columnIndex == 4){
                //this.kanbanStation.scene.start('ReviewStation');
            } else if(this.columnIndex == 5){
                //this.kanbanStation.scene.start('');
            }
            
        });

        const BACK_BUTTON_X_POS = LABEL_WIDTH / 2;
        const BACK_BUTTON_WIDTH = 40;
        const backButton = this.createButton(BACK_BUTTON_X_POS, 1, BACK_BUTTON_WIDTH, 'Back');

        //Event listener for the "Go to Station" button interaction (click).
        backButton.on('pointerdown', () => {
            console.log('Back Button clicked!!!!!');
            if(this.columnIndex == 0){
                
            } else if(this.columnIndex == 1){
                this.kanbanStation.scene.start('PrepareStation');
            } else if(this.columnIndex == 2){
                this.kanbanStation.scene.start('CookStation');
            } else if(this.columnIndex == 3){
                this.kanbanStation.scene.start('ReviewStation');
            } else if(this.columnIndex == 4){
                //this.kanbanStation.scene.start('ReviewStation');
            } else if(this.columnIndex == 5){
                //this.kanbanStation.scene.start('');
            }
            
        });

        const nextButton = this.createButton(BACK_BUTTON_X_POS + BACK_BUTTON_WIDTH + 3, 1, BACK_BUTTON_WIDTH, 'Next');

        //Event listener for the "Go to Station" button interaction (click).
        nextButton.on('pointerdown', () => {
            console.log('Next Button clicked!!!!!');
            if(this.columnIndex == 0){
                this.moveLabelToNextColumnOnKanbanLabelsList();
            } else if(this.columnIndex == 1){
                this.moveLabelToNextColumnOnKanbanLabelsList();
            } else if(this.columnIndex == 2){
                this.moveLabelToNextColumnOnKanbanLabelsList();
            } else if(this.columnIndex == 3){
                this.moveLabelToNextColumnOnKanbanLabelsList();
            } else if(this.columnIndex == 4){
                this.moveLabelToNextColumnOnKanbanLabelsList();
                //Remove buttons, except for bottom "Remove" button.
            } else if(this.columnIndex == 5){
                
            }
            
        });
    }

    /**
     * This is a TEST constructor. The proper one will take the ticket/label object for the Pizza order, and will be
     * instantiated when a pizza order is submitted (when the player takes the order from the customer.)
     * @param {*} kanbanStation Reference to the KanbanStation object.
     * @param {*} kanbanBoard Reference to the KanbanBoard object used for storing and displaying the Kanban board.
     * @param {*} height The height can be set, but the width is fixed to the column width.
     * @param {*} columnIndex Index of the column on the Kanban board, can be 0 to 5 (as there are 6 columns.)
     * @param {*} ticket The "Ticket" object associated with this label.
     * @param {*} labelTextList List of text strings for text to be displayed on the Kanban label.
     */
    constructor(kanbanStation, kanbanBoard, height, columnIndex, ticket, labelTextList){
        this.kanbanStation = kanbanStation
        this.kanbanBoard = kanbanBoard
        this.labelTextList = labelTextList
        this.columnIndex = columnIndex
        this.height = height
        this.ticket = ticket
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
        //console.log("drawLabelOnKanbanBoard() function called.");
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
}