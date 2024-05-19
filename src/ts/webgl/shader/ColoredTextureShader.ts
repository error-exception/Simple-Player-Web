import {BaseShader} from "./BaseShader";
import {Disposable} from "../core/Disposable";
import { VertexBufferLayout } from "../core/VertexBufferLayout";
import { Shader } from "../core/Shader";
import {Nullable} from "../../type";
import {VertexArray} from "../core/VertexArray";

export interface ColoredTextureShaderUniform {
  orth?: Float32Array,
  transform?: Float32Array,
  sampler?: number,
  color?: Float32Array
}

class ColoredTextureShader extends BaseShader implements Disposable {
  protected vertex = `
    attribute vec2 a_position;
    attribute vec2 a_texcoord;
    
    varying vec2 v_texcoord;
    
    uniform mat4 u_orth;
    uniform mat4 u_transform;
    
    void main() {
        vec4 position = vec4(a_position, 0.0, 1.0) * u_transform;
        gl_Position = position * u_orth;
        v_texcoord = a_texcoord;
    }
  `
  protected fragment = `
    varying highp vec2 v_texcoord;
    
    uniform sampler2D u_sampler;
    uniform mediump vec4 u_color;
    
    void main() {
        mediump vec4 tex_color = texture2D(u_sampler, v_texcoord);
        mediump vec4 out_color = vec4(tex_color.rgba * u_color.rgba);
        gl_FragColor = out_color;
    }
  `
  protected shader: Nullable<Shader> = null
  protected layout: Nullable<VertexBufferLayout> = null
  protected vertexArray: Nullable<VertexArray> = null

  getVertexArray(): VertexArray {
    return this.vertexArray!
  }

  getLayout(): VertexBufferLayout {
    return this.layout!;
  }

  getShader(gl: WebGL2RenderingContext): Shader {
    if (this.shader === null) {
      this.shader = new Shader(gl, this.vertex, this.fragment)
      this.layout = new VertexBufferLayout(gl)
      this.vertexArray = new VertexArray(gl)
      this.vertexArray.bind()
      this.shader.bind()
      this.layout.pushFloat(this.shader.getAttributeLocation("a_position"), 2)
      this.layout.pushFloat(this.shader.getAttributeLocation("a_texcoord"), 2)
      this.vertexArray.addBuffer(this.layout)
      this.shader.unbind()
      this.vertexArray.unbind()
    }
    return this.shader!;
  }

  newShader(gl: WebGL2RenderingContext): Shader {
    return new Shader(gl, this.vertex, this.fragment);
  }

  createUniform(): ColoredTextureShaderUniform {
    return { orth: undefined, color: undefined, sampler: undefined, transform: undefined }
  }

  setUniform(uniform: ColoredTextureShaderUniform) {
    const shader = this.shader
    if (!shader) {
      return
    }
    if (uniform.orth) shader.setUniformMatrix4fv('u_orth', uniform.orth)
    if (uniform.transform) shader.setUniformMatrix4fv('u_transform', uniform.transform)
    if (uniform.sampler) shader.setUniform1i("u_sampler", uniform.sampler)
    if (uniform.color) shader.setUniform4fv("u_color", uniform.color)
  }

  dispose() {
    this.shader?.dispose()
    this.shader = null
  }

}

export default new ColoredTextureShader()