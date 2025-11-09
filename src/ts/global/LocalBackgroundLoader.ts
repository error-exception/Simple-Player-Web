import {Interpolation} from "../webgl/util/Interpolation";
import type {Nullable} from "../type";
import {clamp, int} from "../Utils";

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
      // this.currentBackgroundFile = this.backgroundFiles[index]
      this.currentBackgroundImage =
        await createImageBitmap(this.backgroundFiles[index])
      this.backgroundSequence.length = 0
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

  // private currentBackgroundFile: Nullable<File> = null
  private currentBackgroundImage: Nullable<ImageBitmap> = null
  private backgroundSequence: number[] = []
  public getBackground(): ImageBitmap {
    let randomSequence = this.backgroundSequence
    if (!randomSequence.length) {
      randomSequence = this.randomSequence(this.backgroundFiles.length)
      this.backgroundSequence = randomSequence
    }
    const index = randomSequence.shift()!
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

  private randomSequence(count: number) {
    const result = [];
    const mark = new Array(count).fill(true);
    for (let k = 0; k < mark.length; k++) {
      const rand = clamp(
        int(Interpolation.valueAt(Math.random(), 0, count - 1)),
        0, count - 1
      );
      if (mark[rand]) {
        result.push(rand);
        mark[rand] = false;
      } else {
        for (
          let i = rand, j = 0;
          j < mark.length;
          i = (i + 1) % count, j++
        ) {
          if (mark[i]) {
            result.push(i);
            mark[i] = false;
            break;
          }
        }
      }
    }
    return result;
  }
}

export default new LocalBackgroundLoader()