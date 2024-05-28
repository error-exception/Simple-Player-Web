import {ShaderWrapper} from "./ShaderWrapper";
import {Shader} from "../core/Shader";
import {ShaderSource} from "./ShaderSource";
import {ATTR_COLOR, ATTR_POSITION, UNI_ALPHA, UNI_ORTH, UNI_TRANSFORM} from "./ShaderConstant";

export class SimpleShaderWrapper extends ShaderWrapper {

  constructor(gl: WebGL2RenderingContext) {
    const shader = new Shader(gl, ShaderSource.Simple.vertex, ShaderSource.Simple.fragment)
    super(gl, shader, [
      { name: ATTR_POSITION, count: 2, type: gl.FLOAT },
      { name: ATTR_COLOR, count: 4, type: gl.FLOAT }
    ]);
  }

  public set orth(mat4: Float32Array) {
    this.shader.setUniformMatrix4fv(UNI_ORTH, mat4)
  }

  public set transform(mat4: Float32Array) {
    this.shader.setUniformMatrix4fv(UNI_TRANSFORM, mat4)
  }

  public set alpha(a: number) {
    this.shader.setUniform1f(UNI_ALPHA, a)
  }

}