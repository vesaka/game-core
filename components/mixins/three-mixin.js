import {Scene, PerspectiveCamera, WebGLRenderer, Clock} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import Container from '$lib/game/core/container';

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};
const cursor = {
    x: 0,
    y: 0
};

const scene = new Scene();


const aspectRatio = sizes.width / sizes.height;
const camera = new PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
export default {
    computed: {
        scene() {
            return scene;
        },
        canvas() {
            return this.$refs.canvas;
        }
    },
    methods: {
        onResize() {
            console.log(this.game);
        }
    },
    mounted() {
        const canvas = this.canvas;

        const renderer = new WebGLRenderer({
            canvas
        });

        window.addEventListener('resize', () => {
            sizes.width = window.innerWidth;
            sizes.height = window.innerHeight;
            //Update camera
            camera.aspect = sizes.width / sizes.height;
            camera.updateProjectionMatrix();
            //Update renderer
            canvas.style.width = `${sizes.width}px`;
            canvas.style.height = `${sizes.height}px`;
            renderer.setSize(sizes.width, sizes.height);
        });

        window.addEventListener('mousemove', event => {
            cursor.x = event.clientX / sizes.width - 0.5;
            cursor.y = -(event.clientY / sizes.height - 0.5);
        });

        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        //renderer.render(scene, camera);

//        const controls = new OrbitControls(camera, canvas);
//        controls.enableDamping = true;

        this.renderer = renderer;
    }
}