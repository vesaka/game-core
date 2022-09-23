import Container from '$lib/game/core/container';
class Collection extends Container {
    constructor(options) {

        super(options);
        
        Object.assign(this, options);        

        let filterMethod;
        for (let attribute in options) {
            filterMethod = `filter_${attribute}`;
            if (typeof this[filterMethod] === 'function') {
                this[attribute] = this[filterMethod](options[attribute]);
            }
        }
        this.items = options.items || [];
        return this;
    }

    all() {
        return this.items;
    }

    avarage(key) {
        this.items.avarage(key);
    }
    
    avg(key) {
        this.items.avarage(key);
    }

    add(item) {
        this.items.push(item);
        return this;
    }

    remove(at) {
        this.items.splice(at, 1);
        return this;
    }
    
    map(callback) {
        const result = [];
        for (let i in this.items) {
            result.push(callback(this.items[i], i));
        }
        return result;
    }
    
    each(callback) {
        for (let i in this.items) {
            callback(this.items[i], i);
        }
        return this;
    }

    filter(condition = null) {
        if (typeof condition !== 'function') {
            condition = (item) => {
                return undefined !== item;
            };
        }

        return this.items.filter(condition);
    }

    merge() {
        for (let i in arguments) {
            if (Array.isArray(arguments[i])) {
                this.items.concat(arguments[i]);
            }
        }

        return this;
    }
    
    
}
;

export default Collection;

