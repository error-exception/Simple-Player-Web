<template>
  <div class="artwork-box">
    <img :src="artwork" alt="artwork" style="position: absolute">
    <Row class="info-box">
      <div style="width: 16px; background-color: yellowgreen;"></div>
      <div style="width: 12px; background-color: yellowgreen; opacity: .7"></div>
      <Column style="flex-grow: 1; padding: 16px" bottom center-horizontal>
        <Row class="fill-width" :gap="16">
          <Row center style="color: yellow;" :gap="8">
            <span class="ma">{{ Icon.AccessTime }}</span>
            <span>{{ duration }}</span>
          </Row>
          <Row center style="color: yellow;" :gap="8">
            <span class="ma">{{ Icon.RadioButtonUnchecked }}</span>
            <span>{{ bpm }}</span>
          </Row>
          <Row center style="color: yellow;" :gap="8">
            <span class="ma">{{ Icon.RadioButtonUnchecked }}</span>
            <span>320kbps</span>
          </Row>
          <Row center style="color: yellow;" :gap="8">
            <span class="ma">{{ Icon.RadioButtonUnchecked }}</span>
            <span>44.1kHz</span>
          </Row>
        </Row>
      </Column>
    </Row>

  </div>
</template>

<script setup lang="ts">

import artwork from '../assets/1.png'
import Row from "./Row.vue";
import Column from "./Column.vue";
import {useStore} from "vuex";
import {AudioPlayer} from "../ts/AudioPlayer";
import {computed} from "vue";
import {timeString} from "../ts/Utils";
import {Icon} from "../ts/icon/Icon";

const store = useStore()

const player = AudioPlayer.instance;

const duration = computed(() => timeString(player.duration.value))

const bpm = computed(() => store.state.currentMusic.bpm)

</script>

<style scoped>
.artwork-box {
  width: 720px;
  height: 280px;
  position: absolute;
  border: 2px solid #ddffff;
  box-shadow: 0 0 16px #ddffff;
  overflow: hidden;
  border-radius: 4px;
  transform: skewX(-15deg) translateX(-48px);
}
.artwork-box > img {
  width: 100%;
  height: 100%;
  transform: skewX(15deg) translateX(40px);
  object-fit: cover;
}
.info-box {
  width: 100%;
  height: 100%;
  position: absolute;
  transform: skewX(15deg) translateX(44px)
}
</style>