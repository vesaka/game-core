<template>
    <div :id="id" :class="props.root">
        <ul class='flex mb-0 list-none flex-col flex-row'>
            <li v-for="(tab, key) in tabs" @click="selectTab(key)" :class="navItemClass(key)" :key="key" :active="isActive(key)">
            <slot name="beforeLink" :tab="tab"></slot>
            <slot :name="`slot${key}`" :tab="tab">
                <span v-html="tab.props.title"></span>
            </slot>
            <slot name="afterLink" :tab="tab"></slot>
            </li>
        </ul>
        <div :class="props.panel">
            <component :is="activeTabComponent" :key="key"/>
        </div>

    </div>
</template>
<script setup>
    import { ref, computed, getCurrentInstance, onBeforeMount } from 'vue';
    const activeTab = ref(null);


    const props = defineProps({
        id: {
            type: String,
            default() {
                return 'tab' + new Date().getTime();
            }
        },
        root: [Object, String],
        navItem: {
            type: Object,
            default() {
                return {}
            }
        },
        panel: [Object, String],
        classes: {
            type: [String, Object],
            default() {
                return {
                    root: {
                        'w-full': true
                    },
                    navItem: {
                        'last:mr-0 text-center p-2 cursor-pointer': true,
                        'hidden': false
                    },
                    panel: {
                        'w-full shadow-md': true,
                    }
                };
            }
        },
        classList: {
            type: [String, Object],
            default() {
                return {
                    panel: {}
                };
            }
        },
        activeClass: {
            type: String,
            default: 'active'
        }
    });

    const selectTab = (key) => {
        activeTab.value = key;
    };
    const isActive = (index) => {
        return index === activeTab;
    };

    const navItemClass = (key) => {

        props.navItem[props.activeClass] = key === activeTab;
        return props.navItem;
    };

    const tabs = computed(() => {
        const {slots, options} = getCurrentInstance();
        console.log(getCurrentInstance().components);
        slots.default().forEach(console.log);
        return slots.default().filter(node => node.type.__name === 'Tab');
    });

    const selected = computed(() => {
        if (null !== activeTab.value) {
            return activeTab.value;
        }
        
        return 0;
    });
    
    const activeTabComponent = computed(() => {
        
    });
    
    onBeforeMount(() => {
        
    });

</script>
