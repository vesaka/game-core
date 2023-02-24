import Container from '$core/container';
import { Texture, Spritesheet, Graphics } from 'pixi.js';
import { extend } from '$core/utils/object';
import { fixed } from '$core/utils/math';

class FramesPack extends Container {
    constructor(options) {
        super(options);
        this.frames = {};
    }
    
    each(fn) {
        for (let key in this.frames) {
            fn(this.frames[key], key);
        }
        
        return this;
    }
    
    map(fn) {
        const list = {};
        for (let key in this.frames) {
            list[key] = fn(this.frames[key], key);
        }
        return list;
    }
    
    first(fn) {
        for (let key in this.frames) {
            const condition = fn(this.frames[key], key);
            if (true === condition) {
                return this.frames[key];
            }
        }
        
        return this.frames[0];
    }
    
}

export default FramesPack;