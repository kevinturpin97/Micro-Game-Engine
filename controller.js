import { ControllerManager } from "./controllerManager.js";
import { Cube } from "./cube.js";
import { Entity } from "./entity.js";

class Controller extends ControllerManager {
  #entities = {
    cubes: []
  };
  #deletedIds = {
    cubes: []
  }
  #context = CanvasRenderingContext2D;

  constructor() {
    super();
  }

  init() {
    if (!this.#context) {
      throw new Error('Context not set');
    }

    const workers = this._getWorkers();
    const workersAvailable = this._getWorkersAvailable();

    for (let i = 0; i < workersAvailable; i++) {
      workers[i].onmessage = (event) => {
        const { type, action, entities, worker } = event.data;

        if (worker !== i) { return; }

        const needRender = {
          cubes: []
        };
  
        for (const entity of entities) {
          const { id, vertices, origin, position, rotation } = entity;
          const entityToUpdate = this.#entities[type].find((entity) => entity.getId() === id);
  
          if (!entityToUpdate) {
            console.warn('Entity not found:', id);
            // TODO: check if entity was moved on other worker
  
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
  
          workers[i].postMessage({
            worker: i,
            type: 'cubes',
            action: 'update_render',
            entities: cubeDatas
          });
        }
      };
    }


    this.#instantiate();
  }

  #instantiate() {
    const count = 100;

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

    let workerAvailable = this._getWorkersAvailable();

    if (workerAvailable === 0) {
      throw new Error('No worker available');
    }

    const workerId = this._subscribe();

    entity.setWorkerId(workerId);

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

    this._unsubscribe(entity.getWorkerId());
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
    let currentWorker = 0;

    while (currentWorker < this._getWorkersAvailable()) {
      const worker = this._getWorker(currentWorker);
      const cubeDatas = cubes
        .filter((entity) => entity.getWorkerId() === currentWorker && !entity.isInstantiated())
        .map((entity) => {

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


      worker.postMessage({
        worker: currentWorker,
        type: 'cubes',
        action: 'update_render',
        entities: cubeDatas
      });

      currentWorker++;
    }
  }

  onUpdate(deltaTime) {
    const cubes = this.#entities.cubes;
    let currentWorker = 0;

    while (currentWorker < this._getWorkersAvailable()) {
      const worker = this._getWorker(currentWorker);
      const cubeDatas = cubes
        .filter((entity) => entity.getWorkerId() === currentWorker && entity.needUpdate())
        .map((entity) => {
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

      if (cubeDatas.length === 0) { continue; }

      worker.postMessage({
        worker: currentWorker,
        type: 'cubes',
        action: 'update_transform',
        entities: cubeDatas
      });

      currentWorker++;
    }
  }
}

export { Controller };