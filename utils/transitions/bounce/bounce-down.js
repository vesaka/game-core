import Transition from '../transition';
import {Ticker} from 'pixi.js';
const props = {};
class BounceDown extends Transition {
    constructor(options = {}) {
        super(options);
        this.step = screen.height / this.duration;
        return this;
    }
    
    in() {
        this.run(({ticker, delta, atEnd}) => {
            this.object.position.y += this.step*ticker.elapsedMS;
            if (atEnd) {
                this.object.position.y = 0;
            }
        });
    }
    
    out() {
        this.run(({ticker, delta, atEnd}) => {
            this.object.position.y -= this.step*ticker.elapsedMS;
            if (atEnd) {
                this.object.position.y = -screen.height;
            }
        });
    }
};

export default BounceDown;