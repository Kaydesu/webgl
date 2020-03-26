time = 0;

let k3d = new K3D();
k3d.createContext("canvas", 600, 600);

let scene = new k3d.Scene(k3d._gl);
let camera = new k3d.Camera();
camera.lookAt(0, 0, 0);

scene.useCamera(camera);

var box = new SceneObject();
var box_geometry = k3d.BoxGeometry(3);
var normal_material = k3d.NormalMaterial([0.2, 0.3, 0.1, 1]);

box.addGeometry(box_geometry);
box.addMaterial(normal_material);

scene.add(box);

box.translateZ = 1;


// function animate() {
//     requestAnimationFrame(animate);
//     scene.render();
//     box.rotateX += 1.5;
//     box.rotateZ += 1.5;
// }

// animate();