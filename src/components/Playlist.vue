<template>
    <div
        class="vertical-scroll no-scroller playlist"
        ref="html"
    >
      <Row
          v-for="(item, index) in list"
          :gap="8"
          @click="playAt(index)"
          :class="`list-item ${activeIndex === index ? 'select' : ''}`"
      >
        <span style="flex-grow: 1">{{item.metadata.title}}</span>
      </Row>
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref, shallowRef} from "vue";
import PlayManager from "../ts/player/PlayManager";
import {useCollect, useStateFlow} from '../ts/util/use';
import Row from "./common/Row.vue";
import {Bullet} from "../ts/type";

function playAt(i: number) {
  PlayManager.playAt(i)
}

const list = shallowRef<Bullet[]>([])

useCollect(PlayManager.getMusicList(), res => {
    list.value = res
})

const activeIndex = useStateFlow(PlayManager.currentIndex)

const html = ref<HTMLDivElement | null>(null)

onMounted(() => {
  const div = html.value
  if (!div) {
    return
  }
  // let scrollTop = 0
  // let viewHeight = div.offsetHeight
  const children = div.children
  let scrollY = 0
  for (let i = 0; i < Math.max(activeIndex.value - 3, 0); i++) {
    scrollY += children[i].clientHeight
  }
  div.scrollTo(0, scrollY)

  // function getScrollTop(html: HTMLElement): number {
  //   const offsetTop = html.offsetTop
  //   return offsetTop - scrollTop
  // }

  // function isInViewport(html: HTMLElement): boolean {
  //   return getScrollTop(html) > 0 && getScrollTop(html) < viewHeight
  // }


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