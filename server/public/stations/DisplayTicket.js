/*
 * This file will have code to display a ticket onto the screen.
 * The order details as well as the pizza state will be displayed.
 */

const TICKET_WIDTH = 180;

/**
 * Display a ticket on the specified scene.
 * @param {*} scene Phaser Scene, which would be one of the stations.
 * @param {*} ticket The "Ticket" object containing the "Order" and "Pizza" objects.
 * @param {*} xPos Top x position to draw the ticket on the scene.
 * @param {*} yPos Top y position to draw the ticket on the scene.
 */
export function displayTicket(scene, ticket, xPos, yPos){
    console.log("displayTicket() function called.");
    const container = scene.add.container(xPos, yPos);
}

// export default class DisplayTicket {
//     TICKET_WIDTH = 180; 
// }