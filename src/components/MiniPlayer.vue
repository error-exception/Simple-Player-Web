
<script setup lang="ts">
import {ref, shallowRef, watch} from "vue";
import {Icon} from "../ts/icon/Icon";
import AudioPlayer from "../ts/player/AudioPlayer";
import OSUPlayer, {OSUBackground} from "../ts/player/OSUPlayer";
import Column from "./common/Column.vue";
import ProgressBar from "./ProgressBar.vue";
import TempOSUPlayManager from "../ts/player/TempOSUPlayManager";
import {PlayerState} from "../ts/player/PlayerState";
import {collectLatest} from "../ts/util/eventRef";
import {Nullable} from "../ts/type";
import BasicButton from "./common/BasicButton.vue";
import {Color} from "../ts/webgl/base/Color";
import Row from "./common/Row.vue";

const img = ref<HTMLImageElement | null>(null)

const title = OSUPlayer.title
const artist = OSUPlayer.artist

const playState = AudioPlayer.playState

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
  TempOSUPlayManager.next()
}

const previous = () => {
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
    <Column class="mini-player-box relative">
      <div class="player-controls">
        <div class="w-1/5"></div>
        <Row class="w-3/5" center :gap="8">
          <BasicButton
              :color="Color.fromHex(0x302e38)"
              class="ma text-white rounded-md"
              :apply-scale="false"
              style="font-size: 36px"
              @click="previous()"
              v-osu-button
          >
            {{ Icon.SkipPrevious }}
          </BasicButton>
          <BasicButton
              :color="Color.fromHex(0x302e38)"
              class="ma text-white rounded-md"
              :apply-scale="false"
              style="font-size: 36px"
              @click="play()"
              v-osu-button
          >
            {{ playState === PlayerState.STATE_PLAYING ? Icon.Pause : Icon.PlayArrow }}
          </BasicButton>
          <BasicButton
              :color="Color.fromHex(0x302e38)"
              class="ma text-white rounded-md"
              :apply-scale="false"
              style="font-size: 36px"
              @click="stop()"
              v-osu-button
          >
            {{ Icon.Stop }}
          </BasicButton>
          <BasicButton
              :color="Color.fromHex(0x302e38)"
              class="ma text-white rounded-md"
              :apply-scale="false"
              style="font-size: 36px"
              @click="next()"
              v-osu-button
          >
            {{ Icon.SkipNext }}
          </BasicButton>
        </Row>
        <Row class="w-1/5" center>
          <BasicButton
              :color="Color.fromHex(0x302e38)"
              class="ma text-white rounded-md"
              :apply-scale="false"
              style="font-size: 36px"
              @click="list = !list"
              v-osu-button
          >
            {{ Icon.List }}
          </BasicButton>
        </Row>
      </div>
      <div class="player-info">
        <img
            ref="img"
            :src="image"
            alt=""
            class="object-cover w-full h-full absolute song-cover"
        >
        <Column class="w-full h-full flex-grow absolute bg-black bg-opacity-10" center :gap="8">
          <span>{{ title }}</span>
          <span>{{ artist }}</span>
        </Column>
      </div>
      <ProgressBar style="width: 100%; " class="absolute bottom-0 progress-bar"/>
    </Column>
    <Transition name="mini-list">
      <Column
        class="mini-playlist no-scroller"
        v-if="list"
        style="height: calc(100vh - var(--top-bar-height) - 16px - 160px)"
      >
        <div ref="listContainer">
          <span
              v-osu-default
              v-for="(item, i) in playlist"
              class="rounded-md w-full hover:text-yellow-500 p-2 text-sm cursor-pointer"
              :class="{
          'text-yellow-500': playIndex === i,
          'text-white': playIndex !== i
        }"
              @click="playAt(i)"
          >{{item.name}}</span>
        </div>
      </Column>
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
  height: 10rem;
  overflow: hidden;
  border-radius: 0.5rem;
  background-color: #302e38;
}
.mini-player-box > .player-info {
  transition: height 400ms var(--ease-out-quint);
}
.song-cover {
  transform: scale(1.04);
  transition: transform 400ms var(--ease-out-quint);
}
.progress-bar {
  transform: scaleY(.3);
  transform-origin: bottom;
  transition: transform 400ms var(--ease-out-quint);
}
.mini-player-box:hover > .player-info {
  height: calc(10rem - 8px/* progress bar height */ - 3rem);
}
.mini-player-box:hover > .player-controls {
  transform: translateY(0);
}
.mini-player-box:hover .song-cover {
  transform: scale(1);
}
.mini-player-box:hover .progress-bar {
  transform: scaleY(1);
}
.player-controls {
  @apply w-full flex justify-center items-center absolute bottom-1.5 h-12;
  transition: transform 400ms var(--ease-out-quint);
  transform: translateY(16px);
}
.player-info {
  @apply w-full h-full absolute rounded-lg overflow-hidden flex
    flex-col text-white justify-center items-center text-center
  ;
}
.player-info > span:first-child {
  text-align: center;
  font-size: 18px;
}
.player-info > span:last-child {
  font-size: 14px;
  text-align: center;
}
.mini-playlist > div {
  @apply w-full h-fit flex flex-col;
}
.mini-playlist {
  @apply rounded-md p-1 grid;
  background-color: #302e38;
  transform-origin: top;
  width: 420px;
  overflow-y: scroll;
}
.mini-list-leave-active, .mini-list-enter-active {
  transition: all 400ms var(--ease-out-quint);
}
.mini-list-leave-from, .mini-enter-to {
  opacity: 1;
  grid-template-rows: 1fr;
}
.mini-list-leave-to, .mini-list-enter-from {
  opacity: 0;
  grid-template-rows: 0;
}
</style>