import { Canvas } from "./canvas.js";
import { Watcher } from "./watcher.js";

class Renderer extends Watcher {
    #lastTimestamp = 0;
    #subscribers = [];
    #maxFPS = 60;
    #interval = (1000 / this.#maxFPS).toFixed(2);
    #isRendering = false;

    constructor() {
        super();
        this._setCanvas(new Canvas());
    }

    /**
     * @param {number} timestamp 
     */
    #render(timestamp = 0) {
        const deltaTime = timestamp - this.#lastTimestamp;

        if (deltaTime >= this.#interval) {
            this.#lastTimestamp = timestamp - (deltaTime % this.#interval);

            this.#subscribers.forEach((subscriber) => {
                subscriber.fn(deltaTime / 1000);
            });
        }
    
        requestAnimationFrame(this.#render.bind(this));
    }

    subscribe({ controller = (_) => { }, debug = HTMLElement }) {
        // this.#subscribers.push({ type: 'debug', el: debug });
        this.#subscribers.push({ type: 'controller', fn: controller });

        if (!this.#isRendering) {
            this.#isRendering = true;
            this.#render();
        }
    }

    getContext() {
        return this.getCanvas().getContext();
    }

    isRendering() {
        return this.#isRendering;
    }
}

export { Renderer };
