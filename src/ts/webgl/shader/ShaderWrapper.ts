import type {Shader} from "../core/Shader";
import {VertexBufferLayout} from "../core/VertexBufferLayout";
import {VertexArray} from "../core/VertexArray";
import type {Bindable} from "../core/Bindable";
import type {WebGLRenderer} from "../WebGLRenderer";
import type {Disposable} from "../core/Disposable";

export interface AttribLayout {
  name: string
  /**
   * gl.FLOAT etc
   */
  type: number
  count: number
}

export class ShaderWrapper implements Bindable, Disposable {

  public stride = 0
  public layout: VertexBufferLayout
  public vertexArray: VertexArray

  constructor(
    protected renderer: WebGLRenderer,
    public shader: Shader,
    public shaderAttributes: AttribLayout[]
  ) {
    shader.bind()
    const gl = renderer.gl
    this.layout = new VertexBufferLayout(gl)
    this.vertexArray = new VertexArray(gl)
    for (let i = 0; i < shaderAttributes.length; i++) {
      const attr = shaderAttributes[i]
      const position = shader.getAttributeLocation(attr.name)
      if (attr.type == gl.FLOAT) {
        this.layout.pushFloat(position, attr.count)
      } else if (attr.type === gl.UNSIGNED_BYTE) {
        this.layout.pushUByte(position, attr.count)
      } else if (attr.type === gl.UNSIGNED_INT) {
        this.layout.pushUInt(position, attr.count)
      }
      this.stride += attr.count
    }
    // this.vertexArray.bind()
    // this.vertexArray.addBuffer(this.layout)
    //
    // this.vertexArray.unbind()
    shader.unbind()
  }

  public bind() {
    const renderer = this.renderer
    renderer.bindShader(this.shader)
    renderer.bindVertexArray(this.vertexArray)
  }

  public unbind() {
    const renderer = this.renderer
    renderer.unbindShader(this.shader)
    renderer.unbindVertexArray(this.vertexArray)
    // renderer.popShader()
    // renderer.popVertexArray()
  }

  public use() {
    this.vertexArray.addBuffer(this.layout)
  }

  public dispose() {
    const renderer = this.renderer
    renderer.unbindShader(this.shader)
    renderer.unbindVertexArray(this.vertexArray)
    this.shader.dispose()
    this.vertexArray.dispose()
  }

}