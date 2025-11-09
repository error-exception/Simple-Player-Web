<script setup lang="ts">
import OSUPanel from "../../framework/OSUPanel.vue";
import {Color} from "../../../ts/webgl/base/Color";
import Column from "../../common/Column.vue";
import Row from "../../common/Row.vue";
import BasicButton from "../../common/BasicButton.vue";
import {OSUDialogs} from "../../../ts/osu/OSUDialogs";
import {ref} from "vue";
import {TexturePacker} from "../../../ts/webgl/graphic/texture/TexturePack";

const showTest = () => {
  OSUDialogs.testDialog.show()
}

const canvasRef = ref<HTMLCanvasElement | null>(null);

const testPack = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const packer = new TexturePacker()
  packer.testDraw(canvas.getContext('2d')!)
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
            @click="testPack"
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