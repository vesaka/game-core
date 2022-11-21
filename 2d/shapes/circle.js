import Shape from './shape';

class Circle extends Shape {
    constructor(c, r, tolerance = 3) {
        super();
        this.c = c;
        this.x = c.x;
        this.y = c.y;
        this.r = this.radius = r;
        this.d = r * 2;
        this.type = 0;
        this.tolerance = tolerance;
        return this;
    }
    
    setOrigin(point) {
        this.c = point;
        this.x = point.x;
        this.y = point.y;
    }
    
    setRadius(r) {
        this.r = this.radius = r;
    }
    
    crossesCircle(circle) {
        let x = this.x - circle.x,
            y = circle.y - this.y,
            radius = this.r + circle.r;
        return (x * x) + (y * y) <= (radius * radius);
    }
    
    hasPoint(point) {
        return point.inCircle(this);
    }
    
    crossesLine(line) {
        return line.crossesCircle(this);
    }

    crossesRectangle(rect) {
        let hw = rect.width / 2,
             hh = rect.height / 2,
            distX = Math.abs(this.c.x - (rect.start.x + rect.width / 2)),
            distY = Math.abs(this.c.y - (rect.start.y + rect.height / 2))

        if (distX > hw + this.r || distY > hh + this.r) {
            return false;
        }

        if (distX <= hw || distY <= hh) {
            return true;
        }

        let x = distX - hw,
            y = distY - hh;
        return x * x + y * y <= this.r * this.r;
    }
    
    maxDistance() {
        return this.d;
    }
    
    touches(point) {
        let rx = this.c.x - point.x,
                ry = this.c.y - point.y;
        
        return this.radius*this.radius === (rx*rx + ry*ry)
    }
    
    area(float = 2) {
        return (Math.PI * this.r * this.r).toFixed(float);
    }
    
    perimeter(float = 2) {
        return (2 * Math.PI * this.r).toFixed(float);
    }
    
    
}
;

export default Circle;

