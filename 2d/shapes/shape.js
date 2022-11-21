class Shape {
    
    static CIRCLE = 0;
    static POINT = 1;
    static LINE = 2;
    static TRIANGLE = 3;
    static RECTANGLE = 4;
    static POLYGON = 5;
    static CURVE = 6;
    static ELIPSE = 7;
    
    constructor(options = {}) {
        Object.assign(this, options);
        this.__shape = this.constructor.name.toLowerCase();
        return this;
    }
    
    is(shape) {
        if (typeof shape === 'number') {
            return shape === this.type;
        }
        
        if (shape === this.__shape) {
            return true;
        }
        
        return false;
    }
    
    isOneOf(...these) {
        for (let i in these) {
            if (this.is(these[i])) {
                return true;
            }
        }
        
        return false;
    }
    
    colides(...args) {
        const object = args.unshift();
        if (typeof object !== 'object' && null !==object) {
            return false;
        }
        
        const method = `colides${object.__shape.toUpperCase()}`;

        if (typeof this[method] === 'function') {
            return this[method].apply(this, args);
        }
        
        return false;
        
    }
    
    inside() {
        
    }
}

export const MAX_DISTANE = 10000;
export const MIN_DISTANCE = -10000;

export default Shape;

