window["K3D"] = {
    Triangle: function (v0, v1, v2) {
        let v = [];
        let triangles = [];
        let lines = [];

        triangles = [[v0, v1, v2]];
        for (let i = 0; i < triangles.length; i++) {
            let l1 = K3D_Utils.Line(triangles[i][0], triangles[i][1]);
            let l2 = K3D_Utils.Line(triangles[i][1], triangles[i][2]);
            let l3 = K3D_Utils.Line(triangles[i][2], triangles[i][0]);

            lines.push(l1);
            lines.push(l2);
            lines.push(l3);
        }
        
        let smooth_normals = K3D_Utils.buildSmoothNormal(triangles);// Normal vector array of every vertices in each triangle.
        let flat_normals = K3D_Utils.buildFlatNormal(triangles); // Normal vector array of each triangle.

        return {
            type: "Triangle",
            points: [v0, v1, v2],
            triangles,
            lines,
            smooth_normals,
            flat_normals
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
            let side_planes = K3D_Utils.Triangle(peak, v[i], v[i + 1]);
            let bottom_planes = K3D_Utils.Triangle(v[i], bottom, v[i + 1]);
            triangles.push(side_planes);
            triangles.push(bottom_planes);
        }

        for (let i = 0; i < triangles.length; i++) {
            let l1 = K3D_Utils.Line(triangles[i][0], triangles[i][1]);
            let l2 = K3D_Utils.Line(triangles[i][1], triangles[i][2]);
            let l3 = K3D_Utils.Line(triangles[i][2], triangles[i][0]);

            lines.push(l1);
            lines.push(l2);
            lines.push(l3);
        }

        // Merge vertices by distance:
        let count = 0;
        let done = true;
        let i = 0;
        for (i; i < v.length; i++) {
            for (let j = i + 1; j < v.length; j++) {
                let p1 = point4.create(v[i][0], v[i][1], v[i][2]);
                let p2 = point4.create(v[j][0], v[j][1], v[j][2]);
                let distanceBetween = point4.distanceBetween(p1, p2);
                if (distanceBetween < 0.00001) {
                    v[i] = v[j];
                    v.splice(j, 1);
                    i = 0;
                    break;
                }
            }
        }

        // Add the peak vertex and origin vertex - no needed order for points rendering:
        v.push([0, 0, 0]);
        v.push([0, 0, height]);

        // Build normal data for flat shading:
        let smooth_normals = K3D_Utils.buildSmoothNormal(triangles);// Normal vector array of every vertices in each triangle.
        let flat_normals = K3D_Utils.buildFlatNormal(triangles); // Normal vector array of each triangle.

        return {
            type: "ConeGeometry",
            points: v,
            triangles,
            lines,
            flat_normals,
            smooth_normals
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
            K3D_Utils.Triangle(v[0], v[1], v[2]), K3D_Utils.Triangle(v[2], v[1], v[3]),
            K3D_Utils.Triangle(v[2], v[3], v[4]), K3D_Utils.Triangle(v[4], v[3], v[5]),
            K3D_Utils.Triangle(v[4], v[5], v[6]), K3D_Utils.Triangle(v[6], v[5], v[7]),
            K3D_Utils.Triangle(v[6], v[7], v[0]), K3D_Utils.Triangle(v[0], v[7], v[1]),
            K3D_Utils.Triangle(v[0], v[2], v[6]), K3D_Utils.Triangle(v[6], v[2], v[4]),
            K3D_Utils.Triangle(v[1], v[7], v[3]), K3D_Utils.Triangle(v[3], v[7], v[5])
        ];

        for (let i = 0; i < triangles.length; i++) {
            let l1 = K3D_Utils.Line(triangles[i][0], triangles[i][1]);
            let l2 = K3D_Utils.Line(triangles[i][1], triangles[i][2]);
            let l3 = K3D_Utils.Line(triangles[i][2], triangles[i][0]);

            lines.push(l1);
            lines.push(l2);
            lines.push(l3);
        }

        // Build normal data for flat shading:
        let smooth_normals = K3D_Utils.buildSmoothNormal(triangles);// Normal vector array of every vertices in each triangle.
        let flat_normals = K3D_Utils.buildFlatNormal(triangles); // Normal vector array of each triangle.


        return {
            type: "BoxGeometry",
            points: v,
            triangles,
            lines,
            flat_normals,
            smooth_normals
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
                    let t = K3D_Utils.Triangle(vertices[k1], vertices[k2], vertices[k1 + 1]);
                    triangles.push(t);
                }
                if (i != rings - 1) {
                    let t = K3D_Utils.Triangle(vertices[k1 + 1], vertices[k2], vertices[k2 + 1]);
                    triangles.push(t);
                }
            }
        }
        // Build lines from triangles:
        for (let i = 0; i < triangles.length; i++) {
            let l1 = K3D_Utils.Line(triangles[i][0], triangles[i][1]);
            let l2 = K3D_Utils.Line(triangles[i][1], triangles[i][2]);
            let l3 = K3D_Utils.Line(triangles[i][2], triangles[i][0]);

            lines.push(l1);
            lines.push(l2);
            lines.push(l3);
        }
        // Merge vertices by distance:
        let count = 0;
        let done = true;
        let i = 0;
        for (i; i < vertices.length; i++) {
            for (let j = i + 1; j < vertices.length; j++) {
                let p1 = point4.create(vertices[i][0], vertices[i][1], vertices[i][2]);
                let p2 = point4.create(vertices[j][0], vertices[j][1], vertices[j][2]);
                let distanceBetween = point4.distanceBetween(p1, p2);
                if (distanceBetween < 0.00001) {
                    vertices[i] = vertices[j];
                    vertices.splice(j, 1);
                    i = 0;
                    break;
                }
            }
        }
        vertices.splice(0, 1);

        // Build normal data for flat shading:
        let smooth_normals = K3D_Utils.buildSmoothNormal(triangles);// Normal vector array of every vertices in each triangle.
        let flat_normals = K3D_Utils.buildFlatNormal(triangles); // Normal vector array of each triangle.

        return {
            type: "SphereGeometry",
            points: vertices,
            triangles,
            lines,
            origin: [0, 0, 0],
            smooth_normals,
            flat_normals
        }
    },
    BasicMaterial: function (base_color, shade_mode) {
        let material = {
            type: "NormalMaterial",
            base_color: base_color,
            shade_mode,
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
            this.type = "Mesh";
            this.material = material;

            this.draw_points = false;
            this.draw_lines = false;
            this.draw_triangles = true;

            // SubObjects of a mesh:
            this.Points = {
                vertices: this._buidVertexAttributeArray(geometry.points, 1),
                color: [0, 0, 0, 1],
                size: 2
            }
            this.Lines = {
                vertices: this._buidVertexAttributeArray(geometry.lines, 2),
                color: [1, 1, 1, 1]
            }
            this.Triangles = {
                vertices: this._buidVertexAttributeArray(geometry.triangles, 3),
                colors: this._buidColorAttributeArray(geometry.triangles, material.base_color),
                flat_normals: this._buidVertexAttributeArray(geometry.flat_normals, 1),
                smooth_normals: this._buidVertexAttributeArray(geometry.smooth_normals, 1)
            };

            // WebGL information:
            this.drawPointsProgram = null;
            this.drawLinesProgram = null;
            this.drawTrianglesProgram = null;

            // Vertex buffer array is interleaved array of attributes data and use when render triangles
            this.vertex_buffer_array = null; // Bind when draw triangles
            // Point buffer array is 1D array of position attribute, don't need to be interleaved since
            // points is render with uniform
            this.point_buffer_array = this.Points.vertices; // Bind when draw points
            // Line buffer array is 1D array of position attribute, don't need to be interleaved since
            // lines is render with uniform
            this.line_buffer_array = this.Lines.vertices; // Bind when draw lines

            this.vertex_buffer_id = null;
            this.point_buffer_id = null;
            this.line_buffer_id = null;

            // Basic transformmation:
            this.scale = { x: 1, y: 1, z: 1 };
            this.translate = { x: 0, y: 0, z: 0 };
            this.rotate = { x: 0, y: 0, z: 0 };
        }

        /** @_buidVertexAttributeArray
        * Building a 1D array of vertices position base on primitives data: TRIANGLES, LINES, ....
        * @param primitives The primitives data of the mesh, can be triangles or lines.
        * @param n number vertices of each primitive, 2 with lines 3 with triangles, 4 with quad ,.....
        * @returns A 1D array contains vertex position data.
        * @private
        */
        _buidVertexAttributeArray(primitives, n) {
            let vertices = new Float32Array(primitives.length * n * 3);

            let nv = 0;

            if (n == 1) {
                for (let i = 0; i < primitives.length; i++) {
                    let point = primitives[i];
                    for (let j = 0; j < point.length; j++, nv++) {
                        vertices[nv] = point[j];
                    }
                }
            }
            else {
                for (let i = 0; i < primitives.length; i++) {
                    let primitive = primitives[i];
                    for (let j = 0; j < primitive.length; j++) {
                        let vertex = primitive[j];
                        for (let k = 0; k < vertex.length; k++, nv++) {
                            vertices[nv] = vertex[k];
                        }
                    }
                }
            }

            return vertices;
        }
        /** @_buidColorAttributeArray
        * Building a 1D array of color data position base on triangles data.
        * @param triangles The triangles data of the mesh.
        * @param base_color Array of color define by the material.
        * @returns A 1D array contains color data for each vertex.
        * @private
        */
        _buidColorAttributeArray(triangles, base_color) {
            let colors = new Float32Array(triangles.length * 9);
            let num_color = base_color.length;
            let cc = 0;
            for (let i = 0; i < triangles.length; i++) {
                let triangle = triangles[i];
                for (let j = 0; j < triangle.length; j++) {
                    let color = base_color[randomInt(0, num_color - 1)];
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
            this.init = false;
        }

        add(object) {
            if (object.type == "Mesh") {
                if (object.material.shade_mode == SHADE_OFF) {
                    object.vertex_buffer_array = 
                    this._buildInterleavedArray(object.Triangles.vertices.length / 3,
                        [object.Triangles.vertices,
                        object.Triangles.colors],
                        [3, 3]
                    );
                }
                else if(object.material.shade_mode == SHADE_FLAT) {
                    object.vertex_buffer_array = 
                    this._buildInterleavedArray(object.Triangles.vertices.length / 3,
                        [object.Triangles.vertices,
                        object.Triangles.colors,
                        object.Triangle.flat_normals],
                        [3, 3, 3]
                    );
                }
                else if(object.material.shade_mode == SHADE_SMOOTH) {
                    object.vertex_buffer_array = 
                    this._buildInterleavedArray(object.Triangles.vertices.length / 3,
                        [object.Triangles.vertices,
                        object.Triangles.colors,
                        object.Triangle.smooth_normals],
                        [3, 3, 3]
                    );
                }

                this.objects.push(object);
            }

        };


        /** @_buildInterleavedArray
        * Building a 1D array contains interleaved attribute data: position, color, texture, normals, ....
        * @param num_vertex The number of total vertices of the mesh: length(vertices_buffer) / 3.
        * @param buffer_arrays an array of attribute arrays
        * @param data_length_array an array of the length of attribute arrays - need to set value in the right orders of @buffer_arrays
        * @returns A 1D array contains interleaved attribute data.
        * @private
        */
        _buildInterleavedArray(num_vertex, buffer_arrays, data_length_array) {

            let total_length = 0;
            let i, j, k;
            let fi = 0;

            for (let i = 0; i < buffer_arrays.length; i++) {
                total_length += buffer_arrays[i].length;
            }

            let interleaved_array = new Float32Array(total_length);

            for (i = 0; i < num_vertex; i++) {
                for (j = 0; j < buffer_arrays.length; j++) {
                    for (k = 0; k < data_length_array[j]; k++) {
                        interleaved_array[fi++] = buffer_arrays[j][(i * data_length_array[j]) + k];
                    }
                }
            }

            return interleaved_array;
        }
    },
    RenderEngine: class RenderEngine {
        constructor(canvas) {
            this._gl = canvas.getContext("webgl");
            this._shader_point_n_line = {
                vShader: this._loadAndCompileShaders(this._gl.VERTEX_SHADER, DRAW_POINT_N_LINE_SHADER.VERT),
                fShader: this._loadAndCompileShaders(this._gl.FRAGMENT_SHADER, DRAW_POINT_N_LINE_SHADER.FRAG)
            };
        }

        /** @_init
        * Init the Scene before rendering, run once in render function
        * @param type WebGL constant gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
        * @param source a string contains GLSL code.
        * @returns A 1D array contains interleaved attribute data.
        * @private
        */
        _init(scene) {
            for (let object of scene.objects) {
                let vertexShader = this._loadAndCompileShaders(this._gl.VERTEX_SHADER, object.material.vShader);
                let fragmentShader = this._loadAndCompileShaders(this._gl.FRAGMENT_SHADER, object.material.fShader);
                object.drawTrianglesProgram = this._createProgram(vertexShader, fragmentShader);
                object.drawPointsProgram = this._createProgram(this._shader_point_n_line.vShader, this._shader_point_n_line.fShader);
                object.drawLinesProgram = this._createProgram(this._shader_point_n_line.vShader, this._shader_point_n_line.fShader);
                object.vertex_buffer_id = this._createBufferId(object.vertex_buffer_array);
                object.point_buffer_id = this._createBufferId(object.point_buffer_array);
                object.line_buffer_id = this._createBufferId(object.line_buffer_array);
            }
            scene.init = true;
        }

        /** @_loadAndCompileShaders
        * Load and compile Shader
        * @param type WebGL constant gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
        * @param source a string contains GLSL code.
        * @returns A 1D array contains interleaved attribute data.
        * @private
        */
        _loadAndCompileShaders(type, source) {
            let gl = this._gl;
            let shader = null;

            switch (type) {
                case gl.VERTEX_SHADER:
                    shader = gl.createShader(gl.VERTEX_SHADER);
                    gl.shaderSource(shader, source);
                    gl.compileShader(shader);
                    break;
                case gl.FRAGMENT_SHADER:
                    shader = gl.createShader(gl.FRAGMENT_SHADER);
                    gl.shaderSource(shader, source);
                    gl.compileShader(shader);
                    break;
                default:
                    break;
            }
            return shader;
        }

        /** @_createProgram
        * Load and compile Shader
        * @param vertexShader WebGL vertex shader
        * @param fragmentShader WebGL fragment shader
        * @returns A WebGL program using the 2 shader.
        * @private
        */
        _createProgram(vertexShader, fragmentShader) {
            let gl = this._gl;

            let program = gl.createProgram();

            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);

            return program;
        }

        /** @_createBufferId
        * Create the ID for buffer data
        * @param data buffer array for vertex attributes.
        * @returns A buffer id of current data.
        * @private
        */
        _createBufferId(data) {
            let buffer_id = this._gl.createBuffer();
            // this._gl.bindBuffer(this._gl.ARRAY_BUFFER, buffer_id)
            // this._gl.bufferData(this._gl.ARRAY_BUFFER, data, this._gl.STATIC_DRAW);
            return buffer_id;
        }

        _setProgramAttribute(program, attrib_list, data_length_list) {
            let gl = this._gl;

            for (let i = 0; i < attrib_list.length; i++) {
                let attrib_name = attrib_list[i];
                let data_length = data_length_list[i];

                gl.vertexAttribPointer(program[attrib_name], data_length, gl.FLOAT, false, 24, 12);
            }


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

        render(scene, camera) {
            if (scene.init == false) {
                this._init(scene);
            }

            else {
                let gl = this._gl;

                gl.enable(gl.DEPTH_TEST);

                gl.clearColor(0, 0, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT);


                for (let obj of scene.objects) {
                    if (obj.draw_triangles == true) {
                        this.drawTriangles(obj);
                    }

                    if (obj.draw_points == true) {
                        this.drawPoints(obj);
                    }
                    if (obj.draw_lines == true) {
                        this.drawLines(obj);
                    }
                }

            }
        }

        drawTriangles(obj) {
            let gl = this._gl;
            let gl_program = obj.drawTrianglesProgram;

            gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertex_buffer_id);
            gl.bufferData(gl.ARRAY_BUFFER, obj.vertex_buffer_array, gl.STATIC_DRAW);
            gl.useProgram(gl_program);

            gl_program["a_Vertex_position"] = gl.getAttribLocation(gl_program, "a_Vertex_position");
            gl.enableVertexAttribArray(gl_program["a_Vertex_position"]);
            gl.vertexAttribPointer(gl_program["a_Vertex_position"], 3, gl.FLOAT, false, 24, 0);

            gl_program["a_Color"] = gl.getAttribLocation(gl_program, "a_Color");
            gl.enableVertexAttribArray(gl_program["a_Color"]);
            gl.vertexAttribPointer(gl_program["a_Color"], 3, gl.FLOAT, false, 24, 12);

            let pvm_transform = mat4.create();
            let model_matrix = this._transformObject(obj);
            let projection_matrix = camera.projection;
            let view_matrix = camera.transform;

            mat4.multiplySeries(pvm_transform, projection_matrix, view_matrix, model_matrix);
            // Set program uniform:
            this._setProgramUniform(gl_program, "u_PVM_transform", pvm_transform, "mat4");

            gl.drawArrays(gl.TRIANGLES, 0, obj.Triangles.vertices.length / 3);
        }

        drawPoints(obj) {
            let gl = this._gl;
            let gl_program = obj.drawPointsProgram;

            gl.bindBuffer(gl.ARRAY_BUFFER, obj.point_buffer_id);
            gl.bufferData(gl.ARRAY_BUFFER, obj.point_buffer_array, gl.STATIC_DRAW);
            gl.useProgram(gl_program);

            gl_program["a_Vertex_position"] = gl.getAttribLocation(gl_program, "a_Vertex_position");
            gl.enableVertexAttribArray(gl_program["a_Vertex_position"]);
            gl.vertexAttribPointer(gl_program["a_Vertex_position"], 3, gl.FLOAT, false, 0, 0);

            let pvm_transform = mat4.create();
            let model_matrix = this._transformObject(obj);
            let projection_matrix = camera.projection;
            let view_matrix = camera.transform;

            mat4.multiplySeries(pvm_transform, projection_matrix, view_matrix, model_matrix);
            // Set program uniform:
            this._setProgramUniform(gl_program, "u_PVM_transform", pvm_transform, "mat4");
            this._setProgramUniform(gl_program, "u_Color", obj.Points.color, "vec4");

            gl.drawArrays(gl.POINTS, 0, obj.Points.vertices.length / 3);
        }

        drawLines(obj) {
            let gl = this._gl;
            let gl_program = obj.drawLinesProgram;

            gl.bindBuffer(gl.ARRAY_BUFFER, obj.line_buffer_id);
            gl.bufferData(gl.ARRAY_BUFFER, obj.line_buffer_array, gl.STATIC_DRAW);
            gl.useProgram(gl_program);

            gl_program["a_Vertex_position"] = gl.getAttribLocation(gl_program, "a_Vertex_position");
            gl.enableVertexAttribArray(gl_program["a_Vertex_position"]);
            gl.vertexAttribPointer(gl_program["a_Vertex_position"], 3, gl.FLOAT, false, 0, 0);

            let pvm_transform = mat4.create();
            let model_matrix = this._transformObject(obj);
            let projection_matrix = camera.projection;
            let view_matrix = camera.transform;

            mat4.multiplySeries(pvm_transform, projection_matrix, view_matrix, model_matrix);
            // Set program uniform:
            this._setProgramUniform(gl_program, "u_PVM_transform", pvm_transform, "mat4");
            this._setProgramUniform(gl_program, "u_Color", obj.Lines.color, "vec4");

            gl.drawArrays(gl.LINES, 0, obj.Lines.vertices.length / 3);
        }
    },
}