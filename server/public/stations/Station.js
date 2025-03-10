export default class Station extends Phaser.Scene {
    // Create tabs at the bottom of the screen to switch to other scenes
    createNavigationTabs() {
        const buttonY = this.game.config.height -50;

        const orderButton = this.add.text(100, buttonY, 'Back to Order', { fontSize: '20px', fill: '#fff', fontFamily: 'Calibri', backgroundColor: '#007bff' })
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.launch('OrderStation');
                this.scene.bringToTop('OrderStation');
                this.scene.pause();
             }); 

        // const prepareButton = this.add.text(300, buttonY, 'Prepare', { fontSize: '20px', fill: '#fff', fontFamily: 'Calibri', backgroundColor: '#ffc107' })
        //     .setInteractive()
        //     .on('pointerdown', () => this.scene.start('PrepareStation'));

        // const cookButton = this.add.text(500, buttonY, 'Cook', { fontSize: '20px', fill: '#fff', fontFamily: 'Calibri', backgroundColor: '#28a745' })
        //     .setInteractive()
        //     .on('pointerdown', () => this.scene.start('CookStation'));
        
        const kanbanButton = this.add.text(700, buttonY, 'Kanban Board', { fontSize: '20px', fill: '#fff', fontFamily: 'Calibri', backgroundColor: '#28a745' })
            .setInteractive()
            .on('pointerdown', () => {
                //    this.scene.launch('KanbanStation'); // Launch Kanban without restarting it
                //    this.scene.bringToTop('KanbanStation'); // Bring Kanban scene to the front
                //    this.scene.pause(); // Pause the current scene
                //New code to integrate the Kanban board into the Cook Station.
                //This is to try and fix a bug.
                this.scene.start('KanbanStation');
            });        

        // const reviewButton = this.add.text(900, buttonY, 'Review', { fontSize: '20px', fill: '#fff', fontFamily: 'Calibri', backgroundColor: '#a7288a' })
        //     .setInteractive()
        //     .on('pointerdown', () => this.scene.start('ReviewStation'));
    }
}
