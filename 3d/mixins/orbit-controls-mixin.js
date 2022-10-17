import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

export const useOrbitControls = (instance) => {
    const {camera, canvas, renderer, scene} = instance;

    instance.controls = new OrbitControls(camera, canvas.parentNode);
    instance.controls.enableDamping = true;
    instance.controls.update();
};