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

