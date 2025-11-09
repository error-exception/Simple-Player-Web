import {Vector2} from "../graphic/core/Vector2";
import {Color} from "../base/Color";
import {Texture} from "../graphic/core/Texture";
import {Blend} from "./Blend";
import {Matrix3} from "../graphic/core/Matrix3";
import {TransformUtils2} from "../graphic/core/TransformUtils2";
import type {Nullable} from "../../type";
import type {ShaderWrapper} from "../graphic/shader/ShaderWrapper";
import type {WebGLRenderer} from "../WebGLRenderer";
import {ArrayUtils} from "../../util/ArrayUtils";
import {Shaders} from "../graphic/shader/Shaders";
import type {BasicVertexBuffer} from "../graphic/buffer/BasicVertexBuffer";
import {Buffers} from "../graphic/buffer/Buffers";
import type {Drawable} from "./Drawable";
import type {TextureRegin} from "../graphic/texture/TextureAtlas";
import {Quad} from "../graphic/shape/Quad";
import type {Rectangle} from "../graphic/shape/Rectangle";
import {QuadUtils} from "../graphic/shape/QuadUtils";
import type {Triangle} from "../graphic/shape/Triangle";
import {TransformUtils3} from "../graphic/core/TransformUtils3";

export class DrawNode {

  public static readonly POSITION_INDEX = 0
  public static readonly COLOR_INDEX = 2
  public static readonly TEXTURE_INDEX = 2
  public static readonly VERTEX_PER_QUAD = 4
  public static readonly VERTEX_PER_TRIANGLE = 3

  public blend: Blend = Blend.Normal
  public color = Color.White.copy()
  public texture: Nullable<Texture> = null
  public bufferData: Float32Array | number[] = ArrayUtils.emptyFloat32Array

  public vertexBuffer: BasicVertexBuffer = Buffers.SingleQuad
  public shader: ShaderWrapper = Shaders.Default
  /**
   * 是否将变换自动应用到顶点的 ATTR_POSITION 上
   */
  public autoTransform = false

  constructor(
    public source: Drawable,
    public matrix = Matrix3.newIdentify()
  ) {
    this.apply()
  }

  /**
   * 如果中途更改了 vertexBuffer 或 Shader，需要调用此方法
   */
  public apply() {
    this.bufferData = new Float32Array(this.vertexBuffer.elementCount)
  }

  private origin: Vector2 = new Vector2();
  public applyTransform(translate: Vector2, rotate: number, scale: Vector2, skew: Vector2, origin: Vector2) {
    this.origin = origin;
    TransformUtils2.applyTransform(this.matrix, translate, rotate, scale, skew, origin)
  }

  /**
   * 绘制一个四边形
   * @param quad
   * @param color
   * @param index
   */
  public drawQuad(
    quad: Quad,
    color?: Color, index: number = 0
  ) {
    const matrix = this.matrix,
      data = this.bufferData,
      stride = this.shader.stride,
      positionIndex = DrawNode.POSITION_INDEX,
      startIndex = index * stride * DrawNode.VERTEX_PER_QUAD,
      topLeft = quad.topLeft,
      topRight = quad.topRight,
      bottomLeft = quad.bottomLeft,
      bottomRight = quad.bottomRight
    if (this.autoTransform) {
      const source = this.source
      const origin = this.origin
      TransformUtils3.applyTo(source, topLeft, data, startIndex + positionIndex, origin)
      TransformUtils3.applyTo(source, topRight, data, startIndex + stride + positionIndex, origin)
      TransformUtils3.applyTo(source, bottomLeft, data, startIndex + stride * 2 + positionIndex, origin)
      TransformUtils3.applyTo(source, bottomRight, data, startIndex + stride * 3 + positionIndex, origin)
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

    if (color) {
      const colorIndex = DrawNode.COLOR_INDEX
      data[startIndex + colorIndex] = color.red
      data[startIndex + colorIndex + 1] = color.green
      data[startIndex + colorIndex + 2] = color.blue
      data[startIndex + colorIndex + 3] = color.alpha

      data[startIndex + stride + colorIndex] = color.red
      data[startIndex + stride + colorIndex + 1] = color.green
      data[startIndex + stride + colorIndex + 2] = color.blue
      data[startIndex + stride + colorIndex + 3] = color.alpha

      data[startIndex + stride * 2 + colorIndex] = color.red
      data[startIndex + stride * 2 + colorIndex + 1] = color.green
      data[startIndex + stride * 2 + colorIndex + 2] = color.blue
      data[startIndex + stride * 2 + colorIndex + 3] = color.alpha

      data[startIndex + stride * 3 + colorIndex] = color.red
      data[startIndex + stride * 3 + colorIndex + 1] = color.green
      data[startIndex + stride * 3 + colorIndex + 2] = color.blue
      data[startIndex + stride * 3 + colorIndex + 3] = color.alpha
    }
  }

  private tempQuad = new Quad()
  /**
   * 绘制一个矩形
   * @param rectangle
   * @param color
   * @param index
   */
  public drawRect(
    rectangle: Rectangle,
    color?: Color, index: number = 0
  ) {
    QuadUtils.fromRectangleTo(rectangle, this.tempQuad)
    this.drawQuad(this.tempQuad, color, index)
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
    const textureIndex = DrawNode.TEXTURE_INDEX
    const startIndex = index * stride * DrawNode.VERTEX_PER_QUAD
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

  public drawTriangle(triangle: Triangle, color?: Color, index: number = 0) {
    const matrix = this.matrix,
      data = this.bufferData,
      positionIndex = DrawNode.POSITION_INDEX,
      stride = this.shader.stride,
      startIndex = index * stride * DrawNode.VERTEX_PER_TRIANGLE,
      a1 = triangle.angle1,
      a2 = triangle.angle2,
      a3 = triangle.angle3
    if (this.autoTransform) {
      const source = this.source
      const origin = this.origin
      TransformUtils3.applyTo(source, a1, data, startIndex + positionIndex, origin)
      TransformUtils3.applyTo(source, a2, data, startIndex + stride + positionIndex, origin)
      TransformUtils3.applyTo(source, a3, data, startIndex + stride * 2 + positionIndex, origin)
    } else {
      data[startIndex + positionIndex] = a1.x
      data[startIndex + positionIndex + 1] = a1.y

      data[startIndex + stride + positionIndex] = a2.x
      data[startIndex + stride + positionIndex + 1] = a2.y

      data[startIndex + stride * 2 + positionIndex] = a3.x
      data[startIndex + stride * 2 + positionIndex + 1] = a3.y
    }
    if (color) {
      const colorIndex = DrawNode.COLOR_INDEX
      data[startIndex + colorIndex] = color.red
      data[startIndex + colorIndex + 1] = color.green
      data[startIndex + colorIndex + 2] = color.blue
      data[startIndex + colorIndex + 3] = color.alpha

      data[startIndex + stride + colorIndex] = color.red
      data[startIndex + stride + colorIndex + 1] = color.green
      data[startIndex + stride + colorIndex + 2] = color.blue
      data[startIndex + stride + colorIndex + 3] = color.alpha

      data[startIndex + stride * 2 + colorIndex] = color.red
      data[startIndex + stride * 2 + colorIndex + 1] = color.green
      data[startIndex + stride * 2 + colorIndex + 2] = color.blue
      data[startIndex + stride * 2 + colorIndex + 3] = color.alpha
    }
  }

  /**
   * 向 buffer 顶点填充一个顶点属性值
   * @param value
   * @param elementSize 如绘制一个三角形，则为 3，若四边形，则为 4
   * @param offsetOfStride 一个顶点数据中，该值的位置
   * @param index
   */
  public drawOne(value: number, elementSize: number, offsetOfStride: number = 4, index: number) {
    const stride = this.shader.stride
    const startIndex = index * stride * elementSize
    const data = this.bufferData
    for (let i = 0; i < elementSize; i++) {
      data[startIndex + offsetOfStride + stride * i] = value
    }
  }

  public draw(renderer: WebGLRenderer) {
    if (!this.source.isPresent) {
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