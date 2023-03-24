<template>
    <div>
        <strong>{{ props.title }}</strong>
    </div>
</template>
<script setup>
    import { ref, computed } from 'vue';
    const active = ref(false);
    const props = defineProps({
        title: String
    });
</script>>