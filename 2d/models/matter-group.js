import Container from '$core/container';
import { Composite, Constraint } from 'matter-js';

class Group extends Container {
    __group__ = true;
    
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
        
        this.components = this.createComponents();
        this.constraints = this.createConstraints();
        this.$name = this.constructor.name.toLowerCase();
        return this;
    }
        
    createComponents() {
        const { def, components } = this; 
        for (let key in components) {
            
        }
        const items = {};
        return components;
    }
    
    createConstraints() {
        return [];
    }
    
    set(key, item) {
        this.components[key] = item;
    }
    
    get(key) {
        return this.components[key] || {};
    }
    
    remove(key) {
        delete this.components[key];
    }
    
    each(callback) {
        for (let key in this.components) {
            callback(this.components[key]);
        }
    }
    
    first(callback) {
        for (let key in this.components) {
            const result = callback(this.components[key], key);
            if (true === result) {
                return this.components[key];
            }
        }
        
        return null;
    }
    
    reduce(callback, value) {
        for (let key in this.components) {
            value = callback(this.components[key], value);
        }
        
        return value;
    }
    
    map(callback) {
        const result = {};
        for (let key in this.components) {
            result[key] = callback(this.components[key]);
        }
        
        return result;
    }
    
    setPosition(point) {
        Composite.translate(this.body, point);
        this.model.position.set(point.x, point.y);
    }
    
    createBody() {
        
    }
    
    addConstraint(constraint, label = '') {
        if ('constraint' === constraint.type) {
            if (label) {
                constraint.label = label;
            }
            this.constraints.push(constraint);
        }
    }
    
    removeConstraint(label) {
        const constraint = this.constraints.find(c => label !== c.label);
        this.constraints = this.constraints.filter(c => label !== c.label);
        
        
        Composite.remove(this.world, constraint);
    }
    
}

export default Group;

