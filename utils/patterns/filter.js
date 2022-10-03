class Filter {
    static add(tag, callback, priority = 10) {
        if (!this[tag]){
            this[tag] = new Array();
        }
        this[tag][this.getPriority(tag, parseInt(priority))] = callback;
    }
    static remove(tag) {
        this[tag] = new Array();
    }
    static getPriority(tag, priority) {
        if (typeof this[tag][priority] !== 'undefined') {
            return this.getPriority(tag, priority + 1);
        }
        
        return priority;
    }
    static apply() {
        let args = Object.values(arguments),
                tag = args.shift(),
                value = args[0];
        for (let i in this[tag]) {
            if(typeof this[tag][i] === 'function') {
                value = this[tag][i].apply(this, args);
            } else if (typeof this[tag][i] === 'string') {
                value = window[this[tag][i]].apply(this, args);
            }
        }
        
        return value;
    }
};

export default Filter;