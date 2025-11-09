import {Blend} from "../../drawable/Blend";
import {Color} from "../../base/Color";
import type {Nullable} from "../../../type";
import {Texture} from "../../graphic/core/Texture";
import {ArrayUtils} from "../../../util/ArrayUtils";
import {Vector2} from "../../graphic/core/Vector2";
import type {BasicVertexBuffer} from "../../graphic/buffer/BasicVertexBuffer";
import {Buffers} from "../../graphic/buffer/Buffers";
import type {ShaderWrapper} from "../../graphic/shader/ShaderWrapper";
import {Shaders} from "../../graphic/shader/Shaders";
import {Matrix3} from "../../graphic/core/Matrix3";
import {TransformUtils2} from "../../graphic/core/TransformUtils2";
import {Quad} from "../../graphic/shape/Quad";
import type {Rectangle} from "../../graphic/shape/Rectangle";
import {QuadUtils} from "../../graphic/shape/QuadUtils";
import type {TextureRegin} from "../../graphic/texture/TextureAtlas";
import type {WebGLRenderer} from "../../WebGLRenderer";
import type {SpriteV2} from "./SpriteV2";

export class SpriteDrawNode {
  public static readonly POSITION_INDEX = 0
  public static readonly TEXTURE_INDEX = 2
  public static readonly VERTEX_PER_QUAD = 4

  public blend: Blend = Blend.Normal
  public color = Color.White.copy()
  public texture: Nullable<Texture> = null
  public bufferData: Float32Array | number[] = ArrayUtils.emptyFloat32Array
  private one = Vector2.newOne()

  public vertexBuffer: BasicVertexBuffer = Buffers.SingleQuad
  public shader: ShaderWrapper = Shaders.Default
  /**
   * 是否将变换自动应用到顶点的 ATTR_POSITION 上
   */
  public autoTransform = true

  constructor(
    public source: SpriteV2,
    public matrix = Matrix3.newIdentify(),
  ) {
    this.apply()
  }

  /**
   * 如果中途更改了 vertexBuffer，需要调用此方法
   */
  public apply() {
    this.bufferData = new Float32Array(this.vertexBuffer.elementCount)
  }

  public applyTransform(translate: Vector2, rotate: number, scale: Vector2, skew: Vector2, origin: Vector2) {
    const m: Matrix3 = this.matrix
    // if (!origin.isZero()) {
    //   TransformUtils2.translateFromLeft(m, origin.negative())
    // }
    if (!translate.isZero()) {
      TransformUtils2.translateFromLeft(m, translate)
    }
    if (rotate !== 0) {
      TransformUtils2.rotateFromLeft(m, rotate)
    }
    if (!scale.equals(this.one)) {
      TransformUtils2.scaleFromLeft(m, scale)
    }
    if (!skew.isZero()) {
      TransformUtils2.skewFromLeft(m, skew)
    }
    // if (!origin.isZero()) {
    //   TransformUtils2.translateFromLeft(m, origin)
    // }
  }

  /**
   * 绘制一个四边形
   */
  public drawQuad(
    quad: Quad,
    index: number = 0
  ) {
    const matrix = this.matrix,
      data = this.bufferData,
      stride = this.shader.stride,
      positionIndex = SpriteDrawNode.POSITION_INDEX,
      startIndex = index * stride * SpriteDrawNode.VERTEX_PER_QUAD,
      topLeft = quad.topLeft,
      topRight = quad.topRight,
      bottomLeft = quad.bottomLeft,
      bottomRight = quad.bottomRight
    if (this.autoTransform) {
      TransformUtils2.applyTo(matrix, topLeft, data, startIndex + positionIndex)
      TransformUtils2.applyTo(matrix, topRight, data, startIndex + stride + positionIndex)
      TransformUtils2.applyTo(matrix, bottomLeft, data, startIndex + stride * 2 + positionIndex)
      TransformUtils2.applyTo(matrix, bottomRight, data, startIndex + stride * 3 + positionIndex)
    } else {
      data[startIndex + positionIndex] = topLeft.x
      data[startIndex + positionIndex + 1] = topLeft.y

      data[startIndex + stride + positionIndex] = topRight.x
      data[startIndex + stride + positionIndex + 1] = topRight.y

      data[startIndex + stride * 2 + positionIndex] = bottomLeft.x
      data[startIndex + stride * 2 + positionIndex + 1] = bottomLeft.y

      data[startIndex + stride * 3 + positionIndex] = bottomRight.x
      data[startIndex + stride * 3 + positionIndex + 1] = bottomRight.y
    }
  }

  private quad = new Quad()
  /**
   * 绘制一个矩形
   */
  public drawRect(
    rectangle: Rectangle, index: number = 0
  ) {
    QuadUtils.fromRectangleTo(rectangle, this.quad)
    this.drawQuad(this.quad, index)
  }

  /**
   * 绘制纹理
   * @param texture
   * @param topLeft
   * @param bottomRight
   * @param index
   */
  public drawTexture(
    texture: Texture | TextureRegin,
    topLeft: Vector2 = Vector2.zero,
    bottomRight: Vector2 = Vector2.one,
    index: number = 0
  ) {
    const data = this.bufferData
    const stride = this.shader.stride
    const textureIndex = SpriteDrawNode.TEXTURE_INDEX
    const startIndex = index * stride * SpriteDrawNode.VERTEX_PER_QUAD
    data[startIndex + textureIndex] = topLeft.x
    data[startIndex + textureIndex + 1] = topLeft.y

    data[startIndex + stride + textureIndex] = bottomRight.x
    data[startIndex + stride + textureIndex + 1] = topLeft.y

    data[startIndex + stride * 2 + textureIndex] = topLeft.x
    data[startIndex + stride * 2 + textureIndex + 1] = bottomRight.y

    data[startIndex + stride * 3 + textureIndex] = bottomRight.x
    data[startIndex + stride * 3 + textureIndex + 1] = bottomRight.y
    if (texture instanceof Texture) {
      this.texture = texture
    } else {
      this.texture = texture.texture
    }
  }

  public draw(renderer: WebGLRenderer) {
    if (!this.source.shouldVisible()) {
      return
    }
    this.source.onDraw(this, renderer)
    this.shader.bind()
    if (this.texture)
      renderer.bindTexture(this.texture)
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
    if (this.texture)
      renderer.unbindTexture(this.texture)

  }


}