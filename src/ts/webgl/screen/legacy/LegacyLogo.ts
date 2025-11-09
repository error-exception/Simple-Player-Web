import {BaseDrawableConfig, Drawable} from "../../drawable/Drawable";
import {ObjectTransition} from "../../transition/Transition";
import {Time} from "../../../global/Time";
import type {DrawNode} from "../../drawable/DrawNode";
import {Color} from "../../base/Color";
import {TextureStore} from "../../graphic/texture/TextureStore";
import type {WebGLRenderer} from "../../WebGLRenderer";
import {Shaders} from "../../graphic/shader/Shaders";
import type {BrightnessTextureShaderWrapper} from "../../graphic/shader/BrightnessTextureShaderWrapper";
import {Coordinate2} from "../../base/Coordinate2";

export class LegacyLogo extends Drawable {

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
    shader.orth = Coordinate2.orthographicProjectionMatrix4
    shader.sampler2D = 0
    shader.alpha = this.computeColor().alpha
    shader.brightness = this.brightness
  }

  public onDraw(node: DrawNode) {
    node.drawRect(this.rectangle)
    node.drawTexture(TextureStore.getTexture('LegacyLogo'))
  }
}