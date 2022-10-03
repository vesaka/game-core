import {deepMerge, raw, deepGet, deepSet} from '$lib/game/utils/object';
const FIRST_KEY = 'options';
export default {
    data() {
        return {
            settings: {}
        };
    },
    props: {
        namespace: {
            type: String,
            default: ''
        }
    },
    computed: {
        path() {
            return `${FIRST_KEY}.${this.namespace}`.replace(/\.$/, '');
        },
        storedSettings() {
            const $settings = this.$loadFrom(FIRST_KEY);
            if (!this.namespace.length) {
                return $settings;
            }
            return raw(deepGet($settings, this.namespace));
        }
    },
    methods: {
        save() {
            this.$saveTo(this.path, this.settings);
        }
    },
    watch: {
        settings: {
            deep: true,
            handler(n, o) {
                
            }
            
        }
    },
    beforeUnmount() {
        this.save();
    },
    beforeMount() {
        this.settings = this.storedSettings;
         window.addEventListener('beforeunload', this.save.bind(this));
    },
    mounted() {
    }
}

