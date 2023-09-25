<template>
  <Column
      class="file-upload-box"
      :style="`border-color: ${borderColor}`"
  >
    <Row
        class="file-upload-area"
        center
        @drop="handleDrop"
        @dragenter="handleDrop"
        @dragover="handleDrop"
        @dragleave="handleDrop"
    >
      <span class="ma">{{ Icon.FileUpload }}</span>
      <img :src="imageData" v-if="isImage" alt="image preview" style="position: absolute; object-fit: contain" class="fill-size">
    </Row>
  </Column>
</template>

<script lang="ts" setup>

import { provide, ref } from "vue";
import { Icon } from "../ts/icon/Icon";
import Column from "./Column.vue";
import Row from "./Row.vue";

// withDefaults(defineProps<{
//   accept: string,
//   action: string,
//   autoUpload: boolean
// }>(), {
//   accept: '*/*',
//   autoUpload: false
// })

const borderColor = ref<"white" | "red">("white")
const isImage = ref(false)
const imageData = ref('')

interface UploadHandler {
  uploadFile(): void
}

provide<UploadHandler>("uploadHandler", {
  uploadFile() {}
})

function handleDrop(e: DragEvent) {
  e.preventDefault()
  if (e.type === "dragenter") {
    borderColor.value = "red"
  } else if (e.type === "dragleave") {
    borderColor.value = "white"
  } else if (e.type === "drop") {
    //@ts-ignore
    const files = e.dataTransfer.files
    if (files.length > 1) {
      return
    }
    handleFile(files.item(0))

    borderColor.value = "white"
  }
}

async function handleFile(file: File | null) {
  if (!file)
    return
  console.log(file.name, file.type)
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = (ev) => {
    if (!ev.target) {
      return
    }
    const result = ev.target.result
    imageData.value = result as string
    isImage.value = true
  }
}



</script>

<style scoped>
.file-upload-box {
  width: 200px;
  aspect-ratio: 1/1;
  background-color: #2e3835;
  border-radius: 12px;
  border: 2px dashed white;
}
.file-upload-area {
  width: 100%;
  height: 100%;
  position: relative;
}
.file-upload-area > span {
  color: white;
  font-size: 64px;
}
</style>