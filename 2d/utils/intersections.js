const lineToLine = (x1, y1, x2, y2, x3, y3, x4, y4) => {
    let ua, ub, denom = (y4 - y3)*(x2 - x1) - (x4 - x3)*(y2 - y1);
    if (denom === 0) {
        return null;
    }
    ua = ((x4 - x3)*(y1 - y3) - (y4 - y3)*(x1 - x3))/denom;
    ub = ((x2 - x1)*(y1 - y3) - (y2 - y1)*(x1 - x3))/denom;
    return {
        x: x1 + ua * (x2 - x1),
        y: y1 + ua * (y2 - y1),
        seg1: ua >= 0 && ua <= 1,
        seg2: ub >= 0 && ub <= 1
    };
};

const lineToRect = (line, rect) => {
    const intersections = [];
    
    intersections.concat(lineToLine(line, {ax: rect.ax, bx: rect.ax, ay: rect.ay, by: rect.by}));
    intersections.concat(lineToLine(line, {ax: rect.bx, bx: rect.bx, ay: rect.cy, by: rect.cy}));
    intersections.concat(lineToLine(line, {ax: rect.cx, bx: rect.cx, ay: rect.dy, by: rect.dy}));
    intersections.concat(lineToLine(line, {ax: rect.dx, bx: rect.dx, ay: rect.ay, by: rect.by}));
    
    intesections = intesections.filter(point => {
        return point.seg1 && point.seg2;
    });

    
    return intersections;
};

const curveToLine = (points, line, firstOnly = false) => {
    const intersections = [];
    const len = points.length - 1;
    for (let i = 0; i < len; i++) {
        const result = lineToLine(
                points[i].x, points[i].y,
                points[i + 1].x, points[i + 1].y,
                line.ax, line.ay,
                line.bx, line.by
        );
        
        if (result && result.seg1 && result.seg2) {
            if (firstOnly) {
                return result;
            }
            intersections.push(result);
            
        }
    }
    
    return intersections;
};

const curveToRectangle = (points, rect, firstOnly = true) => {
    const intersections = [];
    
    intersections.concat(curveToLine(points, {ax: rect.ax, bx: rect.ax, ay: rect.ay, by: rect.by}));
    intersections.concat(curveToLine(points, {ax: rect.bx, bx: rect.bx, ay: rect.cy, by: rect.cy}));
    intersections.concat(curveToLine(points, {ax: rect.cx, bx: rect.cx, ay: rect.dy, by: rect.dy}));
    intersections.concat(curveToLine(points, {ax: rect.dx, bx: rect.dx, ay: rect.ay, by: rect.by}));
    
    intesections = intesections.filter(point => {
        return point.seg1 && point.seg2;
    });
    if (firstOnly) {
        return intersections[0]
    }
    
    return intersections;
};

const pointInRectangle = (point, rect) => {
    return (rect.ax <= point.x) && (point.x <= (rect.ax + rect.width))
        && (rect.ay <= point.y) && (point.y < (rect.ay + rect.height));
};

const rectOverlapsRect = (a, b) => {
	// no horizontal overlap
	if (a.x1 >= b.x2 || b.x1 >= a.x2) return false;

	// no vertical overlap
	if (a.y1 >= b.y2 || b.y1 >= a.y2) return false;

	return true;
}

export {curveToLine, curveToRectangle, lineToLine, pointInRectangle, lineToRect, rectOverlapsRect};



export default {};


