window["FLAT_SHADER"] = {
    VERT: `
        // Vertex Shader
        precision mediump int;
        precision mediump float;
        
        // Scene transformations
        uniform mat4 u_PVM_transform; // Projection, view, model transform
        uniform mat4 u_VM_transform;  // View, model transform
        uniform vec4 u_Color;
        
        // Light model
        uniform vec3 u_Light_position;
        
        // Original model data
        attribute vec3 a_Vertex_position;
        attribute vec3 a_Color;
        attribute vec3 a_Vertex_normal;
        
        // Data (to be interpolated) that is passed on to the fragment shader
        varying vec3 v_Vertex_position;
        varying vec4 v_Color;
        varying vec3 v_Vertex_normal;
        
        void main() {
        
        // Perform the model and view transformations on the vertex and pass this
        // location to the fragment shader.
        v_Vertex = vec3( u_VM_transform * vec4(a_Vertex_position, 1.0) );
        
        // Perform the model and view transformations on the vertex's normal vector
        // and pass this normal vector to the fragment shader.
        v_Vertex_normal = vec3( u_VM_transform * vec4(a_Vertex_normal, 0.0) );
        
        // Pass the vertex's color to the fragment shader.
        v_Color = vec4(a_Color, 1.0);
        
        // Transform the location of the vertex for the rest of the graphics pipeline
        gl_Position = u_PVM_transform * vec4(a_Vertex_position, 1.0);
        }
    `,
    FRAG: `
        // Fragment shader program
        precision mediump int;
        precision mediump float;
        
        // Light model
        uniform vec3 u_Light_position;
        
        // Data coming from the vertex shader
        varying vec3 v_Vertex;
        varying vec4 v_Color;
        varying vec3 v_Vertex_normal;
        
        void main() {
        
        vec3 to_light;
        vec3 vertex_normal;
        float cos_angle;
        
        // Calculate a vector from the fragment location to the light source
        to_light = u_Light_position - v_Vertex;
        to_light = normalize( to_light );
        
        // The vertex's normal vector is being interpolated across the primitive
        // which can make it un-normalized. So normalize the vertex's normal vector.
        vertex_normal = normalize( v_Vertex_normal );
        
        // Calculate the cosine of the angle between the vertex's normal vector
        // and the vector going to the light.
        cos_angle = dot(vertex_normal, to_light);
        cos_angle = clamp(cos_angle, 0.0, 1.0);
        
        // Scale the color of this fragment based on its angle to the light.
        gl_FragColor = vec4(vec3(v_Color) * cos_angle, v_Color.a);
        }
    `
};

window["BASIC_SHADER"] = {
    VERT: `
        precision mediump int;
        precision mediump float;

        uniform mat4 u_PVM_transform; // Projection, view, model transform

        //attribute vec3 a_Color;
        attribute vec3 a_Vertex_position;
        
        
        varying vec3 v_Color;
        
        void main() {
            gl_Position = u_PVM_transform * vec4(a_Vertex_position, 1.0);
        }
    `,
    FRAG: `
        precision mediump int;
        precision mediump float;
        
        uniform vec3 u_Color;

        varying vec3 v_Color;
        
        void main() {
            gl_FragColor = vec4(0., 0.4, 0.2, 1.);
        }
    `
}

window["KUtils"] = {
    Triangle: function (a, b, c) {
        let T = [a, b, c];
        return T;
    },
    Line: function (a, b) {
        let L = [a, b];
        return L;
    }
}

window["SHADE_FLAT"] = Math.random();
window["SHADE_SMOOTH"] = Math.random();
window["SHADE_OFF"] = Math.random();

window["randomInt"] = function (min, max) {
    return min + Math.floor((max - min) * Math.random());
}
