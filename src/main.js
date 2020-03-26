const canvas = document.getElementById("canvas");
canvas.width = 500;
canvas.height = 500;

let k3d = new K3D();

let scene = new k3d.Scene();
let camera = new k3d.PerspectiveCamera(45, 1, 1, 200);



var box_geometry = k3d.BoxGeometry(15);
var normal_material = k3d.NormalMaterial([0.2, 0.3, 0.1, 1]);

var box = new k3d.Mesh(box_geometry, normal_material);
scene.add(box);

var renderer = new k3d.RenderEngine(canvas);

function animate() {
    requestAnimationFrame(animate);

    box.rotate.x += 1.2;



    renderer.render(scene, camera);
}

animate();