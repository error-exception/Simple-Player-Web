import {ref, watch} from "vue";
import AudioPlayer from "./AudioPlayer";
import {loadOSZ} from "../osu/OSZ";

class TempOSUPlayManager {

  public readonly list = ref<File[]>([])
  public readonly currentIndex = ref(0)

  constructor() {
    watch(this.list, list => {
      if (list.length) {
        AudioPlayer.onEnd.collect(() => {
          this.next()
        })
      }
    })
  }

  public playAt(index: number, preview = true) {
    loadOSZ(this.list.value[index], preview)
  }

  public next() {
    let list = this.list.value, currentIndex = this.currentIndex.value;
    currentIndex = (currentIndex + 1) % list.length
    this.currentIndex.value = currentIndex
    this.playAt(currentIndex, false)
  }

  public prev() {
    let list = this.list.value, currentIndex = this.currentIndex.value;
    currentIndex--
    this.currentIndex.value = currentIndex < 0 ? list.length - 1 : currentIndex
    this.playAt(this.currentIndex.value, false)
  }

}

export default new TempOSUPlayManager()