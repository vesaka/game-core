<template>
    <div>
        <slot>{{ title }}</slot>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                active: false,
                key: 0
            };
        },
        props: {
            selected: {
                type: Boolean,
                default: false
            },
            name: {
                type: String,
                default() {
                        return 'tab' + new Date().getTime();
                }
            },
            title: {
                type: String,
                default: 'Tab'
            }
        },
        watch: {
            active(v) {
                console.log(v);
            }
        },
        mounted() {
            this.active = this.selected;
        }
    }
</script>
