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

    // TODO: add logic to instantiate controller before first Renderer call

    // get every entities that need to be updated
    // send them to the renderer
    launch() {
        if (!this.#initialized) {
            throw new Error('Engine not initialized');
        }

        const debug = document.getElementById('fps');
        this.#controller.instantiate();
        this.#renderer.subscribe({ controller: (dT) => this.#controller.onUpdate(dT), debug: debug });

        console.log('Engine launched');
        console.log('Entities:', this.#controller.getEntities());
    }
}

export { Engine };