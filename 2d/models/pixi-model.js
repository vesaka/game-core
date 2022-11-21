import Container from '$lib/game/core/container';

import { Graphics, Point } from 'pixi.js';
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
        this.$name = this.constructor.name.toLowerCase();
        return this;
    }
    
    createModel() {
        return new Graphics();
    }

    setPosition(x = 0, y = 0) {
        this.model.position.set(x, y);
        return this;
    }

    setX(value) {
        this.model.position.x = value;
        return this;
    }

    setY(value) {
        this.model.position.y = value;
        return this;
    }

    increaseX(value) {
        this.model.position.x += value;
        return this;
    }

    increaseY(value) {
        this.model.position.y = value;
        return this;
    }

    rotate(angle) {
        this.model.rotation = angle;
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

    filter_style(style) {
        return this.filterObject(style);
    }
    
    hide() {
        this.model.visible = false;
    }
    
    show() {
        this.model.visible = true;
    }
    
    toggle() {
        this.model.visible = !this.model.visible;
    }

}

export default Model;