class K3D {
    constructor() {
        this.Scene = this.Scene.bind(this);
        this.PerspectiveCamera = this.PerspectiveCamera.bind(this);
        this.Mesh = this.Mesh.bind(this);
        this.RenderEngine = this.RenderEngine.bind(this);
    }

    RenderEngine = function (canvas) {
        this._gl = canvas.getContext("webgl");
        this.isConfig = false;

        this._configSceneAndCamera = (scene) => {
            for (let object of scene.objects) {
                let vertexShader = this._loadAndCompileShaders("VS", object.material.vShader);
                let fragmentShader = this._loadAndCompileShaders("FS", object.material.fShader);
                object.gl_program = this._createProgram(vertexShader, fragmentShader);
                object.face_buffer_id = this._createWebGLBufferId(object.face_geometry_buffer);
                object.line_buffer_id = this._createWebGLBufferId(object.line_geometry_buffer);
            }

            this.isConfig = true;
        }

        this._createProgram = (vertexShader, fragmentShader) => {
            let gl = this._gl;

            let program = gl.createProgram();

            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);

            return program;
        }

        this._createWebGLBufferId = (data) => {
            let buffer_id = this._gl.createBuffer();
            this._gl.bindBuffer(this._gl.ARRAY_BUFFER, buffer_id)
            this._gl.bufferData(this._gl.ARRAY_BUFFER, data, this._gl.STATIC_DRAW);
            return buffer_id;
        }

        this._setProgramAttribute = (program, atrrib_name, data_length) => {
            let gl = this._gl;
            program[atrrib_name] = gl.getAttribLocation(program, atrrib_name);
            gl.enableVertexAttribArray(program[atrrib_name]);
            gl.vertexAttribPointer(program[atrrib_name], data_length, gl.FLOAT, false, 0, 0);
        }

        this._setProgramUniform = (program, uniform_name, data, type) => {
            let gl = this._gl;
            program[uniform_name] = gl.getUniformLocation(program, uniform_name);

            if (type === "vec3") {
                gl.uniform3fv(program[uniform_name], data);
            }
            else if (type === "vec4") {
                gl.uniform4fv(program[uniform_name], data);
            }
            else if (type === "mat4") {
                gl.uniformMatrix4fv(program[uniform_name], false, data);
            }
        }

        this._loadAndCompileShaders = (type, source) => {
            let gl = this._gl;
            let shader = null;

            switch (type) {
                case "VS":
                    shader = gl.createShader(gl.VERTEX_SHADER);
                    gl.shaderSource(shader, source);
                    gl.compileShader(shader);
                    break;
                case "FS":
                    shader = gl.createShader(gl.FRAGMENT_SHADER);
                    gl.shaderSource(shader, source);
                    gl.compileShader(shader);
                    break;
                default:
                    console.log("You must enter shader type first: VS for vertex shader and FS for fragment shader");
                    break;
            }
            return shader;
        }

        this._transformObject = (object) => {
            let translate_matrix = mat4.create();
            mat4.translate(translate_matrix, object.translate.x, object.translate.y, object.translate.z);

            let scale_matrix = mat4.create();
            mat4.scale(scale_matrix, object.scale.x, object.scale.y, object.scale.z);

            let rotateX_matrix = mat4.create();
            let rotateY_matrix = mat4.create();
            let rotateZ_matrix = mat4.create();
            mat4.rotate(rotateX_matrix, object.rotate.x, 1, 0, 0);
            mat4.rotate(rotateY_matrix, object.rotate.y, 0, 1, 0);
            mat4.rotate(rotateZ_matrix, object.rotate.z, 0, 0, 1);

            let transform_matrix = mat4.create();
            mat4.multiplySeries(transform_matrix, translate_matrix, scale_matrix, rotateX_matrix, rotateY_matrix, rotateZ_matrix);

            return transform_matrix;
        }

        this.render = (scene) => {
            if (this.isConfig == false) {
                this._configSceneAndCamera(scene, camera);
            }

            else if (this.isConfig == true) {
                let gl = this._gl;

                gl.enable(gl.DEPTH_TEST);

                gl.clearColor(0, 0, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT);


                for (let obj of scene.objects) {

                    if (obj.type === "BoxGeometry") {

                        if (obj.material !== null) {
                            if (obj.material.type === "NormalMaterial") {
                                gl.useProgram(obj.gl_program);
                                gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer_id);

                                let m = mat4.create();
                                let model_matrix = this._transformObject(obj);
                                let projection_matrix = camera.projection;
                                let view_matrix = camera.transform;

                                mat4.multiplySeries(m, projection_matrix, view_matrix, model_matrix);

                                this._setProgramAttribute(obj.gl_program, "position", 3);
                                this._setProgramUniform(obj.gl_program, "color", obj.material.base_color, "vec4");
                                this._setProgramUniform(obj.gl_program, "u_Transform", m, "mat4");

                                gl.drawArrays(gl.TRIANGLE_STRIP, 0, obj.vertices.length);
                            }
                        }
                    }

                    else if (obj.type === "SphereGeometry") {
                        if (obj.material !== null) {
                            if (obj.material.type === "NormalMaterial") {
                                if (obj.render_face == true) {
                                    gl.useProgram(obj.gl_program);
                                    gl.bindBuffer(gl.ARRAY_BUFFER, obj.face_buffer_id);

                                    let m = mat4.create();
                                    let model_matrix = this._transformObject(obj);
                                    let projection_matrix = camera.projection;
                                    let view_matrix = camera.transform;

                                    mat4.multiplySeries(m, projection_matrix, view_matrix, model_matrix);

                                    this._setProgramAttribute(obj.gl_program, "position", 3);
                                    this._setProgramUniform(obj.gl_program, "color", obj.material.base_color, "vec4");
                                    this._setProgramUniform(obj.gl_program, "u_Transform", m, "mat4");

                                    gl.drawArrays(gl.TRIANGLE_STRIP, 0, obj.vertices_for_triangles.length);
                                }
                                if (obj.render_line == true) {
                                    gl.useProgram(obj.gl_program);
                                    gl.bindBuffer(gl.ARRAY_BUFFER, obj.line_buffer_id);

                                    let m = mat4.create();
                                    let model_matrix = this._transformObject(obj);
                                    let projection_matrix = camera.projection;
                                    let view_matrix = camera.transform;

                                    mat4.multiplySeries(m, projection_matrix, view_matrix, model_matrix);

                                    this._setProgramAttribute(obj.gl_program, "position", 3);
                                    this._setProgramUniform(obj.gl_program, "color", obj.line_color, "vec4");
                                    this._setProgramUniform(obj.gl_program, "u_Transform", m, "mat4");

                                    gl.drawArrays(gl.LINES, 0, obj.vertices_for_lines.length);
                                }
                            }

                        }
                    }

                }
            }
        }

    }

    Scene = function () {
        this.objects = [];

        this.add = (object) => {
            object.face_geometry_buffer = this._buildObjectBuffer(object.vertices_for_triangles);
            object.line_geometry_buffer = this._buildObjectBuffer(object.vertices_for_lines);
            this.objects.push(object);
        };

        /* Function _buildObjectBuffer() <object, mode>
            - Build geometry buffer array for an object. Internal function.
            - Params:
            1. Vertices: Vertices for rendering faces (or lines) of K3D.Mesh object
            Object.vertices_for_triangles or Object.vertices_for_lines
        */
        this._buildObjectBuffer = (vertices) => {
            let geometryBufferData = new Float32Array(vertices.length * 3);
            let nv = 0;
            for (let i = 0; i < vertices.length; i++) {
                let vertex = vertices[i];
                for (let j = 0; j < vertex.length; j++, nv++) {
                    geometryBufferData[nv] = vertex[j];
                }
            }
            return geometryBufferData;
        }
    }

    light = function () {
        let light = {

        }
    }

    Mesh = function (geometry, material) {

        this.type = geometry.type;
        this.material = material;

        // WebGL information
        this.vertices_for_triangles = null;
        this.vertices_for_lines = null;

        this.face_geometry_buffer = null;
        this.line_geometry_buffer = null;

        this.face_buffer_id = null;
        this.line_buffer_id = null;

        this.gl_program = null
        // Render state:
        this.render_face = true;
        this.render_line = false;
        this.line_color = [1, 1, 1, 1];
        // Basic transformmation:
        this.scale = { x: 1, y: 1, z: 1 };
        this.translate = { x: 0, y: 0, z: 0 };
        this.rotate = { x: 0, y: 0, z: 0 };
        // Build vertices data functions:
        // 1. Build vertices data for rendering TRIANGLE STRIPS:
        this.buidVerticesForTriangles = (triangles) => {
            let vertices = [];
            for (let i = 0; i < triangles.length; i++) {
                let triangle = triangles[i];
                for (let j = 0; j < triangle.length; j++) {
                    let vertex = triangle[j];
                    vertices.push(vertex);
                }
            }
            return vertices;
        }
        // 2. Build vertices data for rendering LINES:
        this.buildVerticesForLines = (lines) => {
            let vertices = [];
            for (let i = 0; i < lines.length; i++) {
                let line = lines[i];
                for (let j = 0; j < line.length; j++) {
                    let vertex = line[j];
                    vertices.push(vertex);
                }
            }
            return vertices;
        }

        this.vertices_for_triangles = this.buidVerticesForTriangles(geometry.triangles);
        this.vertices_for_lines = this.buildVerticesForLines(geometry.lines);


    }

    PerspectiveCamera = function (fov, asp, near, far) {
        // Private variables:
        var u = vec3.create(0, 0, 0);
        var v = vec3.create(0, 0, 0);
        var n = vec3.create(0, 0, 0);
        var center = vec3.create(0, 0, 0);

        this.eye = {
            x: 0,
            y: 0,
            z: 0
        }
        this.up = {
            x: 0,
            y: 1,
            z: 0
        };
        this.transform = mat4.create();
        this.projection = mat4.createPerspective(fov, asp, near, far);

        this.lookAt = (center_x, center_y, center_z) => {
            // Local coordinate system for the camera:
            //   u maps to the x-axis
            //   v maps to the y-axis
            //   n maps to the z-axis
            let eye = vec3.create(this.eye.x, this.eye.y, this.eye.z);
            let up = vec3.create(this.up.x, this.up.y, this.up.z);

            vec3.set(center, center_x, center_y, center_z);

            vec3.subtract(n, eye, center);
            vec3.normalize(n);

            vec3.crossProduct(u, up, n);
            vec3.normalize(u);

            vec3.crossProduct(v, n, u);
            vec3.normalize(v);

            var tx = - vec3.dotProduct(u, eye);
            var ty = - vec3.dotProduct(v, eye);
            var tz = - vec3.dotProduct(n, eye);

            // Set the camera matrix:
            this.transform[0] = u[0]; this.transform[4] = u[1]; this.transform[8] = u[2]; this.transform[12] = tx;
            this.transform[1] = v[0]; this.transform[5] = v[1]; this.transform[9] = v[2]; this.transform[13] = ty;
            this.transform[2] = n[0]; this.transform[6] = n[1]; this.transform[10] = n[2]; this.transform[14] = tz;
            this.transform[3] = 0; this.transform[7] = 0; this.transform[11] = 0; this.transform[15] = 1;
        }

        this.lookAt(0, 0, 0);
    }

    GeometryBuffer = function (data_array) {
        return null;
    }

    BoxGeometry = function (size) {
        return {
            type: "BoxGeometry",
            vertices: [
                [-size / 2, size / 2, size / 2],
                [-size / 2, -size / 2, size / 2],
                [size / 2, size / 2, size / 2],
                [size / 2, -size / 2, size / 2],



                [size / 2, size / 2, -size / 2],
                [size / 2, -size / 2, -size / 2],
                [-size / 2, size / 2, -size / 2],
                [-size / 2, -size / 2, -size / 2],

                [-size / 2, size / 2, size / 2],
                [-size / 2, -size / 2, size / 2],

                [-size / 2, size / 2, size / 2],
                [size / 2, size / 2, size / 2],
                [-size / 2, size / 2, -size / 2],
                [size / 2, size / 2, -size / 2],

                [-size / 2, -size / 2, size / 2],
                [size / 2, -size / 2, size / 2],
                [-size / 2, -size / 2, -size / 2],
                [size / 2, -size / 2, -size / 2],

            ],
        }
    }

    UVSphereGeometry = function (size, rings, segments) {

        let vertices = [];
        let triangles = [];
        let lines = [];
        let x, y, z, xy;
        let lat, lon;
        let lat_step = Math.PI / rings;
        let lon_step = 2 * Math.PI / segments;

        // Build spherical geometry vertices:

        for (let i = 0; i <= rings; i++) {
            lat = Math.PI / 2 - i * lat_step;
            xy = size * Math.cos(lat);
            z = size * Math.sin(lat);

            for (let j = 0; j < segments; j++) {
                lon = j * lon_step;
                x = xy * Math.cos(lon);
                y = xy * Math.sin(lon);
                vertices.push([x, y, z]);
            }
        }

        // Build triangles from vertices:
        let k1, k2;

        for (let i = 0; i < rings; i++) {
            k1 = i * segments;
            k2 = k1 + segments;
            for (let j = 0; j < segments; j++, k1++, k2++) {
                if (i != 0) {
                    let t = this.Triangle(vertices[k1], vertices[k2], vertices[k1 + 1]);
                    triangles.push(t);
                }
                if (i != rings - 1) {
                    let t = this.Triangle(vertices[k1 + 1], vertices[k2], vertices[k2 + 1]);
                    triangles.push(t);
                }
            }
        }

        // Build lines from triangles:

        for (let i = 0; i < triangles.length; i++) {
            let l1 = this.Line(triangles[i][0], triangles[i][1]);
            let l2 = this.Line(triangles[i][1], triangles[i][2]);
            let l3 = this.Line(triangles[i][2], triangles[i][0]);

            lines.push(l1);
            lines.push(l2);
            lines.push(l3);
        }

        return {
            type: "SphereGeometry",
            triangles,
            lines,
        }
    }

    Triangle = function (a, b, c) {
        let T = [a, b, c];
        return T;
    }
    Line = function (a, b) {
        let L = [a, b];
        return L;
    }
    NormalMaterial = function (base_color) {
        let material = {
            type: "NormalMaterial",
            base_color: base_color,
            vShader: `
                precision mediump int;
                precision mediump float;
            
                attribute vec3 position;
                uniform mat4 u_Transform;
                
                void main() {
                    gl_PointSize = 4.0;
                    gl_Position =  u_Transform * vec4(position, 1.0);
                }
            `,
            fShader: `
                precision mediump int;
                precision mediump float;
            
                uniform vec4 color;
            
                void main() {
                    gl_FragColor = vec4(color);
                }
            `
        }

        return material;
    }
    GradientMaterial = function (base_color) {
        let material = {
            type: "GradientMaterial",
            base_color: base_color,
            vShader: `
                precision mediump int;
                precision mediump float;
            
                attribute vec3 position;
                attribute vec3 a_Color;
                uniform mat4 u_Transform;

                varying vec3 v_Color;
                
                void main() {
                    v_Color = a_Color;
                    gl_Position =  u_Transform * vec4(position, 1.0);
                }
            `,
            fShader: `
                precision mediump int;
                precision mediump float;

                varying vec3 v_Color;
            
                uniform vec4 color;
            
                void main() {
                    gl_FragColor = vec4(vec3(v_Color), 1.);
                }
            `
        }

        return material;
    }
}
