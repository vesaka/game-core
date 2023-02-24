import Container from '$core/container';
import {raw, deepMerge} from '$core/utils/object';
import StatesMixin from '$core/mixins/states-mixin';

class Collection extends Container {
    constructor(options) {
        super(options);
        this.items = {};
        this.__types = {};
        this.__initialize();
        
        
        return this;
    }

    __initialize() {
        const map = this.getTypesMap();
        const rawDefault = Object.assign({}, this.default);
        for (let type in this.types) {
            if (!map[type]) {
                continue;
            }

            if (!this.items[type]) {
                this.items[type] = [];
            }
            
           
            this.__types[type] = deepMerge(Object.assign({}, this.default), this.types[type]);
            
            for (let i = 0; i < this.__types[type].count; i++) {
                const item = new map[type](raw(this.__types[type]));
                
                item.id = `${type}${i}`;
                item.index = i;
                item.type = type;
                this.items[type].push(item);
                
                if (0 === i) {
                    item.setState('landing')
                }
            }         
            
            
        }
        

    }

    getTypesMap() {
        return {};
    }

    filter_list() {

    }

    add() {

    }

    remove() {

    }
    
    eachTypeOption(callback) {
        for (let type in this.__types) {
            callback(this.__types[type], type);
        }
    }

    each(callback) {
        for (let type in this.items) {
            for (let i in this.items[type]) {
                callback(this.items[type][i], type);
            }
        }
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
