<template>
    <svg :viewBox="`0 0 ${maxWidth} 100`"
         :width="size"
         :height="size"
         xmlns="http://www.w3.org/2000/svg">
        <rect x="0" :y="50 - line.height/2 - outer.width" :width="maxWidth" :height="line.height + outer.width*2" :fill="outer.color" :rx="line.radius" :ry="line.radius"/>
        <rect :x="outer.width" :y="50 - line.height/2" :width="value" height="10" :fill="line.color"  :rx="line.radius" :ry="line.radius">
            <slot name="animate"></slot>
        </rect>

    </svg>
</template>
<script>
    export default {
        props: {
            size: {
                type: Number,
                default: 50
            },
            border: {
                type: Object,
                default() {
                    return {}
                }
            },
            bar: {
                type: Object,
                default() {
                    return {}
                }
            },
            value: {
                type: Number,
                default: 0
            }
        },
        computed: {
            outer() {
                return Object.assign({
                    color: 'grey',
                    width: 2
                }, this.border);
            },
            line() {
                return Object.assign({
                    height: 10,
                    radius: 5,
                    color: '#0000ff'
                }, this.bar);
            },
            maxWidth() {
                return 100 + (this.outer.width*2)
            }
            
        }
    }
</script>
