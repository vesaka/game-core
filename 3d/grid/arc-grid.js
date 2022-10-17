import Grid3d from './grid-3d.js';
import { raw, extend } from '$core/utils/object.js';
import { radians } from '$core/utils/math.js';
import { Shape, Path,
    ExtrudeGeometry, TorusGeometry,
    WireframeGeometry, Mesh,
    LineSegments, LineBasicMaterial, MeshPhongMaterial
} from 'three';
import * as dat from 'dat.gui';
class ArcGrid extends Grid3d {
    constructor(preset) {
        super(preset);
        this.arcs = [];
        this.createArcs();
        return this;
    }
    
    filter_angle(angle) {
        return radians(angle);
    }   
    
    createArcs() {
        const { origin, height, rings, tube, sectors, radial, angle } = this;
        
        const arcTube = Math.floor(height / rings);
        
        const material = new LineBasicMaterial({
                color: 0xff6666,
                linewidth: 1,
                linecap: 'round', //ignored by WebGLRenderer
                linejoin:  'round', //ignored by WebGLRenderer,
                wireframe: true
        });
        
        for (let i = 1; i <= rings; i++) {
            console.log(i * arcTube * 2);
            const torusGeometry = new TorusGeometry(origin.radius + (i * arcTube * 2), arcTube, radial, sectors, radians(180));
            const wireframe = new WireframeGeometry(torusGeometry);
            const mesh = new LineSegments(wireframe, material);
            mesh.position.y = -origin.radius;
            mesh.position.z = -height / 2;
            mesh.position.x = 0;
            this.arcs.push(mesh);
        }

        
    }

    prepare() {
        const {rings, sectors, divisions, types, placement, sphere} = this;
        const def = this.default;


//        const slot = extend(placement, {
//            x: [placement.x[0] * sphere.radius, placement.x[1] * sphere.widthSegments],
//            y: [placement.y[0] * app.screen.height, placement.y[1] * app.screen.height],
//            z: []
//        });
    }
}

export default ArcGrid;