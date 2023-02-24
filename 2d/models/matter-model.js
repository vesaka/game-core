import Container from '$core/container';

import { Graphics, Point } from 'pixi.js';
import { Body, Bodies, Vector } from 'matter-js';
import { parse } from 'js-svg-path';
const HALF_PI = Math.PI / 2;

const ARRAY_ATTRIBUTES = ['axes', 'vertices', 'parts', ];

class Model extends Container {

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

        if (!this.position) {
            this.position = new Point(0, 0);
        }

        this.model = this.createModel();
        this.body = this.createBody();
        //Body.setCentre(this.body, true);
        this.$name = this.body.label = this.constructor.name.toLowerCase();
        return this;
    }

    set(name, value) {
        this[name] = value;
        this.model[name] = value;
        this.body[name] = value;
        return this;
    }

    createModel() {
        return new Graphics();
    }

    createBody() {
        return Bodies.rectangle();
    }

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

    setPosition(x = 0, y = 0) {
        Body.setPosition(this.body, {x, y});
        this.model.position.set(x, y);
        return this;
    }

    setX(value) {
        Body.setPosition(this.body, { x: value, y: this.body.position.y });
        this.model.position.x = this.body.position.x;
        return this;
    }

    setY(value) {
        Body.setPosition(this.body, { x: this.body.position.x, y: value });
        this.model.position.y = this.body.position.y;
        return this;
    }

    increaseX(value) {
        Body.setPosition(this.body, { x: this.body.position.x + value, y: this.body.position.y });
        this.model.position.x += this.body.position.x;
        return this;
    }

    increaseY(value) {
        Body.setPosition(this.body, { x: this.body.position.x, y: this.body.position.y + value });
        this.model.position.y = this.body.position.y;
        return this;
    }

    rotate(angle) {
        Body.setAngle(this.body, angle);
        this.model.rotation = angle;
        return this;
    }

    update() {
        this.model.rotation = this.body.angle;
        this.updatePosition();
        return this;
    }

    updatePosition() {
        this.model.position.x = this.body.position.x;
        this.model.position.y = this.body.position.y;

        return this;
    }

    updateRotation() {
        this.model.angle = this.body.angle;
        return this;
    }

    build() {

    }

    clone() {
        return this.model.clone();
    }

    filterObject(obj = {}) {
        const val = Object.assign({}, obj);
        if (typeof val === 'object') {
            for (let key in val) {
                if (Array.isArray(val[key]) && val[key].length === 2) {
                    val[key] = Math.between(val[key][0], val[key][1]);
                }
            }
        }

        return val;
    }

    filter_matter(body = {}) {
        const matter = Object.assign({}, body);
        if (typeof matter === 'object') {
            for (let key in matter) {
                if (ARRAY_ATTRIBUTES.indexOf(key) > -1) {
                    continue;
                }

                if (Array.isArray(matter[key]) && matter[key].length === 2) {
                    matter[key] = Math.between(matter[key][0], matter[key][1]);
                }
            }
        }

        return matter;
    }

    filter_style(style) {
        return this.filterObject(style);
    }

}

export default Model;