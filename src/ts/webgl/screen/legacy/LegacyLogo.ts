import Coordinate from "../../base/Coordinate";
import {BaseDrawableConfig, Drawable} from "../../drawable/Drawable";
import {ObjectTransition} from "../../transition/Transition";
import {Time} from "../../../global/Time";
import type {DrawNode} from "../../drawable/DrawNode";
import {Color} from "../../base/Color";
import {TextureStore} from "../../texture/TextureStore";
import type {WebGLRenderer} from "../../WebGLRenderer";
import {Shaders} from "../../shader/Shaders";
import type {BrightnessTextureShaderWrapper} from "../../shader/BrightnessTextureShaderWrapper";

export class LegacyLogo extends Drawable {

  //@ts-ignore
  private brightness = 0
  private brightnessTransition = new ObjectTransition(this, 'brightness')

  constructor(config: BaseDrawableConfig) {
    super(config)
    this.setColor(Color.White)
  }

  onLoad(renderer: WebGLRenderer) {
    super.onLoad(renderer);
    const node = this.drawNode
    node.shader = Shaders.BrightnessTexture
    node.apply()
  }

  public brightnessBegin(atTime: number = Time.currentTime) {
    this.brightnessTransition.setStartTime(atTime)
    return this.brightnessTransition
  }

  public onUpdate() {
    super.onUpdate();
    this.brightnessTransition.update(Time.currentTime)
  }

  public beforeCommit(node: DrawNode) {
    const shader = node.shader as BrightnessTextureShaderWrapper
    shader.orth = Coordinate.orthographicProjectionMatrix4
    shader.sampler2D = 0
    // const color = this.color
    // color.red = Math.min(1 - this.brightness, 1)
    // color.blue = Math.min(1 - this.brightness, 1)
    // color.green = Math.min(1 - this.brightness, 1)
    // color.alpha = this.appliedTransform.alpha
    shader.alpha = this.computeColor().alpha
    shader.brightness = this.brightness
    // shader.color = this.computeColor()
  }

  public onDraw(node: DrawNode) {
    node.drawRect(
      this.initRectangle.topLeft,
      this.initRectangle.bottomRight
    )
    node.drawTexture(TextureStore.get('LegacyLogo'))
  }
}