import { Cube } from "./cube.js";
import { Entity } from "./entity.js";

class Controller {
  #cubeWorker = Worker;
  #entities = {
    cubes: []
  };
  #deletedIds = {
    cubes: []
  }
  #context = CanvasRenderingContext2D;

  constructor() {
    this.#cubeWorker = new Worker('workers/cube.js');
  }

  init() {
    if (!this.#context) {
      throw new Error('Context not set');
    }

    this.#cubeWorker.onmessage = (event) => {
      const { id, vertices, origin } = event.data;
      const entity = this.#entities.cubes.find((entity) => entity.getId() === id);

      if (!entity) { return; }

      this.#context.clearRect(0, 0, this.#context.canvas.width, this.#context.canvas.height);
      entity.drawCube(vertices, origin, this.#context);
    };

    this.#instantiate();
  }

  #instantiate() {
    const count = 1;
    
    let sizeX, sizeY, sizeZ, posX, posY, posZ, rotX, rotY, rotZ;

    sizeX = sizeY = sizeZ = 10;
    posX = posY = posZ = rotX = rotY = rotZ = 0;

    for (let i = 1; i < (count + 1); i++) {
      const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
      const cube = new Cube(
        this.#cubeWorker,
        { x: sizeX, y: sizeY, z: sizeZ },
        { x: posX + 100, y: posY + 100, z: posZ },
        { x: rotX, y: rotY, z: rotZ },
        { x: 5, y: 0, z: 0 },
        { x: 1, y: 1, z: -1 },
        color
      );

      posX += (sizeX * sizeY * (sizeZ / 2));

      if (i % 10 === 0) {
        posX = 0;
        posY += (sizeY * sizeZ * (sizeX / 2));
      }

      this.addEntity(cube);
    }
  }

  setContext(context) {
    if (!(context instanceof CanvasRenderingContext2D)) {
      throw new Error('Invalid context');
    }

    this.#context = context;
  }

  /**
   * @param {Entity} entity 
   */
  addEntity(entity) {
    if (!(entity instanceof Entity)) {
      throw new Error('Invalid entity');
    }

    if (this.#entities.cubes.includes(entity)) {
      throw new Error('Entity already exists');
    }

    if (this.#deletedIds.cubes.includes(entity.getId())) {
      throw new Error('Entity was deleted');
    }

    if (this.#deletedIds.cubes.length > 0) {
      entity.setId(this.#deletedIds.cubes.shift());
    } else {
      entity.setId(this.#entities.cubes.length);
    }
    
    this.#entities.cubes.push(entity);

    console.log('New entity:', entity.getId());
  }

  /**
   * @param {Entity} entity
   */
  removeEntity(entity) {
    if (!(entity instanceof Entity)) {
      throw new Error('Invalid entity');
    }

    if (!this.#entities.cubes.includes(entity)) {
      throw new Error('Entity does not exist');
    }

    this.#deletedIds.cubes.push(entity.getId());
    this.#entities.cubes = this.#entities.cubes.filter((e) => e !== entity);
  }

  /**
   * @returns {Entity[]}
   */
  getEntities() {
    return this.#entities;
  }

  toUpdate() {
    const cubes = this.#entities.cubes;
    
    cubes.forEach((entity) => {
      if (!entity || !entity.needUpdate()) { return; }

      const id = entity.getId();
      const position = entity.getPosition();
      const rotation = entity.getRotation();
      const size = entity.getSize();
      const origin = { x: 0, y: 0, z: 0 };

      this.#cubeWorker.postMessage({
        id,
        size,
        position,
        rotation,
        origin
      });
    });
  }
}

export { Controller };