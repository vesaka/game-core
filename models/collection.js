import Container from '$lib/game/core/container';
class Collection extends Container {
    constructor(options) {

        super(options);

        Object.assign(this, options);

        let filterMethod;
        for (let attribute in options) {
            filterMethod = `filter_${attribute}`;
            if (typeof this[filterMethod] === 'function') {
                this[attribute] = this[filterMethod](options[attribute]);
            }
        }
        this.items = options.items || [];
        return this;
    }

    all() {
        return this.items;
    }

    count(condition = null) {
        if (typeof condition === 'function') {
            return this.filter(condition).count();
        }

        return this.items.length;
    }

    avarage(key) {
        this.items.avarage(key);
    }

    avg(key) {
        this.items.avarage(key);
    }

    add(item) {
        this.items.push(item);
        return this;
    }

    get(key = 0) {
        return this.items[key];
    }

    remove(at) {
        this.items.splice(at, 1);
        return this;
    }
    
    find(condition) {
        return this.first(condition);
    }

    first(condition) {
        for (let i in this.items) {
            const stop = condition(this.items[i], i);
            if (true === stop) {
                return this.items[i];
            }
        }
        return null;
    }

    map(callback) {
        const result = [];
        for (let i in this.items) {
            result.push(callback(this.items[i], i));
        }
        return result;
    }

    each(callback) {
        for (let i in this.items) {
            const stop = callback(this.items[i], i);
            if (true === stop) {
                break;
            }
        }
        return this;
    }

    reduce(callback, start) {
        let accumulator = start;
        const len = this.count();
        for (let i = 0; i < len; i++) {
            if (accumulator) {
                accumulator = callback(accumulator, this.items[i], i);
            } else {
                accumulator = this.items[i];
            }
        }

        return accumulator;
    }

    filter(condition = null) {
        if (typeof condition !== 'function') {
            condition = (item) => {
                return undefined !== item;
            };
        }

        return new Collection({items: this.items.filter(condition)});
    }

    merge() {
        for (let i in arguments) {
            if (Array.isArray(arguments[i])) {
                this.items.concat(arguments[i]);
            }
        }

        return this;
    }
    
    min(property = null) {
        if (0 === this.items.length) {
            return null;
        }
        
        let min, callback;
        
        if (['string', 'number'].includes(typeof property)) {
            min = this.items[0][property];
            callback = item => {
                if (min > item[property]) {
                    min = item[property];
                }
            };
        } else if (typeof property === 'function') {
            min = property(this.items[0]);
            callback = property;
        } else {
            min = this.items[0];
            callback = item => {
                if (min > item) {
                    min = item;
                }
            };
        }
        
        this.each(callback);
        
        return min;
    }
    
    max(property = null) {
        if (0 === this.items.length) {
            return null;
        }
        
        let max, callback;
        
        if (['string', 'number'].includes(typeof property)) {
            max = this.items[0][property];
            callback = item => {
                if (max < item[property]) {
                    max = item[property];
                }
            };
        } else if (typeof property === 'function') {
            max = property(this.items[0]);
            callback = property;
        } else {
            max = this.items[0];
            callback = item => {
                if (max < item) {
                    max = item;
                }
            };
        }
        
        this.each(callback);
        
        return max;
    }
    
    unique(property = null) {
        let items = [];
        if (typeof property === 'function') {
            items = this.items.map(property);
        } else if (['string', 'number'].includes(typeof property)) {
            items = this.items.map(item => item[property]);
        } else {
            items = this.items;
        }
        
        return items.filter((value, index, self) => {
            return self.indexOf(value) === index;
        });
    }

    sum(arg) {
        let sum = 0;
        if ((typeof arg === 'string') || (typeof arg === 'number')) {
            this.each(item => {
                if (item[arg]) {
                    sum += Number(item[arg]);
                }
            });

        } else if (typeof arg === 'function') {
            this.each((item, key) => {
                sum += Number(arg(item, key));
            });
        }

        return sum;
    }

    random() {
        return this.items[Math.floor(Math.random() * this.count())]
    }

    shuffle() {
        let currentIndex = this.items.length, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [this.items[currentIndex], this.items[randomIndex]] = [
                this.items[randomIndex], this.items[currentIndex]];
        }

        return this;
    }

    slice(start = 0, end = 0) {
        return new Collection(this.items.slice(start, end))
    }
}
;

export default Collection;

