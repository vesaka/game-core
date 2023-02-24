import Container from '$lib/game/core/container';
import { Text, BitmapText, Graphics } from 'pixi.js';
import { extend, deepGet, isObject } from '$core/utils/object';
import { fixed } from '$core/utils/math';
import { hex2dec } from '$core/utils/colors';
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
        return extend(this.setup.style, style);
    }
    
    filter_style(style) {
        const styles = extend(defaultStyle, style);
        const colorKeys = ['fill', 'color', 'background'];
        for (let key in styles) {
            
            if (colorKeys.includes(key) && typeof styles[key] === 'string') {
                styles[key] = hex2dec(styles[key]);
            }
            
            if (key === 'line' && isObject(styles[key])) {
                for (let lineKey in styles[key]) {
                    if (colorKeys.includes(key) && typeof styles[key][lineKey] === 'string') {
                        styles[key][lineKey] = hex2dec(styles[key][lineKey]);
                    }
                }
            }
        }
        return styles;
    }
    
    filter_size(size) {
        const { width, height } = this.app.screen;
        if (size.width >= 0 && size.width <= 1) {
            size.width *= width;
        }
        
        if (size.height >= 0 && size.height <= 1) {
            size.height *= height;
        }
        
        return size;
    }
    
    filter_position(position) {
        const { width, height } = this.app.screen;
        if (position.x >= -1 && position.x <= 1) {
            position.x *= width;
        }
        
        if (position.y >= -1 && position.y <= 1) {
            position.y *= height;
        }
        
        return position;
    }
    
    createText(text, style = {}) {
        return new Text(text, extend(this.style, style));
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




