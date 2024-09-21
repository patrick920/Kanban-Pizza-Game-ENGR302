/*
* Kanban Board Station.
* Patrick started working on this code. It was copied and pasted from Gabbie's "PrepareStation.js" code and then modified.
*/
import Station from './Station.js';
import Pizza from './Pizza.js'; // Import the Pizza class

export default class KanbanStation extends Station {
    constructor() {
        super({ key: 'KanbanStation' });
    }

    preload() {
        // // load tomato paste image
        // this.load.image('tomatoPaste', 'stations/assets/tomato_paste.png');
    }

    create() {
        this.createBackground();

        // Game logic here
        this.add.text(100, 100, 'Kanban Board', { fontSize: '32px', fontFamily: 'Calibri', fill: '#fff' });

        // Navigation buttons (from Station.js)
        this.createNavigationTabs();

        // Create tomato paste image
        //this.createTomatoPasteBottle();
    }

    createBackground() {
        // Set a specific background color for the PrepareStation
        this.cameras.main.setBackgroundColor('#996600');
        //this.createPizzaBaseButton(); // Setup pizza base buttons
    }

    /*
    createPizzaBaseButton() {
        const baseSmallButton = this.add.text(50, 200, 'Small Pizza Base', { fontSize: '20px', fill: '#000', fontFamily: 'Calibri', backgroundColor: '#ffd11a' })
            .setInteractive()
            .on('pointerdown', () => {
                this.createPizza('small');
            });
        const baseLargeButton = this.add.text(50, 250, 'Large Pizza Base', { fontSize: '20px', fill: '#000', fontFamily: 'Calibri', backgroundColor: '#ffd11a' })
            .setInteractive()
            .on('pointerdown', () => {
                this.createPizza('large');
            });
    }
    */
}
