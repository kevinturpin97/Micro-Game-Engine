import { Canvas } from "./canvas.js";
import { Watcher } from "./watcher.js";

class Renderer extends Watcher {
    #lastTimestamp = 0;
    #renderWorker = Worker;
    #entities = {
        cubes: []
    };

    constructor() {
        super();
        this.#renderWorker = new Worker('workers/rendering.js');
        this._setCanvas(new Canvas());

        this.#renderWorker.onmessage = (event) => {
            const { type, id, position, rotation } = event.data;
            const entity = this.#entities[type].find((entity) => entity.getId() === id);

            if (!entity) { return; }

            entity.setOldPosition(entity.getPosition());
            entity.setOldRotation(entity.getRotation());
            entity.setPosition(position);
            entity.setRotation(rotation);
            entity.draw();
            this.getCanvas().clear();
        };

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
            this.#update(deltaTime);
        }

        requestAnimationFrame(this.#render.bind(this));
    }

    #update(deltaTime) {
        const cubes = this.#entities.cubes;
        
        cubes.forEach((entity) => {
            if (!entity || !entity.needUpdate()) { return; }

            const id = entity.getId();
            const position = entity.getPosition();
            const velocity = entity.getVelocity();
            const rotation = entity.getRotation();
            const angularVelocity = entity.getAngular();

            this.#renderWorker.postMessage({
                type: 'cubes',
                id,
                position,
                velocity,
                rotation,
                angularVelocity,
                deltaTime,
                origin: { x: 0, y: 0, z: 0 }
            });
        });
    }

    toUpdate(entities = {}) {
        this.#entities = entities;
    }

    getContext() {
        return this.getCanvas().getContext();
    }
}

export { Renderer };