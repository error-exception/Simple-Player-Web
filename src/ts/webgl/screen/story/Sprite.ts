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
import {StoryEventGroup} from "./event/StoryEventGroup";
import {Axis} from "../../drawable/Axis";
import {ImageFormat} from "../../core/Texture";

const originMap: Record<StoryOrigin, number> = {
  TopLeft: Axis.Y_TOP | Axis.X_LEFT,
  TopCentre: Axis.Y_TOP | Axis.X_CENTER,
  TopRight: Axis.Y_TOP | Axis.X_RIGHT,
  CentreLeft: Axis.Y_CENTER | Axis.X_LEFT,
  Centre: Axis.Y_CENTER | Axis.X_CENTER,
  CentreRight: Axis.Y_CENTER | Axis.X_RIGHT,
  BottomLeft: Axis.Y_BOTTOM | Axis.X_LEFT,
  BottomCentre: Axis.Y_BOTTOM | Axis.X_CENTER,
  BottomRight: Axis.Y_BOTTOM | Axis.X_RIGHT,
  "": Axis.Y_TOP | Axis.X_LEFT
}

export class Sprite implements Disposable {

  public layer: StoryLayer = ""
  public path: string = ''
  public x: number = 0
  public y: number = 0
  public origin: StoryOrigin = ""

  public color = Color.fromHex(0xffffff)

  protected size = Vector()
  protected topLeft = Vector()
  protected bottomRight = Vector()

  // protected layoutTransform: Transform = new Transform() // 首先转换坐标系
  public transform: Transform = new Transform()
  // protected appliedTransform: Transform = new Transform()

  protected transformMatrix4 = new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ])

  protected buffer: number[] = []
  protected readonly vertexBuffer: VertexBuffer

  protected readonly showTime: number
  protected readonly hideTime: number

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
    this.vertexBuffer = new VertexBuffer(gl)

    this.eventsGroup = new StoryEventGroup(this, sprite.events)
    this.showTime = this.eventsGroup.startTime()
    this.hideTime = this.eventsGroup.endTime()
    this.loadTexture(sprite, source)
    this.setupBound()
  }

  protected loadTexture(sprite: OSBSprite, source: OSBSource) {

    const format =
      (sprite.filePath.endsWith(".jpg") || sprite.filePath.endsWith(".jpeg"))
        ? ImageFormat.JPEG
        : ImageFormat.PNG
    const image = source.get(sprite.filePath)
    if (isUndef(image)) {
      throw new Error("sprite texture cannot be undefined or null " + sprite.filePath)
    }
    this.size.set(image.width, image.height)
    StoryTextureManager.addIf(this.gl, sprite.filePath, image, format)
  }

  protected shouldVisible() {
    const current = AudioPlayer.currentTime()
    return current >= this.showTime && current < this.hideTime
  }

  protected originPosition = Vector()
  protected setupBound() {
    this.adjustOrigin()
    this.transform.translateTo(Vector(this.x, this.y))
  }

  public adjustOrigin() {
    const origin = originMap[this.origin],
      hFlip = this.horizontalFlip,
      vFlip = this.verticalFlip
    let x, y, xAxis = Axis.getXAxis(origin), yAxis = Axis.getYAxis(origin)
    if (hFlip) {
      if (xAxis === Axis.X_LEFT) {
        xAxis = Axis.X_RIGHT
      } else if (xAxis === Axis.X_RIGHT) {
        xAxis = Axis.X_LEFT
      }
    }
    if (vFlip) {
      if (yAxis === Axis.Y_TOP) {
        yAxis = Axis.Y_BOTTOM
      } else if (yAxis === Axis.Y_BOTTOM) {
        yAxis = Axis.Y_TOP
      }
    }
    if (xAxis === Axis.X_LEFT) {
      x = 0
    } else if (xAxis === Axis.X_CENTER) {
      x = -this.size.x / 2
    } else {
      x = -this.size.x
    }
    if (yAxis === Axis.Y_TOP) {
      y = 0
    } else if (yAxis === Axis.Y_CENTER) {
      y = -this.size.y / 2
    } else {
      y = -this.size.y
    }
    this.originPosition.set(x, y)
  }

  protected needUpdateVertex = true
  public onResize() {
    this.setupBound()
    this.needUpdateVertex = true
  }

  public update() {
    const current = AudioPlayer.currentTime()
    this.eventsGroup.update(current)
    this.applyTransform()
  }

  public applyTransform() {

    const transform = this.transform,
      topLeft = this.topLeft,
      bottomRight = this.bottomRight,
      scaleY = this.verticalFlip ? -1 : 1,
      scaleX = this.horizontalFlip ? -1 : 1

    this.adjustOrigin()

    transform.scale.x *= scaleX
    transform.scale.y *= scaleY

    transform.extractToMatrix4(this.transformMatrix4)

    topLeft.set(this.originPosition.x, this.originPosition.y)
    bottomRight.set(this.originPosition.x + this.size.x, this.originPosition.y + this.size.y)

    this.color.alpha = transform.alpha
  }

  protected colorArray = new Float32Array(4)

  public draw(vertexArray: VertexArray) {
    if (!this.shouldVisible()) {
      return
    }
    const shader = ColoredTextureShader.getShader(this.gl), gl = this.gl
    this.vertexBuffer.bind()
    if (this.needUpdateVertex) {
      Shape2D.quadVector2(this.topLeft, this.bottomRight, this.buffer, 0, 4)
      Shape2D.quad(0, 0, 1, 1, this.buffer, 2, 4)
      this.vertexBuffer.setBufferData(new Float32Array(this.buffer))
      this.needUpdateVertex = false
    }
    shader.setUniformMatrix4fv("u_transform", this.transformMatrix4)
    const array = this.colorArray, color = this.color
    array[0] = color.red
    array[1] = color.green
    array[2] = color.blue
    array[3] = color.alpha
    shader.setUniform4fv("u_color", array)
    vertexArray.addBuffer(ColoredTextureShader.getLayout())
    StoryTextureManager.tryBind(this.path)
    if (this.additiveBlend) {
      // gl.blendFunc(gl.ONE, gl.ONE)
      gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD)
      gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE, gl.ONE, gl.ONE)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
    } else {
      // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD)
      // gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE)
      gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
    }
    this.vertexBuffer.unbind()
  }

  public dispose() {
    this.vertexBuffer.dispose()
  }

}