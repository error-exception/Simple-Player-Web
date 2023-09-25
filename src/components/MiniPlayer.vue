<template>
    <div class="mini-player-box">
        <div style="position: relative" class="fill-size">
            <img ref="img" :src="artwork" alt="" width="500" height="240" style="position: absolute">
            <Column class="fill-size" style="position: absolute; background-color: #00000040">
                <Column class="fill-width flex-grow" center :gap="8">
                    <span class="player-title">{{ title }}</span>
                    <span class="player-artist">{{ artist }}</span>
                </Column>
                <Row class="fill-width" style="background-color: #00000080; height: 64px;" center>
                    <button class="control-btn ma" @click="previous()">{{ Icon.SkipPrevious }}</button>
                    <button class="control-btn ma" @click="play()">{{ playState ? Icon.Pause : Icon.PlayArrow }}</button>
                    <button class="control-btn ma" @click="stop()">{{ Icon.Stop }}</button>
                    <button class="control-btn ma" @click="next()">{{ Icon.SkipNext }}</button>
                </Row>
            </Column>
            <ProgressBar style="width: 100%; position: absolute; bottom: 0;" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { Icon } from "../ts/icon/Icon";
import AudioPlayer from "../ts/player/AudioPlayer";
import OSUPlayer from "../ts/player/OSUPlayer";
import PlayManager from "../ts/player/PlayManager";
import { useCollect, useStateFlow } from "../ts/util/use";
import Column from "./Column.vue";
import ProgressBar from "./ProgressBar.vue";
import Row from "./Row.vue";
import { url } from "../ts/Utils";

const artwork = ref("")
const img = ref<HTMLImageElement | null>(null)

const title = useStateFlow(OSUPlayer.title)
const artist = useStateFlow(OSUPlayer.artist)

const playState = useStateFlow(AudioPlayer.playStateFlow)

useCollect(OSUPlayer.onChanged, bullet => {
    if (bullet.general.from === 'default') {
        artwork.value = url("/artwork?id=" + bullet.metadata.id)
    }

})

// const image = shallowRef<Blob>()
//
// const collector = (bg: OSUBackground) => {
//     if (bg.imageBlob) image.value = bg.imageBlob
// }

onMounted(() => {
    // OSUPlayer.background.collect(collector)
    console.log(OSUPlayer.background.value.imageBlob);
    if (img.value && OSUPlayer.background.value.imageBlob) {
        img.value.src = URL.createObjectURL(OSUPlayer.background.value.imageBlob)
    }
})

onUnmounted(() => {
    // OSUPlayer.background.removeCollect(collector)
})

const next = () => PlayManager.next()

const previous = () => PlayManager.previous()

const stop = () => {
    OSUPlayer.seek(0)
    OSUPlayer.pause()
}

const play = () => {
    if (OSUPlayer.isPlaying()) {
        OSUPlayer.pause()
    } else {
        OSUPlayer.play()
    }
}

</script>

<style scoped>
.mini-player-box {
    width: 500px;
    height: 200px;
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