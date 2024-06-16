<script lang="ts">

import {defineComponent} from "vue";
import AlertDialog from "../framework/AlertDialog.vue";
import Column from "../common/Column.vue";
import Row from "../common/Row.vue";
import {Icon} from "../../ts/icon/Icon";
import {OSUDialogs} from "../../ts/osu/OSUDialogs";

export default defineComponent({
  computed: {
    Icon() {
      return Icon
    }
  },
  components: {Row, Column, AlertDialog},
  name: "TestDialog",
  setup(props, { emit }) {

    const abort = () => {
      OSUDialogs.testDialog.sendAndClose()
    }

    const confirm = () => {
      OSUDialogs.testDialog.sendAndClose()
    }

    return {
      abort, confirm
    }
  },
})
</script>

<template>
  <AlertDialog dialog-id="test">
    <Column
        style="background-color: #302e38"
        class="py-8 rounded-[16px] w-[560px]"
        :gap="24"
        center-horizontal
    >
      <Row class="relative w-36 aspect-square" center>
        <div
            class="rounded-full border-4 w-full h-full absolute scale-0"
            style="
            animation-duration: 500ms;
            animation-timing-function: var(--ease-out-back);
            animation-name: scale-larger;
            animation-fill-mode: forwards;
          "
        />
        <div class="ma text-white absolute" style="font-size: 72px">
          {{ Icon.Delete }}
        </div>
      </Row>
      <Column class="w-full px-8 mb-4" center-horizontal :gap="24">
        <div class="text-white text-center mt-4 text-3xl">
          提示
        </div>
        <p class="text-white">是否删除这个铺面？</p>
      </Column>
      <Column class="w-full bg-black">
        <Row center class="w-full h-14 relative overflow-hidden">
          <div
              class="bg-yellow-500 w-3/5 h-full -skew-x-12 absolute shadow-yellow-500 hover:scale-x-125"
              style="transition: transform 200ms var(--ease-out-quint)"
              @click="confirm"
          />
          <span class="text-white font-bold absolute text-lg pointer-events-none" style="letter-spacing: 1px">
            Yes
          </span>
        </Row>
        <Row center class="w-full h-14 relative overflow-hidden">
          <div
              class="bg-red-500 w-3/5 h-full -skew-x-12 absolute shadow-yellow-500 hover:scale-x-125"
              style="transition: transform 200ms var(--ease-out-quint)"
              @click="abort"
          />
          <span class="text-white font-bold absolute text-lg pointer-events-none" style="letter-spacing: 1px">
            Abort
          </span>
        </Row>
      </Column>
    </Column>
  </AlertDialog>
</template>

<style>
@keyframes scale-larger {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}
</style>