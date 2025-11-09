import {LoopType} from "./StoryType";
import {OSBAnimation} from "../../../osu/OSUFile";
import {OSZ} from "../../../osu/OSZ";
import {isUndef} from "../../graphic/core/Utils";
import StoryTextureManager from "./StoryTextureManager";
import AudioPlayer from "../../../player/AudioPlayer";
import {ImageFormat} from "../../graphic/core/Texture";
import {type WebGLRenderer} from "../../WebGLRenderer";
import {SpriteV2} from "./SpriteV2";
import {type SpriteDrawNode} from "./SpriteDrawNode";
import type {DefaultShaderWrapper} from "../../graphic/shader/DefaultShaderWrapper";

/**
 * 可能是故事版中的帧动画
 */
export class Animation extends SpriteV2 {

  // @ts-ignore
  public frameCount: number
  // @ts-ignore
  public frameDelay: number
  // @ts-ignore
  public loopType: LoopType
  // @ts-ignore
  private frames: string[]
  // @ts-ignore
  private loopForever
  // @ts-ignore
  private loopedCount

  protected loadTexture(sprite: OSBAnimation, source: OSZ) {
    this.frameDelay = sprite.frameDelay
    this.frameCount = sprite.frameCount
    this.loopType = sprite.loopType
    this.loopForever = sprite.loopType === "LoopForever"
    this.frames = []
    const path = sprite.filePath, dotIndex = path.lastIndexOf(".")
    const name = path.substring(0, dotIndex)
    const suffix = path.substring(dotIndex)
    // console.log(this.frameDelay, this.frameCount, this.loopType)
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
      this.setWidth(image.width)
      this.setHeight(image.height)
      StoryTextureManager.addIf(this.gl, newName, image, format)
    }
  }

  private getFrameIndex(): number {
    const showTime = this.showTime, current = AudioPlayer.currentTime()
    const time = current - showTime
    if (time < 0) {
      return -1
    }
    const frameNum = Math.floor(time / this.frameDelay)
    // console.log("Animation Frame Num", frameNum)
    this.loopedCount = Math.floor(frameNum / this.frameCount)
    if (!this.loopForever && this.loopedCount > 1) {
      return -1
    }
    return frameNum % this.frameCount
  }

  beforeCommit(node: SpriteDrawNode) {
    const shader = node.shader as DefaultShaderWrapper
    shader.color = this._color
  }

  onDraw(node: SpriteDrawNode, renderer: WebGLRenderer) {
    const frameIndex = this.getFrameIndex()
    if (frameIndex < 0) {
      return;
    }
    const texture = StoryTextureManager.getTexture(this.frames[frameIndex])
    node.drawRect(this.rectangle)
    node.drawTexture(texture)
  }

}