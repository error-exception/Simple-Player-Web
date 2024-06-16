import {createMutableSharedFlow} from "../util/flow"
import {reactive} from "vue";

export let beatmapDirectoryId = "beatmap"

export const onEnterMenu = createMutableSharedFlow<boolean>()

export const onLeftSide = createMutableSharedFlow<boolean>()

export const onRightSide = createMutableSharedFlow<boolean>()

export const VueUI = reactive({
  settings: false,
  miniPlayer: false,
  notification: false,
  selectBeatmapDirectory: false
})

export const OSZConfig = reactive({
  /**
   * 是否默认自动加载视频，设置为 false 可以避免因视频加载问题而导致 osz 不能播放
   */
  loadVideo: false
})