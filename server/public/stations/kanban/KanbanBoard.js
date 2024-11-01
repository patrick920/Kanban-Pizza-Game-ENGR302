/*
 * kanbanStation file will hold all the display code for the Kanban board, to keep KanbanStation.js cleaner and not too long.
 */

import KanbanLabel from './KanbanLabel.js';

//TODO: Have a list for each of the stations with the labels currently in there. Have a hardcoded list for each
//one as it will be simpler. NO, get the list from the KanbanStation that has already been defined.

//Source: https://www.w3schools.com/js/js_const.asp
const TOP_TO_TITLE_GAP = 10;
const TITLE_TEXT_HEIGHT = 40;
const TITLE_TO_COLUMN_TITLES_HEIGHT = 5; //Used to be 10.
const COLUMN_TITLES_TEXT_HEIGHT = 20; //Used to be 15.
//The width of the Kanban board column.
const COLUMN_RECTANGLE_WIDTH = 200;
//The gap between the Kanban board column and the menu at the bottom of the screen.
const COLUMN_RECTANGLES_TO_MENU_GAP = 10;
//Y position for the start of the buttons for the menu at the bottom of the screen.
const Y_MENU_START = 100;
//The gap between each of the Kanban board columns.
const GAP_BETWEEN_COLUMN_RECTANGLES = 14;
//The additional gap at the left and right sides of the screen, as when you divide an odd number is produced so must
//balance things out.
const ADDITIONAL_GAP_BESIDE_COLUMN_RECTANGLES_LEFT_RIGHT_SCREEN = 1;

/**
 * Have just a 1D list, not a 2D list for the labels on the Kanban board. This is because there can
 * be an attribute somewhere that stores its position, maybe in the KanbanLabel class itself.
 * 
 * This does not store all tickets, it only stores the ones that should be visible on the board.
 */
let kanbanLabelsList = []

export default class KanbanBoard{
    constructor(kanbanStation) {
        this.kanbanStation = kanbanStation;
    }

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
     */
    addLabel(){
        //"push" is used to add to the list.
        kanbanLabelsList.push(new KanbanLabel(this.kanbanStation, 200, [this.kanbanStation.add.text("Top"),
            this.kanbanStation.add.text("Bottom")]));
    }
    
    displayLabels(){
        //Use the lists in KanbanStation.
        for(let i = 0; i < kanbanLabelsList.length; i++){
            console.log("Display label " + i + " on the Kanban board.");
            let currentLabel = kanbanLabelsList[i];
            //Random number code from ChatGPT.
            currentLabel.drawLabelOnKanbanBoard(Math.floor(Math.random() * (800 - 200 + 1)) + 200);
            //Call a method to display the label. EVERYTHING about positioning is decided by KanbanLabel except for
            //the y position on the column which is decided here.
        }
    }

    createTestLabels(){
        //Create several test labels on the Kanban board automatically for testing purposes.
        //kanbanStation code should be removed later on.
        this.addLabel();
        this.addLabel();
    }

}