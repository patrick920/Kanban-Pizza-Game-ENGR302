// import { addImageDynamically } from './phaser_game.js';
//Code from ChatGPT:
import { game } from './phaser_game.js';
import { kanbanLabelsList } from './stations/kanban/KanbanBoard.js';
//Don't have to import io I think.
const socket = io('ws://localhost:3500')

//Send message might have event e.
function sendMessage(e) {
    e.preventDefault() //Submit form without reloading the page.
    const input = document.querySelector('input')
    if (input.value) {
        socket.emit('message', input.value)
        input.value = "" //After we send it, want to erase what's already in the input.
    }
    input.focus() //Put the focus back on the input.
}

//Send message with the kanban labels list
//export function sendKanbanMessage(operation, data) {
export function sendKanbanMessage(e) {
    console.log("sendKanbanMessage: operation: ", operation);
    //socket.emit('message', newKanbanLabelsList)
    //Code from ChatGPT:
    // const serializedList = JSON.stringify(newKanbanLabelsList); // Convert to JSON string
    // socket.emit('message', serializedList);
    //socket.emit('message', [operation, data])
    //socket.emit('message', { operation: 'addLabel' });
    //socket.emit('message', JSON.stringify({ operation: "addLabel" }));

    e.preventDefault() //Submit form without reloading the page.
    const input = document.querySelector('input')
    if (input.value) {
        socket.emit('message', input.value)
        input.value = "" //After we send it, want to erase what's already in the input.
    }
    input.focus() //Put the focus back on the input.
}

//Listening for the submit event of the form. Then call "sendMessage" function.
document.querySelector('form')
    .addEventListener('submit', sendMessage)

//Listen for messages. "on" is the message event. Will call this function when we get an event I think.
socket.on("message", (data) => {
    // try {
    //     const parsedData = JSON.parse(data);
    //     console.log("Parsed operation:", parsedData.operation);
    // } catch (e) {
    //     console.error("Failed to parse data:", e);
    // }


    // // li is list item.
    // const li = document.createElement('li')
    // li.textContent = data //data is essentially the message from the server.
    // // I think this should add a list item containing the server's message.
    // document.querySelector('ul').appendChild(li)

    //Add the pizza image to the Phaser game.
    //Line below from ChatGPT:
    //addImageDynamically();
    console.log("MESSAGE RECEIVED GLOBALLY: " + data);
    //From ChatGPT:
    //console.log("Received operation:", data.operation);

    //game.scene.start('KanbanStation'); //This works successfully.
    //const kanbanStation = game.scene.get('KanbanStation'); //Gives error:
    // Ensure the scene is started somewhere in the code first
    //const kanbanScene = game.scene.getScene('KanbanStation');

    if (typeof data === 'string') {
        // Split the string by commas
        const parts = data.split(',');

        // Assuming the first part is the operation and the rest are list entries
        const operation = parts[0];
        const labelsList = parts.slice(1).map(item => {
            // Convert "[object Object]" back to actual object if possible
            return item === "[object Object]" ? {} : item;
        });

        console.log("Operation:", operation);
        console.log("Parsed labelsList:", labelsList);

        // Now `labelsList` should contain parsed elements
        // Proceed with your processing
    } else {
        console.error("Unexpected data format:", data);
    }

    // const operation = data[0];
    // const content = data[1];
    // console.log(typeof(data));
    // console.log("operation = " + operation);
    // console.log("content = " + content);

    // if(operation == "addLabel"){
    //     //Add label to the "kanbanLabelsList".
    //     console.log("In app.js, add label.");
    //     kanbanLabelsList[0].push(new KanbanLabel(this, this.kanbanBoard, 81, 0, ticket, [
    //         "Order #",
    //         pizzaQuantity + " pizza(s) with:",
    //         pepperoniQuantity + " pepperoni",
    //         mushroomQuantity + " mushroom(s)"
    //     ]));
    //     this.kanbanBoard.debugPrintKanbalLabelsListContent(0); //Print the first column for debugging purposes.
    //     //Also redraw everything.
    //     this.kanbanBoard.displayLabels();
    // }

    //Set the list of Kanban labels to the new one.
    /*
    kanbanLabelsList = data;

    if (game.scene.isActive('KanbanStation')) {
        // The scene is active, so we can safely get it
        //const kanbanScene = game.scene.get('KanbanStation');
        const kanbanStation = game.scene.getScene('KanbanStation'); //Get the KanbanStation Phaser Scene.
        kanbanStation.kanbanBoard.displayLabels();
        console.log('KanbanStation is active and ready to use:', kanbanStation);
    } else {
        // The scene is not active, so you may want to start it or handle this case differently
        //console.log('KanbanStation is not active. Starting the scene now.');
        //game.scene.start('KanbanStation');
        // Optionally, retrieve the scene after starting it
        //const kanbanScene = game.scene.get('KanbanStation');
        console.log("KanbanStation is not active, so do not redraw the labels. However, update the kanbanLabelsList.");
    }
    console.log("Got the KanbanStation object.");
    */
})

/*
* -----------------------------------------------------------------------------------------------------
* Phaser Code:
* -----------------------------------------------------------------------------------------------------
* Everything above was socket code, this below is Phaser code.
*/