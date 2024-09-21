/*
* Review Station.
* Max started working on this code. It was copied and pasted from Gabbie's "PrepareStation.js" code and then modified.
*/

/*
* Plans for implementing review station functionality:
* Need to call pizza's info from somewhere to display the image of the finished pizza
* Add section for notes to be taken on pizza which will be saved somewhere.
* Could add a ticket class which stores the pizza object, 
* notes about it, and the stage the pizza is at.
* Tickets would show up on the kanban board in the section their stage indicates? 
* Review class will display the pizza, the instructions given to make the pizza 
* and have two buttons to either remake the pizza or allow it to be served. 
* Review can't be completed without some notes being taken in the review section. 
* At the end of the day could display review notes to help demonstrate 
* what sections went well or didn't.
*/

import Station from './Station.js';
import Pizza from './Pizza.js'; // Import the Pizza class

export default class ReviewStation extends Station {
    
    
    constructor() {
        super({ key: 'ReviewStation' });
    }

    preload() {
       
    }

    create() {
        this.createBackground();

        // Game logic here
        // Add review title to top of screen
        this.add.text(100, 100, 'Review', { fontSize: '32px', fontFamily: 'Calibri', fill: '#fff'});

        // Add button to go back to kanban board in bottom right
        this.add.text(50, this.game.config.height - 100, 'Back to Kanban Board', { fontSize: '20px', fill: '#fff', fontFamily: 'Calibri', backgroundColor: '#996600' })
            .setInteractive()
            .on('pointerdown', () => this.scene.start('KanbanStation'));

        //Add a text box on right side of screen people can type in

        //Add button to restart order - needs functionality
        this.add.text(200, this.game.config.height - 100, 'Reject', { fontSize: '20px', fill: '#fff', fontFamily: 'Calibri', backgroundColor: '#f44336' });

        //Add button to allow order through - needs functionality
        this.add.text(250, this.game.config.height - 100, 'Serve', { fontSize: '20px', fill: '#fff', fontFamily: 'Calibri', backgroundColor: '#8fce00' });

    }

    createBackground() {
        // Set a specific background color for the ReviewStation
        this.cameras.main.setBackgroundColor('#00e699');

        // Add functionality here to display the pizza image 
    }


}
