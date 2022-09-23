const props = {
    object: null,
    screen: {},
    duration: 300,
    step: 0.1,
    start: {
        x: 0,
        y: 0
    },
    end: {
        x: 0,
        y: 0
    },
}

class Transition {
    constructor(options) {
        Object.assign(this, props, options);
        
//        let filterMethod;
//        for (let attribute in options) {
//            filterMethod = `filter_${attribute}`;
//            if (typeof this[filterMethod] === 'function') {
//                this[attribute] = this[filterMethod](options[attribute]);
//            }
//        }
        
        return this;
    }
    
    run(callback) {
        const {duration, animate, step} = this;
        const ticker = new Ticker;
        const start = new Date().getTime();
        const end = start + duration;
        
        ticker.add(delta => {
             const now = new Date().getTime();
             const atEnd = now > end;
             callback.call(this, {ticker, delta, now, atEnd, step: (end - now) / duration});
             if (atEnd) {
                 ticker.stop();
                 
             }
             
             
             
        });
        
        ticker.start();
    }
    
    
    in() {
        this.run(({delta, ticker}) => {
            this.object.position.y = -screen.height;
        });
    }
    
    out() {
        this.run(({delta, ticker}) => {
            this.object.position.y = 0;
        });
    }
    
}

export default Transition;