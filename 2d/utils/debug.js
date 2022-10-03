import { Graphics } from 'pixi.js';
import { Body } from 'matter-js';
const drawRect = (obj, data = {}) => {
    const g = new Graphics;
    const options = Object.assign({
        fill: '#90ff00',
        color: '#ff9000',
        lineWidth: 1,
        alpha: 0.1,
        lineAlpha: 0.9
    }, data);
    
    g.beginFill(options.fill, options.alpha);
    g.lineStyle(options.lineWidth, options.lineAlpha);
    g.drawRect(obj.body.position.x, obj.body.position.y, obj.body.width, obj.body.height);
    g.endFill();
    
}

export {drawRect};
