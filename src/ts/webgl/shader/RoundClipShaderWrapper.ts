import {ShaderWrapper} from "./ShaderWrapper";
import {Shader} from "../core/Shader";
import {ShaderSource} from "./ShaderSource";
import {ATTR_COLOR, ATTR_POSITION, UNI_CIRCLE, UNI_ORTH, UNI_TRANSFORM} from "./ShaderConstant";

export class RoundClipShaderWrapper extends ShaderWrapper {

  constructor(gl: WebGL2RenderingContext) {
    const shader = new Shader(gl, ShaderSource.RoundClip.vertex, ShaderSource.RoundClip.fragment)
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

  public set light(light: number) {
    this.shader.setUniform1f('u_light', light)
  }

  /**
   *
   * @param circle 数据分布 [x, y, radius]
   */
  public set circle(circle: Float32Array) {
    this.shader.setUniform3fv(UNI_CIRCLE, circle)
  }

}