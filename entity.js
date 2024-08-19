/**
 * @typedef {Object} Vector3
 * @property {number} x
 * @property {number} y
 * @property {number} z
 */

class Entity {
    #id = null;
    #size = {
        x: 0,
        y: 0,
        z: 0
    };
    #position = {
        x: 0,
        y: 0,
        z: 0
    };
    #rotation = {
        x: 0,
        y: 0,
        z: 0
    };
    #velocity = {
        x: 0,
        y: 0,
        z: 0
    };
    #angular = {
        x: 0,
        y: 0,
        z: 0
    };
    #oldPosition = {
        x: 0,
        y: 0,
        z: 0
    };
    #oldRotation = {
        x: 0,
        y: 0,
        z: 0
    };
    #isVisible = false;
    #processing = Worker;
    #isInstantiated = false;

    /**
     * @param {Worker} worker
     * @param {Vector3} size
     * @param {Vector3} position
     * @param {Vector3} rotation
     * @param {Vector3} velocity
     * @param {Vector3} angular
     */
    constructor(
        worker = null,
        size = { x: 0, y: 0, z: 0 },
        position = { x: 0, y: 0, z: 0 },
        rotation = { x: 0, y: 0, z: 0 },
        velocity = { x: 0, y: 0, z: 0 },
        angular = { x: 0, y: 0, z: 0 }
    ) {
        if (!(worker instanceof Worker)) {
            throw new Error('Invalid worker');
        }

        const entry = [size, position, rotation, velocity, angular];

        entry.forEach((entry) => {
            if (!this.#validateEntry(entry)) {
                throw new Error('Invalid entry');
            }

            if (!this.#validateCoordinates(entry)) {
                throw new Error('Invalid coordinates');
            }
        });

        this.#size = size;
        this.#position = position;
        this.#rotation = rotation;
        this.#velocity = velocity;
        this.#angular = angular;
        this.#processing = worker;
    }

    /**
     * @returns {Entity}
     * 
     * @throws {Error}
     */
    setId(id) {
        if (typeof id !== 'number') {
            throw new Error('Invalid ID');
        }

        if (this.#id !== null) {
            throw new Error('ID already set');
        }

        this.#id = id;

        return this;
    }

    /**
     * @param {Vector3} size
     * 
     * @returns {Entity}
     */
    setSize(size) {
        if (this.#validateCoordinates(size)) {
            this.#size = size;
        }

        return this;
    }

    /**
     * @param {Vector3} size
     * 
     * @returns {Entity}
     */
    setSize(size) {
        if (this.#validateCoordinates(size)) {
            this.#size = size;
        }

        return this;
    }

    /**
     * @param {Vector3} position
     * 
     * @returns {Entity}
     */
    setPosition(position) {
        if (this.#validateCoordinates(position)) {
            this.#position = position;
        }

        return this;
    }

    /**
     * @param {Vector3} rotation
     * 
     * @returns {Entity}
     */
    setRotation(rotation) {
        if (this.#validateCoordinates(rotation)) {
            this.#rotation = rotation;
        }

        return this;
    }

    /**
     * @param {Vector3} velocity
     * 
     * @returns {Entity}
     */
    setVelocity(velocity) {
        if (this.#validateCoordinates(velocity)) {
            this.#velocity = velocity;
        }

        return this;
    }

    /**
     * @param {Vector3} angular
     * 
     * @returns {Entity}
     */
    setAngular(angular) {
        if (this.#validateCoordinates(angular)) {
            this.#angular = angular;
        }

        return this;
    }

    /**
     * @param {boolean} visible
     */
    setVisible(visible) {
        if (typeof visible === 'boolean') {
            this.#isVisible = visible;
        }

        return this;
    }

    /**
     * @param {Vector3} oldPosition
     */
    setOldPosition(oldPosition) {
        if (this.#validateCoordinates(oldPosition)) {
            this.#oldPosition = oldPosition;
        }

        return this;
    }

    /**
     * @param {Vector3} oldRotation
     */
    setOldRotation(oldRotation) {
        if (this.#validateCoordinates(oldRotation)) {
            this.#oldRotation = oldRotation;
        }

        return this;
    }

    /**
     * @returns {Entity}
     */
    instantiate() {
        if (this.#isInstantiated) {
            throw new Error('Entity already instantiated');
        }

        this.#isInstantiated = true;

        return this;
    }

    /**
     * @returns {number|null}
     */
    getId() {
        return this.#id;
    }

    /**
     * @returns {Vector3}
     */
    getSize() {
        return this.#size;
    }

    /**
     * @returns {Vector3}
     */
    getPosition() {
        return this.#position;
    }

    /**
     * @returns {Vector3}
     */
    getRotation() {
        return this.#rotation;
    }

    /**
     * @returns {Vector3}
     */
    getVelocity() {
        return this.#velocity;
    }

    /**
     * @returns {Vector3}
     */
    getAngular() {
        return this.#angular;
    }

    /**
     * @returns {Vector3}
     */
    getOldPosition() {
        return this.#oldPosition;
    }

    /**
     * @returns {Vector3}
     */
    getOldRotation() {
        return this.#oldRotation;
    }

    /**
     * @returns {boolean}
     */
    isVisible() {
        return this.#isVisible;
    }

    /**
     * @returns {boolean}
     */
    isInstantiated() {
        return this.#isInstantiated;
    }

    /**
     * @returns {Worker}
     */
    getProcessing() {
        return this.#processing;
    }

    needUpdate() {
        if (!this.#isInstantiated) { return true; }

        const { x : refPosX, y : refPosY, z : refPosZ } = this.#oldPosition;
        const { x : curPosX, y : curPosY, z : curPosZ } = this.#position;
        const { x : refRotX, y : refRotY, z : refRotZ } = this.#oldRotation;
        const { x : curRotX, y : curRotY, z : curRotZ } = this.#rotation;

        return refPosX !== curPosX || refPosY !== curPosY || refPosZ !== curPosZ || refRotX !== curRotX || refRotY !== curRotY || refRotZ !== curRotZ;
    }

    #validateEntry(entry) {
        return typeof entry === 'object' && 'x' in entry && 'y' in entry && 'z' in entry;
    }

    #validateCoordinates({ x, y, z }) {
        return typeof x === 'number' && typeof y === 'number' && typeof z === 'number';
    }
}

export { Entity };