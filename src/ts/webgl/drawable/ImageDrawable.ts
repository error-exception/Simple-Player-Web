import Coordinate from "../base/Coordinate";
import {BaseDrawableConfig, Drawable} from "./Drawable";
import {Texture} from "../core/Texture";
import type {DefaultShaderWrapper} from "../shader/DefaultShaderWrapper";
import {Color} from "../base/Color";
import {type DrawNode} from "./DrawNode";
import {Blend} from "./Blend";
import type {WebGLRenderer} from "../WebGLRenderer";
import type {TextureRegin} from "../texture/TextureAtlas";

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
    if (config.color) {
      this.color = config.color
    }
    this.alpha = this.color.alpha
  }

  public onLoad(renderer: WebGLRenderer) {
    super.onLoad(renderer);
    this.drawNode.blend = this.config.blend ?? Blend.Normal
  }

  protected color = Color.fromHex(0xffffff)
  beforeCommit(node: DrawNode) {
    const shader = node.shader as DefaultShaderWrapper
    shader.orth = Coordinate.orthographicProjectionMatrix4
    this.color.alpha = this.appliedTransform.alpha
    shader.color = this.color
    shader.sampler2D = 0
  }

  public onDraw(node: DrawNode) {
    node.drawRect(this.position, this.position.add(this.size))
    if (this.texture instanceof Texture) {
      node.drawTexture(this.texture)
    } else {
      node.drawTexture(this.texture, this.texture.texTopLeft, this.texture.texBottomRight)
    }
  }
}