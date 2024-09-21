import express from 'express'
import { Server } from "socket.io"
import path from 'path' //Node.js module.
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

//If port is not defined in the env file, use 3500.
const PORT = process.env.PORT || 3500

//Refer to server as app???
const app = express()

//Middleware???
//Will have problem later.
//dirname is not available in modules, so will need to apply the fix.
app.use(express.static(path.join(__dirname, "public")))

const expressServer = app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})

//const httpServer = createServer()

const io = new Server(expressServer, {
    //Will talk about CORS.
    cors: {
        //If it equals production then we'll say false. Don't want anyone outside of domain to
        //access it. 5500 is where LiveServer hosts our application at.
        //An issue will come up with this.
        //If backend were on a different doamin, then you would have to list it.
        //localhost and 127.0.0.1 are the same thing, but CORS interprets them as different things.

        //With express, will host the front-end application with Express on the server as well. So won't
        //have to address this further here.
        origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:5500", "http://127.0.0.1:5500",
            "http://localhost:5501", "http://127.0.0.1:5501"
        ]
        //Note: I added 5501 above in case Live Server starts it with 5501 instead of 5500.
    }
})

// Game state
const gameState = {
    orders: [],
    preparedPizzas: [],
    cookedPizzas: [],
    kanbanTasks: []
}

//Connection then listen.
//Will echo message that was sent.
io.on('connection', socket => {
    console.log(`User ${socket.id} connected`)

        
    // Send initial game state to the new user
    socket.emit('initialGameState', gameState)

    socket.on('message', data => { //Listen for a message?
        console.log(data)
        //emit sends the message to EVERYONE who is connected to the server.
        io.emit('message', `${socket.id.substring(0, 5)}: ${data}`) //Send that message back.
    })
     // Order Station events
     socket.on('newOrder', order => {
        gameState.orders.push(order)
        io.emit('orderUpdate', gameState.orders)
    })

    // Prepare Station events
    socket.on('pizzaPrepared', pizza => {
        gameState.preparedPizzas.push(pizza)
        io.emit('preparedPizzasUpdate', gameState.preparedPizzas)
    })

    // Cook Station events
    socket.on('pizzaCooked', pizza => {
        gameState.cookedPizzas.push(pizza)
        io.emit('cookedPizzasUpdate', gameState.cookedPizzas)
    })

    // Kanban Station events
    socket.on('kanbanUpdate', tasks => {
        gameState.kanbanTasks = tasks
        io.emit('kanbanTasksUpdate', gameState.kanbanTasks)
    })

    // Disconnect event
    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`)
    })
})
