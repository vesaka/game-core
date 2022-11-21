import Shape from './shape';
import Point from './point';
import Circle from './circle'
import Line from './line';
import Curve from './curve';


class Rectangle extends Shape {
    constructor(start, width, height) {
        super();
        if (!start instanceof Point) {
            start = new Point(start.x || 0, start.y || 0);
        }
        this.a = this.start = start;
        this.b = new Point(start.x + width, start.y);
        this.c = new Point(start.x, start.y + height);
        this.d = new Point(start.x + width, start.y + height);
        this.edges = [
            new Line(this.a, this.b),
            new Line(this.b, this.d),
            new Line(this.d, this.c),
            new Line(this.c, this.a)
        ];
        this.width = width;
        this.height = height;
        this.type = 4;
        return this;
                
    }
    
    /**
     * 
     * @param Point point
     * @returns boolean
     */
    hasPoint(point) {
        return point.inRectangle(this);
    }
    
    /**
     * 
     * @returns integer
     */
     maxDistance() {
        return this.a.distance(this.c);
    }
    
    hasCircle(circle) {
        return circle.crossesRectangle(this);
    }
    
    touches(point) {
        for (let i in this.edges) {
            if (point.onLine(this.edges[i])) {
                return true;
            }
        }
        
        return false;
    }
    
    areaSize() {
        return this.width * this.height;
    }
    
    diagonal() {
        return this.a.distance(this.c);
    }
    
    colidesRectangle(rect) {
        
    }
}

export default Rectangle;


