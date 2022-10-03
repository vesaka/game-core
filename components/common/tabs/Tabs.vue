<template lang="html">
    <div :id="id" :class="rootClass">
        <ul class='flex mb-0 list-none flex-col flex-row'>
            <li v-for="(tab, key) in tabs" @click="selectTab(key)" :class="navItemClass(key)" :key="key" :active="isActive(key)">
            <span v-html="tab"></span>
            </li>
        </ul>
        <div :class="panelClass">
            <component :is="activeTabComponent" :key="key"/>
        </div>
        
    </div>
</template>
<script>
    export default {
        data() {
            return {
                key: 0,
                activeTab: null,
            };
        },
        props: {
            id: {
                type: String,
                default() {
                    return 'tab' + new Date().getTime();
                }
            },
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
        },
        components: {},
        methods: {
            selectTab(key) {
                this.activeTab = key;
                if (this.$store) {
                    this.$store.commit('model', {
                        key: 'activeTab',
                        value: key
                    });
                }
                this.key++;
            },
            isActive(index) {
                return index === this.activeTab;
            },
            navItemClass(key) {
                let classList = Object.assign({}, this.classes.navItem, this.classList.navItem || {});

                classList[this.activeClass] = this.selected === key;
                return classList;
            },
        },
        computed: {
            rootClass() {
                return Object.assign({}, this.classes.root);
            },
            className() {
                let obj;
                if (typeof this.classes === 'string') {
                    let classes = this.classes.split('\s+'), obj = {};
                    for (let i in classes) {
                        obj[i] = true;
                    }


                } else {
                    obj = Object.assign({}, this.classes);
                }

                return obj;
            },
            panelClass() {
                return Object.assign({} , this.classList.panel, this.classes.panel);
            },
            selected() {
                if (null !== this.activeTab) {
                    return this.activeTab;
                }

                if (this.$store && this.$store.state.activeTab) {
                    return this.$store.state.activeTab;
                }
                return 0;
            },
            tabs() {
                const tabs = [];
                let title;
                for (let i in this.$options.components) {
                    if (this.$options.components[i].children.title) {
                        this.$options.components[i].children.title().forEach(child => {
                            title +=  typeof child.children !== 'undefined' ? child.children : '';
                        });
                    } else {
                        title = this.$options.components[i].props.title;
                    }
                    tabs.push(title);
                }
                return tabs;
            },
            activeTabComponent() {
                return `tab-${this.selected}`;
            }
        },
        watch: {
            activeTab(n, o) {
                this.$emit('changeTab', n, o);
            }
        },
        created() {
            if (typeof this.$slots.default === 'function') {
                this.$slots.default().filter((child, i) => {
                    if (child.type.__file.indexOf('Tab.vue') > -1) {
                        child.key = i;
                        this.$options.components[`tab-${i}`] = child;
                    }
                });
            }

        },
        mounted() {
            const key = this.selected;
//            this.tabs.forEach((tab, index) => {
//                tab.active = (index === key);
//            });
        }
    }
</script>

