<template>
  <div class="mini-player-box">
    <div style="position: relative" class="fill-size">
      <img :src="artwork" alt="" width="500" height="240" style="position: absolute">
      <Column class="fill-size" style="position: absolute; bottom: 4px">
        <Column class="fill-width flex-grow" center :gap="8">
          <span class="player-title">{{ title }}</span>
          <span class="player-artist">{{ artist }}</span>
        </Column>
        <Row
            class="fill-width"
            style="background-color: #00000080; height: 64px;"
            center
        >
          <button class="control-btn ma" @click="prevSong()">{{ Icon.SkipPrevious }}</button>
          <button class="control-btn ma" @click="play()">{{ isPlaying ? Icon.Pause : Icon.PlayArrow }}</button>
          <button class="control-btn ma" @click="nextSong()">{{ Icon.SkipNext }}</button>
        </Row>
      </Column>
      <div style="height: 8px; background-color: yellow; position: absolute; bottom: 0" class="fill-width"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import testArtwork from '../assets/1.png'
import Column from "./Column.vue";
import Row from "./Row.vue";
import {computed, inject, onMounted, ref} from "vue";
import {useStore} from "vuex";
import {Icon} from "../ts/icon/Icon";
import {AudioPlayerV2} from "../ts/AudioPlayerV2";
import {useEvent} from "../ts/EventBus";

const store = useStore()

const player = AudioPlayerV2.instance

const artwork = ref(testArtwork)

const title = computed(() => store.state.currentMusic.title)
const artist = computed(() => store.state.currentMusic.artist)

const isPlaying = player.isPlaying

const { nextSong, play, prevSong } = inject<{
  nextSong: () => void,
  play: () => void,
  prevSong: () => void
}>("playerControl")!!

useEvent({
  onSongChanged(id: number) {
    artwork.value = "/api/artwork?id=" + id
  }
})

onMounted(() => {
  const music = player.currentMusic
  if (music) {
    const id = music.id
    artwork.value = "/api/artwork?id=" + id
  }
})

</script>

<style scoped>
.mini-player-box {
  width: 500px;
  height: 240px;
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
  font-size: 20px;
}
.player-artist {
  width: 100%;
  color: white;
  font-size: 16px;
  text-align: center;
}
.control-btn {
  width: 48px;
  height: 48px;
  font-size: 36px;
  color: white;
  border-radius: 8px;
  transition: all 100ms ease-in-out;
}
.control-btn:hover {
  background-color: gold;
}
.control-btn:active {
  transform: scale(.96);
}
</style>