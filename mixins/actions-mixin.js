export default {
    actions: [],
    does() {
        const actions = this.actions;
        const args = Array.isArray(arguments[0]) ? arguments[0] : arguments;
        for (let i = 0; i< args.length; i++) {
            const action = args[i];
            if ((typeof action === 'string') && (actions.indexOf(action) > -1)) {
                return true;
            }
        }
        return false;
    },
    
    doesnt(...args) {
        return false === this.does(args);
    },
    
    starts() {
        const actions = this.actions;
        const args = Array.isArray(arguments[0]) ? arguments[0] : arguments;
        for (let i in args) {
            if ((typeof args[i] === 'string') && (actions.indexOf(args[i]) === -1)) {
                actions.push(args[i]);
            }
        };
    },
    
    stops() {
        const actions = this.actions;
        const args = Array.isArray(arguments[0]) ? arguments[0] : arguments;
        
        
        for (let i in args) {
            if (typeof args[i] === 'string') {
                const index = actions.indexOf(args[i]);
                if (index > -1) {
                    actions.splice(index, 1);
                }
            }
        };
    }
}