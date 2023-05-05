<template>
  <div ref="html" :style="'background-image: url(' + testImage + ')'" :class="`artwork fill-size ${className}`"></div>
</template>

<script setup lang="ts">
import testImage from '../assets/1.png'
import {computed, onMounted, ref, watch} from "vue";
import {useStore} from "vuex";

const store = useStore()

const className = ref('movable')

let clientX: number, clientY: number;

function move(el: HTMLElement, clientX: number, clientY: number) {
  const ratioString = getComputedStyle(el).backgroundSize;
  const ratio = parseInt(ratioString.substring(0, ratioString.lastIndexOf("%"))) / 100;

  const windowX = window.innerWidth;
  const windowY = window.innerHeight;
  //背景图尺寸
  const imgWidth = windowX * ratio;
  const imgHeight = windowY * ratio;
  //鼠标在图片上的区域的尺寸
  const rectX = imgWidth - windowX;
  const rectY = imgHeight - windowY;

  const x = rectX * (clientX / windowX);
  const y = rectY * (clientY / windowY);

  el.style.backgroundPosition = -x + "px " + -y + "px";
}

const html = ref(null)

function mouseMove(e: MouseEvent, div: HTMLDivElement) {
  clientX = e.clientX;
  clientY = e.clientY
  if (store.state.settings.backgroundMovable) {
    move(div, clientX, clientY)
  }
}

onMounted(() => {
  //@ts-ignore
  const div: HTMLDivElement = html.value
  window.onmousemove = (ev) => {
    mouseMove(ev, div)
  }
})

</script>

<style scoped>
.artwork {
}
.movable {
  background-position: center;
  background-size: 101%;
  background-attachment: fixed;
  background-repeat: no-repeat;
}
.static {
  background-position: center;
  background-size: cover;
  background-attachment: fixed;
  background-repeat: no-repeat;
}
</style>