import { ShaderWrapper, VerticesAddAction } from "./ShaderWrapper";
import { Shader } from "../core/Shader";
import { ShaderSource } from "./ShaderSource";
import {
  ATTR_ALPHA,
  ATTR_POSITION,
  ATTR_TEXCOORD,
  UNI_FLAG_ORTH,
  UNI_FLAG_SAMPLER,
  UNI_ORTH,
  UNI_SAMPLER
} from "./ShaderConstant";
import { ArrayUtils } from "../../../util/ArrayUtils";
import type { WebGLRenderer } from "../../WebGLRenderer";
import { hasFlag } from "../../util/flagUtils";
import { DrawState } from "../../canvas/Canvas";
import { Coordinate2 } from "../../base/Coordinate2";

class AlphaTextureVerticesAddAction extends VerticesAddAction {

  addVertex(state: DrawState, target: number[], ...vertex: vec2[]) {
    const alpha = state.globalAlpha
    const shader = this.shader as AlphaTextureShaderWrapper
    shader.sampler2D = 0
    shader.orth = shader.renderer.currentOrth()
    const a = vertex[0], b = vertex[1], c = vertex[2], d = vertex[3]
    target.push(
      a[0], a[1], 0, 0, alpha,
      b[0], b[1], 1, 0, alpha,
      c[0], c[1], 0, 1, alpha,
      d[0], d[1], 1, 1, alpha
    )
  }

}

export class AlphaTextureShaderWrapper extends ShaderWrapper {

  public addAction: AlphaTextureVerticesAddAction = new AlphaTextureVerticesAddAction(this)

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
      this.uniformDirtyFlag |= UNI_FLAG_ORTH
      this._orth = mat4
    }
  }

  private _sampler2D = Number.NaN
  public set sampler2D(sampler: number) {
    if (sampler !== this._sampler2D) {
      this.uniformDirtyFlag |= UNI_FLAG_SAMPLER
      this._sampler2D = sampler
    }
  }

  public bind() {
    super.bind();
    const flag = this.uniformDirtyFlag, shader = this.shader
    if (hasFlag(flag, UNI_FLAG_ORTH)) {
      shader.setUniformMatrix4fv(UNI_ORTH, this.renderer.currentOrth())
    }
    if (hasFlag(flag, UNI_FLAG_SAMPLER)) {
      shader.setUniform1i(UNI_SAMPLER, this._sampler2D)
    }
    this.uniformDirtyFlag = 0
  }

  public unbind() {
    super.unbind();
    this._orth = ArrayUtils.emptyFloat32Array
    this._sampler2D = Number.NaN
  }
}