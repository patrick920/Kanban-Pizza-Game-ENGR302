/*
 * This class will be used to store labels on the Kanban board.
 * Each label will be stored as a Phaser Container.
 * There will be a button on each Kanban label to go the corresponding station of the column it's
 * currently in.
 * 
 * Sources:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
 */

class KanbanLabel {
    //TODO: Add the Ticket/Label object that will be created by the Pizza order.
    //For now, maybe have a test constructor that initialises dummy things such as text.

    constructor(){
        //This constructor will take the ticket/label object for the Pizza order.
    }

    /**
     * This is a TEST constructor. The proper one will take the ticket/label object for the Pizza order, and will be
     * instantiated when a pizza order is submitted (when the player takes the order from the customer.)
     * @param {*} textList List of text objects.
     * @param {*} height The height can be set, but the width is fixed to the column width.
     */
    constructor(labelList, height){
        this.labelList = labelList
        this.height = height

        
    }

    //Put and display the label on the first column.
    putLabelOnKanbanBoard(){

    }

    //TODO: Create list of buttons to each of the stations. These will changed based on which column the label is on.

    //TODO: Create a function to change classes. This could be static as the functionality will be the same everywhere.
    //But for simplicity, might be easier not to make it static at this stage. No, don't make it static.

    //TODO: Create a KanbanBoard class and copy and pasted the KanbanStation code to there for layout and positioning.
}