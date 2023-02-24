import Container from '$core/container';
import { raw, extend } from '$core/utils/object.js';

class Grid3D extends Container {
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
        this.prepare();
        this.mesh = this.createMesh();
        return this;
    }
    
    createMesh() {
        return null;
    }
}

export default Grid3D;