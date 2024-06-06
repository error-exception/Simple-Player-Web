import {Vector, Vector2} from "../core/Vector2";
import {Color} from "../base/Color";
import {Texture} from "../core/Texture";
import {Blend} from "./Blend";
import {Matrix3} from "../core/Matrix3";
import {TransformUtils2} from "../core/TransformUtils2";
import type {Nullable} from "../../type";
import type {ShaderWrapper} from "../shader/ShaderWrapper";
import type {WebGLRenderer} from "../WebGLRenderer";
import {ArrayUtils} from "../../util/ArrayUtils";
import {Shaders} from "../shader/Shaders";
import type {BasicVertexBuffer} from "../buffer/BasicVertexBuffer";
import {Buffers} from "../buffer/Buffers";
import type {Drawable} from "./Drawable";
import type {TextureRegin} from "../texture/TextureAtlas";

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
  private one = Vector2.newOne()
  protected childrenNodes: DrawNode[] = []

  public vertexBuffer: BasicVertexBuffer = Buffers.SingleQuad
  public shader: ShaderWrapper = Shaders.Default
  public shouldDraw = true

  constructor(
    public source: Drawable,
    public matrix = Matrix3.newIdentify(),
  ) {
    this.apply()
  }

  /**
   * 如果中途更改了 vertexBuffer 或 Shader，需要调用此方法
   */
  public apply() {
    this.bufferData = new Float32Array(this.vertexBuffer.elementCount)
  }

  public addDrawNodes(...nodes: DrawNode[]) {
    this.childrenNodes.push(...nodes)
  }

  public applyTransform(translate: Vector2, rotate: number, scale: Vector2, skew: Vector2, origin: Vector2) {
    const m: Matrix3 = this.matrix
    if (!origin.isZero()) {
      TransformUtils2.translateFromLeft(m, origin.negative())
    }
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
    if (!origin.isZero()) {
      TransformUtils2.translateFromLeft(m, origin)
    }
  }

  /**
   * 绘制一个四边形
   * @param topLeft
   * @param topRight
   * @param bottomLeft
   * @param bottomRight
   * @param color
   * @param index
   */
  public drawQuad(
    topLeft: Vector2, topRight: Vector2,
    bottomLeft: Vector2, bottomRight: Vector2,
    color?: Color, index: number = 0
  ) {
    const matrix = this.matrix,
      data = this.bufferData,
      stride = this.shader.stride,
      positionIndex = DrawNode.POSITION_INDEX,
      startIndex = index * stride * DrawNode.VERTEX_PER_QUAD
    TransformUtils2.applyTo(matrix, topLeft, data, startIndex + positionIndex)
    TransformUtils2.applyTo(matrix, topRight, data, startIndex + stride + positionIndex)
    TransformUtils2.applyTo(matrix, bottomLeft, data, startIndex + stride * 2 + positionIndex)
    TransformUtils2.applyTo(matrix, bottomRight, data, startIndex + stride * 3 + positionIndex)
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

  /**
   * 绘制一个矩形
   * @param topLeft
   * @param bottomRight
   * @param color
   * @param index
   */
  public drawRect(
    topLeft: Vector2,
    bottomRight: Vector2,
    color?: Color, index: number = 0
  ) {
    this.drawQuad(
      topLeft, Vector(bottomRight.x, topLeft.y),
      Vector(topLeft.x, bottomRight.y), bottomRight,
      color, index
    )
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

  public drawTriangle(a1: Vector2, a2: Vector2, a3: Vector2, color?: Color, index: number = 0) {
    const matrix = this.matrix,
      data = this.bufferData,
      positionIndex = DrawNode.POSITION_INDEX,
      stride = this.shader.stride,
      startIndex = index * stride * DrawNode.VERTEX_PER_TRIANGLE
    TransformUtils2.applyTo(matrix, a1, data, startIndex + positionIndex)
    TransformUtils2.applyTo(matrix, a2, data, startIndex + stride + positionIndex)
    TransformUtils2.applyTo(matrix, a3, data, startIndex + stride * 2 + positionIndex)
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
    if (!this.shouldDraw) {
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
    // const nodes = this.childrenNodes
    // for (let i = 0; i < nodes.length; i++) {
    //   nodes[i].draw(renderer)
    // }

  }


}