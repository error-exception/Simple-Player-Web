import {ShaderWrapper} from "./ShaderWrapper";
import {Shader} from "../core/Shader";
import {ShaderSource} from "./ShaderSource";
import {ATTR_COLOR, ATTR_POSITION, UNI_ALPHA, UNI_ORTH, UNI_TRANSFORM} from "./ShaderConstant";
import {ArrayUtils} from "../../util/ArrayUtils";
import type {WebGLRenderer} from "../WebGLRenderer";

export class SimpleShaderWrapper extends ShaderWrapper {

  constructor(renderer: WebGLRenderer) {
    const gl = renderer.gl
    const shader = new Shader(gl, ShaderSource.Simple.vertex, ShaderSource.Simple.fragment)
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

  private _transform: Float32Array = ArrayUtils.emptyFloat32Array
  public set transform(mat4: Float32Array) {
    if (!ArrayUtils.equals(this._transform, mat4)) {
      this.shader.setUniformMatrix4fv(UNI_TRANSFORM, mat4)
      this._transform = mat4
    }
  }

  private _alpha = Number.NaN
  public set alpha(a: number) {
    if (this._alpha !== a) {
      this.shader.setUniform1f(UNI_ALPHA, a)
      this._alpha = a
    }
  }

  public unbind() {
    super.unbind();
    this._orth = ArrayUtils.emptyFloat32Array
    this._transform = ArrayUtils.emptyFloat32Array
    this._alpha = Number.NaN
  }

}