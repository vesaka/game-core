import Collection from './collection';
import Container from '$core/container';
import { extend, raw, isObject } from '$core/utils/object';
import { between } from '$core/utils/math';
class List extends Container {    
    #firstKey = '';
    
    items = {};
    constructor(options = {}) {
        if (!options.map) {
            options.map = {};
        }
        super(options);
        Object.assign(this, options);

        let filterMethod;
        for (let attribute in options) {
            filterMethod = `filter_${attribute}`;
            if (typeof this[filterMethod] === 'function') {
                this[attribute] = this[filterMethod](options[attribute]);
            }
        }
    }
    
    add(name, item) {
        this.items[name] = item;
    }
    
    get(name) {
        return this.items[name] || Object.values(this.items)[0];   
        
    }

    createItems() {
        const {types} = this;
        for (let type in types) {
            this.add(type, this.createItem(type, types[type] || {}));
        }
    }

    createItem(type = '', options = {}) {
        const {def, map} = this;
        const keys = Object.keys(map);
        type = keys.includes(type) ? type : keys[0];
        options.type = type;
        return new map[type](extend(def, options));
        
    }
    
    create(type = '', extra = {}) {
        const {def, map, types} = this;
        const keys = Object.keys(map);
        type = keys.includes(type) ? type : keys[0];
        
        
        const options = extend(types[type], extra);
        options.type = type;

        return new map[type](extend(def, options));
    }
    
    select(name = '', options = null) {
        return this.find(item => item.$name === name);
    }
}

export default List;

