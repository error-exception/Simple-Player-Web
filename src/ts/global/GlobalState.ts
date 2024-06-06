import { OSZ } from "../osu/OSZ"
import { createMutableSharedFlow } from "../util/flow"
import {reactive, ref} from "vue";

interface GlobalState {
    beatmapFileList: File[]
}

export const GlobalState: GlobalState = {
    beatmapFileList: []
}

export let beatmapDirectoryId = "beatmap"

export let playingBeatmap: OSZ

export const onEnterMenu = createMutableSharedFlow<boolean>()

export const onLeftSide = createMutableSharedFlow<boolean>()

export const onRightSide = createMutableSharedFlow<boolean>()

export type int = number
export type float = number

export const VueUI = reactive({
    settings: false,
    miniPlayer: false,
    notification: false,
    selectBeatmapDirectory: false
})