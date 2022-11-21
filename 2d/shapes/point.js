import Shape from './shape';

class Point extends Shape {
    
    type = 1;
    fixed = 0;
    constructor(x, y, tolerance = 3) {
        super();
        this.x = Math.fixed(x || 0);
        this.y = Math.fixed(y || 0);
        this.tolerance = tolerance;
        return this;
                
    }
    
    slope(point) {
        if (this.x === point.x) {
            return false;
        }
        return (this.y - point.y) / (this.x - point.x);
    }
    
    distance(point) {
        let a = this.x - point.x,
            b = this.y - point.y;
        return Math.sqrt(a*a + b*b);
    }
    
    xInt(point) {
        if (this.y === point.y) {
            return this.x === 0 ? 0 : false;
        }
        
        if (this.x === point.x) {
            return this.x;
        }
        
        let slope = this.slope(point);
        
        return  (-1 * ((slope * this.x) - this.y)) / slope;
    }
    
    yInt(point) {
        if (this.x === point.x) {
            return this.y === 0 ? 0 : false;
        }
        
        if(this.y === point.y) {
            return this.y;
        }
        
        return this.y - (this.slope(point) * this.x);
    }
    
    polar(radius, angle = null) {
        let theta = Math.tan(angle || Math.rand(0, 400)),
                x = this.x + Math.cos(theta)*radius,
                y = this.y + Math.sin(theta)*radius;

        return new Point(x, y);
    }
}

export default Point;


