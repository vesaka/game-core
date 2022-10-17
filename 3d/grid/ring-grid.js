import Grid3d from './grid-3d.js';
import { raw, extend } from '$core/utils/object.js';

class RingGrid extends Grid3d {
    constructor(preset) {
        
        return this;
    }
    
    prepare() {
        const {layers, sectors, types, placement, sphere} =  this;
        const def = this.default;
        
        
        const slot = extend(placement, {
            x: [placement.x[0] * sphere.radius, placement.x[1]*sphere.widthSegments],
            y: [placement.y[0]*app.screen.height, placement.y[1]*app.screen.height],
            z: []
        });
    }
}