<template>
    <Column class="fill-width">
        <Row class="top-bar fill-size">
            <button
                class="ma light-gray-click"
                style="width: 48px; height: 48px; color: white"
                @click="$emit('settingsClick')"
            >
                {{ Icon.Settings }}
            </button>
            <button
                class="ma light-gray-click"
                style="width: 48px; height: 48px; color: white"
                @click="switchScreen('main')"
            >
                {{ Icon.ScreenLockLandscape }}
            </button>
            <button
                class="ma light-gray-click"
                style="width: 48px; height: 48px; color: white"
                @click="switchScreen('second')"
            >
                {{ Icon.ScreenLockLandscape }}
            </button>
            <button
                class="ma light-gray-click"
                style="width: 48px; height: 48px; color: white"
                @click="switchScreen('mania')"
            >
                {{ Icon.ScreenLockLandscape }}
            </button>
            <!--        <button-->
            <!--            class="ma light-gray-click"-->
            <!--            style="width: 48px; height: 48px; color: white"-->
            <!--            @click="switchScreen('std')"-->
            <!--        >-->
            <!--            {{ Icon.ScreenLockLandscape }}-->
            <!--        </button>-->
            <Row style="flex-grow: 1" center>
                <span class="text-white">{{ stateText }}</span>
            </Row>
            <button
                class="ma light-gray-click"
                style="width: 48px; height: 48px; color: white"
                @click="openMiniPlayer()"
            >
                {{ Icon.MusicNote }}
            </button>
            <button
                class="ma light-gray-click"
                style="width: 48px; height: 48px; color: white"
                @click="$emit('beatmapListClick')"
            >
                {{ Icon.FolderOpen }}
            </button>
            <button
                class="ma light-gray-click"
                style="width: 48px; height: 48px; color: white"
                @click="$emit('hideUI')"
            >
                {{ Icon.Fullscreen }}
            </button>
            <button
                v-if="PLAYER"
                class="ma light-gray-click"
                style="width: 48px; height: 48px; color: white"
                @click="$emit('bpmCalcClick')"
            >
                {{ Icon.RadioButtonUnchecked }}
            </button>
            <button
                v-if="PLAYER"
                class="ma light-gray-click"
                style="width: 48px; height: 48px; color: white"
                @click="openPlaylist()"
            >
                {{ Icon.List }}
            </button>
        </Row>
        <div class="top-bar-shadow"></div>
    </Column>
</template>

<script setup lang="ts">
import { inject } from "vue";
import { Icon } from "../ts/icon/Icon";
import ScreenManager from "../ts/webgl/util/ScreenManager";
import Row from "./common/Row.vue";
import {PLAYER} from "../ts/build";
import Column from "./common/Column.vue";

defineProps<{
    stateText: string
}>()

defineEmits<{
    (e: 'settingsClick'): void
    (e: 'bpmCalcClick'): void
    (e: 'hideUI'): void
    (e: 'beatmapListClick'): void
}>()

const openPlaylist = inject<Function>("openList")!!

const openMiniPlayer = inject<Function>("openMiniPlayer")!!

function switchScreen(id: string) {
    ScreenManager.activeScreen(id)
}

</script>

<style scoped>
.top-bar {
    height: 48px;
    background-color: var(--top-bar-bg);
}
.top-bar-shadow {
    width: 100%;
    height: 160px;
    background-image: linear-gradient(black, transparent);
    transition: opacity 220ms linear;
    opacity: 0;
}
.top-bar:hover + .top-bar-shadow {
    opacity: 1;
}
</style>