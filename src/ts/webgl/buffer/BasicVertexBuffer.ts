import {VertexBuffer} from '../core/VertexBuffer'
import type {Nullable} from "../../type";
import type {Bindable} from "../core/Bindable";
import type {Disposable} from "../core/Disposable";
import type {WebGLRenderer} from "../WebGLRenderer";
import {ArrayUtils} from "../../util/ArrayUtils";

/**
 * todo: 复用 BasicVertexBuffer
 */
export class BasicVertexBuffer implements Bindable, Disposable {

  protected size: number
  private isInit = false
  protected bufferData: Float32Array
  protected buffer: Nullable<VertexBuffer> = null
  protected isIndexBufferSet = false

  /**
   *
   * @param renderer
   * @param verticesCount 顶点数量
   * @param stride 每个顶点的的元素数量
   * @param usage
   */
  constructor(
    protected renderer: WebGLRenderer,
    verticesCount: number,
    protected stride: number,
    protected usage: number
  ) {
    this.size = verticesCount
    this.bufferData = new Float32Array(verticesCount * this.stride)
  }

  public get elementCount() {
    return this.size * this.stride
  }

  private maxVerticesToEquals = 24

  public setVertex(data: Float32Array) {
    if (data.length <= this.maxVerticesToEquals) {
      const bufferData = this.bufferData
      if (ArrayUtils.almostEquals(bufferData, data)) {
        return
      }
      ArrayUtils.copyTo(data, 0, data.length, bufferData, 0)
      this.buffer?.setBufferData(bufferData)
    } else {
      this.buffer?.setBufferData(data)
    }
  }

  protected init() {
    this.buffer = new VertexBuffer(this.renderer.gl, null, this.usage)
    this.renderer.bindVertexBuffer(this.buffer)
    this.buffer.setBufferData(this.bufferData)
    this.renderer.unbindVertexBuffer(this.buffer)
  }

  public bind() {
    if (!this.isInit) {
      this.init()
      this.isInit = true
    }
    if (this.buffer) {
      this.renderer.bindVertexBuffer(this.buffer)
    }
  }

  public unbind() {
    if (this.buffer) {
      this.renderer.unbindVertexBuffer(this.buffer)
    }
  }

  protected toElements(vertices: number) {
    return ~~vertices
  }

  protected toElementIndex(vertexIndex: number) {
    return ~~vertexIndex
  }

  public draw() {
    // this.bind()
    const gl = this.renderer.gl
    if (this.isIndexBufferSet) {
      gl.drawElements(
        gl.TRIANGLES,
        this.toElements(this.size),
        gl.UNSIGNED_INT,
        0
      )
    } else {
      gl.drawArrays(
        gl.TRIANGLES,
        0,
        this.toElements(this.size)
      )
    }
  }

  public dispose() {
    if (this.buffer)
      this.renderer.unbindVertexBuffer(this.buffer)
    this.buffer?.dispose()
  }

}