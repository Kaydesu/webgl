window["K3D"] = {
    Triangle: function (v0, v1, v2) {
        let v = [];
        let triangles = [];
        let lines = [];

        triangles = [[v0, v1, v2]];
        for (let i = 0; i < triangles.length; i++) {
            let l1 = KUtils.Line(triangles[i][0], triangles[i][1]);
            let l2 = KUtils.Line(triangles[i][1], triangles[i][2]);
            let l3 = KUtils.Line(triangles[i][2], triangles[i][0]);

            lines.push(l1);
            lines.push(l2);
            lines.push(l3);
        }

        return {
            type: "Triangle",
            triangles,
            lines,
        }
    },

    ConeGeometry: function (radius, height, segments) {
        let v = [];
        let triangles = [];
        let lines = [];
        let angle_step = 2 * Math.PI / segments;
        let x, y, angle;
        for (let i = 0; i <= segments; i++) {
            angle = i * angle_step;
            x = radius * Math.cos(angle);
            y = radius * Math.sin(angle);
            v.push([x, y, 0]);
        }

        for (let i = 0; i < segments; i++) {
            let peak = [0, 0, height];
            let bottom = [0, 0, 0];
            let side_planes = KUtils.Triangle(peak, v[i], v[i + 1]);
            let bottom_planes = KUtils.Triangle(v[i], bottom, v[i + 1]);
            triangles.push(side_planes);
            triangles.push(bottom_planes);
        }

        for (let i = 0; i < triangles.length; i++) {
            let l1 = KUtils.Line(triangles[i][0], triangles[i][1]);
            let l2 = KUtils.Line(triangles[i][1], triangles[i][2]);
            let l3 = KUtils.Line(triangles[i][2], triangles[i][0]);

            lines.push(l1);
            lines.push(l2);
            lines.push(l3);
        }

        return {
            type: "ConeGeometry",
            triangles,
            lines,
        }
    },

    BoxGeometry: function (width, height, depth) {
        let w, h, d;
        let v = null;
        let triangles = [];
        let lines = [];

        w = width;
        if (height != null) {
            h = height;
        }
        else {
            h = w;
        }
        if (depth != null) {
            d = depth;
        }
        else {
            d = w;
        }

        v = [
            [-w / 2, h / 2, d / 2],
            [-w / 2, -h / 2, d / 2],
            [w / 2, h / 2, d / 2],
            [w / 2, -h / 2, d / 2],
            [w / 2, h / 2, -d / 2],
            [w / 2, -h / 2, -d / 2],
            [-w / 2, h / 2, -d / 2],
            [-w / 2, -h / 2, -d / 2],
        ];

        triangles = [
            KUtils.Triangle(v[0], v[1], v[2]), KUtils.Triangle(v[2], v[1], v[3]),
            KUtils.Triangle(v[2], v[3], v[4]), KUtils.Triangle(v[4], v[3], v[5]),
            KUtils.Triangle(v[4], v[5], v[6]), KUtils.Triangle(v[6], v[5], v[7]),
            KUtils.Triangle(v[6], v[7], v[0]), KUtils.Triangle(v[0], v[7], v[1]),
            KUtils.Triangle(v[0], v[2], v[6]), KUtils.Triangle(v[6], v[2], v[4]),
            KUtils.Triangle(v[1], v[3], v[7]), KUtils.Triangle(v[7], v[3], v[5])
        ];

        for (let i = 0; i < triangles.length; i++) {
            let l1 = KUtils.Line(triangles[i][0], triangles[i][1]);
            let l2 = KUtils.Line(triangles[i][1], triangles[i][2]);
            let l3 = KUtils.Line(triangles[i][2], triangles[i][0]);

            lines.push(l1);
            lines.push(l2);
            lines.push(l3);
        }

        return {
            type: "BoxGeometry",
            triangles,
            lines,
        }
    },

    UVSphereGeometry: function (size, rings, segments) {
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
                    let t = KUtils.Triangle(vertices[k1], vertices[k2], vertices[k1 + 1]);
                    triangles.push(t);
                }
                if (i != rings - 1) {
                    let t = KUtils.Triangle(vertices[k1 + 1], vertices[k2], vertices[k2 + 1]);
                    triangles.push(t);
                }
            }
        }
        // Build lines from triangles:
        for (let i = 0; i < triangles.length; i++) {
            let l1 = KUtils.Line(triangles[i][0], triangles[i][1]);
            let l2 = KUtils.Line(triangles[i][1], triangles[i][2]);
            let l3 = KUtils.Line(triangles[i][2], triangles[i][0]);

            lines.push(l1);
            lines.push(l2);
            lines.push(l3);
        }
        return {
            type: "SphereGeometry",
            triangles,
            lines,
        }
    },
    BasicMaterial: function (base_color, shade_mode) {
        let material = {
            type: "NormalMaterial",
            base_color: base_color,
            vShader: null,
            fShader: null
        }
        if (shade_mode == SHADE_FLAT) {
            material.vShader = FLAT_SHADER.VERT;
            material.fShader = FLAT_SHADER.FRAG;
        }

        else if (shade_mode == SHADE_OFF) {
            material.vShader = BASIC_SHADER.VERT;
            material.fShader = BASIC_SHADER.FRAG;
        }

        return material;
    },

    AmbientLight: function (color) {
        return {
            type: "light",
            color
        }
    },

    PointLight: class PointLight {
        constructor() {

        }
    },

    PerspectiveCamera: class PerspectiveCamera {

        constructor(fov, asp, near, far) {
            this.eye = { x: 0, y: 0, z: 0 }
            this.up = { x: 0, y: 1, z: 0 };
            this.transform = mat4.create();
            this.projection = mat4.createPerspective(fov, asp, near, far);

            this.lookAt(0, 0, 0);
        }

        lookAt(center_x, center_y, center_z) {
            // Local coordinate system for the camera:
            //   u maps to the x-axis
            //   v maps to the y-axis
            //   n maps to the z-axis
            var u = vec3.create(0, 0, 0);
            var v = vec3.create(0, 0, 0);
            var n = vec3.create(0, 0, 0);
            var center = vec3.create(0, 0, 0);

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
    },
    Mesh: class Mesh {
        constructor(geometry, material) {
            this.type = geometry.type;
            this.material = material;

            this.draw_points = false;
            this.draw_lines = false;
            this.draw_faces = true;

            // SubObjects of a mesh:
            this.Points = {
                vertices: new Float32Array(),
                colors: [0, 0, 0, 1],
                size: 2
            }
            this.Lines = {
                vertices: this._buidVertexAttributeArray(geometry.lines, 2),
                colors: [1, 1, 1, 1]
            }
            this.Triangles = {
                vertices: this._buidVertexAttributeArray(geometry.triangles, 3),
                colors: this._buidColorAttributeArray(geometry.triangles, material.base_color),
                flat_normals: new Float32Array(),
                smooth_normals: new Float32Array()
            };

            // WebGL information:
            this.glProgram = {
                drawPointsProgram: null,
                drawLinesProgram: null,
                drawTriangleProgram: null
            }

            this.buffer_array_list = {
                point_attribute_array: null, // Bind when draw points
                line_attribute_array: null, // Bind when draw lines
                vertex_attribute_array: null // Bind when draw triangles
            }

            // Basic transformmation:
            this.scale = { x: 1, y: 1, z: 1 };
            this.translate = { x: 0, y: 0, z: 0 };
            this.rotate = { x: 0, y: 0, z: 0 };
        }

        _buidVertexAttributeArray(primitives, n) {
            let vertices = new Float32Array(primitives.length * n * 3);
            let nv = 0;
            for (let i = 0; i < primitives.length; i++) {
                let primitive = primitives[i];
                for (let j = 0; j < primitive.length; j++) {
                    let vertex = primitive[j];
                    for (let k = 0; k < vertex.length; k++, nv++) {
                        vertices[nv] = vertex[k];
                    }
                }
            }
            return vertices;
        }

        _buidColorAttributeArray(triangles, base_color) {
            let colors = new Float32Array(triangles.length * 9);
            let num_color = base_color.length;
            let cc = 0;
            for (let i = 0; i < triangles.length; i++) {
                let triangle = triangles[i];
                for (let j = 0; j < triangle.length; j++) {
                    let color = base_color[randomInt(0, num_color)];
                    for (let k = 0; k < color.length; k++, cc++) {
                        colors[cc] = color[k];
                    }
                }
            }
            return colors;
        }
    },
    Scene: class Scene {
        constructor() {
            this.objects = [];
            this.lights = [];
        }

        add(object) {
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
        _buildObjectBuffer(vertices) {
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
    },
    RenderEngine: class RenderEngine {
        constructor(canvas) {
            this._gl = canvas.getContext("webgl");
            this.isConfig = false;
        }

        _configSceneAndCamera(scene) {
            for (let object of scene.objects) {
                let vertexShader = this._loadAndCompileShaders("VS", object.material.vShader);
                let fragmentShader = this._loadAndCompileShaders("FS", object.material.fShader);
                object.gl_program = this._createProgram(vertexShader, fragmentShader);
                object.face_buffer_id = this._createWebGLBufferId(object.face_geometry_buffer);
                object.line_buffer_id = this._createWebGLBufferId(object.line_geometry_buffer);
                object.flat_normal_buffer_id = this._createWebGLBufferId(object.flat_shade_normal_buffer);
            }

            this.isConfig = true;
        }

        _createProgram(vertexShader, fragmentShader) {
            let gl = this._gl;

            let program = gl.createProgram();

            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);

            return program;
        }

        _createWebGLBufferId(data) {
            let buffer_id = this._gl.createBuffer();
            this._gl.bindBuffer(this._gl.ARRAY_BUFFER, buffer_id)
            this._gl.bufferData(this._gl.ARRAY_BUFFER, data, this._gl.STATIC_DRAW);
            return buffer_id;
        }

        _setProgramAttribute(program, atrrib_name, data_length) {
            let gl = this._gl;
            program[atrrib_name] = gl.getAttribLocation(program, atrrib_name);
            gl.enableVertexAttribArray(program[atrrib_name]);
            gl.vertexAttribPointer(program[atrrib_name], data_length, gl.FLOAT, false, 0, 0);
        }

        _setProgramUniform(program, uniform_name, data, type) {
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

        _loadAndCompileShaders(type, source) {
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

        _transformObject(object) {
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

        render(scene, shade_mode) {
            if (this.isConfig == false) {
                this._configSceneAndCamera(scene, camera);
            }

            else if (this.isConfig == true) {
                let gl = this._gl;

                gl.enable(gl.DEPTH_TEST);

                gl.clearColor(0, 0, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT);


                for (let obj of scene.objects) {

                    if (obj.render_face == true) {
                        gl.useProgram(obj.gl_program);
                        gl.bindBuffer(gl.ARRAY_BUFFER, obj.face_buffer_id);

                        let pvm_transform = mat4.create();
                        let model_matrix = this._transformObject(obj);
                        let projection_matrix = camera.projection;
                        let view_matrix = camera.transform;

                        mat4.multiplySeries(pvm_transform, projection_matrix, view_matrix, model_matrix);

                        this._setProgramAttribute(obj.gl_program, "a_Vertex_position", 3);
                        this._setProgramUniform(obj.gl_program, "u_Color", obj.material.base_color, "vec4");
                        this._setProgramUniform(obj.gl_program, "u_PVM_transform", pvm_transform, "mat4");

                        gl.drawArrays(gl.TRIANGLES, 0, obj.vertices_for_triangles.length);
                    }
                    if (obj.render_line == true) {
                        this._renderLine(obj);
                    }
                }

            }
        }

        _renderFlatShading(obj) {

        }

        _renderLine(obj) {
            this._gl.useProgram(obj.gl_program);
            this._gl.bindBuffer(this._gl.ARRAY_BUFFER, obj.line_buffer_id);

            let m = mat4.create();
            let model_matrix = this._transformObject(obj);
            let projection_matrix = camera.projection;
            let view_matrix = camera.transform;

            mat4.multiplySeries(m, projection_matrix, view_matrix, model_matrix);

            this._setProgramAttribute(obj.gl_program, "position", 3);
            this._setProgramUniform(obj.gl_program, "color", obj.line_color, "vec4");
            this._setProgramUniform(obj.gl_program, "u_Transform", m, "mat4");

            this._gl.drawArrays(this._gl.LINES, 0, obj.vertices_for_lines.length);
        }
    },


    // Global variable:


}