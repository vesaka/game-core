<template>
    <div :class="classes.root">
        <button :class="leftClass" @click="selectPrevious">
            <slot name="left">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 12H6" />
                </svg>
            </slot>
        </button>
        <div :class="classes.label">
            <input type="hidden" v-model="val">
                <slot name="selected" :item="selected" :index="val">
                    <span v-html="selected"></span>
                </slot>
        </div>
        <button :class="rightClass" @click="selectNext">
            <span name="right">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            </span> 
        </button>
    </div>
</template>
<script>
    import ClassMixin from '$m/media/game/components/mixins/class-mixin';
    export default {
        data() {
            return {
                val: this.value,
            };
        },
        props: {
            value: {
                type: [String, Number],
                default: 0
            },
            readonly: {
                type: Boolean,
                default: false
            },
            display: {
                type: [Function, Boolean],
                default: false
            },
            options: {
                type: [Object, Array],
                default() {
                    let options = [];
                    for (let i = 0; i < 10; i++) {
                        options.push(i);
                    }
                    return options;
                }
            },
            start: {
                type: Number,
                default: 0
            },
            step: {
                type: Number,
                default: 0
            },
            min: {
                type: Number,
                default: 0
            },
            max: {
                type: Number,
                default: 0
            },
            classes: {
                type: Object,
                default() {
                    return {
                        root: {
                            'flex flex-row relative': true
                        },
                        spinner: {
                            'flex': true,
                            'font-semibold': true,
                            'cursor-pointer': true,
                            'inline-block p-2': true,
                            'h-12 w-12': true
                        },
                        label: {
                            'inline-block text-center flex-grow p-2': true
                        },
                        input: {
                            'w-full inline-block text-center flex-grow p-2': true,
                            'bg-white border border-gray-300 rounded-md focus:outline-none focus:shadow-outline': true
                        },
                        left: {
                            'inline-block': true
                        },
                        right: {

                        }
                    };
                }
            }
        },
        mixins: [ClassMixin],
        methods: {
            selectPrevious() {
                let prevValue = this.index - 1;
                this.val = this.keys[prevValue >= 0 ? prevValue : this.end];
            },
            selectNext() {
                let nextValue = this.index + 1;
                this.val = this.keys[nextValue <= this.end ? nextValue : this.start];

            },
            validateValue(ev) {
                const target = ev.target, val = parseInt(ev.target.value);
                if (val < this.start) {
                    ev.target.value = this.start;
                } else if (val > this.end) {
                    ev.target.value = this.end;
                }
            }
        },
        computed: {
            keys() {
                if (Array.isArray(this.options)) {
                    return this.options;
                }

                if (typeof this.options === 'object') {
                    return Object.keys(this.options);
                }

                return [];
            },
            end() {
                return this.keys.length - 1;
            },
            selected() {
                return this.options[this.keys[this.index]];
            },
            leftClass() {
                return Object.assign({}, this.classes.spinner, this.classes.left);
            },
            rightClass() {
                return Object.assign({}, this.classes.spinner, this.classes.right);
            },
            labelClass() {

            },
            editable() {
                return typeof this.display === 'function';
            },
            index() {
                return this.keys.indexOf(this.val);
            }
        },
        watch: {
            val(newValue, oldValue) {
                this.$emit('input', newValue, oldValue);
            }
        },
        mounted() {
        }

    }
</script>
