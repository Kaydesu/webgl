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
        [0.2, 0.8, 0.3],
        [0.2, 0.2, 0.5],
        [0.6, 0.8, 0.1],
    ], SHADE_OFF);

    triangle_geometry = K3D.Triangle(
        [0, 15, 25],
        [-15, -15, 25],
        [15, -15, 25]
    );

    triangle = new K3D.Mesh(triangle_geometry, material1);

    box_geometry = K3D.BoxGeometry(35);
    box = new K3D.Mesh(box_geometry, material1);
    box.draw_triangles = false;
    box.draw_points = true;
    box.draw_lines = true;

    sphere_geometry = K3D.UVSphereGeometry(25, 3, 3);
    sphere = new K3D.Mesh(sphere_geometry, material1);
    sphere.draw_triangles = true;
    sphere.draw_points = true;
    sphere.draw_lines = true;

    cone_geometry = K3D.ConeGeometry(25, 55, 5);
    cone = new K3D.Mesh(cone_geometry, material1);
    cone.draw_triangles = true;
    cone.draw_points = true;
    cone.draw_lines = true;
    
    // triangle = new K3D.Mesh(triangle_geometry, material1);
    scene.add(triangle);
    // scene.add(triangle);

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
    sphere.rotate.x += 0.2;
    sphere.rotate.z -= 0.5;
    renderer.render(scene, camera);
}

init();
animate();







// WEBGL GRAPHIC PIPELINE:

//================ DATA PREPARING===============


// let gl = canvas.getContext("webgl");

// gl.clearColor(1, 0, 1, 1);
// gl.clear(gl.COLOR_BUFFER_BIT);

// let vShader = gl.createShader(gl.VERTEX_SHADER);
// gl.shaderSource(vShader, `
//     precision mediump float;
//     attribute vec3 a_Vertex_position;
//     attribute vec3 a_Color;

//     varying vec3 v_Color;
//     void main() {
//         v_Color = a_Color;
//         gl_Position = vec4( a_Vertex_position, 1.0);
//     }
// `
// );
// gl.compileShader(vShader);

// let fShader = gl.createShader(gl.FRAGMENT_SHADER);
// gl.shaderSource(fShader, `
//     precision mediump float;
//     uniform vec4 color;

//     varying vec3 v_Color;

//     void main() {
//         gl_FragColor = vec4(v_Color, 1.0);
//     }
// `
// );
// gl.compileShader(fShader);

// let program = gl.createProgram();
// gl.attachShader(program, vShader);
// gl.attachShader(program, fShader);
// gl.linkProgram(program);

// let vertices = new Float32Array([
//     0, 1,
//     -1, -1,
//     1, -1
// ]);

// let colors = new Float32Array([
//     1, 0, 0,
//     0, 0, 1,
//     0, 1, 0
// ]);

// let buffer_array = new Float32Array([
//     0, 1, 0,      1, 0, 0,
//     -1, -1, 0,    0, 0, 1,
//     1, -1, 0,     0, 1, 0
// ]);


// ======== OPTIONS 1: KEEP SEPARATE BUFFER ARRAY FOR ATTRIBUTES========//
/*
let buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

gl.useProgram(program);
program.color = gl.getUniformLocation(program, 'color');
gl.uniform4fv(program.color, [1, 0, 0, 1]);

program.position = gl.getAttribLocation(program, 'position');
gl.enableVertexAttribArray(program.position);
gl.vertexAttribPointer(program.position, 2, gl.FLOAT, false, 0, 0);

let color_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

program.color = gl.getAttribLocation(program, 'a_Color');
gl.enableVertexAttribArray(program.color);
gl.vertexAttribPointer(program.color, 3, gl.FLOAT, false, 0, 0);

gl.drawArrays(gl.TRIANGLES, 0, 3);
*/


// ======== OPTIONS 2: USING INTERLEAVED DATA ========//

// let buffer = gl.createBuffer();
// gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
// gl.bufferData(gl.ARRAY_BUFFER, buffer_array, gl.STATIC_DRAW);
// gl.useProgram(program);

// program.position = gl.getAttribLocation(program, 'a_Vertex_position');
// gl.enableVertexAttribArray(program.position);
// gl.vertexAttribPointer(program.position, 3, gl.FLOAT, false, 24, 0);

// program.color = gl.getAttribLocation(program, 'a_Color');
// gl.enableVertexAttribArray(program.color);
// gl.vertexAttribPointer(program.color, 3, gl.FLOAT, false, 24, 12);

// gl.drawArrays(gl.TRIANGLES, 0, 3);

