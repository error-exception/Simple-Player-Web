import type {Shader} from "../core/Shader";
import {VertexBufferLayout} from "../core/VertexBufferLayout";
import {VertexArray} from "../core/VertexArray";
import type {Bindable} from "../core/Bindable";

export interface AttribLayout {
  name: string
  /**
   * gl.FLOAT etc
   */
  type: number
  count: number
}

export class ShaderWrapper implements Bindable {

  public stride = 0
  public layout: VertexBufferLayout
  public vertexArray: VertexArray

  constructor(
    gl: WebGL2RenderingContext,
    public shader: Shader,

    public shaderAttributes: AttribLayout[]
  ) {
    shader.bind()
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
    this.vertexArray.bind()
    this.vertexArray.addBuffer(this.layout)

    this.vertexArray.unbind()
    shader.unbind()
  }

  public bind() {
    this.shader.bind()
    this.vertexArray.bind()
  }

  public unbind() {
    this.shader.unbind()
    this.vertexArray.unbind()
  }

  public use() {
    this.vertexArray.addBuffer(this.layout)
  }

}