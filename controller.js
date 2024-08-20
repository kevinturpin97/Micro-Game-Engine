import { Cube } from "./cube.js";
import { Entity } from "./entity.js";

class Controller {
  #vectorWorker = Worker;
  #entities = {
    cubes: []
  };
  #deletedIds = {
    cubes: []
  }
  #context = CanvasRenderingContext2D;

  constructor() {
    this.#vectorWorker = new Worker('workers/vectorWorker.js');
  }

  init() {
    if (!this.#context) {
      throw new Error('Context not set');
    }

    this.#vectorWorker.onmessage = (event) => {
      const { type, action, entities } = event.data;
      const needRender = {
        cubes: []
      };

      for (const entity of entities) {
        const { id, vertices, origin, position, rotation } = entity;
        const entityToUpdate = this.#entities[type].find((entity) => entity.getId() === id);

        if (!entityToUpdate) {
          console.warn('Entity not found:', id);

          continue;
        }

        switch (action) {
          case 'update_transform':
            entityToUpdate.setPosition(position);
            entityToUpdate.setRotation(rotation);

            needRender[type].push(entityToUpdate);
            continue;

          case 'update_render':
            // TODO: unique function for each entity type
            entityToUpdate.draw(vertices, origin, this.#context);
            continue;

          default:
            continue;
        }
      }

      if (needRender.cubes.length > 0) {
        const cubeDatas = needRender.cubes
          .map((entity) => {
            return {
              id: entity.getId(),
              size: entity.getSize(),
              position: entity.getPosition(),
              rotation: entity.getRotation(),
              origin: { x: 0, y: 0, z: 0 }
            };
          });

        this.#vectorWorker.postMessage({
          type: 'cubes',
          action: 'update_render',
          entities: cubeDatas
        });
      }
    };

    this.#instantiate();
  }

  #instantiate() {
    const count = 1;

    let sizeX, sizeY, sizeZ, posX, posY, posZ, rotX, rotY, rotZ;

    sizeX = sizeY = sizeZ = 4;
    posX = posY = posZ = rotX = rotY = rotZ = 0;

    posX = (sizeX * sizeY * (sizeZ / 2));
    posY = (sizeY * sizeZ * (sizeX / 2));

    for (let i = 1; i < (count + 1); i++) {
      const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
      const cube = new Cube(
        { x: sizeX, y: sizeY, z: sizeZ },
        { x: posX, y: posY, z: posZ },
        { x: rotX, y: rotY, z: rotZ },
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 1, z: -1 },
        color
      );

      posX += (sizeX * sizeY * (sizeZ / 2));

      if (i % 25 === 0) {
        posX = (sizeX * sizeY * (sizeZ / 2));
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

  instantiate() {
    const cubes = this.#entities.cubes;
    const cubeDatas = cubes
      .map((entity) => {
        if (!entity || entity.isInstantiated()) { return; }

        entity.instantiate();

        return {
          id: entity.getId(),
          size: entity.getSize(),
          position: entity.getPosition(),
          rotation: entity.getRotation(),
          origin: { x: 0, y: 0, z: 0 }
        };
      })
      .filter((entity) => entity);

    this.#vectorWorker.postMessage({
      type: 'cubes',
      action: 'update_render',
      entities: cubeDatas
    });
  }

  onUpdate(deltaTime) {
    const cubes = this.#entities.cubes;
    const cubeDatas = cubes
      .map((entity) => {
        if (!entity || !entity.needUpdate()) { return; }

        return {
          id: entity.getId(),
          size: entity.getSize(),
          position: entity.getPosition(),
          rotation: entity.getRotation(),
          velocity: entity.getVelocity(),
          angular: entity.getAngular(),
          deltaTime: deltaTime
        };
      })
      .filter((entity) => entity);

    if (cubeDatas.length === 0) { return; }

    this.#vectorWorker.postMessage({
      type: 'cubes',
      action: 'update_transform',
      entities: cubeDatas
    });
  }
}

export { Controller };