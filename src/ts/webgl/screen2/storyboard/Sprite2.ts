import type { OSBSprite } from "../../../osu/OSUFile";
import type { OSZ } from "../../../osu/OSZ";
import AudioPlayer from "../../../player/AudioPlayer";
import type { Nullable } from "../../../type";
import { color } from "../../base/Color";
import type { Canvas } from "../../canvas/Canvas";
import { anchor } from "../../drawable/Anchor";
import { Blend } from "../../drawable/Blend";
import { Transformable } from "../../drawable/Transformable";
import type { Disposable } from "../../graphic/core/Disposable";
import { ImageFormat, Texture } from "../../graphic/core/Texture";
import { almostEquals, isUndef } from "../../graphic/core/Utils";
import { vector2 } from "../../graphic/matrix/vec2";
import { TextureRegin } from "../../graphic/texture/TextureAtlas";
import { StoryEventGroup } from "./event/StoryEventGroup";
import type { StoryTextureStore } from "./StoryTextureManager";
import type { StoryLayer } from "./StoryType";

export enum LiveState {
  Ready,
  Alive,
  Dead
}

export class StorySprite extends Transformable implements Disposable {
  public layer: StoryLayer = ""
  public filePath: string = ""
  public origin = vector2.create()
  public finalOrigin = vector2.create()
  public anchor = vector2.create()
  public position = vector2.create()

  protected _size = vector2.create()

  public set width(w: number) {
    this._size[0] = w
  }
  public get width(): number {
    return this._size[0]
  }

  public set height(h: number) {
    this._size[1] = h
  }
  public get height(): number {
    return this._size[1]
  }

  public set size(size: vec2) {
    this._size = size
  }

  public get size(): vec2 {
    return this._size
  }

  public texture: Nullable<Texture | TextureRegin> = null

  public blend = Blend.Normal

  public flipX = false

  public flipY = false
  public readonly showTime: number

  public readonly hideTime: number

  protected eventsGroup: StoryEventGroup
  public liveState = LiveState.Ready

  public get isDead() {
    return this.liveState === LiveState.Dead
  }

  constructor(sprite: OSBSprite, source: OSZ, protected storyTextureStore: StoryTextureStore) {
    super()
    this.layer = sprite.layer
    this.translateX = sprite.x
    this.translateY = sprite.y
    // this.position[0] = sprite.x
    // this.position[1] = sprite.y
    this.filePath = sprite.filePath
    switch (sprite.origin) {
      case "TopLeft": this.origin = anchor.TopLeft; break;
      case "TopCentre": this.origin = anchor.TopCenter; break;
      case "TopRight": this.origin = anchor.TopRight; break;
      case "CentreLeft": this.origin = anchor.CenterLeft; break;
      case "Centre": this.origin = anchor.Center; break;
      case "CentreRight": this.origin = anchor.CenterRight; break;
      case "BottomLeft": this.origin = anchor.BottomLeft; break;
      case "BottomCentre": this.origin = anchor.BottomCenter; break;
      case "BottomRight": this.origin = anchor.BottomRight; break;
      default: this.origin = anchor.Center; break;
    }
    this.eventsGroup = new StoryEventGroup(this, sprite.events)
    this.showTime = this.eventsGroup.startTime()
    this.hideTime = this.eventsGroup.endTime()
    this.loadTexture(sprite, source)
    this.adjustOrigin()
    this.color = color.White
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
    vector2.set(this._size, image.width, image.height)
    // TODO: use better texture manage
    this.storyTextureStore.addIfAbsent(sprite.filePath, image, format)
  }

  public onWindowResize() {
    this.adjustOrigin()
  }

  protected adjustOrigin() {
    const origin = this.origin, flipX = this.flipX, flipY = this.flipY,
      finalOrigin = this.finalOrigin

    vector2.copy(finalOrigin, origin)
    if (flipX) finalOrigin[0] = 1 - origin[0]
    if (flipY) finalOrigin[1] = 1 - origin[1]
  }

  public update() {
    const current = AudioPlayer.currentTime()
    this.eventsGroup.update(current)


    const texture = this.storyTextureStore.getTexture(this.filePath)
    if (texture) {
      this.texture = texture
    }
    this.adjustOrigin()
  }

  public isNotPresent() {
    const current = AudioPlayer.currentTime()
    const result = almostEquals(this._size[0], 0) ||
      almostEquals(this._size[1], 0) ||
      almostEquals(this._alpha, 0) ||
      almostEquals(this._scale[0], 0) ||
      almostEquals(this._scale[1], 0) ||
      current < this.showTime ||
      current > this.hideTime ||
      this.texture === null

    if (result && this.liveState === LiveState.Alive) {
      this.liveState = LiveState.Dead
    }
    return result
  }

  public draw(canvas: Canvas) {
    if (this.isNotPresent()) {
      return
    }
    this.liveState = LiveState.Alive
    canvas.save()
    const pivotX = this.width * this.finalOrigin[0], pivotY = this.height * this.finalOrigin[1]
    canvas.base(0, 0)
    canvas.pivot(pivotX, pivotY)

    const finalTranslateX = -pivotX + this._translate[0]
    const finalTranslateY = -pivotY + this._translate[1]
    canvas.translate(finalTranslateX, finalTranslateY)
    canvas.scale(this._scale[0] * (this.flipX ? -1 : 1), this._scale[1] * (this.flipY ? -1 : 1))

    canvas.rotate(this._rotate)

    canvas.setBlend(this.blend)
    canvas.setColor(this._color)
    canvas.setGlobalAlpha(this._alpha)

    if (this.texture instanceof Texture) {
      // canvas.drawTexture(this.texture, -this.position[0], -this.position[1], this.width, this.height)
      canvas.drawTexture(this.texture, 0, 0, this.width, this.height)
    } else if (this.texture instanceof TextureRegin) {
      // canvas.drawTextureAtlas(this.texture, -this.position[0], -this.position[1], this.width, this.height)
      canvas.drawTextureAtlas(this.texture, 0, 0, this.width, this.height)
    } else {
      // No support content to draw
      return
    }
    canvas.restore()
  }

  public dispose(): void {

  }
}