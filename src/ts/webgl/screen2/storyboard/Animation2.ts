import type { OSBAnimation } from "../../../osu/OSUFile";
import type { OSZ } from "../../../osu/OSZ";
import AudioPlayer from "../../../player/AudioPlayer";
import { ImageFormat } from "../../graphic/core/Texture";
import { isUndef } from "../../graphic/core/Utils";
import { vector2 } from "../../graphic/matrix/vec2";
import { StorySprite } from "./Sprite2";
import type { LoopType } from "./StoryType";

export class StoryAnimation extends StorySprite {

  //@ts-ignore
  public frameCount: number
  //@ts-ignore
  public frameDelay: number
  //@ts-ignore
  public loopType: LoopType
  //@ts-ignore
  public frames: string[]
  //@ts-ignore
  public loopForever
  //@ts-ignore
  public loopedCount

  protected loadTexture(sprite: OSBAnimation, source: OSZ): void {
    this.frameDelay = sprite.frameDelay
    this.frameCount = sprite.frameCount
    this.loopType = sprite.loopType
    this.loopForever = sprite.loopType === "LoopForever"
    this.frames = []
    const path = sprite.filePath, dotIndex = path.lastIndexOf(".")
    const name = path.substring(0, dotIndex)
    const suffix = path.substring(dotIndex)
    // console.log(this.frameDelay, this.frameCount, this.loopType)

    // 只设置一次尺寸，使用第一帧的尺寸
    const firstFrameName = `${name}0${suffix}`
    const firstImage = source.getImageBitmap(firstFrameName)
    if (isUndef(firstImage)) {
      console.error("no image found for first frame")
      throw new Error("sprite texture cannot be undefined or null " + firstFrameName)
    }
    vector2.set(this._size, firstImage.width, firstImage.height)

    for (let i = 0; i < this.frameCount; i++) {
      const newName = `${name}${i}${suffix}`
      const image = source.getImageBitmap(newName)
      if (isUndef(image)) {
        console.error("no image found")
        throw new Error("sprite texture cannot be undefined or null " + newName)
      }
      const format =
        (newName.endsWith(".jpg") || newName.endsWith(".jpeg"))
          ? ImageFormat.JPEG
          : ImageFormat.PNG
      this.frames.push(newName)
      this.storyTextureStore.addIfAbsent(newName, image, format)
    }
  }
  private getFrameIndex(): number {
    const showTime = this.showTime, current = AudioPlayer.currentTime()
    const time = current - showTime
    if (time < 0) {
      return -1
    }
    const frameNum = Math.floor(time / this.frameDelay)
    this.loopedCount = Math.floor(frameNum / this.frameCount)
    if (!this.loopForever && this.loopedCount > 1) {
      return -1
    }
    return frameNum % this.frameCount
  }

  public update(): void {
    const current = AudioPlayer.currentTime()
    this.eventsGroup.update(current)

    this.adjustOrigin()
    const frameIndex = this.getFrameIndex()
    if (frameIndex < 0) {
      this.texture = null
      return;
    }
    const texture = this.storyTextureStore.getTexture(this.frames[frameIndex])
    if (texture) {
      this.texture = texture
    }
  }


  // public draw(canvas: Canvas): void {
  //   if (this.isNotPresent()) {
  //     return
  //   }
  //   canvas.save()
  //   const pivotX = this.width * this.finalOrigin[0], pivotY = this.height * this.finalOrigin[1]
  //   canvas.base(0, 0)
  //   canvas.pivot(pivotX, pivotY)

  //   const finalTranslateX = -pivotX + this.position[0] + this._translate[0]
  //   const finalTranslateY = -pivotY + this.position[1] + this._translate[1]
  //   canvas.translate(finalTranslateX, finalTranslateY)
  //   console.log(
  //     "Animation2 draw",
  //     "pivotX=", pivotX,
  //     "pivotY=", pivotY,
  //     "finalTranslateX=", finalTranslateX,
  //     "finalTranslateY=", finalTranslateY,
  //     "positionX=", this.position[0],
  //     "positionY=", this.position[1],
  //     "translateX=", this._translate[0],
  //     "translateY=", this._translate[1],
  //     "sizeX=", this.size[0],
  //     "sizeY=", this.size[1],
  //     "originX=", this.origin[0],
  //     "originY=", this.origin[1],
  //   )
  //   canvas.scale(this._scale[0] * (this.flipX ? -1 : 1), this._scale[1] * (this.flipY ? -1 : 1))

  //   canvas.rotate(this._rotate)

  //   canvas.setBlend(this.blend)
  //   canvas.setColor(this._color)
  //   canvas.setGlobalAlpha(this._alpha)

  //   if (this.texture instanceof Texture) {
  //     // canvas.drawTexture(this.texture, -this.position[0], -this.position[1], this.width, this.height)
  //     canvas.drawTexture(this.texture, 0, 0, this.width, this.height)
  //   } else if (this.texture instanceof TextureRegin) {
  //     // canvas.drawTextureAtlas(this.texture, -this.position[0], -this.position[1], this.width, this.height)
  //     canvas.drawTextureAtlas(this.texture, 0, 0, this.width, this.height)
  //   } else {
  //     // No support content to draw
  //     return
  //   }
  //   canvas.restore()
  // }

}
