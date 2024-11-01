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
        
        //Add the 6 rectangles or other objects to represent the columns on the Kanban board.
        //Source: https://newdocs.phaser.io/docs/3.80.0/focus/Phaser.GameObjects.GameObjectFactory-rectangle
        //rectangle([x], [y], [width], [height], [fillColor], [fillAlpha])
        //TODO: Height should be x top minus x bottom.

        //The Y position for the TOP of the Kanban board column rectangle.
        const Y_TOP_COLUMN_RECTANGLES = TOP_TO_TITLE_GAP + TITLE_TEXT_HEIGHT + TITLE_TO_COLUMN_TITLES_HEIGHT + COLUMN_TITLES_TEXT_HEIGHT;
        console.log("Y_TOP_COLUMN_RECTANGLES = " + Y_TOP_COLUMN_RECTANGLES);
        
        //Some stuff from ChatGPT.
        const Y_BOTTOM_COLUMN_RECTANGLES = this.kanbanStation.scale.height - (COLUMN_RECTANGLES_TO_MENU_GAP + Y_MENU_START);
        console.log("Y_BOTTOM_COLUMN_RECTANGLES = " + Y_BOTTOM_COLUMN_RECTANGLES);
        //The height of the column rectangles for the Kanban board.
        const COLUMN_RECTANGLE_HEIGHT = Y_BOTTOM_COLUMN_RECTANGLES - Y_TOP_COLUMN_RECTANGLES;
        console.log("COLUMN_RECTANGLE_HEIGHT = " + COLUMN_RECTANGLE_HEIGHT);

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
            COLUMN_RECTANGLE_WIDTH, COLUMN_RECTANGLE_HEIGHT, 0x4fa632);
        //Set the origin point which is used to set the X and Y positions to the top left of the object.
        orderColumnRectangle.setOrigin(0, 0);
        increaseCurrentXColumnRectangleStartPos(); //Increase the starting X position before drawing the next column rectangle.

        console.log("Before drawing 2nd column (prep), currentXColumnRectangleStartPos = " + currentXColumnRectangleStartPos);
        const prepColumnRectangle = this.kanbanStation.add.rectangle(currentXColumnRectangleStartPos, Y_TOP_COLUMN_RECTANGLES,
            COLUMN_RECTANGLE_WIDTH, COLUMN_RECTANGLE_HEIGHT, 0x4fa632);
        //Set the origin point which is used to set the X and Y positions to the top left of the object.
        prepColumnRectangle.setOrigin(0, 0);
        increaseCurrentXColumnRectangleStartPos(); //Increase the starting X position before drawing the next column rectangle.

        console.log("Before drawing 3rd column (cook), currentXColumnRectangleStartPos = " + currentXColumnRectangleStartPos);
        const cookColumnRectangle = this.kanbanStation.add.rectangle(currentXColumnRectangleStartPos, Y_TOP_COLUMN_RECTANGLES,
            COLUMN_RECTANGLE_WIDTH, COLUMN_RECTANGLE_HEIGHT, 0x4fa632);
        //Set the origin point which is used to set the X and Y positions to the top left of the object.
        cookColumnRectangle.setOrigin(0, 0);
        increaseCurrentXColumnRectangleStartPos(); //Increase the starting X position before drawing the next column rectangle.

        console.log("Before drawing 4th column (review), currentXColumnRectangleStartPos = " + currentXColumnRectangleStartPos);
        const reviewColumnRectangle = this.kanbanStation.add.rectangle(currentXColumnRectangleStartPos, Y_TOP_COLUMN_RECTANGLES,
            COLUMN_RECTANGLE_WIDTH, COLUMN_RECTANGLE_HEIGHT, 0x4fa632);
        //Set the origin point which is used to set the X and Y positions to the top left of the object.
        reviewColumnRectangle.setOrigin(0, 0);
        increaseCurrentXColumnRectangleStartPos(); //Increase the starting X position before drawing the next column rectangle.

        console.log("Before drawing 5th column (service), currentXColumnRectangleStartPos = " + currentXColumnRectangleStartPos);
        const serviceColumnRectangle = this.kanbanStation.add.rectangle(currentXColumnRectangleStartPos, Y_TOP_COLUMN_RECTANGLES,
            COLUMN_RECTANGLE_WIDTH, COLUMN_RECTANGLE_HEIGHT, 0x4fa632);
        //Set the origin point which is used to set the X and Y positions to the top left of the object.
        serviceColumnRectangle.setOrigin(0, 0);
        increaseCurrentXColumnRectangleStartPos(); //Increase the starting X position before drawing the next column rectangle.

        console.log("Before drawing last (6th) column (completed), currentXColumnRectangleStartPos = " + currentXColumnRectangleStartPos);
        const completedColumnRectangle = this.kanbanStation.add.rectangle(currentXColumnRectangleStartPos, Y_TOP_COLUMN_RECTANGLES,
            COLUMN_RECTANGLE_WIDTH, COLUMN_RECTANGLE_HEIGHT, 0x4fa632);
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
                console.log("Display label " + i + " on the Kanban board.");
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
        this.addLabel(120, 0);

        this.addLabel(150, 1);
        this.addLabel(100, 1);
        this.addLabel(80, 1);

        this.addLabel(70, 2);
        this.addLabel(190, 2);
        this.addLabel(80, 2);

        this.addLabel(210, 3);
        this.addLabel(70, 3);
        this.addLabel(130, 3);

        this.addLabel(140, 4);
        this.addLabel(80, 4);
        this.addLabel(120, 4);

        this.addLabel(230, 5);
        this.addLabel(70, 5);
        this.addLabel(90, 5);
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
            let TOP_Y_CURRENT_COL = 0;
            let BOTTOM_Y_CURRENT_COL = 900;

            //console.log("LEFT_X_CURRENT_COL = " + LEFT_X_CURRENT_COL); //This currently gives NaN.
            //console.log("RIGHT_X_CURRENT_COL = " + RIGHT_X_CURRENT_COL);

            //Check if the mouse pointer is within a column.
            //If true, check individual labels and the BREAK out of this for loop.
            if(pointer.x >= LEFT_X_CURRENT_COL && pointer.x <= RIGHT_X_CURRENT_COL &&
                pointer.y >= TOP_Y_CURRENT_COL && pointer.y <= BOTTOM_Y_CURRENT_COL){
                console.log("DEBUG: Mouse clicked inside of column " + columnIndex + ".");
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

        console.log("insideColumn = " + insideColumn);
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
            this.checkIfMouseWithinKanbanColumn(pointer);
        });

        // Capture any mouse movement in the scene
        this.kanbanStation.input.on('pointermove', (pointer) => {
            //console.log('SCENE-WIDE Pointer moved to:', pointer.x, pointer.y);
        });
    }
}