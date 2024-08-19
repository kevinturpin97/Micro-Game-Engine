(async () => {
    importScripts('vector.js');

    const VectorModule = await VectorModuleWasm();

    if (!VectorModule) {
        throw new Error("Failed to load VectorModuleWasm");
    }

    onmessage = (event) => {
        const {
            type,
            id,
            position,
            velocity,
            rotation,
            angularVelocity,
            deltaTime,
            origin
        } = event.data;
    
        const positionPointer = VectorModule._create_vector3d(position.x, position.y, position.z);
        const rotationPointer = VectorModule._create_vector3d(rotation.x, rotation.y, rotation.z);
        const velocityPointer = VectorModule._create_vector3d(velocity.x, velocity.y, velocity.z);
        const angularVelocityPointer = VectorModule._create_vector3d(angularVelocity.x, angularVelocity.y, angularVelocity.z);

        /**
         * @returns {Vector3[2]} - The new position and rotation (in that order and Vector3 = { x: float, y: float, z: float })
         */
        const newTransform = VectorModule._compute_new_transform(positionPointer, rotationPointer, velocityPointer, angularVelocityPointer, deltaTime);
        const transformBuffers = new Float32Array(VectorModule.HEAPF32.buffer, newTransform, 6);
        const newPosition = { x: transformBuffers[0], y: transformBuffers[1], z: transformBuffers[2] };
        const newRotation = { x: transformBuffers[3], y: transformBuffers[4], z: transformBuffers[5] };

        postMessage({
            type: type,
            id: id,
            position: newPosition,
            rotation: newRotation,
            origin: origin
        });
        
        VectorModule._free_vector(newTransform);
        VectorModule._free_vector(angularVelocityPointer);
        VectorModule._free_vector(velocityPointer);
        VectorModule._free_vector(rotationPointer);
        VectorModule._free_vector(positionPointer);
    };
})();