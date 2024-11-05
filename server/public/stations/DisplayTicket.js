/*
 * This file will have code to display a ticket onto the screen.
 * The order details as well as the pizza state will be displayed.
 */

const TICKET_WIDTH = 180;
const TICKET_HEIGHT = 400;

/**
 * Display a ticket on the specified scene.
 * @param {*} scene Phaser Scene, which would be one of the stations.
 * @param {*} ticket The "Ticket" object containing the "Order" and "Pizza" objects.
 * @param {*} xPos Top x position to draw the ticket on the scene.
 * @param {*} yPos Top y position to draw the ticket on the scene.
 */
export function displayTicket(scene, ticket, xPos, yPos){
    console.log("displayTicket() function called.");
    const BACKGROUND_COLOR = 0x091447;

    const container = scene.add.container(xPos, yPos);

    const mainRectangle = scene.add.rectangle(0, 0, TICKET_WIDTH, TICKET_HEIGHT, BACKGROUND_COLOR);
    //mainRectangle.setInteractive();
    mainRectangle.setOrigin(0, 0); // Set origin to top-left //New code after further ChatGPT prompt.

    //Add the main rectangle to the main container.
    container.add(mainRectangle);

    //TODO: Make a list of text, that way you can easily add or remove text and it will automatically reposition
    //everything in the right place.
    let textList = []; //Each element in the list will be displayed in a row.
    textList.push("Example 1");
    textList.push("Example 2");
    textList.push("Example 3");
}

// export default class DisplayTicket {
//     TICKET_WIDTH = 180; 
// }