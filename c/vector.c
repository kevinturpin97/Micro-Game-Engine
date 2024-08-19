#include "vector.h"
#include <stdlib.h>
#include <math.h>

void apply_transformation(Vector3D scale, Vector3D position, Vector3D rotation, Vector3D *vertex)
{
    // Scale
    vertex->x *= scale.x;
    vertex->y *= scale.y;
    vertex->z *= scale.z;

    // Rotate
    double x = vertex->x;
    double y = vertex->y;
    double z = vertex->z;

    vertex->x = x * cos(rotation.y) * cos(rotation.z) + y * (cos(rotation.y) * sin(rotation.z) * sin(rotation.x) - sin(rotation.y) * cos(rotation.x)) + z * (cos(rotation.y) * sin(rotation.z) * cos(rotation.x) + sin(rotation.y) * sin(rotation.x));
    vertex->y = x * sin(rotation.y) * cos(rotation.z) + y * (sin(rotation.y) * sin(rotation.z) * sin(rotation.x) + cos(rotation.y) * cos(rotation.x)) + z * (sin(rotation.y) * sin(rotation.z) * cos(rotation.x) - cos(rotation.y) * sin(rotation.x));
    vertex->z = -x * sin(rotation.z) + y * cos(rotation.z) * sin(rotation.x) + z * cos(rotation.z) * cos(rotation.x);

    // Translate
    vertex->x += position.x;
    vertex->y += position.y;
    vertex->z += position.z;
}

Vector3D *cube(Vector3D scale, Vector3D position, Vector3D rotation)
{
    Vector3D *vertices = (Vector3D *)malloc(sizeof(Vector3D) * 8);

    if (vertices == NULL)
    {
        return NULL;
    }

    vertices[0] = (Vector3D){-scale.x / 2, -scale.y / 2, -scale.z / 2};
    vertices[1] = (Vector3D){scale.x / 2, -scale.y / 2, -scale.z / 2};
    vertices[2] = (Vector3D){scale.x / 2, scale.y / 2, -scale.z / 2};
    vertices[3] = (Vector3D){-scale.x / 2, scale.y / 2, -scale.z / 2};
    vertices[4] = (Vector3D){-scale.x / 2, -scale.y / 2, scale.z / 2};
    vertices[5] = (Vector3D){scale.x / 2, -scale.y / 2, scale.z / 2};
    vertices[6] = (Vector3D){scale.x / 2, scale.y / 2, scale.z / 2};
    vertices[7] = (Vector3D){-scale.x / 2, scale.y / 2, scale.z / 2};

    for (int i = 0; i < 8; i++)
    {
        apply_transformation(scale, position, rotation, &vertices[i]);
    }

    return vertices;
}

Vector3D *create_vector3d(float x, float y, float z)
{
    Vector3D *vector = (Vector3D *)malloc(sizeof(Vector3D));

    if (vector == NULL)
    {
        return NULL;
    }

    vector->x = x;
    vector->y = y;
    vector->z = z;

    return vector;
}

Vector3D* compute_new_transform(Vector3D position, Vector3D rotation, Vector3D velocity, Vector3D angular, float deltaTime)
{
    Vector3D* transform = (Vector3D*)malloc(sizeof(Vector3D) * 2);

    if (transform == NULL)
    {
        return NULL;
    }

    transform[0] = (Vector3D){
        position.x + (velocity.x * deltaTime),
        position.y + (velocity.y * deltaTime),
        position.z + (velocity.z * deltaTime)
    };

    transform[1] = (Vector3D){
        rotation.x + (angular.x * deltaTime),
        rotation.y + (angular.y * deltaTime),
        rotation.z + (angular.z * deltaTime)
    };

    return transform;
}

void free_vector(Vector3D *vector)
{
    free(vector);
}