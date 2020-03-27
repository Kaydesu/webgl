let posX_slider, posY_slider, posZ_slider, fov_slider, centerX_slider, centerY_slider, centerZ_slider;
let cameraX, cameraY, cameraZ, fov, centerX, centerY, centerZ;

$(document).ready(() => {
    posX_slider = document.getElementById("positionX");
    posY_slider = document.getElementById("positionY");
    posZ_slider = document.getElementById("positionZ");
    fov_slider = document.getElementById("fov");
    centerX_slider = document.getElementById("centerX");
    centerY_slider = document.getElementById("centerY");
    centerZ_slider = document.getElementById("centerZ");

    cameraX = posX_slider.value;
    cameraY = posY_slider.value;
    cameraZ = posZ_slider.value;
    fov = fov_slider.value;
    centerX = centerX_slider.value;
    centerY = centerY_slider.value;
    centerZ = centerZ_slider.value;

    posX_slider.oninput = () => {
        cameraX = posX_slider.value;
    }
    posY_slider.oninput = () => {
        cameraY = posY_slider.value;
    }
    posZ_slider.oninput = () => {
        cameraZ = posZ_slider.value;
    }
    fov_slider.oninput = () => {
        fov = fov_slider.value;
    }
    centerX_slider.oninput = () => {
        centerX = centerX_slider.value;
    }
    centerY_slider.oninput = () => {
        centerY = centerY_slider.value;
    }
    centerZ_slider.oninput = () => {
        centerZ = centerZ_slider.value;
    }
});


