import Station from './Station.js';

export default class CookStation extends Station {
    constructor() {
        super({ key: 'CookStation' });
        this.preparedPizzas = [];
        this.cookingPizzas = [];
        this.cookedPizzas = [];
        this.oven = null;
        this.cookingTimers = {};
    }

    preload() {
        this.load.image('oven', 'stations/assets/oven.png');
        this.load.image('pizza', 'stations/assets/pizza.png');
    }

    create() {
        this.createBackground();
        this.add.text(100, 50, 'Cook Station', { fontSize: '32px', fill: '#fff', fontFamily: 'Calibri' });
        this.createNavigationTabs();

        // Create oven
        this.oven = this.add.image(400, 300, 'oven').setScale(0.5);
        
        // Create cooking slots
        this.cookingSlots = [
            { x: 350, y: 250 },
            { x: 450, y: 250 },
            { x: 350, y: 350 },
            { x: 450, y: 350 }
        ];

        // Display prepared pizzas
        this.preparedPizzasText = this.add.text(50, 100, 'Prepared Pizzas:', { fontSize: '24px', fill: '#fff', fontFamily: 'Calibri' });
        
        // Display cooked pizzas
        this.cookedPizzasText = this.add.text(800, 100, 'Cooked Pizzas:', { fontSize: '24px', fill: '#fff', fontFamily: 'Calibri' });

        // Listen for prepared pizzas updates
        this.game.socket.on('preparedPizzasUpdate', (preparedPizzas) => {
            this.preparedPizzas = preparedPizzas;
            this.updatePreparedPizzasDisplay();
        });

        // Listen for cooked pizzas updates
        this.game.socket.on('cookedPizzasUpdate', (cookedPizzas) => {
            this.cookedPizzas = cookedPizzas;
            this.updateCookedPizzasDisplay();
        });

        // Get initial game state
        this.game.socket.on('initialGameState', (gameState) => {
            this.preparedPizzas = gameState.preparedPizzas;
            this.cookedPizzas = gameState.cookedPizzas;
            this.updatePreparedPizzasDisplay();
            this.updateCookedPizzasDisplay();
        });
    }

    createBackground() {
        this.cameras.main.setBackgroundColor('#333333');
    }

    updatePreparedPizzasDisplay() {
        if (this.preparedPizzaItems) {
            this.preparedPizzaItems.forEach(item => item.destroy());
        }
        this.preparedPizzaItems = [];

        this.preparedPizzas.forEach((pizza, index) => {
            const pizzaItem = this.add.text(50, 140 + index * 30, `Pizza ${pizza.id}: ${pizza.size} - ${pizza.toppings.join(', ')}`, { fontSize: '18px', fill: '#fff', fontFamily: 'Calibri' });
            pizzaItem.setInteractive().on('pointerdown', () => this.startCooking(pizza));
            this.preparedPizzaItems.push(pizzaItem);
        });
    }

    updateCookedPizzasDisplay() {
        if (this.cookedPizzaItems) {
            this.cookedPizzaItems.forEach(item => item.destroy());
        }
        this.cookedPizzaItems = [];

        this.cookedPizzas.forEach((pizza, index) => {
            const pizzaItem = this.add.text(800, 140 + index * 30, `Pizza ${pizza.id}: ${pizza.size} - Cooked`, { fontSize: '18px', fill: '#fff', fontFamily: 'Calibri' });
            this.cookedPizzaItems.push(pizzaItem);
        });
    }

    startCooking(pizza) {
        if (this.cookingPizzas.length < 4) {
            const slot = this.cookingSlots[this.cookingPizzas.length];
            const cookingPizza = this.add.image(slot.x, slot.y, 'pizza').setScale(0.2);
            
            this.cookingPizzas.push({ pizza, cookingPizza });
            
            // Remove from prepared pizzas
            this.preparedPizzas = this.preparedPizzas.filter(p => p.id !== pizza.id);
            this.game.socket.emit('preparedPizzasUpdate', this.preparedPizzas);
            
            this.updatePreparedPizzasDisplay();

            // Start cooking timer
            const cookingTime = this.calculateCookingTime(pizza);
            this.cookingTimers[pizza.id] = this.time.delayedCall(cookingTime, () => this.finishCooking(pizza), [], this);

            // Start burning timer
            const burningTime = cookingTime * 1.5; // 50% more time to burn
            this.cookingTimers[`burn_${pizza.id}`] = this.time.delayedCall(burningTime, () => this.burnPizza(pizza), [], this);

            // Make the cooking pizza interactive
            cookingPizza.setInteractive().on('pointerdown', () => this.removePizza(pizza));
        } else {
            this.add.text(400, 500, 'Oven is full!', { fontSize: '24px', fill: '#ff0000', fontFamily: 'Calibri' }).setOrigin(0.5);
        }
    }

    calculateCookingTime(pizza) {
        // Base cooking time
        let cookingTime = 5000; // 5 seconds base time

        // Add time for each topping
        cookingTime += pizza.toppings.length * 1000; // 1 second per topping

        // Adjust for size
        if (pizza.size === 'large') {
            cookingTime *= 1.5; // 50% more time for large pizzas
        }

        return cookingTime;
    }

    finishCooking(pizza) {
        const cookedPizza = {
            id: pizza.id,
            size: pizza.size,
            toppings: pizza.toppings,
            status: 'Cooked'
        };
        
        this.cookedPizzas.push(cookedPizza);
        this.game.socket.emit('pizzaCooked', cookedPizza);
        
        this.updateCookedPizzasDisplay();
    }

    burnPizza(pizza) {
        const cookingPizzaIndex = this.cookingPizzas.findIndex(cp => cp.pizza.id === pizza.id);
        if (cookingPizzaIndex !== -1) {
            const { cookingPizza } = this.cookingPizzas[cookingPizzaIndex];
            cookingPizza.setTint(0x000000); // Turn the pizza black to indicate burning
            
            // Remove the pizza from cooking pizzas after a short delay
            this.time.delayedCall(2000, () => {
                this.removePizza(pizza, true);
            });
        }
    }

    removePizza(pizza, isBurnt = false) {
        const cookingPizzaIndex = this.cookingPizzas.findIndex(cp => cp.pizza.id === pizza.id);
        if (cookingPizzaIndex !== -1) {
            const { cookingPizza } = this.cookingPizzas[cookingPizzaIndex];
            cookingPizza.destroy();
            this.cookingPizzas.splice(cookingPizzaIndex, 1);

            // Clear timers
            if (this.cookingTimers[pizza.id]) {
                this.cookingTimers[pizza.id].remove();
                delete this.cookingTimers[pizza.id];
            }
            if (this.cookingTimers[`burn_${pizza.id}`]) {
                this.cookingTimers[`burn_${pizza.id}`].remove();
                delete this.cookingTimers[`burn_${pizza.id}`];
            }

            if (isBurnt) {
                // Send the pizza back to be remade
                this.game.socket.emit('pizzaBurnt', pizza);
            } else {
                // Add to cooked pizzas if not burnt
                this.finishCooking(pizza);
            }
        }
    }

    update() {
        // Update cooking pizzas visuals
        this.cookingPizzas.forEach(({ pizza, cookingPizza }) => {
            const elapsedTime = this.time.now - this.cookingTimers[pizza.id].getElapsed();
            const cookingTime = this.calculateCookingTime(pizza);
            const cookingProgress = Math.min(elapsedTime / cookingTime, 1);
            
            cookingPizza.setTint(Phaser.Display.Color.GetColor(
                255,
                255 - (cookingProgress * 255),
                255 - (cookingProgress * 255)
            ));
        });
    }
}