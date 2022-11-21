import Container from '$lib/game/core/container';
import { Text, BitmapText, Graphics } from 'pixi.js';
import { extend, deepGet } from '$core/utils/object';
import { fixed } from '$core/utils/math';
class UI extends Container {
        
    constructor(options) {
        super(options);
        this.setup = options;
        Object.assign(this, options);
        let filterMethod;
        for (let attribute in options) {
            filterMethod = `filter_${attribute}`;
            if (typeof this[filterMethod] === 'function') {
                this[attribute] = this[filterMethod](options[attribute]);
            }
        }
        this.$name = this.constructor.name.toLowerCase();
        return this;
    }
    
    styles(style = {}) {
        return Object.assign({}, this.setup.style, style);
    }
    
    filter_style(style) {
        return extend(defaultStyle, style);
    }
    
    createText(text, style = {}) {
        return new Text(text, Object.assign({}, this.style, style));
    }
    
    createBitmapText(text, style = {}) {
        return new BitmapText(text, Object.assign({}, this.style, style));
    }
    
    normalize_values(options) {
        const { width, height } = this.app.screen;
        for (let key in options) {
            if (typeof options[key] === 'number' && (options[key] >= 0 && options[key] <= 1)) {
                if (['y', 'height'].includes(key)) {
                    options[key] *= height;
                } else {
                    options[key] *= width;
                }
            }
        }
        return options;
    }
    
    translate(key, def = null) {
        return deepGet(this.locale, key, def);
    }
    
    normalizePlacement() {
        const { width, height } = this.app.screen;
        const props = ['x', 'width', 'y', 'height']
        for (let i in props) {
            const key = props[i];
            if (typeof this[key] === 'number' && (this[key] >= 0 && this[key] <= 1)) {
                if (['y', 'height'].includes(key)) {
                    this[key] = fixed(this[key] * height, 2);
                } else {
                    this[key] = fixed(this[key] * width, 2);
                }
            }
        }
    }
    
    static setDefaultStyle(style = {}) {
        UI.prototype.defaultStyle = style;
    }
}

const defaultStyle = {};
export const useDefaultStyle = style => {
    Object.assign(defaultStyle, style);
};

UI.prototype.defaultStyle = {};

export default UI;




