import {BasicVertexBuffer} from "./BasicVertexBuffer";
import type {WebGLRenderer} from "../WebGLRenderer";
import QuadIndexBuffer from "./QuadIndexBuffer";

/**
 * 适用于不确定顶点数量的绘制
 */
export class DynamicQuadBuffer extends BasicVertexBuffer {
  private amountIndices: number

  constructor(
    renderer: WebGLRenderer,
    stride: number = 4
  ) {
    super(renderer, 0, stride, renderer.gl.STREAM_DRAW)
    QuadIndexBuffer.init(renderer)
    this.amountIndices = 0
    this.isIndexBufferSet = true
  }

  public setVertex(data: Float32Array) {
    this.size = ~~(data.length / this.stride)
    this.amountIndices = this.toElements(this.size)
    QuadIndexBuffer.tryExtendTo(this.amountIndices)
    this.buffer?.setBufferData(data)
  }

  public bind() {
    super.bind();
    QuadIndexBuffer.bind()
  }

  public unbind() {
    super.unbind();
    QuadIndexBuffer.unbind()
  }

  protected toElements(vertices: number) {
    return ~~(3 * vertices / 2)
  }

  protected toElementIndex(vertexIndex: number) {
    return ~~(3 * vertexIndex / 2)
  }

}