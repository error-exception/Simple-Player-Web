import { ShaderWrapper, VerticesAddAction } from "./ShaderWrapper";
import type { WebGLRenderer } from "../../WebGLRenderer";
import { Shader } from "../core/Shader";
import { ShaderSource } from "./ShaderSource";
import {
  ATTR_POSITION,
  ATTR_TEXCOORD,
  UNI_ALPHA,
  UNI_BRIGHTNESS, UNI_FLAG_ALPHA, UNI_FLAG_BRIGHTNESS,
  UNI_FLAG_ORTH, UNI_FLAG_SAMPLER,
  UNI_ORTH,
  UNI_SAMPLER
} from "./ShaderConstant";
import { ArrayUtils } from "../../../util/ArrayUtils";
import { almostEquals } from "../core/Utils";
import { hasFlag } from "../../util/flagUtils";
import { DrawState } from "../../canvas/Canvas";
import { Coordinate2 } from "../../base/Coordinate2";

class BrightnessTextureVerticesAddAction extends VerticesAddAction {

  addVertex(state: DrawState, target: number[], ...vertex: vec2[]) {
    const shader = this.shader as BrightnessTextureShaderWrapper
    shader.alpha = state.globalAlpha
    shader.sampler2D = 0
    shader.orth = shader.renderer.currentOrth()

  }

}

/**
 * @deprecated
 */
export class BrightnessTextureShaderWrapper extends ShaderWrapper {

  public addAction: VerticesAddAction = new BrightnessTextureVerticesAddAction(this)

  constructor(renderer: WebGLRenderer) {
    const gl = renderer.gl
    const shader = new Shader(gl, ShaderSource.BrightnessTexture.vertex, ShaderSource.BrightnessTexture.fragment)
    super(renderer, shader, [
      { name: ATTR_POSITION, count: 2, type: gl.FLOAT },
      { name: ATTR_TEXCOORD, count: 2, type: gl.FLOAT }
    ]);
  }

  private _orth: Float32Array = ArrayUtils.emptyFloat32Array
  public set orth(mat4: Float32Array) {
    if (!ArrayUtils.equals(this._orth, mat4)) {
      // this.shader.setUniformMatrix4fv(UNI_ORTH, mat4)
      this.uniformDirtyFlag |= UNI_FLAG_ORTH
      this._orth = mat4
    }
  }

  private _alpha = Number.NaN
  public set alpha(a: number) {
    if (!almostEquals(a, this._alpha)) {
      // this.shader.setUniform1f(UNI_ALPHA, a)
      this.uniformDirtyFlag |= UNI_FLAG_ALPHA
      this._alpha = a
    }
  }

  private _sampler2D = Number.NaN
  public set sampler2D(sampler: number) {
    if (sampler !== this._sampler2D) {
      // this.shader.setUniform1i(UNI_SAMPLER, sampler)
      this.uniformDirtyFlag |= UNI_FLAG_SAMPLER
      this._sampler2D = sampler
    }
  }

  private _brightness = Number.NaN
  public set brightness(b: number) {
    if (!almostEquals(b, this._brightness)) {
      // this.shader.setUniform1f(UNI_BRIGHTNESS, b)
      this.uniformDirtyFlag |= UNI_FLAG_BRIGHTNESS
      this._brightness = b
    }
  }

  public bind() {
    super.bind();
    const shader = this.shader, flag = this.uniformDirtyFlag
    if (hasFlag(flag, UNI_FLAG_ORTH)) {
      shader.setUniformMatrix4fv(UNI_ORTH, this.renderer.currentOrth())
    }
    if (hasFlag(flag, UNI_FLAG_ALPHA)) {
      shader.setUniform1f(UNI_ALPHA, this._alpha)
    }
    if (hasFlag(flag, UNI_FLAG_SAMPLER)) {
      shader.setUniform1i(UNI_SAMPLER, this._sampler2D)
    }
    if (hasFlag(flag, UNI_FLAG_BRIGHTNESS)) {
      shader.setUniform1f(UNI_BRIGHTNESS, this._brightness)
    }
    this.uniformDirtyFlag = 0
  }

  public unbind() {
    super.unbind();
    this._orth = ArrayUtils.emptyFloat32Array
    this._sampler2D = Number.NaN
    this._alpha = Number.NaN
    this._brightness = Number.NaN
  }


}