// ImagePreloader.js
export default class ImagePreloader {
    static preloadImages(scene) {
        // Pizza base
        scene.load.image('pizzaBase', 'stations/assets/pizza_base_raw.png');
        scene.load.image('pizzaBaseCooked', 'stations/assets/pizza_base_cooked.png');
        scene.load.image('pizzaBaseBurnt', 'stations/assets/pizza_base_burnt.png');
        
        // Sauce
        scene.load.image('pizzaSauce', 'stations/assets/sauce.png');
        
        // Cheese
        scene.load.image('cheeseUncooked', 'stations/assets/cheese_uncooked.png');
        scene.load.image('cheeseCooked', 'stations/assets/cheese_cooked.png');
        
        // Toppings
        scene.load.image('pepperoniSlice', 'stations/assets/pepperoni_slice.png');
        scene.load.image('mushroomSlice', 'stations/assets/mushroom_slice.png');
        
        // Other station-specific images
        scene.load.image('tomatoPaste', 'stations/assets/sauce_bucket.png');
        scene.load.image('pepperoniTray', 'stations/assets/pepperoni_tray.png');
        scene.load.image('cheese', 'stations/assets/cheese_block.png');
        
    }
}