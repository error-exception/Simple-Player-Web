<template>
  <div style="height: 56px">
    <Row class="fill-size" center-vertical :gap="16">
      <ProgressBar/>
      <Row class="fill-height" center-vertical>
        <button class="ma btn light-gray-click" @click="prevSong()">{{Icon.SkipPrevious}}</button>
        <button
            class="ma btn light-gray-click"
            @click="play()"
        >
          {{player.isPlaying.value ? Icon.Pause : Icon.PlayArrow}}
        </button>
        <button class="ma btn light-gray-click" @click="nextSong()">{{Icon.SkipNext}}</button>
      </Row>

      <Column center-vertical :gap="4" class="music-info">
        <span style="font-size: 14px; font-weight: bold">{{title}}</span>
        <span
            style="font-size: 12px"
        >
        {{artist}}
      </span>
      </Column>
    </Row>
  </div>
</template>

<script setup lang="ts">
import Row from "./Row.vue";
import {Icon} from "../ts/icon/Icon";
import {AudioPlayer} from "../ts/AudioPlayer";
import Column from "./Column.vue";
import {computed, reactive, ref} from "vue";
import {useStore} from "vuex";
import ProgressBar from "./ProgressBar.vue";
import {launchVisualizer} from "../ts/Visualizer";
import {useKeyboard} from "../ts/Utils";
import {AudioPlayerV2} from "../ts/AudioPlayerV2";

const player = AudioPlayerV2.instance

const musicInfo = useStore()

const title = computed(() => musicInfo.state.currentMusic.title)

const artist = computed(() => {
  const artist = musicInfo.state.currentMusic.artist
  return (!artist || artist.length === 0) ? '未知艺术家' : artist
})

function play() {
  if (player.isPlaying.value) {
    player.pause()
  } else {
    player.play()
  }
  launchVisualizer(musicInfo)
}

function nextSong() {
  const songCount = musicInfo.state.musicList.length;
  let newIndex = musicInfo.state.currentIndex + 1
  if (newIndex >= songCount) {
    newIndex = 0
  }
  musicInfo.commit("setIndex", newIndex)
  const music = musicInfo.state.currentMusic;
  player.src(music)
  player.play()
  launchVisualizer(musicInfo)
}

function prevSong() {
  const songCount = musicInfo.state.musicList.length;
  let newIndex = musicInfo.state.currentIndex - 1
  if (newIndex < 0) {
    newIndex = songCount - 1
  }
  musicInfo.commit("setIndex", newIndex)
  const music = musicInfo.state.currentMusic;
  player.src(music)
  player.play()
  launchVisualizer(musicInfo)
}

player.onEnded = () => {
  nextSong()
}

useKeyboard("up", (evt) => {
  if (evt.code === 'ArrowRight') {
    nextSong()
  } else if (evt.code === 'ArrowLeft') {
    prevSong()
  } else if (evt.code === 'Space') {
    play()
  }
})

</script>

<style scoped>
.music-info {
  width: 180px;
  overflow-x: hidden;
  color: white;
}
.music-info > span {
  text-overflow: ellipsis;
  white-space: nowrap;
}
.btn {
  padding: 8px;
  color: white;
}
</style>