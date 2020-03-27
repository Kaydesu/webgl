let scene, camera, renderer;
let box_geometry, material1, material2, box, box2;
let sphere_geometry, sphere;
let time = 0;

let k3d = new K3D();

const canvas = document.getElementById("canvas");
canvas.width = 500;
canvas.height = 500;


function init() {
    scene = new k3d.Scene();
    camera = new k3d.PerspectiveCamera(45, 1, 1, 1000);
    camera.eye.z = 120;

    material1 = k3d.NormalMaterial([0.2, 0.3, 0.1, 1]);
    material2 = k3d.NormalMaterial([0.2, 0.2, 0.4, 1])


    sphere_geometry = k3d.UVSphereGeometry(20, 24, 24);
    sphere = new k3d.Mesh(sphere_geometry, material1);
    sphere.render_line = true;

    scene.add(sphere);

    // sphere.rotate.x = -90;
    renderer = new k3d.RenderEngine(canvas);
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