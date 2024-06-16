import {ShaderWrapper} from "./ShaderWrapper";
import type {WebGLRenderer} from "../WebGLRenderer";
import {Shader} from "../core/Shader";
import {ShaderSource} from "./ShaderSource";
import {ATTR_POSITION, ATTR_TEXCOORD, UNI_ALPHA, UNI_BRIGHTNESS, UNI_ORTH, UNI_SAMPLER} from "./ShaderConstant";
import {ArrayUtils} from "../../util/ArrayUtils";
import {almostEquals} from "../core/Utils";

export class BrightnessTextureShaderWrapper extends ShaderWrapper {

  constructor(renderer: WebGLRenderer) {
    const gl= renderer.gl
    const shader = new Shader(gl, ShaderSource.BrightnessTexture.vertex, ShaderSource.BrightnessTexture.fragment)
    super(renderer, shader, [
      { name: ATTR_POSITION, count: 2, type: gl.FLOAT },
      { name: ATTR_TEXCOORD, count: 2, type: gl.FLOAT }
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
    if (!almostEquals(a, this._alpha)) {
      this.shader.setUniform1f(UNI_ALPHA, a)
      this._alpha = a
    }
  }

  private _sampler2D = Number.NaN
  public set sampler2D(sampler: number) {
    if (sampler !== this._sampler2D) {
      this.shader.setUniform1i(UNI_SAMPLER, sampler)
      this._sampler2D = sampler
    }
  }

  private _brightness = Number.NaN
  public set brightness(b: number) {
    if (!almostEquals(b, this._brightness)) {
      this.shader.setUniform1f(UNI_BRIGHTNESS, b)
      this._brightness = b
    }
  }


  public unbind() {
    super.unbind();
    this._orth = ArrayUtils.emptyFloat32Array
    // this._transform = ArrayUtils.emptyFloat32Array
    this._sampler2D = Number.NaN
    this._alpha = Number.NaN
    this._brightness = Number.NaN
  }


}