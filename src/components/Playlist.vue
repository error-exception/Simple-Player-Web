<template>
    <div
        class="vertical-scroll no-scroller playlist"
        ref="html"
    >
      <div
          v-for="(item, index) in list"
          @click="playAt(index, item)"
          :class="`list-item ${activeIndex === index ? 'select' : ''}`"
      >
        <span>{{item.title}}</span>
      </div>
    </div>
</template>

<script setup lang="ts">
import {Music} from "../ts/type";
import {AudioPlayer} from "../ts/AudioPlayer";
import {computed, onMounted, ref} from "vue";
import {useStore} from "vuex";
import {launchVisualizer} from "../ts/Visualizer";
import Row from "./Row.vue";

const musicInfo = useStore()
function playAt(i: number, music: Music) {
  musicInfo.commit("setIndex", i)
  AudioPlayer.instance.src(music)
  AudioPlayer.instance.play()
  launchVisualizer(musicInfo)
}

const list = computed(() => musicInfo.state.musicList)

const activeIndex = computed(() => musicInfo.state.currentIndex)

const html = ref(null)

onMounted(() => {
  //@ts-ignore
  const div = html.value as HTMLDivElement
  let scrollTop = 0
  let viewHeight = div.offsetHeight

  function getScrollTop(html: HTMLElement): number {
    const offsetTop = html.offsetTop
    return offsetTop - scrollTop
  }

  function isInViewport(html: HTMLElement): boolean {
    return getScrollTop(html) > 0 && getScrollTop(html) < viewHeight
  }


})

</script>

<style scoped>
.list-item {
  display: flex;
  flex-direction: column;
  width: 100%;
  font-size: 14px;
  color: white;
  border-radius: 4px;
  user-select: none;
  cursor: pointer;
  padding: 8px;
}
.list-item:hover {
  background-color: #556963;
}
.select {
  background-color: #33cb98;
}
.playlist {
  height: 100%;
  width: 360px;
  display: flex;
  flex-direction: column;
  background-color: #2e3835;
  padding: 4px;
}
</style>