import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

export default {
    camera_created() {
        const {camera, canvas, renderer, scene} = this;

        this.controls = new OrbitControls(camera, canvas.parentNode);
        this.controls.enableDamping = true;
        this.controls.update();


    },
    
    window_resize() {

    }
}