import {BaseShader} from "./BaseShader";
import {Disposable} from "../core/Disposable";
import { VertexBufferLayout } from "../core/VertexBufferLayout";
import { Shader } from "../core/Shader";
import {Nullable} from "../../type";

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
    varying mediump vec2 v_texcoord;
    
    uniform sampler2D u_sampler;
    uniform highp vec4 u_color;
    
    void main() {
        highp vec4 tex_color = texture2D(u_sampler, v_texcoord);
        tex_color = tex_color * u_color;
        gl_FragColor = tex_color;
    }
  `
  protected shader: Nullable<Shader> = null
  protected layout: Nullable<VertexBufferLayout> = null

  getLayout(): VertexBufferLayout {
    return this.layout!;
  }

  getShader(gl: WebGL2RenderingContext): Shader {
    if (this.shader === null) {
      this.shader = new Shader(gl, this.vertex, this.fragment)
      this.layout = new VertexBufferLayout(gl)
      this.shader.bind()
      this.layout.pushFloat(this.shader.getAttributeLocation("a_position"), 2)
      this.layout.pushFloat(this.shader.getAttributeLocation("a_texcoord"), 2)
      this.shader.unbind()
    }
    return this.shader!;
  }

  newShader(gl: WebGL2RenderingContext): Shader {
    return new Shader(gl, this.vertex, this.fragment);
  }

  dispose() {
    this.shader?.dispose()
    this.shader = null
  }

}

export default new ColoredTextureShader()