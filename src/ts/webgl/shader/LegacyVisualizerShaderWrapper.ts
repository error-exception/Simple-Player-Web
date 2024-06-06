import {ShaderWrapper} from "./ShaderWrapper";
import type {WebGLRenderer} from "../WebGLRenderer";
import {Shader} from "../core/Shader";
import {ShaderSource} from "./ShaderSource";
import {ArrayUtils} from "../../util/ArrayUtils";
import {UNI_ORTH} from "./ShaderConstant";

export class LegacyVisualizerShaderWrapper extends ShaderWrapper {

  constructor(renderer: WebGLRenderer) {
    const gl = renderer.gl
    const shader = new Shader(gl, ShaderSource.LegacyVisualizer.vertex, ShaderSource.LegacyVisualizer.fragment)
    super(renderer, shader, [
      { name: 'a_vertexPosition', count: 2, type: gl.FLOAT },
      { name: 'a_tex_coord', count: 2, type: gl.FLOAT },
      { name: 'a_sampler_flag', count: 1, type: gl.FLOAT}
    ]);
  }

  private _orth: Float32Array = ArrayUtils.emptyFloat32Array
  public set orth(mat4: Float32Array) {
    if (!ArrayUtils.equals(this._orth, mat4)) {
      this.shader.setUniformMatrix4fv(UNI_ORTH, mat4)
      this._orth = mat4
    }
  }

  private _alpha = Number.NaN
  public set alpha(a: number) {
    if (this._alpha !== a) {
      this.shader.setUniform1f('u_alpha', a)
      this._alpha = a
    }
  }

  private _sampler2D1 = Number.NaN
  public set sampler2D1(sampler: number) {
    if (this._sampler2D1 !== sampler) {
      this.shader.setUniform1i('u_sampler_4', sampler)
      this._sampler2D1 = sampler
    }
  }

  private _sampler2D2 = Number.NaN
  public set sampler2D2(sampler: number) {
    if (this._sampler2D2 !== sampler) {
      this.shader.setUniform1i('u_sampler_5', sampler)
      this._sampler2D2 = sampler
    }
  }

  public unbind() {
    super.unbind();
    this._orth = ArrayUtils.emptyFloat32Array
    this._alpha = Number.NaN
    this._sampler2D1 = -1
    this._sampler2D2 = -1
  }

}