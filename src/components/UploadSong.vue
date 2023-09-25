<template>
  <Row class="fill-size" style="pointer-events: none" center>
    <Column class="upload-box" style="pointer-events: auto">
      <Row center>
        <span class="upload-box-title">歌曲上传</span>
      </Row>
      <Row class="fill-width" style="background-color: #33cb98">
        <FileUpload action="" style="width: 200px; aspect-ratio: 1/1"/>
        <FileUpload action="" style="width: 200px; aspect-ratio: 1/1"/>
      </Row>
    </Column>
  </Row>
</template>

<script setup lang="ts">
import Column from "./Column.vue";
import Row from "./Row.vue";
import FileUpload from "./FileUpload.vue";
</script>

<style scoped>
.upload-box {
  width: 800px;
  height: 600px;
  border-radius: 16px;
  background-color: #2e3835;
  padding: 32px;
}
.upload-box-title {
  color: white;
  font-size: 32px;

}
</style>