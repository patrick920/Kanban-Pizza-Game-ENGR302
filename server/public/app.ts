import { io } from 'socket.io-client';

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
})

/*
* -----------------------------------------------------------------------------------------------------
* Phaser Code:
* -----------------------------------------------------------------------------------------------------
* Everything above was socket code, this below is Phaser code.
*/