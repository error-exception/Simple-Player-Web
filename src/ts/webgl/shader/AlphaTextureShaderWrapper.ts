import {ShaderWrapper} from "./ShaderWrapper";
import {Shader} from "../core/Shader";
import {ShaderSource} from "./ShaderSource";
import {ATTR_ALPHA, ATTR_POSITION, ATTR_TEXCOORD, UNI_ORTH, UNI_SAMPLER, UNI_TRANSFORM} from "./ShaderConstant";
import {ArrayUtils} from "../../util/ArrayUtils";
import type {WebGLRenderer} from "../WebGLRenderer";

export class AlphaTextureShaderWrapper extends ShaderWrapper {

  constructor(renderer: WebGLRenderer) {
    const gl = renderer.gl
    const shader = new Shader(gl, ShaderSource.AlphaTexture.vertex, ShaderSource.AlphaTexture.fragment)
    super(renderer, shader, [
      { name: ATTR_POSITION, count: 2, type: gl.FLOAT },
      { name: ATTR_TEXCOORD, count: 2, type: gl.FLOAT },
      { name: ATTR_ALPHA, count: 1, type: gl.FLOAT }
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

  private _sampler2D = Number.NaN
  public set sampler2D(sampler: number) {
    if (sampler !== this._sampler2D) {
      this.shader.setUniform1i(UNI_SAMPLER, sampler)
      this._sampler2D = sampler
    }
  }

  public unbind() {
    super.unbind();
    this._orth = ArrayUtils.emptyFloat32Array
    // this._transform = ArrayUtils.emptyFloat32Array
    this._sampler2D = Number.NaN
  }
}