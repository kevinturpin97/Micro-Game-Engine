import { Entity } from "./entity.js";

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
    constructor(worker, size, position, rotation, velocity, angular, color = '#000000') {
        super(worker, size, position, rotation, velocity, angular);

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

    // FEATURE: get exact number of sides needed to be drawn by checking the rotation of the cube (reduce processing time)
    draw() {
        if (!this.needUpdate()) { return this; }

        const id = this.getId();
        const position = this.getPosition();
        const rotation = this.getRotation();
        const size = this.getSize();
        
        this.getProcessing().postMessage({
            id: id,
            size: size,
            position: position,
            rotation: rotation,
            origin: { x: 100, y: 100, z: 0 }
        });

        return this;
    }

    drawCube(vertices, origin, ctx) {
        // this.addToClearQueue(vertices, origin);
        // if (!this.isInstantiated()) {
        //     this.instantiate();
        // }

        ctx.beginPath();
        // front face
        ctx.moveTo(origin.x + vertices[0].x, origin.y + vertices[0].y);
        ctx.lineTo(origin.x + vertices[1].x, origin.y + vertices[1].y);
        ctx.lineTo(origin.x + vertices[2].x, origin.y + vertices[2].y);
        ctx.lineTo(origin.x + vertices[3].x, origin.y + vertices[3].y);
        ctx.lineTo(origin.x + vertices[0].x, origin.y + vertices[0].y);
        ctx.closePath();
        ctx.fillStyle = this.#color;
        ctx.fill();

        // back face
        ctx.moveTo(origin.x + vertices[4].x, origin.y + vertices[4].y);
        ctx.lineTo(origin.x + vertices[5].x, origin.y + vertices[5].y);
        ctx.lineTo(origin.x + vertices[6].x, origin.y + vertices[6].y);
        ctx.lineTo(origin.x + vertices[7].x, origin.y + vertices[7].y);
        ctx.lineTo(origin.x + vertices[4].x, origin.y + vertices[4].y);
        ctx.closePath();
        ctx.fillStyle = this.#color;
        ctx.fill();

        // top face
        ctx.moveTo(origin.x + vertices[3].x, origin.y + vertices[3].y);
        ctx.lineTo(origin.x + vertices[2].x, origin.y + vertices[2].y);
        ctx.lineTo(origin.x + vertices[6].x, origin.y + vertices[6].y);
        ctx.lineTo(origin.x + vertices[7].x, origin.y + vertices[7].y);
        ctx.lineTo(origin.x + vertices[3].x, origin.y + vertices[3].y);
        ctx.closePath();
        ctx.fillStyle = this.#color;
        ctx.fill();

        // bottom face
        ctx.moveTo(origin.x + vertices[0].x, origin.y + vertices[0].y);
        ctx.lineTo(origin.x + vertices[1].x, origin.y + vertices[1].y);
        ctx.lineTo(origin.x + vertices[5].x, origin.y + vertices[5].y);
        ctx.lineTo(origin.x + vertices[4].x, origin.y + vertices[4].y);
        ctx.lineTo(origin.x + vertices[0].x, origin.y + vertices[0].y);
        ctx.closePath();
        ctx.fillStyle = this.#color;
        ctx.fill();

        // left face
        ctx.moveTo(origin.x + vertices[0].x, origin.y + vertices[0].y);
        ctx.lineTo(origin.x + vertices[4].x, origin.y + vertices[4].y);
        ctx.lineTo(origin.x + vertices[7].x, origin.y + vertices[7].y);
        ctx.lineTo(origin.x + vertices[3].x, origin.y + vertices[3].y);
        ctx.lineTo(origin.x + vertices[0].x, origin.y + vertices[0].y);
        ctx.closePath();
        ctx.fillStyle = this.#color;
        ctx.fill();

        // right face
        ctx.moveTo(origin.x + vertices[1].x, origin.y + vertices[1].y);
        ctx.lineTo(origin.x + vertices[5].x, origin.y + vertices[5].y);
        ctx.lineTo(origin.x + vertices[6].x, origin.y + vertices[6].y);
        ctx.lineTo(origin.x + vertices[2].x, origin.y + vertices[2].y);
        ctx.lineTo(origin.x + vertices[1].x, origin.y + vertices[1].y);
        ctx.closePath();
        ctx.fillStyle = this.#color;
        ctx.fill();

        ctx.stroke();

        this.setVisible(true);

        return this;
    }

    addToClearQueue(vertices, origin) {
        this.setVisible(false);
        return;

        // debug:
        this.#clearQueued.push({vertices: vertices, origin: origin});

        while (this.#clearQueued.length > 1) {
            this.#clear(this.#clearQueued[0].vertices, this.#clearQueued[0].origin);
            this.#clearQueued.shift();
        }

        this.setVisible(false);
    }
        
    #clear(vertices, origin) {
        const ctx = this._getCtx();
        const margin = 10;
        
        ctx.beginPath();
        ctx.fillStyle = '#ffffff';

        // front face
        ctx.moveTo(origin.x + vertices[0].x, origin.y + vertices[0].y);
        ctx.lineTo(origin.x + vertices[1].x, origin.y + vertices[1].y);
        ctx.lineTo(origin.x + vertices[2].x, origin.y + vertices[2].y);
        ctx.lineTo(origin.x + vertices[3].x, origin.y + vertices[3].y);
        ctx.lineTo(origin.x + vertices[0].x, origin.y + vertices[0].y);
        ctx.closePath();
        ctx.fill();

        // back face
        ctx.moveTo(origin.x + vertices[4].x, origin.y + vertices[4].y);
        ctx.lineTo(origin.x + vertices[5].x, origin.y + vertices[5].y);
        ctx.lineTo(origin.x + vertices[6].x, origin.y + vertices[6].y);
        ctx.lineTo(origin.x + vertices[7].x, origin.y + vertices[7].y);
        ctx.lineTo(origin.x + vertices[4].x, origin.y + vertices[4].y);
        ctx.closePath();
        ctx.fill();

        // top face
        ctx.moveTo(origin.x + vertices[3].x, origin.y + vertices[3].y);
        ctx.lineTo(origin.x + vertices[2].x, origin.y + vertices[2].y);
        ctx.lineTo(origin.x + vertices[6].x, origin.y + vertices[6].y);
        ctx.lineTo(origin.x + vertices[7].x, origin.y + vertices[7].y);
        ctx.lineTo(origin.x + vertices[3].x, origin.y + vertices[3].y);
        ctx.closePath();
        ctx.fill();

        // bottom face
        ctx.moveTo(origin.x + vertices[0].x, origin.y + vertices[0].y);
        ctx.lineTo(origin.x + vertices[1].x, origin.y + vertices[1].y);
        ctx.lineTo(origin.x + vertices[5].x, origin.y + vertices[5].y);
        ctx.lineTo(origin.x + vertices[4].x, origin.y + vertices[4].y);
        ctx.lineTo(origin.x + vertices[0].x, origin.y + vertices[0].y);
        ctx.closePath();
        ctx.fill();

        // left face
        ctx.moveTo(origin.x + vertices[0].x, origin.y + vertices[0].y);
        ctx.lineTo(origin.x + vertices[4].x, origin.y + vertices[4].y);
        ctx.lineTo(origin.x + vertices[7].x, origin.y + vertices[7].y);
        ctx.lineTo(origin.x + vertices[3].x, origin.y + vertices[3].y);
        ctx.lineTo(origin.x + vertices[0].x, origin.y + vertices[0].y);
        ctx.closePath();
        ctx.fill();

        // right face
        ctx.moveTo(origin.x + vertices[1].x, origin.y + vertices[1].y);
        ctx.lineTo(origin.x + vertices[5].x, origin.y + vertices[5].y);
        ctx.lineTo(origin.x + vertices[6].x, origin.y + vertices[6].y);
        ctx.lineTo(origin.x + vertices[2].x, origin.y + vertices[2].y);
        ctx.lineTo(origin.x + vertices[1].x, origin.y + vertices[1].y);
        ctx.closePath();
        ctx.fill();

        // this.setVisible(false); // setVisible false inside clearQueue

        return this;
    }
}

export { Cube };