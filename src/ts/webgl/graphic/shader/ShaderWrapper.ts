import { nullable } from "../../../Utils";
import { DrawState } from "../../canvas/Canvas";
import type { WebGLRenderer } from "../../WebGLRenderer";
import type { Bindable } from "../core/Bindable";
import type { Disposable } from "../core/Disposable";
import type { Shader } from "../core/Shader";
import { VertexArray } from "../core/VertexArray";
import { VertexBufferLayout } from "../core/VertexBufferLayout";

export interface AttribLayout {
  name: string
  /**
   * gl.FLOAT etc
   */
  type: number
  count: number
}

export class VerticesAddAction {

  constructor(public shader: ShaderWrapper) {

  }

  public extra = nullable<Record<string, any>>()

  addVertex(state: DrawState, target: number[], ...vertex: vec2[]) {

  }

}

export class ShaderWrapper implements Bindable, Disposable {

  public stride = 0
  public layout: VertexBufferLayout
  public vertexArray: VertexArray

  protected uniformDirtyFlag = 0

  public addAction: VerticesAddAction = new VerticesAddAction(this)

  constructor(
    public renderer: WebGLRenderer,
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
    shader.unbind()
  }

  public bind() {
    const renderer = this.renderer
    renderer.pushShader(this.shader)
    renderer.pushVertexArray(this.vertexArray)
  }

  public unbind() {
    const renderer = this.renderer
    renderer.popShader()
    renderer.popVertexArray()
  }

  public use() {
    this.vertexArray.addBuffer(this.layout)
  }

  public dispose() {
    this.shader.dispose()
    this.vertexArray.dispose()
  }

}