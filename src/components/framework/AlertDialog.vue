<script setup lang="ts">
import Row from "../common/Row.vue";
import Column from "../common/Column.vue";

withDefaults(defineProps<{
  title?: string
}>(), {
  title: ''
})

</script>
<template>
    <Column class="rounded-[8px] overflow-hidden">
        <Row class="w-full">
            <slot name="title"/>
        </Row>
        <Column>
            <slot/>
        </Column>
    </Column>
</template>