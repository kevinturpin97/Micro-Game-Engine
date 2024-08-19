import { Controller } from "./controller.js";
import { Renderer } from "./renderer.js";

class Engine {
    #renderer = Renderer;
    #controller = Controller;
    #initialized = false;

    constructor() {
        // controller will be here
        this.#controller = new Controller();
        this.#renderer = new Renderer();
    }

    init() {
        if (this.#initialized) {
            throw new Error('Engine already initialized');
        }

        this.#controller.setContext(this.#renderer.getContext());
        this.#controller.init();

        this.#initialized = true;

        console.log('Engine initialized');
    }

    // get every entities that need to be updated
    // send them to the renderer
    launch() {
        if (!this.#initialized) {
            throw new Error('Engine not initialized');
        }

        this.#renderer.toUpdate(this.#controller.getEntities());

        console.log('Engine launched');
        console.log('Entities:', this.#controller.getEntities());
    }
}

export { Engine };