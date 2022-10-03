const polyBezier = () => {
        let step = 0.1, points = [], x, y, f, l, args = arguments,
                start, end, c, values = [], last, length;

        for (let i = 0; i < args.length; i++) {
            if (args[i].x && args[i].y) {
                points.push(args[i]);
            }
        }
        length = points.length;
        last = length - 1;
        start = points[0];
        end = points[l];
        for (let t = 0; t <= 1; t += step) {
            f = 1 - t;
            x = y = 0;
            for (let n = 0; n < length; n++) {
                c = Math.binom(last, last - n) * Math.pow(f, last - n) * Math.pow(t, n);
                x += c * points[n].x;
                y += c * points[n].y;
            }

            values.push({x, y});
        }
        return values;
    };
    
    const toBezier = (list, complete = false) => {

        const count = list.length;  
        
        let points = [], j = 0, subPoints;
                ;

        for (let i = 0; i < count; i++) {
            subPoints = [];
            j = i + 5;
            for (let index = i; index < j; index++) {
                if (list[index]) {
                    subPoints.push(list[index]);
                }
            }
            

            points = points.concat(subPoints);
            i = j;
        }
        
        if (complete && points[0]) {
            const first = points[0];
            const last = points[points.length - 1];
            
            if ((first.x !== last.x) || (first.y !== last.y)) {
                points.push(first);
            }
        }
        

        return points;
        
    }
export default {};

