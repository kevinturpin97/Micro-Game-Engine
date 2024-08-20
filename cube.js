import { Entity } from "./entity.js";
import { Utilities } from "./utilities.js";

/**
 * @typedef {Object} Vector3
 * @property {number} x
 * @property {number} y
 * @property {number} z
 */

class Cube extends Entity {
    #color = '#000000';
    #clearQueued = [];

    /**
     * @param {Vector3} size The size of the cube
     * @param {Vector3} position The position of the cube
     * @param {Vector3} rotation The rotation of the cube
     * @param {Vector3} velocity The velocity of the cube
     * @param {Vector3} angular The angular velocity of the cube
     * @param {string} color The color of the cube
        */
    constructor(size, position, rotation, velocity, angular, color = '#000000') {
        super(size, position, rotation, velocity, angular);

        this.#color = color;
    }

    /**
     * @returns {string} The color of the cube
     */
    getColor() {
        return this.#color;
    }

    /**
     * @param {string} color The color of the cube
     * 
     * @returns {Cube}
     */
    setColor(color) {
        this.#color = color;

        return this;
    }

    draw(vertices, origin, ctx) {
        this.addToClearQueue(vertices, origin, ctx);

        ctx.beginPath();

        const sides = [
            [0, 1, 2, 3, 0],
            [4, 5, 6, 7, 4],
            [3, 2, 6, 7, 3],
            [0, 1, 5, 4, 0],
            [0, 3, 7, 4, 0],
            [1, 2, 6, 5, 1]
        ];

        for (const side of sides) {
            ctx.moveTo(origin.x + vertices[side[0]].x, origin.y + vertices[side[0]].y);
            ctx.lineTo(origin.x + vertices[side[1]].x, origin.y + vertices[side[1]].y);
            ctx.lineTo(origin.x + vertices[side[2]].x, origin.y + vertices[side[2]].y);
            ctx.lineTo(origin.x + vertices[side[3]].x, origin.y + vertices[side[3]].y);
            ctx.lineTo(origin.x + vertices[side[4]].x, origin.y + vertices[side[4]].y);

            ctx.fillStyle = this.#color;
            ctx.fill();
        }

        ctx.stroke();
        ctx.closePath();

        this.setVisible(true);

        return this;
    }

    addToClearQueue(vertices, origin, ctx) {
        
        this.#clearQueued.push({ vertices: vertices, origin: origin });

        while (this.#clearQueued.length > 1) {
            this.#clear(this.#clearQueued[0].vertices, this.#clearQueued[0].origin, ctx);
            this.#clearQueued.shift();
        }

        this.setVisible(false);
    }

    #clear(vertices, origin, ctx) {
        const margin = 1; // Marge de 1 pixel pour effacer également le stroke

        const xMin = Math.min(...vertices.map(v => origin.x + v.x)) - margin;
        const xMax = Math.max(...vertices.map(v => origin.x + v.x)) + margin;
        const yMin = Math.min(...vertices.map(v => origin.y + v.y)) - margin;
        const yMax = Math.max(...vertices.map(v => origin.y + v.y)) + margin;

        ctx.clearRect(xMin, yMin, xMax - xMin, yMax - yMin);

        return this;
    }
}

export { Cube };