export default class Ticket {
    pizza; 
    
    constructor(order, instructions) {
        this.order = order; // Order associated with this ticket
        this.instructions = instructions; 
        this.station = "prepare"; // Set the initial station
    }

    getInstructions(){
        return this.instructions; 
    }

    setPizza(pizza) {
        this.pizza = pizza;
    }

    getPizza() {
        return this.pizza;
    }

    getOrder() {
        return this.order;
    }
}
