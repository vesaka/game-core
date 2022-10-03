import Container from '$lib/game/core/container';
import {raw, deepMerge} from '$lib/game/core/utils/object';

class Pool extends Container {
    
    constructor(options = {}) {
        super(options);
        this.__initialize();
        return this;
    }
    
    __initialize() {
        this.collections = {};
        
        const collectionTypes = this.getCollectionTypes();
        const rawDefault = deepMerge({}, this.default);
        
        for(let type in this.types) {
            const options = deepMerge({}, deepMerge({}, this.default));
        }
    }
    
    getCollectionTypes() {
        return {};
    }
    
};

export default Pool;
