import { Graphics, Container } from 'pixi.js';
import UI from './ui';


class Progress extends UI {
    
    constructor(setup) {
        super(setup);
        this.screen = new Container();
        this.app.stage.addChild(this.screen);
        this.progress = 0;
        this.$listen({
            loader: ['start', 'progress', 'error', 'complete']
        });
        return this;
    }
    
    loader_start() {
        
    }
    
    loader_progress() {
        
    }
    
    loader_complete() {
        
    }
    
    loader_error() {
        
    }
}

export default Progress;