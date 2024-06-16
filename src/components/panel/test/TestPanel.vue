<script setup lang="ts">
import OSUPanel from "../../framework/OSUPanel.vue";
import {Color} from "../../../ts/webgl/base/Color";
import Column from "../../common/Column.vue";
import Row from "../../common/Row.vue";
import BasicButton from "../../common/BasicButton.vue";
import {OSUDialogs} from "../../../ts/osu/OSUDialogs";

const showTest = () => {
  OSUDialogs.testDialog.show()
}

</script>

<template>
  <OSUPanel
      panel-id="test"
      :theme-color="Color.Transparent"
  >
    <Column class="bg-gray-800 w-full h-full" center :gap="64">
      <Row :gap="64">
        <BasicButton
            :color="Color.fromRGB(59, 130, 246 )"
            class="px-4 py-2 text-white rounded-md"
            v-osu-button
            @click="showTest"
        >
          上一个
        </BasicButton>
        <BasicButton
            :color="Color.fromRGB(59, 130, 246 )"
            class="px-4 py-2 text-white rounded-md"
            v-osu-button
        >
          下一个
        </BasicButton>
      </Row>
    </Column>
  </OSUPanel>
</template>

<style scoped>

</style>