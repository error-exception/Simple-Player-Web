import {StoryLayer, StoryOrigin} from "./StoryType";
import {OSBSprite} from "../../../osu/OSUFile";
import {Transform} from "../../base/Transform";
import {Vector} from "../../core/Vector2";
import {Shape2D} from "../../util/Shape2D";
import {Color} from "../../base/Color";
import StoryTextureManager from "./StoryTextureManager";
import {VertexBuffer} from "../../core/VertexBuffer";
import {OSBSource} from "../../../osu/OSZ";
import {VertexArray} from "../../core/VertexArray";
import ColoredTextureShader from "../../shader/ColoredTextureShader";
import {Disposable} from "../../core/Disposable";
import AudioPlayer from "../../../player/AudioPlayer";
import {isUndef} from "../../core/Utils";
import {IEntry} from "./IEntry";
import {StoryEventGroup} from "./event/StoryEventGroup";

export class Sprite implements Disposable, IEntry {

  public layer: StoryLayer = ""
  public path: string = ''
  public x: number = 0
  public y: number = 0
  public origin: StoryOrigin = ""

  public color = Color.fromHex(0xffffff)

  protected size = Vector()
  protected topLeft = Vector()
  protected bottomRight = Vector()

  protected layoutTransform: Transform = new Transform() // 首先转换坐标系
  public transform: Transform = new Transform()
  protected appliedTransform: Transform = new Transform()

  protected transformMatrix4 = new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ])

  protected buffer: number[] = []
  protected readonly vertexBuffer: VertexBuffer

  protected readonly showTime: number
  protected readonly endTime: number

  // protected scaleEvent = new StoryScaleEvent(this)
  // protected moveEvent = new StoryMoveEvent(this)
  // protected fadeEvent = new StoryFadeEvent(this)
  // protected rotateEvent = new StoryRotateEvent(this)
  // protected colorEvent = new StoryColorEvent(this)
  // protected paramEvent = new StoryParamEvent(this)

  // protected readonly loopEvent: Nullable<StoryLoopEvent> = null

  public verticalFlip = false
  public horizontalFlip = false
  public additiveBlend = false

  protected eventsGroup: StoryEventGroup

  constructor(protected gl: WebGL2RenderingContext, sprite: OSBSprite, source: OSBSource) {
    this.layer = sprite.layer
    this.origin = sprite.origin
    this.x = sprite.x
    this.y = sprite.y
    this.path = sprite.filePath
    // for (const event of sprite.events) {
    //   if (event.type === "S" || event.type === "V") {
    //     this.scaleEvent.addEvent(event as OSBValueEvent)
    //   } else if (event.type === "M" || event.type === "MX" || event.type === "MY") {
    //     this.moveEvent.addEvent(event as (OSBValueEvent | OSBVectorEvent))
    //   } else if (event.type === "F") {
    //     this.fadeEvent.addEvent(event as OSBValueEvent)
    //   } else if (event.type === "R") {
    //     this.rotateEvent.addEvent(event as OSBValueEvent)
    //   } else if (event.type === "C") {
    //     this.colorEvent.addEvent(event as OSBColorEvent)
    //   } else if (event.type === "P") {
    //     this.paramEvent.addEvent(event as OSBParamEvent)
    //   }
    // }

    this.vertexBuffer = new VertexBuffer(gl)
    //
    // const times: number[] = []
    // if (this.fadeEvent.hasEvent()) {
    //   times.push(this.fadeEvent.startTime())
    // }
    // if (this.moveEvent.hasEvent()) {
    //   times.push(this.moveEvent.startTime())
    // }
    // if (this.rotateEvent.hasEvent()) {
    //   times.push(this.rotateEvent.startTime())
    // }
    // if (this.scaleEvent.hasEvent()) {
    //   times.push(this.scaleEvent.startTime())
    // }
    // if (this.colorEvent.hasEvent()) {
    //   times.push(this.colorEvent.startTime())
    // }
    // this.showTime = ArrayUtils.minOf(times, v => v)
    // times.length = 0
    // if (this.fadeEvent.hasEvent()) {
    //   times.push(this.fadeEvent.endTime())
    // }
    // if (this.moveEvent.hasEvent()) {
    //   times.push(this.moveEvent.endTime())
    // }
    // if (this.rotateEvent.hasEvent()) {
    //   times.push(this.rotateEvent.endTime())
    // }
    // if (this.scaleEvent.hasEvent()) {
    //   times.push(this.scaleEvent.endTime())
    // }
    // if (this.colorEvent.hasEvent()) {
    //   times.push(this.colorEvent.endTime())
    // }
    // this.endTime = ArrayUtils.maxOf(times, v => v)

    // const loopEvent = sprite.events.find(v => isLoopEvent(v))
    // if (loopEvent) {
    //   const loop = loopEvent as OSBLoopEvent
    //   this.loopEvent = new StoryLoopEvent(this, loop)
    //   this.showTime = Math.min(this.loopEvent.startTime(), this.showTime)
    //   this.endTime = Math.max(this.loopEvent.endTime(), this.endTime)
    // }
    this.eventsGroup = new StoryEventGroup(this, sprite.events)
    // console.log(this.eventsGroup)
    this.showTime = this.eventsGroup.startTime()
    this.endTime = this.eventsGroup.endTime()
    this.loadTexture(sprite, source)
    this.setupBound()
  }

  protected loadTexture(sprite: OSBSprite, source: OSBSource) {
    const image = source.get(sprite.filePath)
    if (isUndef(image)) {
      throw new Error("sprite texture cannot be undefined or null " + sprite.filePath)
    }
    this.size.set(image.width, image.height)
    StoryTextureManager.addIf(this.gl, sprite.filePath, image)
  }

  protected shouldVisible() {
    const current = AudioPlayer.currentTime()
    return current >= this.showTime && current <= this.endTime
  }

  protected originPosition = Vector()
  protected setupBound() {
    const origin = this.origin
    if (origin === "TopLeft") {
      this.originPosition.set(0, 0)
    } else if (origin === "TopCentre") {
      this.originPosition.set(-this.size.x / 2, 0)
    } else if (origin === "TopRight") {
      this.originPosition.set(-this.size.x, 0)
    } else if (origin === "CentreLeft") {
      this.originPosition.set(0, -this.size.y / 2)
    } else if (origin === "Centre") {
      this.originPosition.set(-this.size.x / 2, -this.size.y / 2)
    } else if (origin === "CentreRight") {
      this.originPosition.set(-this.size.x, -this.size.y / 2)
    } else if (origin === "BottomLeft") {
      this.originPosition.set(0, -this.size.y)
    } else if (origin === "BottomCentre") {
      this.originPosition.set(-this.size.x / 2, -this.size.y)
    } else if (origin === "BottomRight") {
      this.originPosition.set(-this.size.x, -this.size.y)
    }
    this.transform.translateTo(Vector(this.x, this.y))
  }

  protected needUpdateVertex = true
  public onResize() {
    this.setupBound()
    this.needUpdateVertex = true
  }

  public update() {
    const current = AudioPlayer.currentTime()
    // this.loopEvent?.update(current)
    // this.fadeEvent.update(current)
    // this.moveEvent.update(current)
    // this.rotateEvent.update(current)
    // this.scaleEvent.update(current)
    // this.colorEvent.update(current)
    // this.paramEvent.update(current)
    this.eventsGroup.update(current)
    this.applyTransform()
  }

  public applyTransform() {

    const layoutTransform = this.layoutTransform,
      transform = this.transform,
      appliedTransform = this.appliedTransform,
      topLeft = this.topLeft, bottomRight = this.bottomRight

    layoutTransform.scale.y = this.verticalFlip ? -1 : 1
    layoutTransform.scale.x = this.horizontalFlip ? -1 : 1

    appliedTransform.translateTo(layoutTransform.translate)
    appliedTransform.translateBy(transform.translate)

    appliedTransform.scaleTo(layoutTransform.scale)
    appliedTransform.scaleBy(transform.scale)

    appliedTransform.rotateTo(layoutTransform.rotate)
    appliedTransform.rotateBy(transform.rotate)

    appliedTransform.alphaTo(layoutTransform.alpha)
    appliedTransform.alphaBy(transform.alpha)

    appliedTransform.extractToMatrix4(this.transformMatrix4)

    topLeft.set(this.originPosition.x, this.originPosition.y)
    bottomRight.set(this.originPosition.x + this.size.x, this.originPosition.y + this.size.y)

    // TransformUtils.applyOrigin(topLeft, this.transformMatrix3)
    // TransformUtils.applyOrigin(bottomRight, this.transformMatrix3)
    this.color.alpha = appliedTransform.alpha
  }

  protected colorArray = new Float32Array(3)

  public draw(vertexArray: VertexArray) {
    if (!this.shouldVisible()) {
      return
    }
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
    StoryTextureManager.tryBind(this.path)
    if (this.additiveBlend) {
      // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_CONSTANT_ALPHA);
      // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_DST_ALPHA);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
      // gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD)
      // gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE, gl.ONE, gl.ONE)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
    } else {
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      // gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD)
      // gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ZERO, gl.ONE, gl.ZERO)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
    }
    this.vertexBuffer.unbind()
  }

  public dispose() {
    this.vertexBuffer.dispose()
  }

}