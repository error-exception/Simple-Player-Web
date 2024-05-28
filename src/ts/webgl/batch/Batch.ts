import type {ShaderWrapper} from "../shader/ShaderWrapper";
import type {VertexBuffer} from "../core/VertexBuffer";
import type {Nullable} from "../../type";
import type {IndexBuffer} from "../core/IndexBuffer";
import type {Texture} from "../core/Texture";
import {Blend} from "./Blend";
import type {Canvas} from "./Canvas";

export let currentBatch: Nullable<Batch> = null

interface DrawInstance {
  beginIndex: number
}

export class Batch {

  private data: number[] = []
  private bufferData: Float32Array = new Float32Array()
  private instances: DrawInstance[] = []

  constructor(
    public gl: WebGL2RenderingContext,
    public shader: ShaderWrapper,
    public vertexBuffer: VertexBuffer,
    public indexBuffer: Nullable<IndexBuffer> = null,
    public texture: Nullable<Texture> = null,
    public blend = Blend.Normal
  ) {
    // const unitCount = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS)
  }

  public commit(instance: DrawInstance, data: number[] | Float32Array) {
    const i = this.instances.indexOf(instance)
    if (i == -1) {
      return
    }
    if (this.bufferData.length > 0) {
      this.bufferData.set(data, instance.beginIndex)
    } else if (Array.isArray(data)) {
      this.data.splice(instance.beginIndex, 0, ...data)
    }
  }

  public instanceMap = new WeakMap<Canvas, DrawInstance>()
  public getInstance(canvas: Canvas) {
    let instance = this.instanceMap.get(canvas)
    if (!instance) {
      instance = {
        beginIndex: this.data.length
      }
      this.instanceMap.set(canvas, instance)
    }
    return instance
  }

  public endBatch() {

  }

  public batchDraw() {
    const count = this.bufferData.length / this.shader.stride
    const gl = this.gl
    this.shader.bind()
    this.vertexBuffer.bind()
    this.texture?.bind()
    this.indexBuffer?.bind()
    if (this.bufferData.length > 0) {
      this.vertexBuffer.setBufferData(this.bufferData)
    } else {
      this.bufferData = new Float32Array(this.data)
      this.vertexBuffer.setBufferData(this.bufferData)
    }
    if (this.blend === Blend.Normal) {

    } else if (this.blend === Blend.Additive) {

    }
    gl.drawArrays(gl.TRIANGLES, 0, count)
  }

}