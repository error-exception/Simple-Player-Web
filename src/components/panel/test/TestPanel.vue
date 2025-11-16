<script setup lang="ts">
import { OSUDialogs } from "../../../ts/osu/OSUDialogs";
import { Color } from "../../../ts/webgl/base/Color";
import BasicButton from "../../common/BasicButton.vue";
import Column from "../../common/Column.vue";
import Row from "../../common/Row.vue";
import OSUPanel from "../../framework/OSUPanel.vue";

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
          Test Pack
        </BasicButton>
      </Row>
      <div class="t">

      </div>
    </Column>
  </OSUPanel>
</template>

<style scoped>
.t {
  width: 240px;
  height: 240px;
  border-radius: 50%;
  border: 40px dotted white;
  border-bottom-color: rebeccapurple;
  transition: all 220ms ease-in;
}
.t:hover {
  border-bottom-color: red;
}
</style>