
<script setup lang="ts">
import {onMounted, onUnmounted, ref, shallowRef} from "vue";
import {Icon} from "../ts/icon/Icon";
import AudioPlayer from "../ts/player/AudioPlayer";
import OSUPlayer, {OSUBackground} from "../ts/player/OSUPlayer";
import PlayManager from "../ts/player/PlayManager";
import {useCollect, useStateFlow} from "../ts/util/use";
import Column from "./common/Column.vue";
import ProgressBar from "./ProgressBar.vue";
import Row from "./common/Row.vue";
import {url} from "../ts/Utils";
import {PLAYER} from "../ts/build";
import TempOSUPlayManager from "../ts/player/TempOSUPlayManager";
import {PlayerState} from "../ts/player/PlayerState";
import {collect, collectLatest} from "../ts/util/eventRef";

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
      <Column
        class="rounded-md bg-[--bpm-color-3] origin-top w-[420px] overflow-y-scroll no-scroller"
        v-if="list"
        style="height: calc(100vh - var(--top-bar-height) - 16px - 160px)"
      >
      <span
        v-osu-button
        v-for="(item, i) in playlist"
        class="text-white w-full hover:bg-[--bpm-color-4] p-2 text-sm"
        @click="playAt(i)"
      >{{item.name}}</span>
      </Column>
    </Transition>
  </Column>
</template>


<style scoped>
.mini-player {
  --bpm-color-3:  #2e3835;
  --bpm-color-4:  #394642;
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
}
.mini-list-leave-to, .mini-list-enter-from {
  transform: scaleY(0);
}
</style>