let draw_triangles = (gl, obj) => {
    let gl_program = obj.drawTrianglesProgram;

    let buffer_id = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_id);
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