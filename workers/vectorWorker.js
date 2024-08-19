(async () => {
    importScripts('vector.js');

    const VectorModule = await VectorModuleWasm();

    if (!VectorModule) {
        throw new Error("Failed to load VectorModuleWasm");
    }

    /**
     * @param {string} type
     * @param {Entity[]} entities 
     */
    const update_render = (type = '', entities = []) => {
        switch (type) {
            case 'cubes':
                const entitiesUpdated = entities.map((entity) => {
                    const {
                        id,
                        size,
                        position,
                        rotation,
                        origin
                    } = entity;

                    const scalePointer = VectorModule._create_vector3d(size.x, size.y, size.z);
                    const positionPointer = VectorModule._create_vector3d(position.x, position.y, position.z);
                    const rotationPointer = VectorModule._create_vector3d(rotation.x, rotation.y, rotation.z);

                    /**
                     * @returns {Vector3[8]}
                     */
                    const verticesPointer = VectorModule._cube(scalePointer, positionPointer, rotationPointer);
                    const numVertices = 8;
                    const verticeBuffers = new Float32Array(VectorModule.HEAPF32.buffer, verticesPointer, numVertices * 3);

                    let vertices = [];

                    for (let i = 0; i < numVertices; i++) {
                        vertices.push({
                            x: verticeBuffers[i * 3],
                            y: verticeBuffers[i * 3 + 1],
                            z: verticeBuffers[i * 3 + 2]
                        });
                    }

                    VectorModule._free_vector(verticesPointer);
                    VectorModule._free_vector(rotationPointer);
                    VectorModule._free_vector(positionPointer);
                    VectorModule._free_vector(scalePointer);

                    return {
                        id: id,
                        vertices: vertices,
                        origin: origin
                    };
                });

                postMessage({
                    type: type,
                    action: 'update_render',
                    entities: entitiesUpdated
                });
                return;

            default:
                console.error('Unknown type:', type);
                return;
        }
    };

    /**
     * @param {string} type
     * @param {Entity[]} entities 
     */
    const update_transform = (type = '', entities = []) => {
        switch (type) {
            case 'cubes':
                const entitiesUpdated = entities.map((entity) => {
                    const {
                        id,
                        position,
                        rotation,
                        velocity,
                        angular,
                        deltaTime,
                        origin
                    } = entity;

                    const positionPointer = VectorModule._create_vector3d(position.x, position.y, position.z);
                    const rotationPointer = VectorModule._create_vector3d(rotation.x, rotation.y, rotation.z);
                    const velocityPointer = VectorModule._create_vector3d(velocity.x, velocity.y, velocity.z);
                    const angularVelocityPointer = VectorModule._create_vector3d(angular.x, angular.y, angular.z);

                    /**
                     * @returns {Vector3[2]} - The new position and rotation (in that order and Vector3 = { x: float, y: float, z: float })
                     */
                    const newTransform = VectorModule._compute_new_transform(positionPointer, rotationPointer, velocityPointer, angularVelocityPointer, deltaTime);
                    const transformBuffers = new Float32Array(VectorModule.HEAPF32.buffer, newTransform, 6);
                    const newPosition = { x: transformBuffers[0], y: transformBuffers[1], z: transformBuffers[2] };
                    const newRotation = { x: transformBuffers[3], y: transformBuffers[4], z: transformBuffers[5] };

                    VectorModule._free_vector(newTransform);
                    VectorModule._free_vector(angularVelocityPointer);
                    VectorModule._free_vector(velocityPointer);
                    VectorModule._free_vector(rotationPointer);
                    VectorModule._free_vector(positionPointer);

                    return {
                        id: id,
                        position: newPosition,
                        rotation: newRotation,
                        origin: origin
                    };
                });

                postMessage({
                    type: type,
                    action: 'update_transform',
                    entities: entitiesUpdated
                });
                break;

            default:
                console.error('Unknown type:', type);
                break;
        }
    };

    onmessage = (event) => {
        const {
            type,
            action,
            entities
        } = event.data;

        eval(action)(type, entities);
    };
})();