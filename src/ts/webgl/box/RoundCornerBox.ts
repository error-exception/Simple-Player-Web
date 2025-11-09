import {Box, type BoxConfig} from "./Box";
import {DrawNode} from "../drawable/DrawNode";
import type {Nullable} from "../../type";
import {Texture} from "../graphic/core/Texture";
import {TextureStore} from "../graphic/texture/TextureStore";
import {Vector2} from "../graphic/core/Vector2";
import {WebGLRenderer} from "../WebGLRenderer";
import {Rectangle} from "../graphic/shape/Rectangle";
import {Shaders} from "../graphic/shader/Shaders";
import {DynamicQuadBuffer} from "../graphic/buffer/DynamicQuadBuffer";
import type {MaskShaderWrapper} from "../graphic/shader/MaskShaderWrapper";
import {almostEquals} from "../graphic/core/Utils";
import {Matrix3} from "../graphic/core/Matrix3";
import {Color} from "../base/Color";
import {LayoutMember, LayoutValue} from "../layout/LayoutValue";
import {Invalidation} from "../drawable/Invalidation";
import {FrameTexture} from "../graphic/FrameTexture";
import {BaseDrawableConfig, Drawable} from "../drawable/Drawable";
import type {DefaultShaderWrapper} from "../graphic/shader/DefaultShaderWrapper";
import {Coordinate2} from "../base/Coordinate2";

export interface RoundCornerBoxConfig extends BoxConfig {
  cornerRadius?: number;
}

export class RoundCornerBox extends Box<RoundCornerBoxConfig> {

  public drawNode: RoundCornerBoxDrawNode = new RoundCornerBoxDrawNode(this)
  private frameTexture: Nullable<FrameTexture> = null
  private readonly roundCornerMaskDrawable: RoundCornerDrawable
  private maskTexture: Nullable<Texture> = null
  private childrenTexture: Nullable<Texture> = null

  constructor(config: RoundCornerBoxConfig) {
    super(config);
    this.roundCornerMaskDrawable = new RoundCornerDrawable(config)
    this.roundCornerMaskDrawable.setParent(this)
    this.setRadius(config.cornerRadius ?? 0)
    this.setColor(Color.White)
  }

  public setRadius(radius: number) {
    this.roundCornerMaskDrawable.setRadius(radius)
  }

  public getRadius(): number {
    return this.roundCornerMaskDrawable.getRadius()
  }

  public setHeight(h: number) {
    super.setHeight(h);
    this.roundCornerMaskDrawable.setHeight(h)
    this.frameTexture?.setHeight(h)
  }

  public setWidth(w: number) {
    super.setWidth(w);
    this.roundCornerMaskDrawable.setWidth(w)
    this.frameTexture?.setWidth(w)
  }

  public setSize(width: number, height: number) {
    super.setSize(width, height);
    this.roundCornerMaskDrawable.setSize(width, height)
    this.frameTexture?.setSize(width, height)
  }

  onLoad(renderer: WebGLRenderer) {
    super.onLoad(renderer);

    this.roundCornerMaskDrawable.load(renderer)

    this.frameTexture = new FrameTexture(renderer)
    this.maskTexture = TextureStore.create()
    this.childrenTexture = TextureStore.create()

    const node = this.drawNode

    node.maskTexture = this.maskTexture
    node.shader = Shaders.Mask
    node.autoTransform = true
  }

  updateLayout() {
    // Do nothing
  }

  add(...children: Drawable[]) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      this.childrenList.push(child)
    }
    this.invalidateLayout()
  }

  onUpdate() {
    super.onUpdate();
    this.drawNode.bufferData = []
  }

  public mask = new LayoutMember(Invalidation.Size)

  private matrix = Matrix3.newIdentify()
  draw(renderer: WebGLRenderer) {
    if (!this.isAvailable || !this.isVisible || !this.isPresent) {
      return
    }
    const node = this.drawNode
    const oldMatrix = node.matrix

    this.matrix.setFrom(Matrix3.identify)
    node.matrix = this.matrix
    this.drawMask(renderer)
    this.drawChildren(renderer)

    node.matrix = oldMatrix
    this.drawNode.draw(renderer)
  }

  public drawMask(renderer: WebGLRenderer) {
    const mask = this.mask
    if (mask.isValid()) {
      return
    }
    const frameTexture = this.frameTexture
    if (frameTexture == null) {
      throw new Error('frameTexture cannot be null')
    }
    const size = this.getSize()
    frameTexture.setSize(size.x, size.y)
    this.roundCornerMaskDrawable.setSize(size.x, size.y)
    mask.validate()
    const drawable = this.roundCornerMaskDrawable
    frameTexture.setTexture(this.maskTexture!)
    frameTexture.bind()
    drawable.update(renderer)
    drawable.draw(renderer)
    frameTexture.unbind()
  }

  protected updateChildren(renderer: WebGLRenderer) {}

  public drawChildren(renderer: WebGLRenderer) {
    const frameTexture = this.frameTexture
    if (frameTexture == null) {
      throw new Error('frameTexture cannot be null')
    }
    frameTexture.setTexture(this.childrenTexture!)
    frameTexture.bind()
    const children = this.childrenList
    for (let i = 0; i < children.length; i++) {
      children[i].update(renderer)
    }
    super.draw(renderer)
    frameTexture.unbind()
  }

  beforeCommit(node: DrawNode) {
    const shader = node.shader as MaskShaderWrapper
    shader.orth = Coordinate2.orthographicProjectionMatrix4
    shader.color = this.computeColor()
    shader.maskSampler2D = 0
    shader.sampler2D = 1
  }

  onDraw(node: DrawNode, renderer:WebGLRenderer) {
    const rectangle = this.rectangle
    node.drawRect(rectangle)
    node.drawTexture(this.childrenTexture!)
  }

  dispose() {
    super.dispose();
    this.drawNode.maskTexture?.dispose()
    this.frameTexture?.dispose()
    this.roundCornerMaskDrawable.dispose()
  }
}

class RoundCornerBoxDrawNode extends DrawNode {

  public maskTexture: Nullable<Texture> = null;

  draw(renderer: WebGLRenderer) {

    this.source.onDraw(this, renderer)
    if (this.maskTexture)
      renderer.bindTexture(this.maskTexture, 0)
    if (this.texture)
      renderer.bindTexture(this.texture, 1)
    this.shader.bind()
    this.vertexBuffer.bind()
    const data = this.bufferData
    this.vertexBuffer.setVertex(
      data instanceof Float32Array ? data : new Float32Array(data)
    )

    renderer.setBlend(this.blend)

    this.source.beforeCommit(this)
    this.shader.use()
    this.vertexBuffer.draw()

    this.shader.unbind()
    this.vertexBuffer.unbind()
    if (this.maskTexture)
      renderer.unbindTexture(this.maskTexture)
    if (this.texture)
      renderer.unbindTexture(this.texture)
  }

}

interface RoundCornerDrawableConfig extends BaseDrawableConfig {
  cornerRadius?: number
}

class RoundCornerDrawable extends Drawable<RoundCornerDrawableConfig> {

  private radius: number = 0

  constructor(config: RoundCornerDrawableConfig) {
    super(config);
    this.setColor(Color.White)
    this.setRadius(config.cornerRadius ?? 0)
  }

  public setRadius(radius: number) {
    this.radius = radius
    this.invalidate(Invalidation.Size)
  }

  public getRadius(): number {
    const radiusBacking = this.radiusBacking;
    if (!radiusBacking.isValid()) {
      radiusBacking.value = this.computeRadius()
    }
    return radiusBacking.value
  }

  private radiusBacking = new LayoutValue<number>(Invalidation.Size)

  private computeRadius() {
    const size = this.getSize()
    const maxRadius = Math.min(size.x, size.y) / 2
    return Math.min(maxRadius, this.radius)
  }

  onLoad(renderer: WebGLRenderer) {
    super.onLoad(renderer);
    const node = this.drawNode
    node.vertexBuffer = new DynamicQuadBuffer(renderer)
  }

  beforeCommit(node: DrawNode) {
    const shader = this.drawNode.shader as DefaultShaderWrapper
    shader.orth = Coordinate2.orthographicProjectionMatrix4
    shader.color = this.computeColor()
    shader.sampler2D = 0
  }

  private cornerRectangle = new Rectangle()
  private rect = new Rectangle()
  private textureTopLeft = new Vector2()
  private textureBottomRight = new Vector2()
  onDraw(node: DrawNode, renderer:WebGLRenderer) {
    this.drawNode.bufferData = []
    const radius = this.getRadius()
    const diameter = radius * 2
    const corner = this.cornerRectangle
    corner.setWidth(radius)
    corner.setHeight(radius)
    const rectangle = this.rect
    const size = this.getSize()
    const round = TextureStore.getTexture('WhiteRound')
    const square = TextureStore.getTexture('Square')
    const topLeft = this.textureTopLeft
    const bottomRight = this.textureBottomRight
    if (radius === 0) {
      rectangle.setWidth(size.x)
      rectangle.setHeight(size.y)
      node.drawRect(rectangle)
      node.drawTexture(square)
    } else if (almostEquals(diameter, size.x) && almostEquals(radius * 2, size.y)) {
      rectangle.setWidth(size.x)
      rectangle.setHeight(size.y)
      node.drawRect(rectangle)
      node.drawTexture(round)
    } else if (almostEquals(diameter, size.x)) { // vertical
      // top
      corner.setWidth(diameter)
      corner.setHeight(radius)
      corner.setTopLeft(0, 0)
      topLeft.set(0, 0)
      bottomRight.set(1, .5)
      node.drawRect(corner, undefined, 0)
      node.drawTexture(round, topLeft, bottomRight, 0)
      // center
      rectangle.setHeight(size.y - diameter)
      rectangle.setWidth(size.x)
      rectangle.setTopLeft(0, radius)
      topLeft.set(0, .5)
      bottomRight.set(1, .5)
      node.drawRect(rectangle, undefined, 1)
      node.drawTexture(round, topLeft, bottomRight, 1)
      // bottom
      corner.setTopLeft(0, size.y - radius)
      topLeft.set(0, .5)
      bottomRight.set(1, 1)
      node.drawRect(corner, undefined, 2)
      node.drawTexture(round, topLeft, bottomRight, 2)
    } else if (almostEquals(diameter, size.y)) { // horizontal
      // left
      corner.setWidth(radius)
      corner.setHeight(size.y)
      corner.setTopLeft(0, 0)
      topLeft.set(0, 0)
      bottomRight.set(.5, 1)
      node.drawRect(corner, undefined, 0)
      node.drawTexture(round, topLeft, bottomRight, 0)
      // center
      rectangle.setWidth(size.x - diameter)
      rectangle.setHeight(size.y)
      rectangle.setTopLeft(radius, 0)
      topLeft.set(.5, 0)
      bottomRight.set(.5, 1)
      node.drawRect(rectangle, undefined, 1)
      node.drawTexture(round, topLeft, bottomRight, 1)
      // right
      corner.setTopLeft(size.x - radius, 0)
      topLeft.set(.5, 0)
      bottomRight.set(1, 1)
      node.drawRect(corner, undefined, 2)
      node.drawTexture(round, topLeft, bottomRight, 2)
    } else {
      // topLeft
      corner.setTopLeft(0, 0)
      topLeft.set(0, 0)
      bottomRight.set(.5, .5)
      node.drawRect(corner, undefined, 0)
      node.drawTexture(round, topLeft, bottomRight, 0)
      // topCenter
      rectangle.setWidth(size.x - diameter)
      rectangle.setHeight(radius)
      rectangle.setTopLeft(radius, 0)
      topLeft.set(.5, 0)
      bottomRight.set(.5, .5)
      node.drawRect(rectangle, undefined, 1)
      node.drawTexture(round, topLeft, bottomRight, 1)
      // topRight
      corner.setTopLeft(size.x - radius, 0)
      topLeft.set(.5, 0)
      bottomRight.set(1, .5)
      node.drawRect(corner, undefined, 2)
      node.drawTexture(round, topLeft, bottomRight, 2)
      // center
      rectangle.setWidth(size.x)
      rectangle.setHeight(size.y - diameter)
      rectangle.setTopLeft(0, radius)
      topLeft.set(0, .5)
      bottomRight.set(1, .5)
      node.drawRect(rectangle, undefined, 3)
      node.drawTexture(round, topLeft, bottomRight, 3)
      // bottomLeft
      corner.setTopLeft(0, size.y - radius)
      topLeft.set(0, .5)
      bottomRight.set(.5, 1)
      node.drawRect(corner, undefined, 4)
      node.drawTexture(round, topLeft, bottomRight, 4)
      // bottomCenter
      rectangle.setWidth(size.x - diameter)
      rectangle.setHeight(radius)
      rectangle.setTopLeft(radius, size.y - radius)
      topLeft.set(.5, .5)
      bottomRight.set(.5, 1)
      node.drawRect(rectangle, undefined, 5)
      node.drawTexture(round, topLeft, bottomRight, 5)
      // bottomRight
      corner.setTopLeft(size.x - radius, size.y - radius)
      topLeft.set(.5, .5)
      bottomRight.set(1, 1)
      node.drawRect(corner, undefined, 6)
      node.drawTexture(round, topLeft, bottomRight, 6)
    }
  }

  public dispose() {
    super.dispose();
    this.drawNode.vertexBuffer.dispose()
  }
}