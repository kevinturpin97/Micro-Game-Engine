import { Canvas } from "./canvas.js";

/**
 * Watcher class
 * Manages Entity class when instantiated
 */
class Watcher {
    #canvas = Canvas;

    /**
     * Set canvas
     * @param {Canvas} canvas 
     * 
     * @returns {Watcher}
     */
    _setCanvas(canvas) {
        this.#canvas = canvas;

        return this;
    }

    /**
     * Get canvas
     * @returns {Canvas}
     */
    getCanvas() {
        return this.#canvas;
    }
}

export { Watcher };