(async () => {
    importScripts('vector.js');

    const VectorModule = await VectorModuleWasm();

    if (!VectorModule) {
        throw new Error("Failed to load VectorModuleWasm");
    }

    onmessage = (event) => {
        const {
            id,
            size,
            position,
            rotation,
            origin
        } = event.data;

        const scalePointer = VectorModule._create_vector3d(size.x, size.y, size.z);
        const positionPointer = VectorModule._create_vector3d(position.x, position.y, position.z);
        const rotationPointer = VectorModule._create_vector3d(rotation.x, rotation.y, rotation.z);

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

        postMessage({
            id: id,
            vertices: vertices,
            origin: origin
        });
    };
})();