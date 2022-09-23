<template>
    <div ref="container" :class="classList('root')" :key="key">
        <div class="w-full text-center">
            <slot name="displayMin" v-if="showValues">
                <span v-html="values.min"></span>
            </slot>
            <slot name="label">
            </slot>
            <slot name="displayMin" v-if="showValues">
                <span v-html="values.max"></span>
            </slot>
        </div>
        <div class="w-full relative">
            <span ref="left" :class="classList('handle')" data-role="left" :style="leftHandleStyle" @mousedown="hold" @touchstart="hold">
                <slot name="leftHandle">
                    <span ref="control" :class="classList('leftHandle')"></span>
                </slot>
            </span>
            <div class="relative h-16 mx-4 flex-grow overflow-hidden">
                
                <div ref="line" :class="classList('line')"></div>
                <div ref="grid" :class="classList('grid')" v-if="showGrid">
                    <span v-for="(divide, index) in gridNumbers" class="absolute flex flex-col" :style="divide.style">
                        <span :class="divide.classList" ></span>
                        <p class="items-center select-none" style="user-select: none;" v-html="divide.number"></p>
                    </span>
                </div>
            </div>
            <span ref="right" :class="classList('handle')" data-role="right" :style="rightHandleStyle" @mousedown="hold" @touchstart="hold">
                <slot name="rightHandle">
                    <span ref="control" :class="classList('rightHandle')"></span>
                </slot>
            </span>
        </div>

    </div>
</template>
<script>
    import ClassMixin from '../../mixins/class-mixin';

    export default {
        data() {

            return {
                key: 0,
                box: null,
                leftBox: null,
                rightBox: null,
                activeHandle: null,
                dragging: true
            };
        },
        props: {
            values: {
                type: [Object, Array],
                default() {
                    return {
                        min: 0,
                        max: 10
                    };
                }
            },
            value: {
                type: [Object, String],
                default() {
                    return {
                        min: 0,
                        max: 10
                    };
                }
            },
            separator: {
                type: String,
                default: '|'
            },
            
            min: {
                type: Number,
                default: 0
            },
            max: {
                type: Number,
                default: 10
            },
            step: {
                type: Number,
                default: 1
            },
            interval: {
                type: Number,
                default: 1
            },
            showValues: {
                type: Boolean,
                default: true
            },
            showPopup: {
                type: Boolean,
                default: false
            },
            showGrid: {
                type: Boolean,
                default: true
            },
            classes: {
                type: Object,
                default() {
                    return {
                        root: {
                            'relative w-full flex flex-col': true
                        },
                        handle: {
                            'absolute border-2 top-0 rounded-full h-8 w-8 bg-red-500 cursor-pointer shadow-lg': true,
                            'items-center justify-center text-center z-10': true,
                            'transform transition-left duration-100 ease-in-out': true
                        },
                        control: {
                            'absolute border-2 top-0 bg-grey-300 rounded-full h-8 w-8 cursor-pointer': true,
                        },
                        leftHandle: {
                            'left-0': true,
                            'bg-red-300 border-red-600 text-red-600': '' === this.startColor,
                        },
                        rightHandle: {
                            'right-0': true,
                            'bg-blue-300 border-blue-600 text-blue-600': '' === this.startColor,
                        },
                        line: {
                            'w-full flex': true,
                            'rounded-full bg-blue-400 h-2 mt-3 mx-auto px-0': true,
                            'relative inset-0': true,
                        },
                        grid: {
                            'relative': true,
                            'h-8 px-0 z-5': true,
                        },
                        tooltipBox: {
                            'absolute border-none top-0': true,
                        },
                        bigDivide: {
                            'w-1 h-4 select-none': true,
                            'bg-blue-900 z-1': true
                        },
                        smallDivide: {
                            'w-0.5 h-2 select-none': true,
                            'bg-blue-900 z-1': true
                        }
                    };
                }
            },
        },
        mixins: [ClassMixin],
        methods: {
            hold(ev) {
                this.activeHandle = ev.target.closest('[data-role]');
                document.addEventListener('mousemove', this.move, true);
                document.addEventListener('mouseup', this.release, false);
                document.addEventListener('touchmove', this.move, false);
                document.addEventListener('touchend', this.release, false);
            },
            release() {
                this.activeHandle = null;
                document.removeEventListener('mousemove', this.move, true);
                document.removeEventListener('mouseup', this.release, false);
                document.removeEventListener('touchmove', this.move, false);
                document.removeEventListener('touchend', this.release, false);
            },
            move(evt) {
                if (!this.activeHandle) {
                    return;
                }

                let ev;
                if (evt.type.startsWith('touch')) {
                    ev = evt.touches[0];
                } else {
                    ev = evt;
                }

                const pageX = ev.pageX;
                const rect = this.box;
                const box = this.limits(this.activeHandle.dataset.role);
                const offset = Math.max(box.start, Math.min(pageX - rect.left, box.end));

                const position = parseFloat(this.percent(offset, this.box.width).toFixed(2));
                this.values[box.attribute] = parseInt(Math.round((position * this.diff) + this.min).toFixed(0));
            },
            getEvent(ev) {
                if (ev.type.startsWith('touch')) {

                } else if (ev.type.startsWith('mouse')) {
                    pageX = ev.pageX;
                }
            },
            emitValue(prop, n, o) {
            },
            handleAttributes(type) {
                const rect = this.$refs[type].getBoundingClientRect();
                const attribute = type === 'left' ? 'min' : 'max';
            },
            solveBoxSizes() {
                this.box = this.$refs.line.getBoundingClientRect();
                this.leftBox = this.$refs.left.getBoundingClientRect();
                this.rightBox = this.$refs.right.getBoundingClientRect();
                this.key++;
            },
            limits(prop) {
                if (prop === 'left') {
                    return {
                        attribute: 'min',
                        start: 0,
                        end: parseFloat(this.rightHandleStyle.left.replace('px', ''))
                    };
                } else {
                    return {
                        attribute: 'max',
                        start: parseFloat(this.leftHandleStyle.left.replace('px', '')),
                        end: this.box.width
                    };
                }
            },
            divideClass(size) {
                return this.classList(`${size}Divide`);
            },
            percent(value, total) {
                return Math.round(value * 100 / total, 2) / 100;
            },
        },
        watch: {
            values: {
                deep: true,
                handler(n, o) {
                    this.$emit('updated:values', n, o);
                }
            }
        },
        computed: {
            gridNumbers() {
                let numbers = {}, exact, num = 0, size, interval, align;
                if (this.box) {
                    align = this.rightBox.width/2;
                    interval = ((this.box.width) / this.diff);
                    
                    for (let i = this.min; i <= this.max; i += this.step) {
                        exact = (i % this.interval === 0) || (i >= this.max);
                        size = exact ? 'big' : 'small';
                        numbers[i] = {
                            index: num,
                            number: exact ? i : '',
                            size: exact ? 'big' : 'small',
                            classList: this.classList(`${size}Divide`),
                            style: {
                                left: parseFloat(num * interval) + 'px'
                            }
                        };
                        num += this.step;
                    }

                }

                return numbers;
            },
            leftHandleClass() {
                return Object.assign({

                }, this.handle);
            },
            rightHandleClass() {
                return Object.assign({

                }, this.handle);
            },
            leftHandleStyle() {
                let leftStyle = 0;
                if (this.box) {
                    leftStyle = parseFloat((this.values.min - this.min) / this.diff).toFixed(2) * this.box.width;
                }
                return {
                    left: leftStyle + 'px'
                };
            },
            rightHandleStyle() { 
                let leftStyle = 0; 
                if (this.box && this.rightBox) {
                    leftStyle = parseFloat((this.values.max - this.min) / this.diff).toFixed(2) * this.box.width;
                }
                return {
                    left: leftStyle + 'px'
                };
            },
            diff() {
                return this.max - this.min;
            }
        },
        created() {
            let val, tmp;
            if (typeof this.value === 'string') {
                try {
                    val = JSON.parse(this.value);
                } catch (e) {
                    let tmp = this.value.split(this.separator).slice(2);
                    val = {
                        min: tmp[0],
                        max: tmp[1]
                    };
                }

                this.values = val;
            } else {
                this.values = this.value;
            }
        },
        mounted() {
            setTimeout(() => {
                this.solveBoxSizes();
                this.key++;
            }, 100);
        }
    }
</script>
