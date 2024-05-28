import {ref} from "vue";
import BackgroundLoader from "./BackgroundLoader";
import LocalBackgroundLoader from "./LocalBackgroundLoader";

class BackgroundManager {

  public readonly Default = 0
  public readonly Beatmap = 1
  public readonly Custom = 2

  public currentLoader = ref(-1)
  public customBackgroundChange = ref(0)
  public async changeLoader(loader: number) {
    const currentLoader = this.currentLoader.value
    let success = true
    if (currentLoader === loader) {
      return success
    }
    if (loader === this.Default) {
      await BackgroundLoader.init()
      success = true
    } else if (loader === this.Custom) {
      success = await LocalBackgroundLoader.init()
    }
    if (!success) {
      return false
    }
    this.currentLoader.value = loader
    return success
  }

  public getBackground(): ImageBitmap {
    const loader = this.currentLoader.value
    if (loader === this.Default) {
      return BackgroundLoader.getBackground()
    } else if (loader === this.Custom) {
      return LocalBackgroundLoader.getBackground()
    } else {
      throw new Error("No loader found")
    }
  }

  public changeCustomBackground() {
    const loader = this.currentLoader.value
    if (loader === this.Custom) {
      this.customBackgroundChange.value = (this.customBackgroundChange.value + 1) % 5
    }
  }
}

export default new BackgroundManager()