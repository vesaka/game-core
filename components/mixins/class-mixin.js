export default {
    props: {
        classNames: {
            type: Object,
            default() {
                return {
                    root: {},
                    wrapper: {},
                    header: {},
                    body: {},
                    footer: {}
                };
            }
        },
        css: {
            type: Object,
            default() {
                return {};
            }
        },
        classes: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    directives: {
        class: {

            bind(el, binding, vnode) {
                vnode.context.updateClassList(el, binding, vnode);
            },
            updated(el, binding, vnode) {
                vnode.context.updateClassList(el, binding, vnode);
            },
            componentUpdated(el, binding, vnode) {
                vnode.context.updateClassList(el, binding, vnode);;
            },
            unbind() {

            }
        }
    },
    methods: {
        styles(name) {
            const stylesMethod = `${name}Styles`;
            let styles;
            
            if (this.css[name]) {
                styles = this.css[name];
            } else if (typeof this[stylesMethod] === 'function') {
                styles = this[stylesMethod]();
            } else if (this[stylesMethod]) {
                styles = this[stylesMethod];
            }
            if (['object', 'string'].indexOf(typeof styles) === -1) {
                styles = {};
            }
            
            return styles;
        },
        classList(name) {
            const classsMethod = `${name}Class`;
            let classList;
            if (this.classes[name]) {
                classList = this.classes[name];
            } else if (typeof this[classsMethod] === 'function') {
                classList = this[classsMethod]();
            } else if (this[classsMethod]) {
                classList = this[classsMethod];
            }

            if (['object', 'string'].indexOf(typeof classList) === -1) {
                classList = {};
            }


            if (typeof classList === 'string') {
                let splitClasses = classList.trim().split(/\s+/);
                classList = {};
                for (let i in splitClasses) {
                    classList[splitClasses[i]] = true;
                }
            } else if (typeof classList !== 'object') {
                classList = {};
            }

            return Object.assign(this.classNames[name] || {}, classList);
        },
        updateClassList(el, binding) {
            const name = binding.arg;
            let classList = this.classList(name);

            for (let list in classList) {
                if (true === classList[list]) {
                    el.classList.add(list);
                }
            }
        },
    },
    computed: {

    }
}


