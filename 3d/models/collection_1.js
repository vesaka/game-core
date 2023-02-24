import Container from '$core/container';
import {deepMerge, raw, isObject} from '$core/utils/object';

class Collection extends Container {
    constructor(options) {
        super(options);
        this.__name = this.constructor.name;
        this.items = [];
        
        return this;
    }
    
    all() {
        return this.items;
    }

    add(item) {
        this.items.push(item);
    }

    remove(key) {
        if (Array.isArray(this.items)) {
            this.items = this.items.slice(key, 0);
        } else if (isObject(this.items)) {
            delete this.items[key];
        }
        return this;
    }
    
    put(item, at) {
        this.items[at] = item;
    }

    each(callback) {
        for (let i in this.items) {
            callback(this.items[i], i);
        }
    }
    
    map(callback) {
        const items = [];
        for (let i in this.items) {
            items.push(callback(this.items[i], i));
        }
        return items;
    }
    
    transform(callback) {
        const items = [];
        for (let i in this.items) {
            this.items[i] = callback(this.items[i], i);
        }
        return this.items;
    }

    contains(callback) {
        let result = false;
        for (let type in this.items) {
            for (let i in this.items[type]) {
                result = callback(this.items[type]);
                if (result) {
                    break;
                }
            }
            if (result) {
                break;
            }
        }
    }
}
;

export default Collection;
