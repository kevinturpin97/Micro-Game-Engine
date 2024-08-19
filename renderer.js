import { Canvas } from "./canvas.js";
import { Watcher } from "./watcher.js";

class Renderer extends Watcher {
    #lastTimestamp = 0;
    #subscribers = [];

    constructor() {
        super();
        this._setCanvas(new Canvas());
        this.#render();
    }

    /**
     * @param {number} deltaTime 
     */
    #render(timestamp = 0) {
        const deltaTime = (timestamp - this.#lastTimestamp) / 1000;
        this.#lastTimestamp = timestamp;

        // limit the frame rate to 60 fps
        if (deltaTime < (1 / 60)) {
            this.#subscribers.forEach((fn) => {
                fn(deltaTime);
            });
        }

        requestAnimationFrame(this.#render.bind(this));
    }

    subscribe({ controller = (_) => { } }) {
        this.#subscribers.push(controller);
    }

    getContext() {
        return this.getCanvas().getContext();
    }
}

export { Renderer };