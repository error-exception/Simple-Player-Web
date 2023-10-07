<template>
    <div
        class="slider-box"
    >
        <div
            class="slider-box-background"
            ref="sliderBackground"
        />
        <div
            class="slider-box-progress"
            :style="`
          background-color: ${color};
          width: ${progress * width}px
        `"
        />
        <div
            class="slider-box-thumb"
            ref="sliderThumb"
            @dragstart="dragStart"
            @drop="onDrop"
            :style="`
          background-color: ${color};
          transform: translateX(${progress * width}px);
        `"
        />
        <input type="range" class="slider-input">
    </div>
</template>

<script setup lang="ts">

import {onMounted, ref} from "vue";

withDefaults(defineProps<{
    color?: string,
    modelValue?: number // 0.0 - 1.0
}>(), {
    color: '#33cb98'
})

defineEmits<{
    (e: 'update:modelValue', value: number): void
}>()

const sliderThumb = ref<HTMLDivElement | null>(null)
const sliderBackground = ref<HTMLDivElement | null>(null)
const width = ref(0)
const progress = ref(0)

onMounted(() => {
    const thumb = sliderThumb.value
    const background = sliderBackground.value
    if (!thumb || !background) {
        return
    }
    width.value = background.offsetWidth
})

function dragStart(e: DragEvent) {
    e.preventDefault()
    console.log("drag start")
}

function onDrop() {
    console.log('drop')
}

</script>

<style scoped>

.slider {
    position: relative;
    height: 24px;
    display: flex;
    align-items: center;
    --slider-color: '#33cb98
}

.slider > * {
    position: absolute;
}

.slider > div:nth-child(1) {

}

.slider > div:nth-child(2) {

}

.slider-input {
    width: 60px;
    height: 16px;
    border-radius: 16px;
}
.slider-input::-webkit-slider-thumb {
    width: 60px;
    height: 16px;
    border-radius: 16px;
    background-color: var(--slider-color);
}
.slider-input::-webkit-slider-thumb:hover {
    box-shadow: 0 0 8px #33cb98;
}

.slider-box {
    height: 24px;
    position: relative;
    display: flex;
    align-items: center;
}

.slider-box-background {
    width: calc(100% - 60px);
    height: 4px;
    background-color: #000000c0;
    border-radius: 16px;
    position: absolute;
    margin-left: 30px;
}

.slider-box-progress {
    width: calc(100% - 60px);
    height: 4px;
    border-radius: 16px;
    position: absolute;
    margin-left: 30px;
}

.slider-box-thumb {
    width: 60px;
    height: 16px;
    border-radius: 16px;
    position: absolute;
}

.slider-box-thumb:hover {
    box-shadow: 0 0 8px #33cb98;
}
</style>