import Container from '$lib/game/core/container';
import { Texture, Spritesheet, Graphics } from 'pixi.js';
import { extend } from '$core/utils/object';

class SpritesheetPack extends Container {
    constructor(options) {
        super(options);
        this.sheets = {};
        this.frames = {};
    }
    
    each(fn) {
        for (let key in sheets) {
            fn(sheets[key], key);
        }
        
        return this;
    }
    
    map(fn) {
        const list = {};
        for (let key in sheets) {
            list[key] = fn(sheets[key], key);
        }
        return list;
    }
    
    first(fn) {
        for (let key in sheets) {
            const condition = fn(sheets[key], key);
            if (condition) {
                return sheets[key];
            }
        }
        
        return this;
    }
}

export default SpritesheetPack;