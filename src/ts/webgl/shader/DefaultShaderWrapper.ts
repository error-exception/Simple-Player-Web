import {ShaderWrapper} from "./ShaderWrapper";
import {ShaderSource} from "./ShaderSource";
import {Shader} from "../core/Shader";
import {ATTR_POSITION, ATTR_TEXCOORD, UNI_COLOR, UNI_ORTH, UNI_SAMPLER, UNI_TRANSFORM} from "./ShaderConstant";
import type {Color} from "../base/Color";

export class DefaultShaderWrapper extends ShaderWrapper {

  constructor(gl: WebGL2RenderingContext) {
    const shader = new Shader(gl, ShaderSource.Default.vertex, ShaderSource.Default.fragment)
    super(gl, shader, [
      { name: ATTR_POSITION, count: 2, type: gl.FLOAT },
      { name: ATTR_TEXCOORD, count: 2, type: gl.FLOAT }
    ]);
  }

  public set orth(mat4: Float32Array) {
    this.shader.setUniformMatrix4fv(UNI_ORTH, mat4)
  }

  public set transform(mat4: Float32Array) {
    this.shader.setUniformMatrix4fv(UNI_TRANSFORM, mat4)
  }

  private colorArray = new Float32Array(4)
  public set color(color: Color) {
    const arr = this.colorArray
    arr[0] = color.red
    arr[1] = color.green
    arr[2] = color.blue
    arr[3] = color.alpha
    this.shader.setUniform4fv(UNI_COLOR, arr)
  }

  public set sampler2D(sampler: number) {
    this.shader.setUniform1i(UNI_SAMPLER, sampler)
  }

}