import Grid3d from './grid-3d.js';
import { raw, extend } from '$core/utils/object.js';

class SphereGrid extends Grid3d {
    constructor(preset) {
        super();
        this.types = {};
        this.placement = {};
        this.sphere = {};
        Object.assign(this, preset);
        this.list = {};
        this.cells = [];
        this.presets = {};
        this.freeSlots = [];
        this.takenSlots = [];
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