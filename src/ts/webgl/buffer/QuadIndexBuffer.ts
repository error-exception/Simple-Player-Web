import {IndexBuffer} from "../core/IndexBuffer";
import type {Disposable} from "../core/Disposable";
import type {Bindable} from "../core/Bindable";
import type {Nullable} from "../../type";
import type {WebGLRenderer} from "../WebGLRenderer";

class QuadIndexBuffer implements Disposable, Bindable {

  public buffer: Nullable<IndexBuffer> = null
  private renderer: Nullable<WebGLRenderer> = null
  public maxAmountIndices: number = 0

  public init(renderer: WebGLRenderer) {
    if (!this.buffer) {
      this.buffer = new IndexBuffer(renderer.gl)
    }
    this.renderer = renderer
  }

  public tryExtendTo(count: number) {
    if (!this.buffer) {
      throw new Error("index buffer is null")
    }
    const maxAmountIndices = this.maxAmountIndices
    if (count > maxAmountIndices) {
      const indices = new Uint32Array(count)
      for (let i = 0, j = 0; j < count; i += 4, j += 6) {
        indices[j] = i
        indices[j + 1] = i + 1
        indices[j + 2] = i + 3
        indices[j + 3] = i + 3
        indices[j + 4] = i + 2
        indices[j + 5] = i
      }
      this.buffer.setIndexBuffer(indices)
      this.maxAmountIndices = count
    }
  }

  public bind() {
    if (this.renderer && this.buffer) {
      this.renderer.bindIndexBuffer(this.buffer)
    }
  }

  public unbind() {
    if (this.renderer && this.buffer) {
      this.renderer.unbindIndexBuffer(this.buffer)
    }
  }

  private isDisposed = false
  public dispose() {
    if (!this.isDisposed) {
      this.unbind()
      this.buffer?.dispose()
      this.renderer = null
      this.isDisposed = true
    }
  }
}

export default new QuadIndexBuffer()