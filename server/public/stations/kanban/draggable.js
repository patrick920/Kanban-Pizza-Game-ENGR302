//Code below copied from video tutorial: https://www.youtube.com/watch?v=jWglIBp4usY&ab_channel=ScottWestover
//If you're wondering how the code below works, that video explains it quite well.
//This code contains functions to drag an object across the screen when the mouse is pressed down over it.
export function makeDraggable(gameObject, enableLogs = false) {
    gameObject.setInteractive(); //Allows us to register our event listeners.

    function log(message){
        //Only log message if "enableLogs" is true.
        if(enableLogs){
            console.debug(message);
        }
    }

    //From my testing: This function will be called if the mouse MOVES over the rectangle, regardless
    //of whether or not the mouse button is held down or not.
    //"pointer" is Phaser thing that has a bunch of data on the cursor's position in our game.
    function onDrag(pointer){
        //Name under game objects can be used to give a unique name to this name, useful for debugging purposes.
        log(`[makeDraggable:onDrag] invoked for game object: ${gameObject.name}`) //... reference game object property.

        //Update the rectangle to the pointer's x and y values, in other words move around the rectangle with the mouse.
        gameObject.x = pointer.x;
        gameObject.y = pointer.y;
    }

    //From my testing: This function will be called if the mouse is RELEASED over the rectangle. It will not be called
    //if the mouse is released anywhere else in the game, even if the user initially clicked on the rectangle.
    function stopDrag(){
        //Name under game objects can be used to give a unique name to this name, useful for debugging purposes.
        log(`[makeDraggable:stopDrag] invoked for game object: ${gameObject.name}`) //... reference game object property.

        gameObject.on(Phaser.Input.Events.POINTER_DOWN, startDrag); //Reference to "startDrag" function.
        gameObject.off(Phaser.Input.Events.POINTER_UP, stopDrag);
        gameObject.off(Phaser.Input.Events.POINTER_MOVE, onDrag);
    }

    //From my testing: This function will be called if the mouse is CLICKED DOWN over the rectangle.
    //Will encapsulate within this scope so that when stuff is called we know which one is running???
    function startDrag(){
        //Name under game objects can be used to give a unique name to this name, useful for debugging purposes.
        log(`[makeDraggable:startDrag] invoked for game object: ${gameObject.name}`) //... reference game object property.

        gameObject.off(Phaser.Input.Events.POINTER_DOWN, startDrag); //Reference to "startDrag" function.
        gameObject.on(Phaser.Input.Events.POINTER_UP, stopDrag);
        gameObject.on(Phaser.Input.Events.POINTER_MOVE, onDrag);
    }

    //Called when the stuff gets destroyed, free up event listeners so they're not taking up memory.
    function destroy(){
        //Name under game objects can be used to give a unique name to this name, useful for debugging purposes.
        log(`[makeDraggable:destroy] invoked for game object: ${gameObject.name}`) //... reference game object property.

        gameObject.off(Phaser.Input.Events.POINTER_DOWN, startDrag); //Reference to "startDrag" function.
        gameObject.off(Phaser.Input.Events.POINTER_UP, stopDrag);
        gameObject.off(Phaser.Input.Events.POINTER_MOVE, onDrag);
    }

    gameObject.on(Phaser.Input.Events.POINTER_DOWN, startDrag); //Reference to "startDrag" function.
    //gameObject.on(Phaser.Input.Events.POINTER_UP, stopDrag);
    //gameObject.on(Phaser.Input.Events.POINTER_MOVE, onDrag);

    //Best practice to destroy event listeners when we're done so they're not taking up memory.
    //Will be called anytime our game object is being destroyed, e.g. when our scene is shut down, or if
    //object were to be removed.
    gameObject.on(Phaser.GameObjects.Events.DESTROY, destroy);
}