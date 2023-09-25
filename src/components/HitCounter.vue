<template>
    <h1 class="hit-counter">{{ count }}</h1>
</template>
<script setup lang="ts">

import {ref} from "vue";
// import {useEvent} from "../ts/EventBus";

const count = ref(0)

// useEvent({
//     onManiaHit(value: number) {
//         count.value = value
//     }
// })

</script>
<style scoped>
.hit-counter {
    padding: 32px 64px;
    background-color: #4f5e5a;
    border-radius: 16px;
    color: white;
}
</style>