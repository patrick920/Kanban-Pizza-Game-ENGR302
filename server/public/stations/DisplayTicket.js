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
    const PADDING = 5;

    const container = scene.add.container(xPos + PADDING, yPos + PADDING);

    const mainRectangle = scene.add.rectangle(0, 0, TICKET_WIDTH, TICKET_HEIGHT, BACKGROUND_COLOR);
    //mainRectangle.setInteractive();
    mainRectangle.setOrigin(0, 0); // Set origin to top-left //New code after further ChatGPT prompt.

    //Add the main rectangle to the main container.
    container.add(mainRectangle);

    //TODO: Make a list of text, that way you can easily add or remove text and it will automatically reposition
    //everything in the right place.
    let textList = []; //Each element in the list will be displayed in a row.
    //textList.push("Example 1");

    //------------------------------------------------------------------------------------------
    //Get the "Order" object and add its contents to the list of text to be displayed.
    //------------------------------------------------------------------------------------------
    let currentOrder = ticket.getOrder();
    console.log("currentOrder.orderId = " + currentOrder.orderId); //Not relevant for now.
    console.log("currentOrder.pizzaType = " + currentOrder.pizzaType); // Not relevant for now.
    console.log("currentOrder.toppings = " + currentOrder.toppings);
    let currentToppings = currentOrder.toppings;
    for(let i = 0; i < currentToppings.length; i++){
        let topping = currentToppings[i];
        console.log("i = " + i + " | Topping: " + topping);
    }
    textList.push("Order #" + currentOrder.orderId + ":");

    //Code below from ChatGPT:
    // Function to get values for a specific key
    // Find the 'Pizza' entry and store its quantity in a variable
    const pizzaEntry = currentToppings.find(item => item.topping === 'Pizza');
    const pizzaQuantity = pizzaEntry ? pizzaEntry.quantity : 0;
    console.log("pizzaQuantity = " + pizzaQuantity);
    textList.push(pizzaQuantity + " pizza(s) with:");

    const pepperoniEntry = currentToppings.find(item => item.topping === 'Pepperoni');
    const pepperoniQuantity = pepperoniEntry ? pepperoniEntry.quantity : 0;
    console.log("pepperoniQuantity = " + pepperoniQuantity);
    textList.push(pepperoniQuantity + " pepperoni");

    const mushroomEntry = currentToppings.find(item => item.topping === 'Mushroom');
    const mushroomQuantity = mushroomEntry ? mushroomEntry.quantity : 0;
    console.log("mushroomQuantity = " + mushroomQuantity);
    textList.push(mushroomQuantity + " mushroom(s)");

    //------------------------------------------------------------------------------------------
    //Get the "Pizza" object and add its contents to the list of text to be displayed.
    //------------------------------------------------------------------------------------------
    textList.push("Current Pizza:");
    const pizza = ticket.getPizza();
    if (typeof pizza === 'undefined'){
        console.log("pizza is undefined. Must create a pizza (small/large) to proceed.");
        textList.push("Not created yet.");
        textList.push("Click the small/");
        textList.push("large button to");
        textList.push("create a pizza.");
    } else{
        //textList.push(pizza."")
        let sauceString = "Sauce: ";
        if(typeof pizza.sauce === 'undefined'){
            sauceString += "None";
        } else{
            sauceString += "Yes";
        }
        textList.push(sauceString);
    }

    //Display the text in the list of text strings on the rectangle.
    const TEXT_SIZE = 18;
    let currentYPos = PADDING; //Start with a bit of padding at the top.
    for(let i = 0; i < textList.length; i++){
        const label = scene.add.text(PADDING, currentYPos, textList[i],
                        {fontSize: TEXT_SIZE + 'px', fill: '#ffffff'});
        container.add(label);
        currentYPos += TEXT_SIZE + PADDING;
    }
}

// export default class DisplayTicket {
//     TICKET_WIDTH = 180; 
// }