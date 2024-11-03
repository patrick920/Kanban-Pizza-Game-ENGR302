/*
 * kanbanStation file will hold all the display code for the Kanban board, to keep KanbanStation.js cleaner and not too long.
 */

import KanbanLabel from './KanbanLabel.js';

//TODO: Have a list for each of the stations with the labels currently in there. Have a hardcoded list for each
//one as it will be simpler. NO, get the list from the KanbanStation that has already been defined.

//Source: ChatGPT
//Source: https://www.w3schools.com/js/js_const.asp
export const TOP_TO_TITLE_GAP = 10;
export const TITLE_TEXT_HEIGHT = 40;
export const TITLE_TO_COLUMN_TITLES_HEIGHT = 5; //Used to be 10.
export const COLUMN_TITLES_TEXT_HEIGHT = 20; //Used to be 15.
//The width of the Kanban board column.
export const COLUMN_RECTANGLE_WIDTH = 200;
//The gap between the Kanban board column and the menu at the bottom of the screen.
export const COLUMN_RECTANGLES_TO_MENU_GAP = 10;
//Y position for the start of the buttons for the menu at the bottom of the screen.
export const Y_MENU_START = 100;
//The gap between each of the Kanban board columns.
export const GAP_BETWEEN_COLUMN_RECTANGLES = 14;
//The additional gap at the left and right sides of the screen, as when you divide an odd number is produced so must
//balance things out.
export const ADDITIONAL_GAP_BESIDE_COLUMN_RECTANGLES_LEFT_RIGHT_SCREEN = 1;

//The Y position for the TOP of the Kanban board column rectangle.
export const Y_TOP_COLUMN_RECTANGLES = TOP_TO_TITLE_GAP + TITLE_TEXT_HEIGHT + TITLE_TO_COLUMN_TITLES_HEIGHT +
                                        COLUMN_TITLES_TEXT_HEIGHT;
console.log("Y_TOP_COLUMN_RECTANGLES = " + Y_TOP_COLUMN_RECTANGLES);

//Constants for layout of the labels.
export const GAP_BETWEEN_COLUMN_AND_LABELS = 10;
//Width of a label on the Kanban board.
export const LABEL_WIDTH = COLUMN_RECTANGLE_WIDTH - (GAP_BETWEEN_COLUMN_AND_LABELS * 2);

/**
 * 2D list for the Kanban board labels.
 * 
 * This does not store all tickets, it only stores the ones that should be visible on the board.
 */
//ChatGPT helped.
//let kanbanLabelsList = [[], [], [], [], [], []];
let kanbanLabelsList = [];
//Initialise empty lists for each of the 6 columns.
for(let i = 0; i < 6; i++){
    kanbanLabelsList[i] = [];
}

export default class KanbanBoard{
    constructor(kanbanStation) {
        this.kanbanStation = kanbanStation;
    }

    //Some stuff from ChatGPT.
    Y_BOTTOM_COLUMN_RECTANGLES;
    //console.log("Y_BOTTOM_COLUMN_RECTANGLES = " + Y_BOTTOM_COLUMN_RECTANGLES);
    //The height of the column rectangles for the Kanban board.
    COLUMN_RECTANGLE_HEIGHT;
    //console.log("COLUMN_RECTANGLE_HEIGHT = " + COLUMN_RECTANGLE_HEIGHT);

    //Use "this.kanbanStation" instead of the "this" keyword for many (but not all) things.
    createKanbanBoard(){
        //const kanbanStation = this.kanbanStation;

        // Game logic here
        //Changed from 100, 100 to 800, 100
        //Source: https://newdocs.phaser.io/docs/3.80.0/focus/Phaser.GameObjects.GameObjectFactory-text
        //Source: https://newdocs.phaser.io/docs/3.80.0/Phaser.Types.GameObjects.Text.TextStyle
        //Some code from ChatGPT:
        //650 as kanbanStation is the middle.
        const titleText = this.kanbanStation.add.text(650, TOP_TO_TITLE_GAP, 'Kanban Board', { fontSize: TITLE_TEXT_HEIGHT + 'px', fontFamily: 'Calibri', fill: '#fff' });

        //Set the X origin to the center of the text. kanbanStation makes it easier to centre it. Keep the Y origin to the top.
        titleText.setOrigin(0.5, 0);

        // Navigation buttons (from Station.js)
        this.kanbanStation.createNavigationTabs();

        // Create tomato paste image
        //kanbanStation.createTomatoPasteBottle();

        // Create add task button
        const addTaskButton = this.kanbanStation.add.text(100, 200, 'Add Task', { fontSize: '24px', fill: '#fff', backgroundColor: '#17a2b8' })
            .setInteractive()
            .on('pointerdown', () => this.kanbanStation.addTask());

        // Listen for kanban tasks updates
        this.kanbanStation.game.socket.on('kanbanTasksUpdate', (tasks) => {
            this.kanbanStation.tasks = tasks;
            this.kanbanStation.updateKanbanDisplay();
        });

        // Get initial game state
        this.kanbanStation.game.socket.on('initialGameState', (gameState) => {
            this.kanbanStation.tasks = gameState.kanbanTasks;
            this.kanbanStation.updateKanbanDisplay();
        });
        
        // //Some stuff from ChatGPT.
        this.Y_BOTTOM_COLUMN_RECTANGLES = this.kanbanStation.scale.height - (COLUMN_RECTANGLES_TO_MENU_GAP + Y_MENU_START);
        console.log("Y_BOTTOM_COLUMN_RECTANGLES = " + this.Y_BOTTOM_COLUMN_RECTANGLES);
        // //The height of the column rectangles for the Kanban board.
        this.COLUMN_RECTANGLE_HEIGHT = this.Y_BOTTOM_COLUMN_RECTANGLES - Y_TOP_COLUMN_RECTANGLES;
        console.log("COLUMN_RECTANGLE_HEIGHT = " + this.COLUMN_RECTANGLE_HEIGHT);

        //Add the 6 rectangles or other objects to represent the columns on the Kanban board.
        //Source: https://newdocs.phaser.io/docs/3.80.0/focus/Phaser.GameObjects.GameObjectFactory-rectangle
        //rectangle([x], [y], [width], [height], [fillColor], [fillAlpha])
        //TODO: Height should be x top minus x bottom.

        //kanbanStation variable will be incremented as I draw each of the rectangles for the columns on the Kanban board.
        //Set it at the initial position for the first rectangle.
        let currentXColumnRectangleStartPos = GAP_BETWEEN_COLUMN_RECTANGLES + ADDITIONAL_GAP_BESIDE_COLUMN_RECTANGLES_LEFT_RIGHT_SCREEN;

        /**
         * Increment the position to start drawing each new column rectangle in the Kanban board.
         */
        function increaseCurrentXColumnRectangleStartPos(){
            currentXColumnRectangleStartPos += GAP_BETWEEN_COLUMN_RECTANGLES + COLUMN_RECTANGLE_WIDTH;
        }

        console.log("Before drawing 1st column, currentXColumnRectangleStartPos = " + currentXColumnRectangleStartPos);
        const orderColumnRectangle = this.kanbanStation.add.rectangle(currentXColumnRectangleStartPos, Y_TOP_COLUMN_RECTANGLES,
            COLUMN_RECTANGLE_WIDTH, this.COLUMN_RECTANGLE_HEIGHT, 0x4fa632);
        //Set the origin point which is used to set the X and Y positions to the top left of the object.
        orderColumnRectangle.setOrigin(0, 0);
        increaseCurrentXColumnRectangleStartPos(); //Increase the starting X position before drawing the next column rectangle.

        console.log("Before drawing 2nd column (prep), currentXColumnRectangleStartPos = " + currentXColumnRectangleStartPos);
        const prepColumnRectangle = this.kanbanStation.add.rectangle(currentXColumnRectangleStartPos, Y_TOP_COLUMN_RECTANGLES,
            COLUMN_RECTANGLE_WIDTH, this.COLUMN_RECTANGLE_HEIGHT, 0x4fa632);
        //Set the origin point which is used to set the X and Y positions to the top left of the object.
        prepColumnRectangle.setOrigin(0, 0);
        increaseCurrentXColumnRectangleStartPos(); //Increase the starting X position before drawing the next column rectangle.

        console.log("Before drawing 3rd column (cook), currentXColumnRectangleStartPos = " + currentXColumnRectangleStartPos);
        const cookColumnRectangle = this.kanbanStation.add.rectangle(currentXColumnRectangleStartPos, Y_TOP_COLUMN_RECTANGLES,
            COLUMN_RECTANGLE_WIDTH, this.COLUMN_RECTANGLE_HEIGHT, 0x4fa632);
        //Set the origin point which is used to set the X and Y positions to the top left of the object.
        cookColumnRectangle.setOrigin(0, 0);
        increaseCurrentXColumnRectangleStartPos(); //Increase the starting X position before drawing the next column rectangle.

        console.log("Before drawing 4th column (review), currentXColumnRectangleStartPos = " + currentXColumnRectangleStartPos);
        const reviewColumnRectangle = this.kanbanStation.add.rectangle(currentXColumnRectangleStartPos, Y_TOP_COLUMN_RECTANGLES,
            COLUMN_RECTANGLE_WIDTH, this.COLUMN_RECTANGLE_HEIGHT, 0x4fa632);
        //Set the origin point which is used to set the X and Y positions to the top left of the object.
        reviewColumnRectangle.setOrigin(0, 0);
        increaseCurrentXColumnRectangleStartPos(); //Increase the starting X position before drawing the next column rectangle.

        console.log("Before drawing 5th column (service), currentXColumnRectangleStartPos = " + currentXColumnRectangleStartPos);
        const serviceColumnRectangle = this.kanbanStation.add.rectangle(currentXColumnRectangleStartPos, Y_TOP_COLUMN_RECTANGLES,
            COLUMN_RECTANGLE_WIDTH, this.COLUMN_RECTANGLE_HEIGHT, 0x4fa632);
        //Set the origin point which is used to set the X and Y positions to the top left of the object.
        serviceColumnRectangle.setOrigin(0, 0);
        increaseCurrentXColumnRectangleStartPos(); //Increase the starting X position before drawing the next column rectangle.

        console.log("Before drawing last (6th) column (completed), currentXColumnRectangleStartPos = " + currentXColumnRectangleStartPos);
        const completedColumnRectangle = this.kanbanStation.add.rectangle(currentXColumnRectangleStartPos, Y_TOP_COLUMN_RECTANGLES,
            COLUMN_RECTANGLE_WIDTH, this.COLUMN_RECTANGLE_HEIGHT, 0x4fa632);
        //Set the origin point which is used to set the X and Y positions to the top left of the object.
        completedColumnRectangle.setOrigin(0, 0);
        increaseCurrentXColumnRectangleStartPos(); //Increase the starting X position before drawing the next column rectangle.

        //-----------------------------------------------------------
        //Create the text labels for each of the columns.
        //-----------------------------------------------------------

        const Y_TOP_COLUMN_TITLES = TOP_TO_TITLE_GAP + TITLE_TEXT_HEIGHT + TITLE_TO_COLUMN_TITLES_HEIGHT

        //kanbanStation variable will be incremented as I draw each of the rectangles for the columns on the Kanban board.
        //Set it at the initial position for the first rectangle.
        let currentXColumnTitleStartPos = GAP_BETWEEN_COLUMN_RECTANGLES + ADDITIONAL_GAP_BESIDE_COLUMN_RECTANGLES_LEFT_RIGHT_SCREEN;
        //Will also need to centre it, not in kanbanStation variable but in the actual code to display the text on the screen.
        let currentXColumnTitleCenterPos = 0;
        updateCurrentXColumnTitleCenterPos(); //Set kanbanStation initially for the first time.

        /**
         * Increment the position to start drawing each new column title in the Kanban board.
         * Additionally call the function to update the variable that holds the centred position to draw the text.
         */
        function increaseCurrentXColumnTitleStartPos(){
            currentXColumnTitleStartPos += GAP_BETWEEN_COLUMN_RECTANGLES + COLUMN_RECTANGLE_WIDTH;
            //Also set the actual position to draw the text so that it is centred.
            updateCurrentXColumnTitleCenterPos();
        }

        /**
         * Set the actual position to draw the text so that it is centred.
         */
        function updateCurrentXColumnTitleCenterPos(){
            currentXColumnTitleCenterPos = currentXColumnTitleStartPos + (COLUMN_RECTANGLE_WIDTH / 2);
        }

        console.log("currentXColumnTitleCenterPos = " + currentXColumnTitleCenterPos);
        //Set the X origin to the center of the text. kanbanStation makes it easier to centre it. Keep the Y origin to the top.
        const orderText = this.kanbanStation.add.text(currentXColumnTitleCenterPos, Y_TOP_COLUMN_TITLES, 'Orders', { fontSize: COLUMN_TITLES_TEXT_HEIGHT + 'px',
            fontFamily: 'Calibri', fill: '#fff' });
        //Set the X origin to the center of the text. kanbanStation makes it easier to centre it. Keep the Y origin to the top.
        orderText.setOrigin(0.5, 0);
        //Update the two variables that store the X positions for drawing the text.
        increaseCurrentXColumnTitleStartPos();

        console.log("currentXColumnTitleCenterPos = " + currentXColumnTitleCenterPos);
        //Set the X origin to the center of the text. kanbanStation makes it easier to centre it. Keep the Y origin to the top.
        const prepText = this.kanbanStation.add.text(currentXColumnTitleCenterPos, Y_TOP_COLUMN_TITLES, 'Preparation', { fontSize: COLUMN_TITLES_TEXT_HEIGHT + 'px',
            fontFamily: 'Calibri', fill: '#fff' });
        //Set the X origin to the center of the text. kanbanStation makes it easier to centre it. Keep the Y origin to the top.
        prepText.setOrigin(0.5, 0);
        //Update the two variables that store the X positions for drawing the text.
        increaseCurrentXColumnTitleStartPos();

        console.log("currentXColumnTitleCenterPos = " + currentXColumnTitleCenterPos);
        //Set the X origin to the center of the text. kanbanStation makes it easier to centre it. Keep the Y origin to the top.
        const cookText = this.kanbanStation.add.text(currentXColumnTitleCenterPos, Y_TOP_COLUMN_TITLES, 'Cooking and Cutting', { fontSize: COLUMN_TITLES_TEXT_HEIGHT + 'px',
            fontFamily: 'Calibri', fill: '#fff' });
        //Set the X origin to the center of the text. kanbanStation makes it easier to centre it. Keep the Y origin to the top.
        cookText.setOrigin(0.5, 0);
        //Update the two variables that store the X positions for drawing the text.
        increaseCurrentXColumnTitleStartPos();

        console.log("currentXColumnTitleCenterPos = " + currentXColumnTitleCenterPos);
        //Set the X origin to the center of the text. kanbanStation makes it easier to centre it. Keep the Y origin to the top.
        const reviewText = this.kanbanStation.add.text(currentXColumnTitleCenterPos, Y_TOP_COLUMN_TITLES, 'Reviewing', { fontSize: COLUMN_TITLES_TEXT_HEIGHT + 'px',
            fontFamily: 'Calibri', fill: '#fff' });
        //Set the X origin to the center of the text. kanbanStation makes it easier to centre it. Keep the Y origin to the top.
        reviewText.setOrigin(0.5, 0);
        //Update the two variables that store the X positions for drawing the text.
        increaseCurrentXColumnTitleStartPos();

        console.log("currentXColumnTitleCenterPos = " + currentXColumnTitleCenterPos);
        //Set the X origin to the center of the text. kanbanStation makes it easier to centre it. Keep the Y origin to the top.
        const serviceText = this.kanbanStation.add.text(currentXColumnTitleCenterPos, Y_TOP_COLUMN_TITLES, 'Service', { fontSize: COLUMN_TITLES_TEXT_HEIGHT + 'px',
            fontFamily: 'Calibri', fill: '#fff' });
        //Set the X origin to the center of the text. kanbanStation makes it easier to centre it. Keep the Y origin to the top.
        serviceText.setOrigin(0.5, 0);
        //Update the two variables that store the X positions for drawing the text.
        increaseCurrentXColumnTitleStartPos();

        console.log("currentXColumnTitleCenterPos = " + currentXColumnTitleCenterPos);
        //Set the X origin to the center of the text. kanbanStation makes it easier to centre it. Keep the Y origin to the top.
        const completedText = this.kanbanStation.add.text(currentXColumnTitleCenterPos, Y_TOP_COLUMN_TITLES, 'Completed Pizzas', { fontSize: COLUMN_TITLES_TEXT_HEIGHT + 'px',
            fontFamily: 'Calibri', fill: '#fff' });
        //Set the X origin to the center of the text. kanbanStation makes it easier to centre it. Keep the Y origin to the top.
        completedText.setOrigin(0.5, 0);
        //Update the two variables that store the X positions for drawing the text.
        increaseCurrentXColumnTitleStartPos();

        //cureentXStartPos += ___ + ___;

        //From ChatGPT:
        //To create labels, use the "Container" object.
    }

    /**
     * Create a label in the Kanban Board.
     * Height is just a temporary variable. Height should be automatic based on how the
     * Kanban tasks work.
     */
    addLabel(height, columnIndex){
        //"push" is used to add to the list.
        kanbanLabelsList[columnIndex].push(new KanbanLabel(this.kanbanStation, height, columnIndex, [this.kanbanStation.add.text("Top"),
            this.kanbanStation.add.text("Bottom")]));
    }
    
    displayLabels(){
        //Loop over all columns on the Kanban board to display the label(s) on each column.
        for(let columnIndex = 0; columnIndex < kanbanLabelsList.length; columnIndex++){

            //The Y position where the next label on the Kanban board will be drawn. This will keep going up as
            //new labels are added.
            //Set the initial Y position for the first Kanban board label.
            let currentYPos = TOP_TO_TITLE_GAP + TITLE_TEXT_HEIGHT + TITLE_TO_COLUMN_TITLES_HEIGHT +
                                COLUMN_TITLES_TEXT_HEIGHT + GAP_BETWEEN_COLUMN_AND_LABELS;

            //Use the lists in KanbanStation.
            for(let i = 0; i < kanbanLabelsList[columnIndex].length; i++){
                //console.log("Display label " + i + " on the Kanban board.");
                let currentLabel = kanbanLabelsList[columnIndex][i];
                //Random number code from ChatGPT.
                //currentLabel.drawLabelOnKanbanBoard(Math.floor(Math.random() * (800 - 200 + 1)) + 200);
                currentLabel.drawLabelOnKanbanBoard(currentYPos);
                //Call a method to display the label. EVERYTHING about positioning is decided by KanbanLabel except for
                //the y position on the column which is decided here.

                //Update "currentYPos" with the height of the label and the gap.
                currentYPos += currentLabel.height + GAP_BETWEEN_COLUMN_AND_LABELS;
            }
        }
    }

    createTestLabels(){
        //Create several test labels on the Kanban board automatically for testing purposes.
        //kanbanStation code should be removed later on.
        this.addLabel(200, 0);
        this.addLabel(90, 0);

        this.addLabel(50, 1);
        this.addLabel(100, 1);
        this.addLabel(80, 1);
        this.addLabel(60, 1);

        this.addLabel(140, 2);

        //NO test labels on column 3.

        this.addLabel(140, 4);
        this.addLabel(80, 4);
        this.addLabel(120, 4);

        this.addLabel(50, 5);
        this.addLabel(70, 5);
        this.addLabel(90, 5);
        this.addLabel(60, 5);
        this.addLabel(80, 5);
        //TODO: Try 1, 2, 3, 4, 5 and no labels in the columns.
    }

    //----------------------------------------------------------------------
    //Code to drag Kanban Board labels up and down.
    //----------------------------------------------------------------------
    
    /*
     * Code to drag Kanban Board labels up and down.
     * Will use scene-wide mouse events.
     * TODO: Only one label can be dragged at a time.
     */

    /**
     * This takes into account the space between labels and the column rectangle.
     * TODO: Get the position from the KanbanLabel object for the individual labels.
     * TODO: Make this function generic to mouse move as well, as it doesn't have to be just for mouse clicks.
     * @param {*} pointer 
     */
    checkIfMouseWithinKanbanColumn(pointer){
        let insideColumn = -1; //If it's -1 then the mouse is not within a column.

        //TODO: Duplicate the below code for other mouse checking functions.
        //Loop over all columns on the Kanban board to display the label(s) on each column.
        for(let columnIndex = 0; columnIndex < kanbanLabelsList.length; columnIndex++){
            let LEFT_X_CURRENT_COL = GAP_BETWEEN_COLUMN_RECTANGLES + 
                                    ADDITIONAL_GAP_BESIDE_COLUMN_RECTANGLES_LEFT_RIGHT_SCREEN +
                                    GAP_BETWEEN_COLUMN_AND_LABELS +
                                    columnIndex * (COLUMN_RECTANGLE_WIDTH + GAP_BETWEEN_COLUMN_RECTANGLES);
            let RIGHT_X_CURRENT_COL = LEFT_X_CURRENT_COL + COLUMN_RECTANGLE_WIDTH - (GAP_BETWEEN_COLUMN_AND_LABELS * 2);
            //let TOP_Y_CURRENT_COL = TOP_TO_TITLE_GAP + TITLE_TEXT_HEIGHT + TITLE_TO_COLUMN_TITLES_HEIGHT +
            //COLUMN_TITLES_TEXT_HEIGHT + GAP_BETWEEN_COLUMN_AND_LABELS;
            //let BOTTOM_Y_CURRENT_COL = TOP_TO_TITLE_GAP + TITLE_TEXT_HEIGHT + TITLE_TO_COLUMN_TITLES_HEIGHT +
            //COLUMN_TITLES_TEXT_HEIGHT + ;
            let TOP_Y_CURRENT_COL = Y_TOP_COLUMN_RECTANGLES + GAP_BETWEEN_COLUMN_AND_LABELS;
            let BOTTOM_Y_CURRENT_COL = Y_TOP_COLUMN_RECTANGLES + this.COLUMN_RECTANGLE_HEIGHT -
                                        GAP_BETWEEN_COLUMN_AND_LABELS;

            //console.log("LEFT_X_CURRENT_COL = " + LEFT_X_CURRENT_COL); //This currently gives NaN.
            //console.log("RIGHT_X_CURRENT_COL = " + RIGHT_X_CURRENT_COL);

            //Check if the mouse pointer is within a column.
            //If true, check individual labels and the BREAK out of this for loop.
            if(pointer.x >= LEFT_X_CURRENT_COL && pointer.x <= RIGHT_X_CURRENT_COL &&
                pointer.y >= TOP_Y_CURRENT_COL && pointer.y <= BOTTOM_Y_CURRENT_COL){
                //console.log("DEBUG: Mouse inside of column " + columnIndex + ".");
                insideColumn = columnIndex;
            } else{
                //console.log("DEBUG: Mouse clicked outside of column " + columnIndex + ".");
                //There is no point checking the others.
                //break;
            }

            //Use the lists in KanbanStation.
            for(let i = 0; i < kanbanLabelsList[columnIndex].length; i++){

            }
        }

        //console.log("insideColumn = " + insideColumn);
        return insideColumn; //Return index of column or -1 if mouse is not on any column.
    }

    /**
     * Check if the mouse is inside of a label on the Kanban board.
     * @param {*} currentColumnKanbanLabelsList Current column on the Kanban board.
     */
    checkIfMouseInKanbanLabel(pointer, currentColumnKanbanLabelsList){
        //-1 if the mouse did not click over any column.
        let kanbanLabelIndexMouseOver = -1;

        //Code from displayLabels() function.

        //The index of the Kanban label the mouse is currently clicked over. This will be -1 if
        //it is not over any Kanban label.

        //The Y position where the next label on the Kanban board will be drawn. This will keep going up as
        //new labels are added.
        //Set the initial Y position for the first Kanban board label.
        let currentYPos = TOP_TO_TITLE_GAP + TITLE_TEXT_HEIGHT + TITLE_TO_COLUMN_TITLES_HEIGHT +
                            COLUMN_TITLES_TEXT_HEIGHT + GAP_BETWEEN_COLUMN_AND_LABELS;

        //Use the lists in KanbanStation.
        for(let i = 0; i < currentColumnKanbanLabelsList.length; i++){
            //console.log("Check label " + i + " on the Kanban board.");
            let currentLabel = currentColumnKanbanLabelsList[i];
            
            //currentLabel.drawLabelOnKanbanBoard(currentYPos);
            let currentXPos = currentLabel.calculateLabelXPos();

            //console.log("currentXPos = " + currentXPos + " | currentYPos = " + currentYPos);
            if(pointer.x >= currentXPos && pointer.x <= currentXPos + LABEL_WIDTH && pointer.y >= currentYPos &&
                pointer.y <= currentYPos + currentLabel.height){
                //console.log("currentXPos = " + currentXPos + " | currentYPos = " + currentYPos);
                console.log("Mouse is within label index " + i);
                kanbanLabelIndexMouseOver = i;
            }

            //Update "currentYPos" with the height of the label and the gap.
            currentYPos += currentLabel.height + GAP_BETWEEN_COLUMN_AND_LABELS;
        }

        if(kanbanLabelIndexMouseOver == -1){
            console.log("Did not click inside of a Kanban Label.");
        }
        return kanbanLabelIndexMouseOver;
    }

    //Initial mouse x and y positions when the drag operation begins.
    //-1 if dragging operation is not active.
    dragInitialMouseX = -1;
    dragInitialMouseY = -1;
    //Current mouse x and y positions. This may be updated as the dragging goes on.
    dragCurrentMouseX = -1;
    dragCurrentMouseY = -1;

    //Whether or not the dragging operation is active.
    dragActive = false;
    //Index of the column where dragging is active.
    dragInsideColumn = -1;
    //Index of the label on the Kanban board where dragging is active.
    dragMouseInLabelIndex = -1;

    //Index of the place on the Kanban board column where the label should be placed after the drag operation has
    //been finished (cancelled).
    dragNewLabelIndex = -1;

    //TODO: Make variables to store the previous x and y positions of the last drag move.

    /**
     * Activate the code to potentially start dragging the label vertically on the column.
     * 
     * Ways to can
     * 
     * @param {*} pointer Mouse object with the mouse's x and y position.
     * @param {*} insideColumn Index of the clicked column on the Kanban board.
     * @param {*} mouseInLabelIndex Index of the clicked label on the Kanban board.
     */
    beginDragOperation(pointer, insideColumn, mouseInLabelIndex){
        //Do not begin drag operation if one is already active.
        if(this.dragActive){
            console.log("MAJOR PROBLEM: Drag operation is already active.");
            return;
        }
        console.log("BEGIN DRAG OPERATION.");

        this.dragInitialMouseX = pointer.x;
        this.dragInitialMouseY = pointer.y;
        this.dragCurrentMouseX = pointer.x;
        this.dragCurrentMouseY = pointer.y;
        this.dragActive = true;
        this.dragInsideColumn = insideColumn;
        this.dragMouseInLabelIndex = mouseInLabelIndex;
        //By default, if the drag operation is cancelled, the label will return to its initial position on the
        //Kanban board column.
        this.dragNewLabelIndex = mouseInLabelIndex;

        //Call a function to draw the red lines on the Kanban board showing eligible positions where the
        //label could be moved to.
        //No, do this in the function where dragging happens as just clicking should not show this.
    }

    /**
     * Reasons to cancel the drag operation.
     * - Mouse button is released.
     * - Mouse movement is detected outside of the CURRENT LABEL.
     * - Mouse initial click is detected inside of another label on the Kanban board.
     * 
     * When the drag operation is cancelled:
     * - Determine where the label should fit based on the red lines on the Kanban board,
     *   which could either be the original position or a different one if it was moved substantially. If the label is
     *   placed in a different column, update "kanbanLabelsList" by reordering it.
     * - Make the label opaque (a solid colour) as it would have been transparent during dragging.
     * - Redraw the labels in the Kanban board, using the standard function in this file. DO NOT UPDATE THE LABEL'S
     *   X AND Y COORDINATES, as this will be handled by the standard function to draw the labels.
     */
    cancelDragOperation(){
        //Do not have an if statement checking "dragActive", as there are multiple reasons why the drag
        //operation could be cancelled, and all of those reasons could trigger this.

        console.log("CANCEL DRAG OPERATION.");

        //Redraw the labels on the Kanban board in their standard positions.
        this.displayLabels();

        //Make the label no longer transparent, only if a drag operation is currently active.
        if(this.dragActive){
            //Get the label which was associated with a drag operation.
            let currentLabel = kanbanLabelsList[this.dragInsideColumn][this.dragMouseInLabelIndex];
        
            //Code from ChatGPT:
            //0 is fully transparent, 1 is fully opaque.
            currentLabel.container.alpha = 1;
        }

        //At the very end of this function, reset the variables.
        this.dragInitialMouseX = -1;
        this.dragInitialMouseY = -1;
        this.dragCurrentMouseX = -1;
        this.dragCurrentMouseY = -1;
        this.dragActive = false;
        this.dragInsideColumn = -1;
        this.dragMouseInLabelIndex = -1;
        this.dragNewLabelIndex = -1;
    }

    /**
     * Draw a line where the Kanban board label is the closest to when dragging to indicate where it will go
     * if the mouse is released.
     * @param {*} pointer Mouse object with x and y position.
     */
    linesLabelPotentialPositions(pointer){
        //Whether or not all the lines should be displayed for testing purposes.
        const LINES_TEST = false;

        //First get the regular code for drawing labels, then modify it.
        //Code from checkIfMouseInKanbanLabel() function in this file but modified.
        const BASE_Y_POS = TOP_TO_TITLE_GAP + TITLE_TEXT_HEIGHT + TITLE_TO_COLUMN_TITLES_HEIGHT +
                        COLUMN_TITLES_TEXT_HEIGHT;
        let currentYPos = BASE_Y_POS + GAP_BETWEEN_COLUMN_AND_LABELS;

        //Constant for the gap between a label and a red line.
        const GAP_BETWEEN_LABEL_AND_LINE = 2;
        //Height of the red line.
        const LINE_HEIGHT = GAP_BETWEEN_COLUMN_AND_LABELS - (GAP_BETWEEN_LABEL_AND_LINE * 2);

        //Create list of potential drawing positions for the red line, and then choose the closest one, but
        //COMPARE FROM THE MIDDLE OF THE LINE, not the drawing position in the top left corner.
        let potentialLineDrawingPositions = [];

        //Get the labels list for the current column.
        let currentColumnKanbanLabelsList = kanbanLabelsList[this.dragInsideColumn];

        //Must potentially draw a red line at the TOP of all the labels.
        if(currentColumnKanbanLabelsList.length >= 1){
            let topLabel = currentColumnKanbanLabelsList[0];

            //x position of the label and also the potential red line.
            const TOP_X_POS = topLabel.calculateLabelXPos();

            let TOP_LINE_Y_POS = BASE_Y_POS + GAP_BETWEEN_LABEL_AND_LINE;

            //Add to the list of potential positions where the red line might get drawn.
            potentialLineDrawingPositions.push(TOP_LINE_Y_POS);

            //Code to draw the top line. This is ONLY for testing purposes, as the proper code will only draw
            //the line which is closest to the current y position of the mouse pointer.
            if(LINES_TEST){
                //Code below from ChatGPT:
                //Create a graphics object (for the red line which is a rectangle.)
                let graphics = this.kanbanStation.add.graphics();
                //Set the fill color to red.
                graphics.fillStyle(0xdb1a1a);

                //Draw a rectangle.
                graphics.fillRect(TOP_X_POS, TOP_LINE_Y_POS,
                                    COLUMN_RECTANGLE_WIDTH - (GAP_BETWEEN_COLUMN_AND_LABELS * 2), LINE_HEIGHT);
            }
        }

        //Add potential positions to the "potentialLineDrawingPositions" list.
        for(let i = 0; i < currentColumnKanbanLabelsList.length; i++){
            //console.log("Label " + i + " on the Kanban board.");
            let currentLabel = currentColumnKanbanLabelsList[i];

            //Skip potentialy drawing a red line for the current label that is being dragged.
            if(i == this.dragMouseInLabelIndex){
                //If currentYPos is not incremented the time where "i" is equal to "thos.dragMouseInLabelIndex",
                //this will lead to issues with drawing the red lines in the correct places.
                //Update "currentYPos" with the height of the label and the gap.
                currentYPos += currentLabel.height + GAP_BETWEEN_COLUMN_AND_LABELS;
                continue;
            }
            
            //x position of the label and also the potential red line.
            let currentXPos = currentLabel.calculateLabelXPos();

            let currentLineYPos = currentYPos + currentLabel.container.height + GAP_BETWEEN_LABEL_AND_LINE;
            console.log("i = " + i + " | currentLabel.container.height = " + currentLabel.container.height +
                        " | curentYPos = " + currentYPos + " | currentLineYPos = " + currentLineYPos);
            potentialLineDrawingPositions.push(currentLineYPos);

            //Code to draw the line. After all iterations of the for loop this will draw all the lines. This is
            //ONLY for testing purposes, as the proper code will only draw the line which is closest to the current y
            //position of the mouse pointer.
            if(LINES_TEST){
                //Code below from ChatGPT:
                //Create a graphics object (for the red line which is a rectangle.)
                let graphics = this.kanbanStation.add.graphics();
                //Set the fill color to red.
                graphics.fillStyle(0xdb1a1a);

                //Draw a rectangle.
                graphics.fillRect(currentXPos, currentLineYPos,
                                    COLUMN_RECTANGLE_WIDTH - (GAP_BETWEEN_COLUMN_AND_LABELS * 2), LINE_HEIGHT);
            }

            //Update "currentYPos" with the height of the label and the gap.
            currentYPos += currentLabel.height + GAP_BETWEEN_COLUMN_AND_LABELS;
        }

        //--------------------------------------------------
        //TODO: Maybe create a field for the current index in the list where the label should be dropped
        //if the drag operation is cancelled.

        //Evaluate which potential red line drawing position is the closest to the mouse's y coordinate, then
        //update the "this.dragNewLabelIndex" field which holds the index for where the label will go
        //when the drag operation finishes (cancels).

        let shortestDistance = -1;
        let shortestDistanceIndex = -1;

        for(let i = 0; i < potentialLineDrawingPositions.length; i++){
            //Calculate the distance between the mouse's y position and the potential line drawing position.
            let currentDistance = Math.abs(pointer.y - potentialLineDrawingPositions[i]);

            //See if it is the shortest distance, and if yes set it as the shortest distance.
            //Also set the current distance to the shortest if it is the first one.
            if(i == 0 || currentDistance <= shortestDistance){
                shortestDistance = currentDistance;
                shortestDistanceIndex = i;
            }
        }

        console.log("shortestDistance = " + shortestDistance + " | shortestDistanceIndex = " + shortestDistanceIndex);

        //Set the shortest distance index as the index where the label will be put after the dragging operation has
        //been finished (cancelled). However, don't do this if "shortestDistanceIndex" is -1.
        if(shortestDistanceIndex != -1){
            this.dragNewLabelIndex = shortestDistanceIndex;

            //Draw the red line in this position, if there is at least 1 label on the column.
            //Code below from ChatGPT:
            //Create a graphics object (for the red line which is a rectangle.)
            let graphics = this.kanbanStation.add.graphics();
            //Set the fill color to red.
            graphics.fillStyle(0xdb1a1a);

            //Draw a rectangle.
            graphics.fillRect(kanbanLabelsList[this.dragInsideColumn][0].calculateLabelXPos(),
                                potentialLineDrawingPositions[shortestDistanceIndex],
                                COLUMN_RECTANGLE_WIDTH - (GAP_BETWEEN_COLUMN_AND_LABELS * 2), LINE_HEIGHT);
        }
    }

    /**
     * Drag the label across the Kanban board if a drag operation is currently active.
     * @param pointer Mouse pointer object with x and y.
     */
    doLabelDragging(pointer){
        if(!this.dragActive){
            return; //A label drag operation is not currently active.
        }
        //console.log("DEBUG: this.dragInsideColumn = " + this.dragInsideColumn);
        //console.log("DEBUG: this.dragMouseInLabelIndex = " + this.dragMouseInLabelIndex);
        //console.log("DEBUG: kanbanLabelsList = " + kanbanLabelsList);
        let currentLabel = kanbanLabelsList[this.dragInsideColumn][this.dragMouseInLabelIndex];
        //currentLabel.x += (pointer.x - );

        //Make the label partially transparent when it is dragged.
        //Code from ChatGPT:
        //0 is fully transparent, 1 is fully opaque.
        currentLabel.container.alpha = 0.5;

        //Call function to draw a red line showing where the label can be placed.
        this.linesLabelPotentialPositions(pointer);

        //Need to access the container inside of currentLabel then increment y.
        //console.log("DEBUG: currentLabel = " + currentLabel);
        //console.log("DEBUG: currentLabel.y = " + currentLabel.y);
        //console.log("DEBUG: currentLabel.container.y = " + currentLabel.container.y);
        //console.log("DEBUG: (this.dragCurrentMouseY - pointer.y) = " + (this.dragCurrentMouseY - pointer.y));
        //console.log("DEBUG: this.dragCurrentMouseY = " + this.dragCurrentMouseY);
        //console.log("DEBUG: pointer.y = " + pointer.y);

        //Update the label's container position on the Phaser Scene.
        currentLabel.container.y -= (this.dragCurrentMouseY - pointer.y);

        //Keep this code at the VERY END of this function.
        //Update the current x and y mouse variables for the dragging operation.
        this.dragCurrentMouseX = pointer.x;
        this.dragCurrentMouseY = pointer.y;
    }

    /**
     * This function is called if the mouse is clicked over a column (within the padding around the labels.)
     * It will check if the mouse is over a particular label, and if yes it will begin the move operation.
     */
    startColumnDragCode(pointer, insideColumn){
        if(insideColumn < 0){return;} //-1 means that it's not currently on a column.
        //const CURRENT_COL
        //Instead of manually checking, maybe check if the mouse is on one of the objects.

        let mouseInLabelIndex = this.checkIfMouseInKanbanLabel(pointer, kanbanLabelsList[insideColumn]);

        //If it is within a column, then call a function to start dragging.
        if(mouseInLabelIndex != -1){
            this.beginDragOperation(pointer, insideColumn, mouseInLabelIndex);
        }
        
        
    }


    /**
     * This sets up the drag functionality by setting up mouse listeners.
     * This function is called from KanbanStation.js.
     * TODO: Don't put too much code in the mouse listener functions (separate it out into separate functions),
     * as this will make it easier to read and understand which mouse listeners are doing what.
     */
    setupDragFunctionality(){
        //Code from ChatGPT:

        // Capture any click on the scene
        this.kanbanStation.input.on('pointerdown', (pointer) => {
            console.log('SCENE-WIDE Mouse clicked at:', pointer.x, pointer.y);
            //If the pointer's position is within one of the Kanban Board's columns, then begin the move operation.
            let insideColumn = this.checkIfMouseWithinKanbanColumn(pointer);
            console.log("Mouse clicked: insideColumn = " + insideColumn);
            this.startColumnDragCode(pointer, insideColumn);
        });

        //Fires when the mouse button is released
        this.kanbanStation.input.on('pointerup', (pointer) => {
            console.log('SCENE-WIDE Mouse released at:', pointer.x, pointer.y);
            //If the mouse button is released anywhere on the Phaser Scene, stop any active label dragging operation.
            this.cancelDragOperation();
        });

        // Capture any mouse movement in the scene
        this.kanbanStation.input.on('pointermove', (pointer) => {
            //console.log('SCENE-WIDE Pointer moved to:', pointer.x, pointer.y);
            let insideColumn = this.checkIfMouseWithinKanbanColumn(pointer);
            //console.log("Mouse moved over: insideColumn = " + insideColumn);

            //If it's not inside of a column, CANCEL the current drag operation (if one is currently active.)
            if(insideColumn == -1 || insideColumn != this.dragInsideColumn){
                this.cancelDragOperation();
            }

            //Do the actual drag operation. Note that the function will do nothing if a drag operation is not
            //current active.
            this.doLabelDragging(pointer);
        });
    }
}