
export default {
    is() {
        const actions = this.states;
        const args = Array.isArray(arguments[0]) ? arguments[0] : arguments;
        for (let i = 0; i< args.length; i++) {
            const action = args[i];
            if (typeof action === 'string' && (actions.indexOf(action) > -1)) {
                return true;
            }
        }
        return false;
    },
    
    isNot(...args) {
        return false === this.is(args);
    },
    
    isOnly(state) {
        return 1 === this.states.length && (this.states.indexOf(state) > -1);
    },
    
    addState() {
        const actions = this.states;
        const args = Array.isArray(arguments[0]) ? arguments[0] : arguments;
        for (let i = 0; i < args.length; i++) {
            const action = args[i];
            if (typeof action === 'string' && (actions.indexOf(action) === -1)) {
                actions.push(action);
            }
        }
    },
    
    removeState(...args) {
        const actions = this.states;
        for (let i = 0; i < args.length; i++) {
            const action = args[i];
            if (typeof action === 'string') {
                const index = actions.indexOf(action);
                if (index > -1) {
                    actions.splice(index, 1);
                }
            }
        }
    },
    setState(state) {
        this.states = [];
        this.states.push(state);
    },
    clearStates() {
        this.states = [];
    },
    getOnlyState() {
        if (1 === this.states.length) {
            return this.states[0];
        }
        
        return null;
    },
    getState() {
        if (this.states.length > 0) {
            return this.states[0];
        }
        
        return null;
    },
    
}

