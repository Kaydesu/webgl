class SceneObject {

    constructor() {
        this.type = null;
        this.vertices = null;
        this.material = null;

        this.scaleX = 1;
        this.scaleY = 1;
        this.scaleZ = 1;

        this.translateX = 0;
        this.translateY = 0;
        this.translateZ = 0;

        this.rotateX = 1;
        this.rotateY = 0;
        this.rotateZ = 0;
    }

    

    addGeometry(geometry) {
        this.type = geometry.type;
        this.vertices = geometry.vertices;
    }

    addMaterial(material) {
        this.material  = material;
    }

    transform() {
        
        let translate_matrix = mat4.create();
        mat4.translate(translate_matrix, this.translateX, this.translateY, this.translateZ);

        let scale_matrix = mat4.create();
        mat4.scale(scale_matrix, this.scaleX, this.scaleY, this.scaleZ);

        let rotateX_matrix = mat4.create();
        let rotateY_matrix = mat4.create();
        let rotateZ_matrix = mat4.create();
        mat4.rotate(rotateX_matrix, this.rotateX, 1, 0, 0);
        mat4.rotate(rotateY_matrix, this.rotateY, 0, 1, 0);
        mat4.rotate(rotateZ_matrix, this.rotateZ, 0, 0, 1);

        let transform_matrix = mat4.create();
        mat4.multiplySeries(transform_matrix, translate_matrix, scale_matrix, rotateX_matrix, rotateY_matrix, rotateZ_matrix);

        return transform_matrix;
    }
}