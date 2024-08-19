import { WindowProperties } from './windowProperties.js';

class Canvas extends WindowProperties {
    #canvas = HTMLCanvasElement;
    #ctx = CanvasRenderingContext2D;

    constructor() {
        if (!document.getElementById('root')) {
            throw new Error('Invalid root element');
        }

        const canvas = document.createElement('canvas');
        canvas.id = 'canvas';
        document.getElementById('root').appendChild(canvas);

        super([canvas]);
        this.#canvas = canvas;
        this.#ctx = canvas.getContext('2d');
    }

    /**
     * @returns {HTMLCanvasElement}
     */
    getCanvas() {
        return this.#canvas;
    }

    /**
     * @returns {CanvasRenderingContext2D}
     */
    getContext() {
        return this.#ctx;
    }

    clear() {
        this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
    }
}

export { Canvas };