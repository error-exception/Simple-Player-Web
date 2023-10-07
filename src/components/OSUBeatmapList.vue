<template>
    <!-- <Row class="fill-size" style="pointer-events: none;" center> -->
    <AlertDialog class="osu-beatmap-list-box">
        <template #title>
            <Row class="w-full h-12 px-4" center-vertical>
                <button @click="show()" class="text-white p-4 ml-auto">访问文件系统</button>
                <span class="text-white" @click="$emit('close')">Close</span>
            </Row>
        </template>
        <Column class="fill-width flex-grow osu-beatmap-list-content no-scroller">
            <Row class="fill-width osu-beatmap-list-content-item" v-for="(item, index) in files" @click="loadOSZ(item)" center-vertical :gap="32">
                <span style="color: #ffffff80;">{{ index + 1 }}</span>
                <Column class="fill-width" :gap="8">
                    <span class="text-white text-[16px]">{{ item.name }}</span>
                    <span style="color: #ffffff80; font-size: 14px;">{{ (item.size / 1024 / 1024).toFixed(2) }} MB</span>
                </Column>
            </Row>
        </Column>
    </AlertDialog>
<!--        <Column class="osu-beatmap-list-box">-->
<!--            <Row style="height: 48px; padding: 0 16px;" center-vertical>-->
<!--                <button @click="show()" style="color: white; padding: 16px; margin-left: auto; ">访问文件系统</button>-->
<!--                <span style="color: white;" @click="$emit('close')">Close</span>-->
<!--            </Row>-->
<!--            <Column class="fill-width flex-grow osu-beatmap-list-content no-scroller">-->
<!--                <Row class="fill-width osu-beatmap-list-content-item" v-for="(item, index) in files" @click="loadOSZ(item)" center-vertical :gap="32">-->
<!--                    <span style="color: #ffffff80;">{{ index + 1 }}</span>-->
<!--                    <Column class="fill-width" :gap="8">-->
<!--                        <span style="color: white; font-size: 16px;">{{ item.name }}</span>-->
<!--                        <span style="color: #ffffff80; font-size: 14px;">{{ (item.size / 1024 / 1024).toFixed(2) }} MB</span>-->
<!--                    </Column>-->
<!--                </Row>-->
<!--            </Column>-->
<!--        </Column>-->
    <!-- </Row> -->
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { GlobalState, beatmapDirectoryId } from '../ts/global/GlobalState';
import { loadOSZ } from '../ts/osu/OSZ';
import Column from './common/Column.vue';
import Row from './common/Row.vue';
import AlertDialog from "./framework/AlertDialog.vue";

const files = ref<File[]>()

defineEmits<{
    (e: 'close'): void
}>()
show()
async function show() {
    if (GlobalState.beatmapFileList.length) {
        console.log(GlobalState.beatmapFileList);
        
        files.value = GlobalState.beatmapFileList
    } else {
        showBeatmapList()
    }
}

async function showBeatmapList() {
    //@ts-ignore
    const handle = await window.showDirectoryPicker({ id: beatmapDirectoryId })
    const list: File[] = []
    for await (const fileHandle of handle.values()) {
        const file = await fileHandle.getFile() as File
        list.push(file)
    }
    GlobalState.beatmapFileList = list.sort((a, b) => {
        return b.lastModified - a.lastModified
    })
    files.value = GlobalState.beatmapFileList
}

</script>
<style scope>
.osu-beatmap-list-box {
    background-color: #2e3835;
    border-radius: 8px;
    width: 1200px;
    pointer-events: auto;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
}
.osu-beatmap-list-content {
    max-height: 80vh;
    overflow-y: scroll;
    padding: 8px;
}
.osu-beatmap-list-content-item {
    padding: 8px 24px;
    border-radius: 4px;
}
.osu-beatmap-list-content-item:hover {
    background-color: #556963;
}
.osu-beatmap-list-content-item:active {
    background-color: #647c75;

}
</style>