import {BaseDrawableConfig, Drawable} from "./Drawable";
import {Texture} from "../graphic/core/Texture";
import type {DefaultShaderWrapper} from "../graphic/shader/DefaultShaderWrapper";
import {Color} from "../base/Color";
import {type DrawNode} from "./DrawNode";
import {Blend} from "./Blend";
import type {WebGLRenderer} from "../WebGLRenderer";
import type {TextureRegin} from "../graphic/texture/TextureAtlas";
import {Coordinate2} from "../base/Coordinate2";

interface ImageDrawableConfig extends BaseDrawableConfig {
  color?: Color,
  blend?: Blend
}

export class ImageDrawable extends Drawable<ImageDrawableConfig> {

  constructor(
    private texture: Texture | TextureRegin,
    config: ImageDrawableConfig
  ) {
    super(config)
    this.setColor(config.color ?? Color.White)
    this.setAlpha(config.color?.alpha ?? 1)
  }

  public onLoad(renderer: WebGLRenderer) {
    super.onLoad(renderer);
    this.drawNode.blend = this.config.blend ?? Blend.Normal
  }

  beforeCommit(node: DrawNode) {
    const shader = node.shader as DefaultShaderWrapper
    shader.orth = Coordinate2.orthographicProjectionMatrix4
    shader.color = this.computeColor()
    shader.sampler2D = 0
  }

  public onDraw(node: DrawNode) {
    node.drawRect(this.rectangle)
    if (this.texture instanceof Texture) {
      node.drawTexture(this.texture)
    } else {
      node.drawTexture(this.texture, this.texture.texTopLeft, this.texture.texBottomRight)
    }
  }
}