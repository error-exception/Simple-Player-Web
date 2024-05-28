import {ShaderWrapper} from "./ShaderWrapper";
import {Shader} from "../core/Shader";
import {ShaderSource} from "./ShaderSource";
import {ATTR_ALPHA, ATTR_POSITION, ATTR_TEXCOORD, UNI_ORTH, UNI_SAMPLER, UNI_TRANSFORM} from "./ShaderConstant";

export class AlphaTextureShaderWrapper extends ShaderWrapper {

  constructor(gl: WebGL2RenderingContext) {
    const shader = new Shader(gl, ShaderSource.AlphaTexture.vertex, ShaderSource.AlphaTexture.fragment)
    super(gl, shader, [
      { name: ATTR_POSITION, count: 2, type: gl.FLOAT },
      { name: ATTR_TEXCOORD, count: 2, type: gl.FLOAT },
      { name: ATTR_ALPHA, count: 1, type: gl.FLOAT }
    ]);
  }

  public set orth(mat4: Float32Array) {
    this.shader.setUniformMatrix4fv(UNI_ORTH, mat4)
  }

  public set transform(mat4: Float32Array) {
    this.shader.setUniformMatrix4fv(UNI_TRANSFORM, mat4)
  }

  public set sampler2D(sampler: number) {
    this.shader.setUniform1i(UNI_SAMPLER, sampler)
  }
}