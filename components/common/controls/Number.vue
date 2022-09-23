<template>
    <div :class="classList('root')">
        <button :class="leftClass" @click="selectPrevious">
            <slot name="left">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-full w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 12H6" />
                </svg>
            </slot>
        </button>
        <div :class="classes.label">
            <input type="hidden" v-model="value">
            <input type="text" :class="classes.input" @keypress="isNumber" v-model="value">
        </div>
        <button :class="rightClass" @click="selectNext">
            <span name="right">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-full w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            </span> 
        </button>
    </div>
</template>
<script>
    import ClassMixin from '../mixins/class-mixin';
    export default {
        data() {
            return {
                value: 0
            };
        },
        props: {
            readonly: {
                type: Boolean,
                default: false
            },
            swap: {
                type: Boolean,
                default: true
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
                default: 1,
                validator(num) {
                    return num !== 0;
                }
            },
            min: {
                type: Number,
                default: 0
            },
            max: {
                type: Number,
                default: 100
            },
            className: {
                type: Object,
                default() {
                        return {
                            root: {
                                   'flex flex-row relative': true
                           },
                           spinner: {
                                'flex': true,
                                'font-semibold': true,
                                'cursor-pointer focus:outline-none focus:shadow-outline': true,
                                'inline-block p-2': true,
                                'border-2': true
                            }
                        };
                }
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
                            'cursor-pointer focus:outline-none focus:shadow-outline': true,
                            'inline-block p-2': true,
                            'border-2': true
                        },
                        label: {
                            'inline-block text-center flex-grow': true
                        },
                        input: {
                            'w-full inline-block text-center flex-grow p-2': true,
                            'bg-white border-t-2 border-b-2 border-blue-600 focus:outline-none focus:shadow-outline': true
                        },
                        left: {
                            'rounded-l-lg border-r-0 bg-red-300 border-red-600 text-red-900': true
                        },
                        right: {
                            'rounded-r-lg border-l-0 bg-indigo-300 border-indigo-600 text-indigo-900': true
                        }
                    };
                }
            }
        },
        mixins: [ClassMixin],
        methods: {
            selectPrevious() {
                let prevValue = parseInt(this.value) - this.step;
                if (this.swap) {
                    this.value = prevValue >= this.min ? prevValue : this.max;
                } else {
                    this.value = prevValue >= this.min ? prevValue : this.min;
                }
            },
            selectNext() {
                let nextValue = parseInt(this.value) + this.step;
                if (this.swap) {
                    this.value = nextValue <= this.max ? nextValue : this.min;
                } else {
                    this.value = nextValue <= this.max ? nextValue : this.max;
                }
            },
            validateInput(evt) {
                if (this.value > this.max || this.value < this.min) {
                    //this.value = oldValue;
                }
            },
            isNumber(evt) {
                
                var charCode = (evt.which) ? evt.which : evt.keyCode, val = parseInt(evt.target.value);
                if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                    evt.preventDefault();
                } else if ((val > this.max)) {
                    evt.preventDefault();
                } else {
                    
                    return true;
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
            leftClass() {
                return Object.assign({}, this.classes.spinner, this.classes.left);
            },
            rightClass() {
                return Object.assign({}, this.classes.spinner, this.classes.right);
            },
            labelClass() {

            },
        },
        watch: {
            value(newValue, oldValue) {
                this.$emit('updated:value', newValue, oldValue);
            }
        },
        mounted() {
            if (!this.value) {
                this.value = this.min;
            }
        }

    }
</script>
