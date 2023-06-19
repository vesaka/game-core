import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

export const useOrbitControls = (instance) => {
    const {camera, canvas} = instance;

    instance.controls = new OrbitControls(camera, canvas);
    instance.controls.enableDamping = true;
    instance.controls.update();
};