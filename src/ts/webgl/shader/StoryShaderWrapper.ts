import {ShaderWrapper} from "./ShaderWrapper";
import type {WebGLRenderer} from "../WebGLRenderer";
import {Shader} from "../core/Shader";
import {ShaderSource} from "./ShaderSource";
import {ATTR_POSITION, ATTR_TEXCOORD, UNI_COLOR, UNI_ORTH, UNI_SAMPLER, UNI_TRANSFORM} from "./ShaderConstant";
import {ArrayUtils} from "../../util/ArrayUtils";
import type {Color} from "../base/Color";

export class StoryShaderWrapper extends ShaderWrapper {
  constructor(renderer: WebGLRenderer) {
    const gl = renderer.gl
    const shader = new Shader(gl, ShaderSource.StoryDefault.vertex, ShaderSource.StoryDefault.fragment)
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

  private _transform: Float32Array = ArrayUtils.emptyFloat32Array
  public set transform(mat4: Float32Array) {
    if (!ArrayUtils.equals(this._transform, mat4)) {
      this.shader.setUniformMatrix4fv(UNI_TRANSFORM, mat4)
      this._transform = mat4
    }
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
    this._transform = ArrayUtils.emptyFloat32Array
    this._sampler2D = Number.NaN
  }
}