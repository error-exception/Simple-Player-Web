import {Transformable} from "../../drawable/Transformable";
import type {Disposable} from "../../graphic/core/Disposable";
import {StoryLayer, StoryOrigin} from "./StoryType";
import {Color} from "../../base/Color";
import {Vector, Vector2} from "../../graphic/core/Vector2";
import {StoryEventGroup} from "./event/StoryEventGroup";
import {OSBSprite} from "../../../osu/OSUFile";
import {OSZ} from "../../../osu/OSZ";
import {ImageFormat} from "../../graphic/core/Texture";
import {isUndef} from "../../graphic/core/Utils";
import StoryTextureManager from "./StoryTextureManager";
import AudioPlayer from "../../../player/AudioPlayer";
import {Axis} from "../../drawable/Axis";
import type {WebGLRenderer} from "../../WebGLRenderer";
import {Shaders} from "../../graphic/shader/Shaders";
import {originMap} from "./Sprite";
import {Matrix3} from "../../graphic/core/Matrix3";
import {Rectangle} from "../../graphic/shape/Rectangle";
import {SpriteDrawNode} from "./SpriteDrawNode";

export class SpriteV2 extends Transformable implements Disposable {

  public layer: StoryLayer = ""
  public path: string = ''
  public x: number = 0
  public y: number = 0
  public origin: StoryOrigin = ""

  protected rectangle = new Rectangle()

  protected readonly showTime: number
  protected readonly hideTime: number

  public verticalFlip = false
  public horizontalFlip = false
  public additiveBlend = false

  protected eventsGroup: StoryEventGroup

  constructor(protected gl: WebGL2RenderingContext, sprite: OSBSprite, source: OSZ) {
    super()
    this.setColor(Color.White)
    this.layer = sprite.layer
    this.origin = sprite.origin
    this.x = sprite.x
    this.y = sprite.y
    this.path = sprite.filePath
    if (this.path === 'sb/bgs/blondhairblackhairgirlsthataregayforeachother.jpg') {
      console.log(this)
    }
    // console.log(this.path)
    this.rectangle.setTopLeft(this.x, this.y)
    this.eventsGroup = new StoryEventGroup(this, sprite.events)
    this.showTime = this.eventsGroup.startTime()
    this.hideTime = this.eventsGroup.endTime()
    this.loadTexture(sprite, source)
    this.setupBound()
  }

  public setWidth(w: number) {
    this.rectangle.setWidth(w)
  }

  public getWidth(): number {
    return this.rectangle.getWidth()
  }

  public setHeight(h: number) {
    this.rectangle.setHeight(h)
  }

  public getHeight(): number {
    return this.rectangle.getHeight()
  }

  public setSize(width: number, height: number) {
    throw new Error('not available')
  }

  public getSize(): Vector2 {
    throw new Error('not available')
  }

  protected loadTexture(sprite: OSBSprite, source: OSZ) {

    const format =
      (sprite.filePath.endsWith(".jpg") || sprite.filePath.endsWith(".jpeg"))
        ? ImageFormat.JPEG
        : ImageFormat.PNG
    const image = source.getImageBitmap(sprite.filePath)
    if (isUndef(image)) {
      throw new Error("sprite texture cannot be undefined or null " + sprite.filePath)
    }
    this.setWidth(image.width)
    this.setHeight(image.height)
    StoryTextureManager.addIf(this.gl, sprite.filePath, image, format)
  }

  public shouldVisible() {
    const current = AudioPlayer.currentTime()
    return current >= this.showTime && current < this.hideTime
  }

  protected originPosition = Vector()
  protected setupBound() {
    this.adjustOrigin()
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
      x = .5
    } else {
      x = 1
    }
    if (yAxis === Axis.Y_TOP) {
      y = 0
    } else if (yAxis === Axis.Y_CENTER) {
      y = .5
    } else {
      y = 1
    }
    this.originPosition.set(this.getWidth() * x, this.getHeight() * y)
  }

  public onResize() {
    this.setupBound()
  }

  public update() {
    const current = AudioPlayer.currentTime()
    this.eventsGroup.update(current)
    this.applyTransform()
  }

  public drawNode = new SpriteDrawNode(this)
  protected finalTranslate = Vector2.newZero()
  public applyTransform() {

    const scaleY = this.verticalFlip ? -1 : 1,
      scaleX = this.horizontalFlip ? -1 : 1

    this.adjustOrigin()

    this._scale.x *= scaleX
    this._scale.y *= scaleY

    this.finalTranslate.set(this.x, this.y)
    this.finalTranslate.increment(this._translate)
    this.drawNode.matrix.setFrom(Matrix3.identify)
    this.drawNode.applyTransform(
      this.finalTranslate,
      this._rotate,
      this._scale,
      this._skew,
      this.originPosition
    )

    const origin = this.originPosition
    this.rectangle.setTopLeft(
      -origin.x,
      -origin.y,
    )
  }

  beforeCommit(node: SpriteDrawNode) {
    const shader = Shaders.Default
    shader.color = this._color
  }

  public onDraw(node: SpriteDrawNode, renderer: WebGLRenderer) {
    const texture = StoryTextureManager.getTexture(this.path)
    node.drawRect(this.rectangle)
    node.drawTexture(texture)
  }

  public draw(renderer: WebGLRenderer) {
    this.drawNode.draw(renderer)
  }

  public dispose() {}

}