import { parse } from 'js-svg-path';

export default {
    createVerticesFromSvgPath(path) {
        const {curveshapes} = parse(path);
        const vertices = [];

        for (let i in curveshapes) {
            for (let j in curveshapes[i].points) {
                vertices.push(
                        Vector.create(
                                curveshapes[i].points[j].main.x,
                                curveshapes[i].points[j].main.y
                                )
                        );
            }
        }

        return vertices;

    }
};

