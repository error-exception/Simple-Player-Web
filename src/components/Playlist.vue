<template>
    <div
        class="vertical-scroll no-scroller playlist"
        ref="html"
    >
      <Row
          v-for="(item, index) in list"
          :gap="8"
          @click="playAt(index, item)"
          :class="`list-item ${activeIndex === index ? 'select' : ''}`"
      >
        <span style="flex-grow: 1">{{item.title}}</span>
      </Row>
    </div>
</template>

<script setup lang="ts">
import {Music} from "../ts/type";
import {computed, onMounted, ref} from "vue";
import {useStore} from "vuex";
import {AudioPlayerV2} from "../ts/AudioPlayerV2";
import {Icon} from "../ts/icon/Icon";
import Row from "./Row.vue";

const musicInfo = useStore()
const player = AudioPlayerV2.instance

function playAt(i: number, music: Music) {
  musicInfo.commit("setIndex", i)
  player.src(music)
  player.play()
}

const list = computed(() => musicInfo.state.musicList)

const activeIndex = computed(() => musicInfo.state.currentIndex)

const html = ref<HTMLDivElement | null>(null)

onMounted(() => {
  const div = html.value
  if (!div) {
    return
  }
  let scrollTop = 0
  let viewHeight = div.offsetHeight
  const children = div.children
  let scrollY = 0
  for (let i = 0; i < Math.max(activeIndex.value - 3, 0); i++) {
    scrollY += children[i].clientHeight
  }
  div.scrollTo(0, scrollY)

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
.list-item > span:nth-child(1) {
  overflow: hidden;
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