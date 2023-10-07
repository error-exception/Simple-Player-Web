<template>
  <Row class="develop-box">
    <span>开发中版本</span>
  </Row>
</template>

<script lang="ts" setup>
import Row from "./common/Row.vue";
</script>

<style scoped>
.develop-box {
  border-top-left-radius: 8px;
  padding: 8px 16px;
  color: white;
  background-color: #00000080;
  pointer-events: none;
}
</style>