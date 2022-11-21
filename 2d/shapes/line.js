import Shape from './shape';
import Point from './point';
import Curve from './curve';

class Line extends Shape {
    constructor(a, b, tolerance) {
        super(options);
        this.a = a;
        this.b = b;
        this.tolerance = tolerance;
        this.type = 2;
        return this;   
    }
    
    
    slope() {
        return this.a.slope(this.b);
    }

    xInt() {
        return this.a.xInt(this.b);
    }

    yInt() {
        return this.a.yInt(this.b);
    }

    distance() {
        return this.a.distance(this.b);
    }
    
    hasPoint(point, tolerance) {
        return point.onLine(this, tolerance);
    }
}

export default Line;


