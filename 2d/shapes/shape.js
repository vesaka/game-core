class Shape {
    constructor(options = {}) {
        this.mass = 0;
        this.restitution = 1.0;
        this.friction = 0;
        
        
        Object.assign(this, options);
        
        this.__shape = this.constructor.name;
        this.__type = Shape.prototype[this.__shape.toUpperCase()] || 0;
        return this;
    }
    
    colide() {
        
    }
    
    inside() {
        
    }
}

Shape.prototype.CIRCLE = 0;
Shape.prototype.POINT = 1;
Shape.prototype.LINE = 2;
Shape.prototype.TRIANGLE = 3;
Shape.prototype.RECTANGLE = 4;
Shape.prototype.POLYGON = 5;
Shape.prototype.CURVE = 6;
Shape.prototype.ELLIPSE = 7;
export default Shape;

