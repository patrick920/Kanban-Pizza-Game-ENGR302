export default class GameStateManager {
    constructor() {
        if (!GameStateManager.instance) {
            this.currentTicket = null;
            GameStateManager.instance = this;
        }
        return GameStateManager.instance;
    }

    setCurrentTicket(ticket) {
        this.currentTicket = ticket;
    }

    getCurrentTicket() {
        return this.currentTicket;
    }

    clearCurrentTicket() {
        this.currentTicket = null;
    }
}