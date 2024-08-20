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
        const fps = 60;
        const interval = 1000 / fps;
        
        const deltaTime = (timestamp - this.#lastTimestamp);
    
        if (deltaTime >= interval) {
            this.#lastTimestamp = timestamp - (deltaTime % interval);
    
            this.#subscribers.forEach((subscriber) => {
                subscriber.fn(deltaTime / 1000);
            });
        }
        
        requestAnimationFrame(this.#render.bind(this));
    }

    subscribe({ controller = (_) => { }, debug = HTMLElement }) {
        // this.#subscribers.push({ type: 'debug', el: debug });
        this.#subscribers.push({ type: 'controller', fn: controller });
    }

    getContext() {
        return this.getCanvas().getContext();
    }
}

export { Renderer };