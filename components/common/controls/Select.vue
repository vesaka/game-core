<template>
    <div v-class:root v-click-outside="clickedOutside">
        <slot name="label"></slot>
        <input
            :value="value"
            @input="handleInput"
            :placeholder="placeholder"
            ref="input"
            tabindex="0"
            :class="inputClass"
            v-if="search"
            />
        <div :class="inputClass" ref="input" v-if="!search" @click="openDropdown">
            <slot name="selected" :item="selectedItem">
                <div v-html="selectedItemLabel"></div>
            </slot>
        </div>
        <span v-if="withClearButton && (selected !== '')"
              @click.prevent="reset()"
              :class="classList('clear')">
            <slot name="close">
                <svg xmlns="http://www.w3.org/2000/svg" :class="classList('close')" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
            </slot>
        </span>
        <div v-show="showOptions"
             @focusout="showOptions = false"
             tabindex="0"
             v-popup
             :class="dropdownClass"
             >
            <ul class="py-1">
                <li v-for="(item, index) in listOptions"
                    :key="index"
                    @click="handleClick(item)"
                    class="px-3 py-2 cursor-pointer hover:bg-gray-200"
                    >
                    <slot name="option" :item="item" :index="index">
                        <span v-html="getOption(item)"></span>
                    </slot>

                </li>
                <li v-if="!listOptions.length" class="px-3 py-2 text-center">
                    <slot name="noResult">No Results</slot>
                </li>
            </ul>
        </div>
        <div v-if="showIndicator" :class="showIndicatorClassName" @click="openDropdown">
            <slot>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-full p-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            </slot>
        </div>
    </div>
</template>

<script>
    import ClassMixin from '$m/media/game/components/mixins/class-mixin';
    export default {
        props: {
            label: {
                type: String,
                default: 'label'
            },
            name: {
                type: String,
                default: 'value'
            },
            search: {
                type: Boolean,
                default: true
            },
            taggable: {
                type: Boolean,
                default: false
            },
            multiple: {
                type: Boolean,
                default: false
            },
            withDefault: {
                type: Boolean,
                default: true
            },
            placeholder: {
                type: String,
                required: false,
                default: "--Please select--",
            },
            options: {
                type: Array,
                default() {
                    return [];
                }
            },
            rootClass: {
                type: String,
                required: false,
                default: "w-full flex relative border border-gray-300 rounded-md items-center",
            },
            inputClass: {
                type: String,
                required: false,
                default: "flex-grow bg-white border border-gray-300 py-2 px-3 rounded-md focus:outline-none focus:shadow-outline",
            },
            dropdownClass: {
                type: String,
                required: false,
                default: "absolute w-full top-10 z-50 bg-white border border-gray-300 mt-1 mh-5 max-h-40 overflow-hidden overflow-y-scroll rounded-md shadow-md",
            },
            classNames: {
                type: Object,
                default() {
                    return {
                        close: {
                            'w-8 h-full p-2': true
                        },
                        clear: {
                            'absolute top-0 h-full flex items-center cursor-pointer': true,
                            'right-0': this.withClearButton,
                            'right-5': !this.withClearButton
                        },
                        label: {
                            'absolute inset-y-0 right-0 flex items-center px-4': true,
                            ' font-bold text-white bg-indigo-600 rounded-r-lg hover:bg-indigo-500 focus:bg-indigo-700': true,
                            'sr-only': true,
                            'right-0': true
                        }
                    };
                }
            },
            withClearButton: {
                type: Boolean,
                default: true
            },
            showIndicator: {
                type: Boolean,
                default: true
            },
            reduce: {
                type: [Function, Object],
                default: null,
            }
        },

        data() {
            return {
                value: '',
                showOptions: false,
                selected: "",
                searchTerm: "",
            };
        },
        mixins: [ClassMixin],
        computed: {
            selectedItemLabel() {
                return this.selectedItem[this.label] || this.selectedItem;
            },
            selectedItem() {
                for (let i = 0; i < this.options.length; i++) {
                    if (this.options[i][this.name] === this.selected) {
                        return this.options[i][this.label];
                    } else if (this.options[i] === this.selected) {
                        return this.options[i];
                    }
                }
                return this.placeholder;
            },
            selectedValue() {
                for (let i = 0; i < this.options.length; i++) {
                    if (this.options[i][this.name] === this.selected) {
                        return this.options[i][this.name];
                    } else if (this.options[i] === this.selected) {
                        return this.options[i];
                    }
                }
                return '';
            },
            listOptions() {
                if (!this.search) {
                    if (this.withDefault) {
                        const defaultOption = {};
                        defaultOption[this.label] = this.placeholder;
                        defaultOption[this.name] = '';
                        this.options.unshift(defaultOption);
                    }

                    return this.options;
                }

                return this.searchResults();
            },
            closeClassName() {
                return '';
            },
            showIndicatorClassName() {
                return {
                    'absolute h-full top-0 right-0 transform': true,
                    'rotate-180': this.showOptions
                };
            },
            rotateable() {

            }
        },
        directives: {
            popup: {
                updated(el, binding, vnode) {
                    const ref = vnode.context.$refs.input;
                    el.style.marginTop = ref.offsetHeight + 'px';
                }
            },
            'click-outside': {
                bind(el, binding, vnode) {
                    el.clickOutsideEvent = function (event) {
                        if (!(el == event.target || el.contains(event.target))) {
                            vnode.context[binding.expression](event);
                        }
                    };
                    document.body.addEventListener('click', el.clickOutsideEvent)
                },
                unbind(el) {
                    document.body.removeEventListener('click', el.clickOutsideEvent);
                },

                stopProp(event) {
                    event.stopPropagation()
                }
            }
        },
        watch: {
            searchTerm(val) {
                this.showOptions = val.length > 0;
            }
        },
        methods: {
            reset() {
                this.$emit("input", "");
                this.selected = "";
            },

            handleInput(evt) {
                this.$emit("input", evt.target.value);
                this.searchTerm = evt.target.value;
                this.showOptions = true;
            },

            handleClick(item) {
                const selected = this.selectedValue;
                this.$emit("input", this.getValue(item), selected);
                this.$emit("chosen", item, this.selected);
                this.selected = this.getValue(item);
                this.showOptions = false;
                if (this.search) {
                    this.$refs.input.focus();
                }
            },

            clickedOutside() {
                this.showOptions = false;

                if (!this.selected) {
                    this.$emit("input", "");
                }
            },
            openDropdown() {
                this.showOptions = !this.showOptions;
            },
            getValue(item) {

                if (typeof this.reduce === 'function') {
                    return this.reduce(item);
                }

                if (typeof item === 'object') {
                    return item;
                }

                return item;
            },
            getOption(item) {
                if (typeof item === 'object') {
                    return item[this.label];
                }
                
                return item;
            },
            searchResults() {
                return this.options.filter(item => {
                    return this.getOption(item).toLowerCase().includes(this.searchTerm.toLowerCase());
                });
            }
        },
        created() {
            if ('' === this.selected) {
                this.selected = this.options[0][this.name] || this.options[0];
            }
        },
        mounted() {
            
        }
    };
</script>