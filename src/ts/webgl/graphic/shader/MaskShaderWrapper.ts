import { ArrayUtils } from "../../../util/ArrayUtils";
import type { WebGLRenderer } from "../../WebGLRenderer";
import type { DrawState } from "../../canvas/Canvas";
import { hasFlag } from "../../util/flagUtils";
import { Shader } from "../core/Shader";
import { ATTR_POSITION, ATTR_TEXCOORD, UNI_FLAG_ORTH, UNI_FLAG_SAMPLER, UNI_ORTH, UNI_SAMPLER } from "./ShaderConstant";
import { ShaderSource } from "./ShaderSource";
import { ShaderWrapper, VerticesAddAction } from "./ShaderWrapper";

class MaskShaderVerticesAddAction extends VerticesAddAction {

  addVertex(state: DrawState, target: number[], ...vertex: vec2[]): void {
    if (vertex.length !== 4) {
      return
    }

    const shader = this.shader as MaskShaderWrapper
    shader.sampler2D = 0
    shader.orth = shader.renderer.currentOrth()
    if (vertex.length === 4) {
      const a = vertex[0], b = vertex[1], c = vertex[2], d = vertex[3]
      target.push(
        a[0], a[1], 0, 0,
        b[0], b[1], 1, 0,
        c[0], c[1], 0, 1,
        d[0], d[1], 1, 1
      )
    }
  }

}

export class MaskShaderWrapper extends ShaderWrapper {

  public addAction: MaskShaderVerticesAddAction = new MaskShaderVerticesAddAction(this)

  constructor(renderer: WebGLRenderer) {
    const gl = renderer.gl
    const shader = new Shader(gl, ShaderSource.Mask.vertex, ShaderSource.Mask.fragment)
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

  // private colorArray = new Float32Array(4)
  // public set color(color: Color) {
  //   const arr = this.colorArray
  //   arr[0] = color.red
  //   arr[1] = color.green
  //   arr[2] = color.blue
  //   arr[3] = color.alpha
  //   this.shader.setUniform4fv(UNI_COLOR, arr)
  // }

  private _sampler2D = Number.NaN
  public set sampler2D(sampler: number) {
    if (sampler !== this._sampler2D) {
      // this.shader.setUniform1i(UNI_SAMPLER, sampler)
      this.uniformDirtyFlag |= UNI_FLAG_SAMPLER
      this._sampler2D = sampler
    }
  }

  // private _maskSampler2D = Number.NaN
  // public set maskSampler2D(sampler: number) {
  //   if (sampler !== this._maskSampler2D) {
  //     this.shader.setUniform1i('u_sampler_mask', sampler)
  //     this._maskSampler2D = sampler
  //   }
  // }

  public bind() {
    super.bind();
    const shader = this.shader
    const flag = this.uniformDirtyFlag
    if (hasFlag(flag, UNI_FLAG_ORTH)) {
      shader.setUniformMatrix4fv(UNI_ORTH, this._orth)
    }
    if (hasFlag(flag, UNI_FLAG_SAMPLER)) {
      shader.setUniform1i(UNI_SAMPLER, this._sampler2D)
    }
    this.uniformDirtyFlag = 0
  }

  public unbind() {
    super.unbind();
    this._orth = ArrayUtils.emptyFloat32Array
    // this._transform = ArrayUtils.emptyFloat32Array
    this._sampler2D = Number.NaN
    // this._maskSampler2D = Number.NaN
  }

}