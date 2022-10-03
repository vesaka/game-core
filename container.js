import { EventDispatcher } from 'three';
import Action from '$lib/game/core/utils/patterns/action';

class Container {

    constructor(options = {}, toPrototype = false) {
        if (toPrototype) {
            Object.assign(Container.prototype, options);
        } else {
            Object.assign(this, options);
        }
        this.$mixins();
        return this;
    }
    
    $mixins() {
        if (typeof this.mixins === 'object' || Array.isArray(this.mixins)) {
            for (let i in this.mixins) {
                for (let attribute in this.mixins[i]) {
                    if (typeof this[attribute] === 'function' && typeof this.mixins[i][attribute] === 'function') {
                        this.$on(attribute, (...args) => { this.mixins[i][attribute].apply(this, args); });
                    } else {
                        this[attribute] = this.mixins[i][attribute];
                    }
                }
            }
        }
    }
    
    $on(tag, callback, placement = 0) {
        Action.add(tag, callback, placement);
    }

    $emit(...args) {
        Action.run.apply(Action, args);
    }

    $off(tag) {
        Action.remove(tag);
    }
    
    $hasEvent(tag) {
        return Array.isArray(Action[tag]) && Action[tag].length > 0;
    }

    $promise(ev, then = null, reject = null) {
        let event = this.resolveEvent(ev),
                done = this.resolveEvent(then),
                fail = reject || this.$errorHandler,
                promise = new Promise((resolve, reject) => {
                    try {
                        event();
                        resolve();
                    } catch (e) {
                        reject();
                    }
                });

        promise.then(done).catch(fail);
    }
    
    $listen(events) {
        this.__events = [];
        for (let name in events) {
            if (!Array.isArray(events[name])) {
                continue;
            }
            for (let i in events[name]) {
                let method = `${name}_${events[name][i]}`;
                if (typeof this[method] === 'function') {
                    this.$on(method, this[method].bind(this));
                }
                
                this.__events.push(method);
            }
            
        }
        
    }
    
    $clear() {
        Action.clear();
    }

    resolveEvent(event) {
        if (typeof event === 'string') {
            return (ev) => {
                this.$emit(event, ev);
            };
        } else if (typeof event === 'function') {
            return event;
        }

        return (ev) => {
        };
    }
    

    i18n(name, params = {}, current = true) {
        let o = this.locale,
                s = name.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, ''),
                a = s.split('.');

        for (var i = 0, n = a.length; i < n; ++i) {
            var k = a[i];
            if (k in o) {
                o = o[k];
            } else {
                return current ? this.i18n(name, params, false) : '';
            }
        }
        
        return o.sprintf(params);
    }
    
    $set(name, value) {
        Container.prototype[name] = value;
    }
}

export default Container;