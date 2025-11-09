import {DrawInfo} from "./DrawInfo";
import {Texture} from "../graphic/core/Texture";
import {TextureRegin} from "../graphic/texture/TextureAtlas";
import {DrawSource} from "./DrawSource";
import {TransformUtils} from "../graphic/core/TransformUtils";
import {degreeToRadian} from "../../Utils";
import {Vector2} from "../graphic/core/Vector2";
import {Matrix3} from "../graphic/core/Matrix3";
import {ApplicationLoader} from "../../ApplicationLoader";
import {Blend} from "./Blend";

export class Canvas {

  public static readonly SOURCE_CACHE_SIZE = 16

  public source: DrawSource[] = new Array(16)

  public sourceIndex: number = -1

  public baseCoordinate = new Vector2()

  constructor() {
    const size = Canvas.SOURCE_CACHE_SIZE
    for (let i = 0; i < size; i++) {
      this.source[i] = new DrawSource()
    }
  }

  public setDrawInfo(drawInfo: DrawInfo) {
    const source = this.getCurrentSource()
    if (drawInfo.shader) {
      source.setShader(drawInfo.shader)
    }
    if (drawInfo.buffer) {
      source.setBuffer(drawInfo.buffer)
    }
  }

  private getCurrentSource() {
    return this.source[this.sourceIndex]
  }

  public beginNew() {
    const source = this.source
    if (this.sourceIndex >= source.length) {
      this.sourceIndex++
      source[this.sourceIndex] = new DrawSource()
    } else {
      this.sourceIndex++
    }
    source[this.sourceIndex].reset()
  }

  public translate(x: number, y: number) {
    this.getCurrentSource().pushMatrix(TransformUtils.translate(x, y))
  }

  public scale(x: number, y: number): void

  public scale(x: number, y: number, ox?: number, oy?: number) {
    let originX = -1, originY = -1
    if (ox !== undefined && oy !== undefined) {
      originX = ox;
      originY = oy;
      this.translate(-originX, -originY);
    }
    this.getCurrentSource().pushMatrix(TransformUtils.scale(x, y))
    if (originX !== -1 && originY !== -1) {
      this.translate(originX, originY);
    }
  }

  public rotate(degree: number): void

  public rotate(degree: number, ox?: number, oy?: number): void {
    let originX = -1, originY = -1
    if (ox !== undefined && oy !== undefined) {
      originX = ox;
      originY = oy;
      this.translate(-originX, -originY);
    }
    this.getCurrentSource().pushMatrix(TransformUtils.rotate(degreeToRadian(degree)))
    if (originX !== -1 && originY !== -1) {
      this.translate(originX, originY);
    }
  }

  public skew(x: number, y: number): void {
    // TODO: impl skew transform
  }

  public setBlend(blend: Blend) {
    this.getCurrentSource().blend = blend
  }

  /**
   * draw a triangle
   * @param a1 a angle of triangle
   * @param a2 b angle of triangle
   * @param a3 c angle of triangle
   * @param paint
   */
  public drawTriangle(a1: Vector2, a2: Vector2, a3: Vector2, paint: DrawInfo) {
    const source = this.getCurrentSource(),
      data = source.bufferData,
      stride = source.shader.stride,
      positionIndex = source.POSITION_INDEX,
      startIndex = paint.index * stride * DrawSource.VERTEX_PER_TRIANGLE,
      matrixEndIndex = source.matrixIndex
    let matrix: Matrix3
    for (let i = 0; i <= matrixEndIndex; ++i) {
      matrix = source.matrix[i]
      this.applyTo(matrix, a1, data, startIndex + positionIndex)
      this.applyTo(matrix, a2, data, startIndex + stride + positionIndex)
      this.applyTo(matrix, a3, data, startIndex + stride * 2 + positionIndex)
    }
    if (paint.color) {
      const color = paint.color
      const alpha = paint.alpha
      const colorIndex = source.COLOR_INDEX
      data[startIndex + stride * 0 + colorIndex + 0] = color.red
      data[startIndex + stride * 0 + colorIndex + 1] = color.green
      data[startIndex + stride * 0 + colorIndex + 2] = color.blue
      data[startIndex + stride * 0 + colorIndex + 3] = color.alpha * alpha

      data[startIndex + stride * 1 + colorIndex + 0] = color.red
      data[startIndex + stride * 1 + colorIndex + 1] = color.green
      data[startIndex + stride * 1 + colorIndex + 2] = color.blue
      data[startIndex + stride * 1 + colorIndex + 3] = color.alpha * alpha

      data[startIndex + stride * 2 + colorIndex + 0] = color.red
      data[startIndex + stride * 2 + colorIndex + 1] = color.green
      data[startIndex + stride * 2 + colorIndex + 2] = color.blue
      data[startIndex + stride * 2 + colorIndex + 3] = color.alpha * alpha
    }
  }

  public drawRectangle(topLeft: Vector2, bottomRight: Vector2, paint: DrawInfo): void {
    this.drawQuad(
      topLeft,
      new Vector2(bottomRight.x, topLeft.y),
      new Vector2(topLeft.x, bottomRight.y),
      bottomRight,
      paint
    )
  }

  public drawTexture(topLeft: Vector2, bottomRight: Vector2, texture: Texture | TextureRegin, paint: DrawInfo) {
    const source = this.getCurrentSource(),
      data = source.bufferData,
      stride = source.shader.stride,
      textureIndex = source.TEXTURE_INDEX,
      startIndex = paint.index * stride * DrawSource.VERTEX_PER_QUAD
    data[startIndex + stride * 0 + textureIndex + 0] = topLeft.x
    data[startIndex + stride * 0 + textureIndex + 1] = topLeft.y

    data[startIndex + stride * 1 + textureIndex + 0] = bottomRight.x
    data[startIndex + stride * 1 + textureIndex + 1] = topLeft.y

    data[startIndex + stride * 2 + textureIndex + 0] = topLeft.x
    data[startIndex + stride * 2 + textureIndex + 1] = bottomRight.y

    data[startIndex + stride * 3 + textureIndex + 0] = bottomRight.x
    data[startIndex + stride * 3 + textureIndex + 1] = bottomRight.y
    if (texture instanceof Texture) {
      source.texture = texture
    } else {
      source.texture = texture.texture
    }
  }

  public drawQuad(
    topLeft: Vector2,
    topRight: Vector2,
    bottomLeft: Vector2,
    bottomRight: Vector2,
    paint: DrawInfo,
  ) {
    const source = this.getCurrentSource(),
      data = source.bufferData,
      stride = source.shader.stride,
      positionIndex = source.POSITION_INDEX,
      startIndex = paint.index * stride * DrawSource.VERTEX_PER_QUAD,
      matrixEndIndex = source.matrixIndex
    let matrix: Matrix3
    for (let i = 0; i <= matrixEndIndex; ++i) {
      matrix = source.matrix[i]
      this.applyTo(matrix, topLeft, data, startIndex + positionIndex)
      this.applyTo(matrix, topRight, data, startIndex + stride + positionIndex)
      this.applyTo(matrix, bottomLeft, data, startIndex + stride * 2 + positionIndex)
      this.applyTo(matrix, bottomRight, data, startIndex + stride * 3 + positionIndex)
    }
    if (paint.color) {
      const color = paint.color
      const alpha = paint.alpha
      const colorIndex = source.COLOR_INDEX
      data[startIndex + stride * 0 + colorIndex + 0] = color.red
      data[startIndex + stride * 0 + colorIndex + 1] = color.green
      data[startIndex + stride * 0 + colorIndex + 2] = color.blue
      data[startIndex + stride * 0 + colorIndex + 3] = color.alpha * alpha

      data[startIndex + stride * 1 + colorIndex + 0] = color.red
      data[startIndex + stride * 1 + colorIndex + 1] = color.green
      data[startIndex + stride * 1 + colorIndex + 2] = color.blue
      data[startIndex + stride * 1 + colorIndex + 3] = color.alpha * alpha

      data[startIndex + stride * 2 + colorIndex + 0] = color.red
      data[startIndex + stride * 2 + colorIndex + 1] = color.green
      data[startIndex + stride * 2 + colorIndex + 2] = color.blue
      data[startIndex + stride * 2 + colorIndex + 3] = color.alpha * alpha

      data[startIndex + stride * 3 + colorIndex + 0] = color.red
      data[startIndex + stride * 3 + colorIndex + 1] = color.green
      data[startIndex + stride * 3 + colorIndex + 2] = color.blue
      data[startIndex + stride * 3 + colorIndex + 3] = color.alpha * alpha
    }
  }

  public drawOne(value: number, elementSize: number, offsetOfStride: number = 4, index: number) {
    const source = this.getCurrentSource(),
      stride = source.shader.stride,
      startIndex = index * stride * elementSize,
      data = source.bufferData
    for (let i = 0; i < elementSize; i++) {
      data[startIndex + offsetOfStride + stride * i] = value
    }
  }

  private applyTo(m: Matrix3, v: Vector2, out: Float32Array | number[], offset: number = 0) {
    const x = v.x + this.baseCoordinate.x
    const y = v.y + this.baseCoordinate.y
    out[offset] = x * m.M11 + y * m.M12 + m.M13
    out[offset + 1] = x * m.M21 + y * m.M22 + m.M23
  }

  /**
   * only call once per frame update
   * @internal
   */
  public draw() {
    const size = this.sourceIndex,
      renderer = ApplicationLoader.renderer,
      source = this.source
    for (let i = 0; i <= size; ++i) {
      source[i].commitGLDraw(renderer)
    }
  }

  /**
   * only call once after draw method called
   * @internal
   */
  public resetCanvas() {
    console.log(`source index: ${this.sourceIndex}`)
    this.sourceIndex = -1
    const source = this.source, len = source.length
    for (let i = 0; i < len; ++i) {
      source[i].reset()
    }
  }

}