<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useTransitionRef} from "../../ts/use/useTransitionRef";
import {easeOutBack, easeOutQuint} from "../../ts/util/Easing";
import {OSUDialog} from "../../ts/osu/OSUDialogStack";
import {useSingleEvent} from "../../ts/util/SingleEvent";

const props = defineProps<{
  dialogId: string
}>()

const dialogOpacity = ref(0)
const dialogScale = ref(.6)
const maskOpacity = ref(0)
const dialogOpacityTo = useTransitionRef(dialogOpacity)
const dialogScaleTo = useTransitionRef(dialogScale)
const maskOpacityTo = useTransitionRef(maskOpacity)

const zIndex = ref(600)

const mask = ref(true)

onMounted(() => {
  dialogScaleTo(1, 400, easeOutBack)
  maskOpacityTo(1, 400, easeOutQuint)
  dialogOpacityTo(1, 400, easeOutQuint)
  zIndex.value = OSUDialog.dialogZIndex.value
})

function closeSelf(data?: any) {
  dialogScaleTo(.6, 800, easeOutQuint)
  maskOpacityTo(0, 800, easeOutQuint)
  dialogOpacityTo(0, 800, easeOutQuint)
  setTimeout(() => {
    mask.value = false
    dialog.onDataReturned.fire(data)
  }, 800)
}

const dialog = OSUDialog.getDialog(props.dialogId)
useSingleEvent(dialog.onCloseRequested, (data) => {
  closeSelf(data)
})


</script>
<template>
  <div class="alert-dialog-box" :style="{ zIndex: zIndex }" v-if="mask">
    <div
        class="alert-dialog-mask"
        :style="{ opacity: maskOpacity }"
        @click="() => dialog.sendAndClose(undefined)"
    />
    <div
        class="alert-dialog-content"
        :style="{
          transform: `scale(${dialogScale})`,
          opacity: dialogOpacity
        }"
    >
      <slot/>
    </div>

  </div>
</template>
<style scoped>
.alert-dialog-box {
  width: 100vw;
  height: 100vh;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
}
.alert-dialog-mask {
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: rgba(0, 0, 0, .5);
}
.alert-dialog-content {
  position: absolute;
  width: fit-content;
  height: fit-content;
  pointer-events: auto;
}

</style>