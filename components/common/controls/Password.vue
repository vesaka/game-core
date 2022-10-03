<template>

    <div :class="classList('root')">
        <slot name="label" v-if="hasLabelSlot">

        </slot>
        <input :type="type" :placeholder="placeholder" v-model="pass" :class="classList('input')" />
        <span :class="classList('toggle')" v-if="hasVisibility" @click="changeVisibility">
            <slot name="visible" v-if="visible">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            </slot>
            <slot name="hidden" v-if="!visible">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
            </slot>
        </span>

    </div>
</template>
<script>
    import ClassMixin from '../mixins/class-mixin';
    export default {
        data() {
            return {
                pass: this.value,
                visible: false,
                type: 'password'
            };
        },
        props: {
            value: {
                type: String,
                default: ''
            },
            alwaysVisible: {
                type: Boolean,
                default: false
            },
            hasVisibility: {
                type: Boolean,
                default: false
            },
            placeholder: {
                type: String,
                default: ''
            },
            classNames: {
                type: Object,
                default() {
                    return {
                        root: {
                            'relative flex w-full flex-wrap items-stretch mb-3': true
                        },
                        input: {
                            'px-3 py-3 placeholder-gray-400 text-gray-700': true,
                            'relative bg-white bg-white rounded text-sm': true,
                            'shadow outline-none focus:outline-none focus:shadow-outline': true,
                            'w-full pl-10': true
                        },
                        toggle: {
                            'z-10 h-full leading-snug font-normal absolute text-center text-gray-400': true,
                            'absolute bg-transparent rounded text-lg cursor-pointer': true,
                            'items-center justify-center w-8 right-0 pr-3 py-4': true
                        }
                    };
                }

            },
            classes: {
                type: Object,
                default() {
                    return {
                        root: {},
                        input: {},
                        toggle: {}
                    };
                }
            }
        },
        methods: {
            changeVisibility() {
                this.visible = !this.visible;
            }
        },
        computed: {
            hasLabelSlot() {
                return !!this.$slots.label;
            },
            hasToggleSlot() {
                return !!this.$slots.toggle;
            }
        },
        watch: {
            visible(val) {
                this.type = true === val ? 'text' : 'password';
            },
            pass(n, o) {
                this.$emit('input:pass', n, o);
            }
        },
        mixins: [ClassMixin],
    }
</script>
