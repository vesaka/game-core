import Container from '$lib/game/core/container';
import { Text, BitmapText, Graphics } from 'pixi.js';
import { extend } from '$lib/game/core/utils/object';

class UI extends Container {
        
    constructor(options) {
        super(options);
        this.setup = options;
        Object.assign(this, options);
//        if (this.options.ui) {
//            this.style = Object.assign({}, this.options.ui.style || {}, options.style = {});
//        }

        let filterMethod;
        for (let attribute in options) {
            filterMethod = `filter_${attribute}`;
            if (typeof this[filterMethod] === 'function') {
                this[attribute] = this[filterMethod](options[attribute]);
            }
        }
        
        return this;
    }
    
    styles(style = {}) {
        return Object.assign({}, this.setup.style, style);
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
    
    static setDefaultStyle(style = {}) {
        UI.prototype.defaultStyle = style;
    }
}

UI.prototype.defaultStyle = {};

export default UI;




