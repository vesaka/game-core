<template>
    <svg xmlns="http://www.w3.org/2000/svg"
         xmlns:xlink="http://www.w3.org/1999/xlink"
         class="h-full w-full" 
         :viewBox="`0 0 ${width} ${height}`"
         :width="size.width" :height="size.height"
         :style="{ width: width + 'px', height: height + 'px'}"
         version="1.1">
        <defs>
            <pattern id="stripePattern" patternUnits="userSpaceOnUse" :width="strip.size" :height="strip.size" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" :y2="strip.size" :stroke="strip.fill.front" :stroke-width="strip.size" />
            </pattern>
        </defs>
        <mask id="rectMask">
            <rect :x="halfBorder" :y="halfBorder" :width="`${props.value}%`"
                  :height="height - strip.border"
                  fill="white"
                  :rx="strip.rx"
                  :ry="strip.ry"/>
        </mask>
        <rect x="0" y="0" width="100%" height="100%" :fill="strip.fill.drop" :rx="strip.rx" :ry="strip.ry" stroke="white" :stroke-width="strip.border"/>
        <rect :x="halfBorder" :y="halfBorder" :width="`${props.value}%`" :height="height - strip.border" :fill="strip.fill.back"/>
        <rect mask="url(#rectMask)" :x="-width*2" y="0" :width="width*2" height="100%" fill="url(#stripePattern)">
                <animateTransform attributeType="XML"
                        attributeName="transform"
                        type="translate"
                        :from="`-${width} 0`" :to="`${width*2} 0`"
                        dur="3s" repeatCount="indefinite"/> 
        </rect>
    </svg>
</template>
<script setup>
    import { computed, ref } from 'vue';

    const props = defineProps({
        width: {
            type: Number,
            default: 100
        },
        height: {
            type: Number,
            default: 25
        },
        options: {
            type: Object,
            default: {}
        },
        value: {
            type: Number,
            default: 0
        }
    });

    const size = computed(() => {
        return {
            width: props.width + strip.value.border * 2,
            height: props.height + strip.value.border * 2
        };
    });

    const strip = computed(() => {
        return Object.assign({
            fillOpacity: 0.9,
            border: 3,
            rx: 0,
            ry: 0,
            width: 30,
            stroke: 10,
            size: 30,
            space: 30,
            fill: {
                front: 'red',
                back: 'white',
                drop: 'grey'
            },
            backColor: 'red',
        }, props.options);
    });
//    const h = 200;
    const h = computed(() => {
        return Math.min(props.width, props.height);
    });
    
    const halfBorder = computed(() => {
        return strip.value.border / 2;
    });
    const d = computed(() => {
        const h = props.height;
        return `M0 ${h}L${h} 0H${h / 2}L0 ${h / 2}M${h} ${h}V${h / 2}L${h / 2} ${h}`;
    });

</script>
