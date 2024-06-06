import {ShaderWrapper} from "./ShaderWrapper";
import {Shader} from "../core/Shader";
import {ShaderSource} from "./ShaderSource";
import {ATTR_COLOR, ATTR_POSITION, UNI_CIRCLE, UNI_ORTH, UNI_RESOLUTION} from "./ShaderConstant";
import {ArrayUtils} from "../../util/ArrayUtils";
import type {WebGLRenderer} from "../WebGLRenderer";
import type {Vector2} from "../core/Vector2";

export class RoundClipShaderWrapper extends ShaderWrapper {

  constructor(renderer: WebGLRenderer) {
    const gl = renderer.gl
    const shader = new Shader(gl, ShaderSource.RoundClip.vertex, ShaderSource.RoundClip.fragment)
    super(renderer, shader, [
      { name: ATTR_POSITION, count: 2, type: gl.FLOAT },
      { name: ATTR_COLOR, count: 4, type: gl.FLOAT }
    ]);
  }

  private _orth: Float32Array = ArrayUtils.emptyFloat32Array
  public set orth(mat4: Float32Array) {
    if (!ArrayUtils.equals(this._orth, mat4)) {
      this.shader.setUniformMatrix4fv(UNI_ORTH, mat4)
      this._orth = mat4
    }
  }

  // private _transform: Float32Array = ArrayUtils.emptyFloat32Array
  // public set transform(mat4: Float32Array) {
  //   if (!ArrayUtils.equals(this._transform, mat4)) {
  //     this.shader.setUniformMatrix4fv(UNI_TRANSFORM, mat4)
  //     this._transform = mat4
  //   }
  // }

  private _light = Number.NaN
  public set light(light: number) {
    if (this._light !== light) {
      this.shader.setUniform1f('u_light', light)
      this._light = light
    }
  }

  private _circle = ArrayUtils.emptyFloat32Array
  /**
   *
   * @param circle 数据分布 [x, y, radius]
   */
  public set circle(circle: Float32Array) {
    if (!ArrayUtils.equals(this._circle, circle)) {
      this.shader.setUniform3fv(UNI_CIRCLE, circle)
      this._circle = circle
    }
  }

  private _resolution = new Float32Array(2)
  public set resolution(r: Vector2) {
    const res = this._resolution
    if (res[0] !== r.x || res[1] !== r.y) {
      res[0] = r.x
      res[1] = r.y
      this.shader.setUniform2fv(UNI_RESOLUTION, res)
    }
  }

  public unbind() {
    super.unbind();
    this._orth = ArrayUtils.emptyFloat32Array
    // this._transform = ArrayUtils.emptyFloat32Array
    this._circle = ArrayUtils.emptyFloat32Array
    this._light = Number.NaN
    this._resolution[0] = 0
    this._resolution[1] = 0
  }

}