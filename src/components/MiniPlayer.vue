
<script setup lang="ts">
import {ref, shallowRef, watch} from "vue";
import {Icon} from "../ts/icon/Icon";
import AudioPlayer from "../ts/player/AudioPlayer";
import OSUPlayer, {OSUBackground} from "../ts/player/OSUPlayer";
import PlayManager from "../ts/player/PlayManager";
import Column from "./common/Column.vue";
import ProgressBar from "./ProgressBar.vue";
import Row from "./common/Row.vue";
import {PLAYER} from "../ts/build";
import TempOSUPlayManager from "../ts/player/TempOSUPlayManager";
import {PlayerState} from "../ts/player/PlayerState";
import {collectLatest} from "../ts/util/eventRef";
import {Nullable} from "../ts/type";

const img = ref<HTMLImageElement | null>(null)

const title = OSUPlayer.title
const artist = OSUPlayer.artist

const playState = AudioPlayer.playState

// useCollect(OSUPlayer.onChanged, bullet => {
//   if (bullet.general.from === 'default') {
//     image.value = url("/artwork?id=" + bullet.metadata.id)
//   }
// })

const image = shallowRef<string>()

collectLatest(OSUPlayer.background, (bg: OSUBackground) => {
  if (image.value) {
    URL.revokeObjectURL(image.value)
  }
  if (bg.imageBlob) {
    image.value = URL.createObjectURL(bg.imageBlob)
  }
})

const next = () => {
  if (PLAYER)
    PlayManager.next()
  else
    TempOSUPlayManager.next()
}

const previous = () => {
  if (PLAYER)
    PlayManager.previous()
  else
    TempOSUPlayManager.prev()
}

const stop = () => {
  OSUPlayer.stop()
}

const play = () => {
  if (OSUPlayer.isPlaying()) {
    OSUPlayer.pause()
  } else {
    OSUPlayer.play()
  }
}

const list = ref(false)
const playlist = TempOSUPlayManager.list
function playAt(i: number) {
  TempOSUPlayManager.playAt(i, false)
}

const listContainer = ref<Nullable<HTMLDivElement>>(null)
const playIndex = TempOSUPlayManager.currentIndex
watch(listContainer, () => {
  if (!listContainer.value) {
    return
  }
  const container = listContainer.value
  const children = container.children
  const targetIndex = Math.max(
    TempOSUPlayManager.currentIndex.value - 3, 0
  )
  let scrollY = 0
  for (let i = 0; i < targetIndex; i++) {
    scrollY += children[i].clientHeight
  }
  container.scrollTo(0, scrollY)
})

</script>
<template>
  <Column class="w-fit mini-player gap-y-2">
    <div style="position: relative" class="mini-player-box">
      <img ref="img" :src="image" alt="" width="500" height="240" style="position: absolute">
      <Column class="fill-size" style="position: absolute; background-color: #00000040">
        <Column class="fill-width flex-grow" center :gap="8">
          <span class="player-title">{{ title }}</span>
          <span class="player-artist">{{ artist }}</span>
        </Column>
        <Row class="fill-width" style="background-color: #00000080; height: 56px;" center :gap="8">
          <button v-osu-button class="control-btn ma" @click="previous()">{{ Icon.SkipPrevious }}</button>
          <button v-osu-button class="control-btn ma" @click="play()">{{ playState === PlayerState.STATE_PLAYING ? Icon.Pause : Icon.PlayArrow }}</button>
          <button v-osu-button class="control-btn ma" @click="stop()">{{ Icon.Stop }}</button>
          <button v-osu-button class="control-btn ma" @click="next()">{{ Icon.SkipNext }}</button>
          <button v-osu-button class="control-btn ma" @click="list = !list">{{ Icon.List }}</button>
        </Row>
      </Column>
      <ProgressBar style="width: 100%; position: absolute; bottom: 0;"/>
    </div>
    <Transition name="mini-list">
      <div
        class="flex flex-col rounded-md bg-[--bpm-color-3] origin-top w-[420px] overflow-y-scroll no-scroller p-1"
        v-if="list"
        style="height: calc(100vh - var(--top-bar-height) - 16px - 160px)"
        ref="listContainer"
      >
      <span
        v-osu-button
        v-for="(item, i) in playlist"
        class="rounded-md text-white w-full hover:bg-[--bpm-color-4] p-2 text-sm"
        :class="{
          'bg-[--bpm-color-11]': playIndex === i,
          'bg-transparent': playIndex !== i
        }"
        @click="playAt(i)"
      >{{item.name}}</span>
      </div>
    </Transition>
  </Column>
</template>


<style scoped>
.mini-player {
  --bpm-color-1:  #171c1a;
  --bpm-color-2:  #222a27;
  --bpm-color-3:  #2e3835;
  --bpm-color-4:  #394642;
  --bpm-color-5:  #45544f;
  --bpm-color-6:  #5c7069;
  --bpm-color-7:  #ffd966;
  --bpm-color-8:  #fff27f;
  --bpm-color-9:  #66ffcc;
  --bpm-color-10: #af00af;
  --bpm-color-11: #38e7ab;
}
.mini-player-box {
  width: 420px;
  height: 160px;
  overflow: hidden;
  border-radius: 8px;
  background-color: black;
}

img {
  object-fit: cover;
}

.player-title {
  width: 100%;
  color: white;
  text-align: center;
  font-size: 18px;
}

.player-artist {
  width: 100%;
  color: white;
  font-size: 14px;
  text-align: center;
}

.control-btn {
  width: 36px;
  height: 36px;
  font-size: 36px;
  color: white;
  border-radius: 8px;
  transition: all 220ms ease-in-out;
}

.control-btn:hover {
  background-color: #FFD70080;
}

.control-btn:active {
  transform: scale(.96);
  background-color: #FFD700FF;
}
.mini-list-leave-active, .mini-list-enter-active {
  transition: all 220ms ease-out;
}
.mini-list-leave-from, .mini-enter-to {
  transform: scaleY(1);
  opacity: 1;
}
.mini-list-leave-to, .mini-list-enter-from {
  transform: scaleY(0);
  opacity: 0;
}
</style>