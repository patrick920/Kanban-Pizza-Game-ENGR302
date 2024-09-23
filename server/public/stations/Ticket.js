import KanbanStation from "./KanbanStation";

// needs further functionality

export default class Ticket {
    //an array as the ticket may have been rejected and restarted and multiple notes may be written
    reviewNotes = []; 
    constructor(pizza, order = '', kanbanStation) {
        this.pizza = pizza; // Reference to a Pizza object
        this.order = order; // Optional string of instructions for the pizza
        this.isCompleted = false; // Track if the ticket has been completed
        this.station = "prepare"; // Set the initial station
        this.kanbanStation = kanbanStation; // Reference to kanaban station
    }

    // Mark the ticket as completed
    completeTicket() {
        this.isCompleted = true;
        kanbanStation.completeTicket(ticket);
    }

    // Get the pizza object associated with this ticket
    getPizza() {
        return this.pizza;
    }

    // Get the order associated with this ticket
    getOrder() {
        return this.order;
    }

    // Get the station the pizza is currently at
    getStation() {
        return this.station; 
    }

    // Add the notes from the review
    setReviewNotes(notes) {
        this.reviewNotes.push(notes); 
    }
    // Get the review notes associated with this ticket
    getNotes() {
        return this.reviewNotes; 
    }

    
}
