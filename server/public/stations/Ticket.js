export default class Ticket {
    // An array for review notes (ticket may have been rejected and restarted)
    reviewNotes = []; 
    pizza; 
    
    constructor(order) {
        this.order = order; // Order associated with this ticket
        this.isCompleted = false; // Track if the ticket has been completed
        this.station = "prepare"; // Set the initial station
    }

    // Mark the ticket as completed
    completeTicket() {
        this.isCompleted = true;
        // Now the responsibility for completing the ticket lies with the KanbanStation
        // Remove reference to kanbanStation.completeTicket(ticket);
    }

    setPizza(pizza) {
        this.pizza = pizza;
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
