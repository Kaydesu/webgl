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
                object.buffer_id = this._createWebGLBufferId(object.bufferData);
            }

            this.isConfig = true;
        }

        this._createProgram = (vertexShader, fragmentShader) => {
            let gl = this._gl;

            let program = gl.createProgram();

            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);

            gl.useProgram(program);

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

                gl.clearColor(0, 0, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT);

                for (let obj of scene.objects) {

                    if (obj.type === "BoxGeometry") {

                        if (obj.material !== null) {
                            if (obj.material.type === "NormalMaterial") {
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

                    else if (obj.type === "GeometryBuffer") {
                        if (obj.material !== null) {

                            if (obj.material.type === "NormalMaterial") {
                                gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer_id);

                                let m = mat4.create();
                                let model_matrix = obj.transform();
                                let view_matrix = camera.transform;

                                mat4.multiplySeries(m, this.projection, view_matrix, model_matrix);

                                this._setProgramAttribute(obj.glProgram, "position", 3);
                                this._setProgramUniform(obj.glProgram, "color", obj.material.base_color, "vec4");
                                this._setProgramUniform(obj.glProgram, "u_Transform", obj.transform, "mat4");

                                gl.drawArrays(gl.TRIANGLE_STRIP, 0, obj.vertices.length);
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

            if (object.type === "GeometryBuffer") {
                object.bufferData = this._buildObjectBuffer(object);
                this.objects.push(object);
            }

            else if (object.type === "BoxGeometry") {
                object.bufferData = this._buildObjectBuffer(object);
                this.objects.push(object);
            }
        };

        this._buildObjectBuffer = (object) => {

            if (object.type === "GeometryBuffer") {
                let geometryBufferData = new Float32Array(object.vertices.length);
                let nv = 0;
                for (let i = 0; i < object.vertices.length; i++, nv++) {
                    geometryBufferData[i] = object.vertices[i];
                }

                return geometryBufferData;
            }

            else if (object.type === "BoxGeometry") {
                let geometryBufferData = new Float32Array(object.vertices.length * 3);
                let nv = 0;
                for (let i = 0; i < object.vertices.length; i++) {
                    let vertex = object.vertices[i];
                    for (let j = 0; j < vertex.length; j++, nv++) {
                        geometryBufferData[nv] = vertex[j];
                    }
                }

                return geometryBufferData;
            }
        }
    }

    light = function () {
        let light = {

        }
    }

    Mesh = function (geometry, material) {
        this.type = geometry.type;
        this.vertices = geometry.vertices;
        this.material = material;

        this.scale = {
            x: 1,
            y: 1,
            z: 1
        };

        this.translate = {
            x: 0,
            y: 0,
            z: 0
        };

        this.rotate = {
            x: 0,
            y: 0,
            z: 0
        };
    }

    PerspectiveCamera = function (fov, asp, near, far) {
        // Private variables:
        var u = vec3.create(0, 0, 0);
        var v = vec3.create(0, 0, 0);
        var n = vec3.create(0, 0, 0);
        var center = vec3.create(0, 0, 0);

        this.eye = vec3.create(0, 0, 120);
        this.up = vec3.create(0, 1, 0);
        this.transform = mat4.create();
        this.projection = mat4.createPerspective(fov, asp, near, far);

        this.lookAt = (center_x, center_y, center_z) => {
            // Local coordinate system for the camera:
            //   u maps to the x-axis
            //   v maps to the y-axis
            //   n maps to the z-axis
            vec3.set(center, center_x, center_y, center_z);

            vec3.subtract(n, this.eye, center);
            vec3.normalize(n);

            vec3.crossProduct(u, this.up, n);
            vec3.normalize(u);

            vec3.crossProduct(v, n, u);
            vec3.normalize(v);

            var tx = - vec3.dotProduct(u, this.eye);
            var ty = - vec3.dotProduct(v, this.eye);
            var tz = - vec3.dotProduct(n, this.eye);

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

    SphereGeometry = function (size, lat_res, lon_res) {
        let sphere = {
            type: "SphereGeometry",
            vertices: [

            ]
        }
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
                    gl_PointSize = 5.0;
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

