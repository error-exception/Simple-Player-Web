import { OSZ } from "./OSZ"
import { createMutableSharedFlow } from "./util/flow"

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