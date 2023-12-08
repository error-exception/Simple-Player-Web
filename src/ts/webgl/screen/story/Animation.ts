import {LoopType} from "./StoryType";
import {OSBAnimation} from "../../../osu/OSUFile";
import {OSBSource} from "../../../osu/OSZ";
import {isUndef} from "../../core/Utils";
import StoryTextureManager from "./StoryTextureManager";
import {VertexArray} from "../../core/VertexArray";
import ColoredTextureShader from "../../shader/ColoredTextureShader";
import {Shape2D} from "../../util/Shape2D";
import {Sprite} from "./Sprite";
import AudioPlayer from "../../../player/AudioPlayer";

/**
 * 可能是故事版中的帧动画
 */
export class Animation extends Sprite {

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

  protected loadTexture(sprite: OSBAnimation, source: OSBSource) {
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
      const image = source.get(newName)
      if (isUndef(image)) {
        console.error("no image found")
        throw new Error("sprite texture cannot be undefined or null " + newName)
      }
      this.frames.push(newName)
      this.size.set(image.width, image.height)
      StoryTextureManager.addIf(this.gl, newName, image)
    }
    // console.log(this, sprite)
  }

  private getFrameIndex(): number {
    const showTime = this.showTime, current = AudioPlayer.currentTime()
    const time = current - showTime
    const frameNum = Math.floor(time / this.frameDelay)
    // console.log("Animation Frame Num", frameNum)
    this.loopedCount = Math.floor(frameNum / this.frameCount)
    if (!this.loopForever && this.loopedCount > 1) {
      return -1
    }
    return frameNum % this.frameCount
  }

  public draw(vertexArray: VertexArray) {
    if (!this.shouldVisible()) {
      return
    }
    const frameIndex = this.getFrameIndex()
    if (frameIndex < 0) {
      return;
    }
    // console.log("Animation Frame Index", frameIndex)
    const shader = ColoredTextureShader.getShader(this.gl), gl = this.gl
    this.vertexBuffer.bind()
    if (this.needUpdateVertex) {
      Shape2D.quadVector2(this.topLeft, this.bottomRight, this.buffer, 0, 4)
      Shape2D.quad(0, 0, 1, 1, this.buffer, 2, 4)
      // console.log(this.path, this.buffer)
      this.vertexBuffer.setBufferData(new Float32Array(this.buffer))
      this.needUpdateVertex = false
    }
    shader.setUniformMatrix4fv("u_transform", this.transformMatrix4)
    shader.setUniform1f("u_alpha", this.color.alpha)
    const array = this.colorArray, color = this.color
    array[0] = color.red
    array[1] = color.green
    array[2] = color.blue
    shader.setUniform3fv("u_color", array)
    vertexArray.addBuffer(this.vertexBuffer, ColoredTextureShader.getLayout())
    StoryTextureManager.tryBind(this.frames[frameIndex])
    if (this.additiveBlend) {
      // gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE)

      // gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE, gl.ONE, gl.ONE)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
    } else {
      // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      // gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD)
      // gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ZERO, gl.ONE, gl.ZERO)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.drawArrays(gl.TRIANGLES, 0, 6)
    }
    this.vertexBuffer.unbind()
  }

}