import {Interpolation} from "../webgl/util/Interpolation";
import type {Nullable} from "../type";

const MAX_CACHE_SIZE = 6
class LocalBackgroundLoader {

  private backgroundFiles: File[] = []
  private recycleQueue: ImageBitmap[] = []
  private isInit = false
  public async init(): Promise<boolean> {
    if (this.isInit) {
      return true
    }
    try {
      //@ts-ignore
      const handle = await window.showDirectoryPicker()
      this.backgroundFiles.length = 0
      for await (const entry of handle.values()) {
        if (entry.kind === 'file' && this.isAccept(entry.name)) {
          const file = await entry.getFile()
          this.backgroundFiles.push(file)
        }
      }
      if (this.backgroundFiles.length === 0) {
        return false
      }
      const index = ~~Interpolation.valueAt(Math.random(), 0, this.backgroundFiles.length - 1)
      this.currentBackgroundFile = this.backgroundFiles[index]
      this.currentBackgroundImage =
        await createImageBitmap(this.backgroundFiles[index])
      this.isInit = true
      return true
    } catch (_) {
      return false
    }
  }

  public async forceInit() {
    this.isInit = false
    await this.init()
  }

  private currentBackgroundFile: Nullable<File> = null
  private currentBackgroundImage: Nullable<ImageBitmap> = null
  public getBackground(): ImageBitmap {
    let index = ~~Interpolation.valueAt(Math.random(), 0, this.backgroundFiles.length - 1)
    if (this.currentBackgroundFile === this.backgroundFiles[index]) {
      index = (index + 1) % this.backgroundFiles.length
    }
    const image = this.currentBackgroundImage!
    this.recycleQueue.push(image)
    this.recycleImageIfNeed()
    createImageBitmap(this.backgroundFiles[index])
      .then((image) => {
        this.currentBackgroundImage = image
      })
    return image
  }

  private formats = ['jpg', 'jpeg', 'png']
  private isAccept(name: string) {
    const dotIndex = name.indexOf('.')
    if (dotIndex < 0) {
      return false
    }
    const extension = name.substring(dotIndex + 1).toLowerCase()
    return this.formats.includes(extension)
  }

  private recycleImageIfNeed() {
    if (this.recycleQueue.length > MAX_CACHE_SIZE) {
      const image = this.recycleQueue.shift()
      image?.close()
    }
  }
}

export default new LocalBackgroundLoader()