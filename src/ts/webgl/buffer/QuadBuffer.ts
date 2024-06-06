import {BasicVertexBuffer} from "./BasicVertexBuffer";
import QuadIndexBuffer from "./QuadIndexBuffer";
import type {WebGLRenderer} from "../WebGLRenderer";

export class QuadBuffer extends BasicVertexBuffer {

  private readonly amountIndices: number

  constructor(
    renderer: WebGLRenderer,
    quadCount: number,
    usage: number = renderer.gl.STATIC_DRAW,
    stride: number = 4
  ) {
    super(renderer, quadCount * 4, stride, usage)
    QuadIndexBuffer.init(renderer)
    this.amountIndices = quadCount * 6
    console.log('amountIndices', this.amountIndices)
    this.isIndexBufferSet = true
  }

  protected init() {
    super.init()
    QuadIndexBuffer.bind()
    QuadIndexBuffer.tryExtendTo(this.amountIndices)
    QuadIndexBuffer.unbind()
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