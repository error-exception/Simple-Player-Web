import {Shader} from "../core/Shader";
import {VertexBufferLayout} from "../core/VertexBufferLayout";
import {Nullable} from "../../type";

export let currentShader: Shader

export abstract class BaseShader {

  protected vertex: string = ''
  protected fragment: string = ''
  protected abstract shader: Nullable<Shader>
  protected abstract layout: Nullable<VertexBufferLayout>

  public abstract getShader(gl: WebGL2RenderingContext): Shader

  public abstract newShader(gl: WebGL2RenderingContext): Shader

  public abstract getLayout(): VertexBufferLayout

  public bind() {
    if (currentShader && currentShader !== this.shader) {
      currentShader.unbind()
    }
    currentShader = this.shader!
    currentShader.bind()
  }

}