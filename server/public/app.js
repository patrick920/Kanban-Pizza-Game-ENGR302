// import { addImageDynamically } from './phaser_game.js';
//Code from ChatGPT:
import { game } from './phaser_game.js';
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

//Listening for the submit event of the form. Then call "sendMessage" function.
document.querySelector('form')
    .addEventListener('submit', sendMessage)

//Listen for messages. "on" is the message event. Will call this function when we get an event I think.
socket.on("message", (data) => {
    //li is list item.
    const li = document.createElement('li')
    li.textContent = data //data is essentially the message from the server.
    //I think this should add a list item containing the server's message.
    document.querySelector('ul').appendChild(li)

    //Add the pizza image to the Phaser game.
    //Line below from ChatGPT:
    //addImageDynamically();
    console.log("MESSAGE RECEIVED GLOBALLY: " + data);
    //From ChatGPT:
    //game.scene.start('KanbanStation'); //This works successfully.
    //const kanbanStation = game.scene.get('KanbanStation'); //Gives error:
    // Ensure the scene is started somewhere in the code first
    //const kanbanScene = game.scene.getScene('KanbanStation');

    if (game.scene.isActive('KanbanStation')) {
        // The scene is active, so we can safely get it
        //const kanbanScene = game.scene.get('KanbanStation');
        const kanbanScene = game.scene.getScene('KanbanStation');
        console.log('KanbanStation is active and ready to use:', kanbanScene);
    } else {
        // The scene is not active, so you may want to start it or handle this case differently
        //console.log('KanbanStation is not active. Starting the scene now.');
        //game.scene.start('KanbanStation');
        // Optionally, retrieve the scene after starting it
        //const kanbanScene = game.scene.get('KanbanStation');
        console.log("KanbanStation is not active, so do not redraw the labels. However, update the kanbanLabelsList.");
    }
    console.log("Got the KanbanStation object.");
})

/*
* -----------------------------------------------------------------------------------------------------
* Phaser Code:
* -----------------------------------------------------------------------------------------------------
* Everything above was socket code, this below is Phaser code.
*/