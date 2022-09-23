<template>
    <div :class="classList('root')">
        <span ref="left" :class="leftClass" :style="leftStyles" @click="minus" v-if="showHandles">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 12H6" />
            </svg>
        </span>
        <div ref="range" class="relative h-8 mx-8 flex-grow overflow-auto">
            <canvas ref="fallbackGradient" :class="classList('fallbackGradient')" :style="fallbackStyle"></canvas>
            <canvas ref="line" :class="classList('line')"></canvas>
            <span ref="control" :class="handleClass" @mousedown="hold" @touchstart="hold" :style="controlStyle"></span>

        </div>

        <span ref="right" :class="rightClass" :style="rightStyles" @click="plus" v-if="showHandles">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
        </span>
        <div :class="classes.tooltipBox" v-show="false">
            <div class="relative">
                <div ref="tooltip" :class="tooltipClass">
                    <span v-html="range"></span>
                    <svg :class="arrowClass" x="0px" y="0px"
                         viewBox="0 0 255 255"
                         xml:space="preserve">
                        <polygon class="fill-current" points="0,0 127.5,127.5 255,0"/>
                    </svg>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import ClassMixin from '$m/media/game/components/mixins/class-mixin';
    export default {
        props: {
            min: {
                type: Number,
                default: 0
            },
            max: {
                type: Number,
                default: 100
            },
            step: {
                type: Number,
                default: 1
            },
            showHandles: {
                type: Boolean,
                default: true
            },
            showMetrics: {
                type: Boolean,
                default: false
            },
            showPopup: {
                type: Boolean,
                default: false
            },
            startColor: {
                type: String,
                default: '#FF4444'
            },
            endColor: {
                type: String,
                default: '#4444FF'
            },
            gradient: {
                type: [Object, Array],
                default() {
                    return [];
                }
            },
            css: {
                type: Object,
                default() {
                    return {
                        left: {
                            'color': this.startColor,
                            'border-color': this.startColor
                        },
                        right: {
                            'color': this.endColor,
                            'border-color': this.endColor
                        },
                        line: {},
                        handle: {}
                    };
                }
            },
            classes: {
                type: Object,
                default() {
                    return {
                        root: {
                            'relative w-full flex': true
                        },
                        handle: {
                            'absolute border-2 top-0 rounded-full h-8 w-8 cursor-pointer shadow-lg': true,
                            'items-center justify-center text-center': true,
                            'transform transition-left duration-100 ease-in-out': true
                        },
                        control: {
                            'absolute border-2 top-0 bg-grey-300 rounded-full h-8 w-8 cursor-pointer': true,
                        },
                        left: {
                            'left-0': true,
                            'bg-red-300 border-red-600 text-red-600': '' === this.startColor,
                        },
                        right: {
                            'right-0': true,
                            'bg-blue-300 border-blue-600 text-blue-600': '' === this.startColor,
                        },
                        line: {
                            'w-full flex': true,
                            'rounded-full bg-grey h-2 my-3 mx-auto px-0': true,
                            'absolute inset-0': true,
                        },
                        fallbackGradient: {
                            'w-full flex': true,
                            'h-2 my-3 mx-0 px-0': true,
                            'absolute inset-0': true,
                        },
                        tooltipBox: {
                            'absolute border-none top-0': true,
                        },

                    };
                }
            },
            placement: {
                type: String,
                default: 'top',
                validator(placement) {
                    return ['top', 'right', 'bottom', 'left'].indexOf(placement) > -1;
                }
            },
            tooltipPlacements: {
                type: Object,
                default() {
                    return {
                        top: {
                            tooltip: 'bottom-full',
                            arrow: 'h-2 w-full left-0 top-full',

                        },
                        right: {
                            tooltip: 'left-full origin-left',
                            arrow: 'h-full w-2 top-0 right-full rotate-90'
                        },
                        bottom: {
                            tooltip: 'top-full origin-top',
                            arrow: 'h-2 w-full left-0 bottom-full rotate-180'
                        },
                        left: {
                            tooltip: 'right-full origin-right',
                            arrow: 'h-full w-2 top-0 left-full -rotate-90'
                        }
                    };
                }
            }
        },
        data() {
            return {
                range: 0,
                dragging: false,
                offset: 0,
                currentTooltip: null
            };
        },
        mixins: [ClassMixin],
        methods: {
            onInput(e) {
                this.$emit('updated:', e.target.value)
            },
            hold() {
                this.dragging = true;
                document.addEventListener('mousemove', this.move, true);
                document.addEventListener('mouseup', this.release, false);
                document.addEventListener('touchmove', this.move, false);
                document.addEventListener('touchend', this.release, false);
                
                if (!this.currentTooltip) {
                    this.currentTooltip = this.$refs.tooltip.cloneNode(true);
                    document.body.appendChild(this.currentTooltip);
                }
                this.moveTooltip();
                this.currentTooltip.classList.remove('hidden');
            },
            move(ev) {
                if (false === this.dragging) {
                    return;
                }

                let pageX;
                if (ev.type.startsWith('touch')) {
                    pageX = ev.touches[0].pageX;
                } else if (ev.type.startsWith('mouse')) {
                    pageX = ev.pageX;
                } else {
                    return;
                }

                const rect = this.$refs.line.getBoundingClientRect();
                const maxWidth = rect.left + rect.width + this.$refs.control.offsetWidth / 2;
                const offset = Math.max(0, Math.min(pageX - rect.left, rect.width));
                const position = parseFloat(this.percent(offset, this.$refs.line.offsetWidth).toFixed(2));
                this.range = parseFloat(((position * (this.max - this.min)) + this.min).toFixed(0));
                this.moveTooltip();

            },
            release() {
                this.dragging = false;
                document.removeEventListener('mousemove', this.move, true);
                document.removeEventListener('mouseup', this.release, false);
                document.removeEventListener('touchmove', this.move, false);
                document.removeEventListener('touchend', this.release, false);
                this.moveTooltip();
                this.currentTooltip.classList.add('hidden');
                //this.currentTooltip.remove();
                //this.currentTooltip = null;
            },
            plus() {
                if (this.range < this.max) {
                    this.range = Math.min(parseInt(this.range) + parseInt(this.step), this.max);
//                    if (this.range > this.max) {
//                        this.range = this.max;
//                    }

                }
                this.moveTooltip();
            },
            minus() {
                if (this.range > this.min) {
                    this.range = Math.max(parseInt(this.range) - parseInt(this.step), this.min);
//                    if (this.range < this.min) {
//                        this.range = this.min;
//                    }

                }
                this.moveTooltip();
            },
            byteToHex(num) {
                return ('0' + num.toString(16)).slice(-2);
            },
            colorToRGBA(color) {
                let canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
                ctx.fillStyle = color;
                ctx.fillRect(0, 0, 1, 1);
                const result = ctx.getImageData(0, 0, 1, 1).data;
                canvas.remove();
                return result;

            },
            colorToRGBAString(color) {
                const result = this.colorToRGBA(color);
                return `rgba(${result[0]}, ${result[1]}, ${result[2]}, ${(Math.round(result[3] * 100) / 255) / 100})`;
            },
            colorToHex(color, withDash = true) {
                let rgba, hex;
                rgba = this.colorToRGBA(color);
                hex = [0, 1, 2].map(
                        function (idx) {
                            return byteToHex(rgba[idx]);
                        }
                ).join('');
                return (withDash ? "#" : "") + hex;
            },
            pickColor(position) {
                
                let canvas = this.$refs.line, ctx = canvas.getContext('2d'),
                        offset = parseInt(Math.min((position * canvas.width).toFixed(0), canvas.width-1)),
                        result = ctx.getImageData(offset, 1, 1, 1).data;
                return `rgba(${result[0]}, ${result[1]}, ${result[2]}, ${(Math.round(result[3] * 100) / 255) / 100})`;
            },
            percent(value, total) {
                return Math.round(value * 100 / total, 2) / 100;
            },
            getLineOffsetSize() {
                const offset = this.$refs.control.offsetWidth;
                return {
                    width: this.$refs.range.clientWidth - (this.$refs.control.offsetWidth),
                    height: this.$refs.range.clientHeight 
                }; 
            },
            fillColor() {

                this.resizeBar();
                let canvas = this.$refs.line,
                        ctx = canvas.getContext("2d");
                if (!this.endColor) {
                    ctx.fillStyle = this.colorToRGBAString(this.startColor);

                } else {
                    var fill = ctx.createLinearGradient(0, 0, 200, 0);
                    const colors = this.gradientColors;
                    for (let position in colors) {
                        fill.addColorStop(position, colors[position]);
                    }

                    ctx.fillStyle = fill;

                }
                ctx.fillRect(0, 0, canvas.width, canvas.height);

            },
            resizeBar() {
                const size = this.getLineOffsetSize();
                this.$refs.line.style.width = size.width + 'px';
                this.$refs.line.width = size.width;
                this.$refs.line.height = size.height;
            },
            moveTo(offset) {
                this.$refs.control.style.left = offset + 'px';
            },
            moveTooltip() {
                const tooltip = this.currentTooltip;
                const rect = this.$refs.control.getBoundingClientRect();
                const tooltip_rect = tooltip.getBoundingClientRect();

                switch (this.placement) {
                    case 'bottom':
                        tooltip.style.left = (rect.x + ((rect.width - tooltip_rect.width) / 2)) + 'px';
                        tooltip.style.top = (rect.y + rect.height) + 'px';
                        break;
                    case 'top':
                        tooltip.style.left = (rect.x + ((rect.width - tooltip_rect.width) / 2)) + 'px';
                        tooltip.style.top = (rect.y - tooltip_rect.height) + 'px';
                        break;
                    case 'left':
                        tooltip.style.left = (rect.x - tooltip_rect.width) + 'px';
                        tooltip.style.top = (rect.y + rect.height/2 - tooltip_rect.height/2) + 'px';
                        break;
                    case 'right':
                        tooltip.style.left = (rect.x + rect.width) + 'px';
                        tooltip.style.top = (rect.y + rect.height/2 - tooltip_rect.height/2) + 'px';
                        break;
                    default:
                        tooltip.style.left = (rect.x + ((rect.width - tooltip_rect.width) / 2)) + 'px';
                        tooltip.style.top = (rect.y - tooltip_rect.height) + 'px';
                        break;
                    

                }

                tooltip.innerHTML = this.$refs.tooltip.innerHTML;
            }

        },
        computed: {
            leftClass() {
                return Object.assign({}, this.classes.handle, this.classes.left);
            },
            rightClass() {
                return Object.assign({}, this.classes.handle, this.classes.right);
            },
            leftStyles() {
                return {
                    'color': this.startColor,
                    'border-color': this.startColor
                };
            },
            rightStyles() {
                return {
                    'color': this.endColor,
                    'border-color': this.endColor
                };
            },
            handleClass() {
                return Object.assign({}, this.classes.control);
            },
            gradientColors() {
                let colors = {};
                if (Array.isArray(this.gradient)) {
                    if (this.gradient.length < 2) {
                        colors = {0.5: this.colorToRGBAString(this.startColor), 1: this.colorToRGBAString(this.endColor)};
                    } else {
                        const length = this.gradient.length;
                        for (let index = 0; index < length; index++) {

                            colors[parseFloat(this.percent(index + 1, length).toFixed(2))] = this.gradient[index];
                        }
                    }
                } else {

                    for (let position in this.gradient) {
                        if (typeof position === 'string') {
                            if (position.endsWith('%')) {
                                let index = parseFloat(position.replace(/%$/, '')) / 100;
                                if (index > 0 && index < 100) {
                                    colors[Math.round(index / 100, 2)] = this.gradient[index];
                                }
                            } else if (position.startsWith('.')) {
                                colors[Math.round(parseFloat('0' + position), 2)] = this.gradient[index];
                            } else if (position.startsWith('0.')) {
                                colors[Math.round(parseFloat(position), 2)] = this.gradient[index];
                            }
                        } else {
                            colors[Math.round(parseFloat(position), 2)] = this.gradient[index];
                        }
                    }


                }
                return colors;
            },
            controlStyle() {
                return {
                    'background-color': this.fromColor,
                    'left': this.offset + 'px'
                };
            },
            fallbackStyle() {
                return {
                    background: `linear-gradient(to right, ${this.fromColor}, ${this.toColor})`
                };
            },
            tooltipClass() {
                return {
                    'absolute bg-black text-white text-xs text-center hidden rounded py-1 px-4 z-10': true
                };
            },
            tooltipStyle() {
                return {
                    left: '-32px'
                };
            },
            arrowClass() {
                return `absolute text-black transform ${this.tooltipPlacements[this.placement].arrow}`;

            },
            arrowStyle() {
                return {

                };
            },
            fromColor() {
                return this.colorToRGBAString(this.startColor);
            },
            toColor() {
                return this.colorToRGBAString(this.endColor);
            },
            fillLine() {

            }
        },
        watch: {
            range(value) {
                const rangeWidth = this.$refs.line.offsetWidth;
                const controlWidth = this.$refs.control.offsetWidth;
                const maxWidth = rangeWidth;
                const position = this.percent(value - this.min, this.max - this.min);
                
                this.offset = parseFloat((position * maxWidth).toFixed(2));
                this.controlStyle['background-color'] = this.pickColor(position);
                this.$emit('update:range', value);
            }
        },
        created() {
            //window.addEventListener('resize', this.resizeBar);
        },
        mounted() {
            this.currentTooltip = this.$refs.tooltip.cloneNode(true);
            document.body.appendChild(this.currentTooltip);
            
            //this.$nextTick(this.resizeBar);
            setTimeout(this.fillColor, 300);
        },
        updated() {
            setTimeout(this.fillColor, 300);
        }
    };
</script>