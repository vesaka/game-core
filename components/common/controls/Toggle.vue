<template>
    <div :class="rootClass" :data-key="key">
        <slot name="label" v-if="hasLabelSlot"></slot>
        <div :class="wrapperClass" @click="checked = !checked">
            <div :class="toggleClass">
                <slot name="center"></slot>
            </div>
            <slot name="enabled" v-if="checked"></slot>
            <slot name="disabled" v-if="!checked"></slot>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                key: 0,
            };
        },
        emits: ['update'],
        props: {
            checked: {
                type: Boolean,
                default: false
            },
            mode: {
                type: String,
                default: 'toggle'
            },
            __modes__: {
                type: Object,
                default() {
                    return {
                        toggle: {
                            root: {
                                'flex justify-between items-center px-8 py-6': true
                            },
                            label: {},
                            wrapper: {
                                'w-16 h-10 bg-gray-300 rounded-full flex-shrink-0 p-1 cursor-pointer': true,
                                'transform duration-300 ease-in-out': true,
                            },
                            toggle: {
                                'flex bg-white w-8 h-8 rounded-full shadow-md': true,
                                'transform': true,
                                'duration-300 ease-in-out': true,
                            },
                            active_wrapper: {
                                'bg-green-400': true
                            },
                            active_toggle: {
                                'translate-x-6': true
                            },
                        },
                        checkbox: {
                            root: {
                                'flex flex-wrap content-center px-8 py-6': true
                            },
                            label: {},
                            wrapper: {
                                'flex flex-wrap content-center w-8 h-8 bg-white rounded-sm p-1 cursor-pointer': true,
                                'transform duration-300 ease-in-out': true,
                            },
                            toggle: {
                                'flex bg-white w-0 h-0 rounded-sm shadow-md bg-blue-300 mx-auto': true,
                                'transform': true,
                                'duration-300 ease-in-out': true,
                            },
                            active_wrapper: {
                                'bg-grey-400': true
                            },
                            active_toggle: {
                                'w-full h-full': true
                            },
                        },
                        radio: {
                            root: {
                                'flex flex-wrap content-center px-8 py-6': true
                            },
                            label: {},
                            wrapper: {
                                'flex flex-wrap content-center': true,
                                'w-8 h-8 bg-white cursor-pointer': true,
                                'border-2 border-blue-300 border-opacity-70 rounded-full p-1 ': true,
                                'transform duration-300 ease-in-out': true,
                            },
                            toggle: {
                                'flex bg-white w-0 h-0 shadow-md bg-blue-300 rounded-full mx-auto': true,
                                'transform': true,
                                'duration-300 ease-in-out': true,
                            },
                            active_wrapper: {
                                'bg-grey-400 border-opacity-100': true
                            },
                            active_toggle: {
                                'w-full h-full': true
                            },
                        }
                    };
                }
            },
            classes: {
                type: Object,
                default() {
                    return {};
                }
            }
        },
        methods: {
            activeClass(name) {
                let className = Object.assign({}, this.__mode[name], this.classes[name] || {});
                if (this.checked) {
                    Object.assign(className, this.__mode[`active_${name}`]);
                }
                return className;
            },
        },
        computed: {
            rootClass() {
                return Object.assign({}, this.__mode.root, this.classes.root || {});
            },
            labelClass() {
                return Object.assign({}, this.__mode.label, this.classes.label || {});
            },
            wrapperClass() {
                return this.activeClass('wrapper');
            },
            toggleClass() {
                return this.activeClass('toggle');
            },
            __mode() {
                return this.__modes__[this.mode] || this.__modes__['toggle'];
            },
            hasLabelSlot() {
                return !!this.$slots.label;
            }
        },
        watch: {
            checked(newValue, oldValue) {
                this.$emit('update:checked', newValue, oldValue);
            }
        },
        mounted() {
        }
    }
</script>
