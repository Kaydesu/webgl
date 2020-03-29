let scene, camera, renderer;
let box_geometry, material1, material2, box, box2, cone, cone_geometry, triangle, triangle_geometry;
let sphere_geometry, sphere;
let time = 0;

const canvas = document.getElementById("canvas");
canvas.width = 500;
canvas.height = 500;




function init() {
    scene = new K3D.Scene();
    camera = new K3D.PerspectiveCamera(45, 1, 1, 1000);
    camera.eye.z = 120;

    material1 = K3D.BasicMaterial([
        [0.2, 0.3, 0.1],
        [0.5, 0.5, 0.2],
        [0.1, 0.2, 0.3],
        [0.2, 0.2, 0.4],
        [0.3, 0.8, 0.2]
    ], SHADE_OFF);
    material2 = K3D.BasicMaterial([0.2, 0.2, 0.4, 1])

    // box_geometry = K3D.BoxGeometry(25, 15, 30);
    // box = new K3D.Mesh(box_geometry, material2);
    // box.render_line = true;

    // sphere_geometry = K3D.UVSphereGeometry(20, 24, 24);
    // sphere = new K3D.Mesh(sphere_geometry, material1);
    // sphere.render_line = true;

    // cone_geometry = K3D.ConeGeometry(25, 45, 100);
    // cone = new K3D.Mesh(cone_geometry, material2);
    // cone.line_color = [0, 0, 0, 1];
    // cone.render_line = true;
    triangle_geometry = K3D.Triangle(
        [0, 15, 25],
        [-15, -15, 25],
        [15, -15, 25]
    );

    triangle = new K3D.Mesh(triangle_geometry, material1);
    scene.add(triangle);

    renderer = new K3D.RenderEngine(canvas);
}

function eventUpdate() {
    camera.eye.x = cameraX;
    camera.eye.y = cameraY;
    camera.eye.z = cameraZ;

    camera.lookAt(centerX, centerY, centerZ);
}

function animate() {
    requestAnimationFrame(animate);

    eventUpdate();

    time += 0.05;

    renderer.render(scene, camera);
}

init();
animate();
