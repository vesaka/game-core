<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        class="h-full w-full" 
        :viewBox="`0 0 ${size} ${size}`"
        style="width: 50px;height: 50px"
        version="1.1"
        >
        <linearGradient :id="gradientID" gradientUnits="userSpaceOnUse" 
            x1="0%" y1="0%" x2="100%" y2="0%" gradientTransform="rotate(65)">
             <stop v-for="(color, i) in strokeColors" :key="i" :offset="color.stop" :stop-color="color.fill"/>
           </linearGradient>
        <circle
            :cx="halfSize"
            :cy="halfSize"
            :r="radius"
            :stroke="stroke.empty"
            :stroke-width="stroke.width"
            :fill="stroke.fill"
            />
        <path
            :d="`M${halfSize} ${stroke.width}
            a ${radius} ${radius} 0 0 1 0 ${diameter}
            a ${radius} ${radius} 0 0 1 0 -${diameter}`"
            fill="none"
            :stroke="strokeColor"
            :stroke-width="stroke.width"
            :stroke-dasharray="`${progress}, ${circumference}`"
            />
        <text x="50%" y="50%"
              text-anchor="middle"
              :fill="font.color"
              :font-family="font.family"
              :font-size="font.size"
              :stroke="font.stroke"
              :stroke-width="font.strokeWidth"
              dy=".4em"
              v-html="displayText"></text>
    </svg>
</template>
<script>
    export default {
        props: {
            size: {
                type: Number,
                default: 100,
            },
            options: {
                type: Object,
                default() {
                    return {}
                }
            },
            value: {
                type: Number,
                default: 0
            },
            withPercents: {
                type: Boolean,
                default: false
            },
            text: {
                type: [String, Number],
                default: 0
            },
            gradientID: {
                type: String,
                default: 'ring-gradient'
            }
        },
        computed: {
            font() {
                return Object.assign({
                    family: 'Arial, no-serif',
                    color: "white",
                    size: 18,
                    stroke: "none",
                    strokeWidth: "1"
                }, this.options.font || {});
            },
            stroke() {
                return Object.assign({
                    fill: "none",
                    width: 10,
                    empty: "rgba(0, 0, 0, 0.5)"
                }, this.options.stroke || {});
            },
            circumference() {
                return this.radius * Math.PI * 2;
            },
            diameter() {
                return this.radius*2;
            },
            halfSize() {
                return this.size / 2;
            },
            radius() {
                return this.halfSize - this.stroke.width;
            },
            displayText() {
                if (this.text) {
                    return this.text;
                }

                return this.value + (this.withPercents ? '%' : '');
            },
            progress() {
                if (100 === this.value) {
                    return 100 * (this.circumference / 100);
                }
                return (this.value % 100) * (this.circumference / 100);
            },
            strokeColors() {
                const c = this.stroke.colors;
                const colors = [];
                if (Array.isArray(c) && c.length > 0) {
                    const stop = Math.round(100 / c.length, 2);
                
                    for (let i = 0; i < c.length; i++) {
                        colors.push({
                            fill: c[i],
                            stop: stop*i + '%'
                        });
                    }
                    
                    colors.push({
                        fill: c[0],
                        stop: '100%'
                    });
                    
                    return colors;
                }
                
                return false;
            },
            strokeColor() {
                if (Array.isArray(this.strokeColors)) {
                    return `url(#${this.gradientID})`;
                }
                
                return this.stroke.color || 'red';
            }

        },
    };
</script>