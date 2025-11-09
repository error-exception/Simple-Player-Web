import { ShaderWrapper, VerticesAddAction } from "./ShaderWrapper";
import { ShaderSource } from "./ShaderSource";
import { Shader } from "../core/Shader";
import {
  ATTR_POSITION,
  ATTR_TEXCOORD,
  UNI_COLOR,
  UNI_FLAG_COLOR,
  UNI_FLAG_ORTH,
  UNI_FLAG_SAMPLER,
  UNI_ORTH,
  UNI_SAMPLER
} from "./ShaderConstant";
import { color, Color, type Color4 } from "../../base/Color";
import { ArrayUtils } from "../../../util/ArrayUtils";
import type { WebGLRenderer } from "../../WebGLRenderer";
import { hasFlag } from "../../util/flagUtils";
import { DrawState } from "../../canvas/Canvas";
import { Vector2 } from "../core/Vector2";
import { Coordinate2 } from "../../base/Coordinate2";

class DefaultShaderVerticesAddAction extends VerticesAddAction {

  addVertex(state: DrawState, target: number[], ...vertex: vec2[]) {
    if (vertex.length !== 4 && vertex.length !== 8) {
      return
    }

    const shader = this.shader as DefaultShaderWrapper
    shader.sampler2D = 0
    const c = color.clone(state.fillColor)
    c[3] *= state.globalAlpha
    shader.color = c
    shader.orth = shader.renderer.currentOrth()
    if (vertex.length === 4) {
      const a = vertex[0], b = vertex[1], c = vertex[2], d = vertex[3]
      target.push(
        a[0], a[1], 0, 0,
        b[0], b[1], 1, 0,
        c[0], c[1], 0, 1,
        d[0], d[1], 1, 1
      )
    } else if (vertex.length === 8) {
      const a = vertex[0], texA = vertex[1],
        b = vertex[2], texB = vertex[3],
        c = vertex[4], texC = vertex[5],
        d = vertex[6], texD = vertex[7]
      target.push(
        a[0], a[1], texA[0], texA[1],
        b[0], b[1], texB[0], texB[1],
        c[0], c[1], texC[0], texC[1],
        d[0], d[1], texD[0], texD[1]
      )
    }
  }
}

export class DefaultShaderWrapper extends ShaderWrapper {

  public addAction: DefaultShaderVerticesAddAction = new DefaultShaderVerticesAddAction(this)

  constructor(renderer: WebGLRenderer) {
    const gl = renderer.gl
    const shader = new Shader(gl, ShaderSource.Default.vertex, ShaderSource.Default.fragment)
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

  private colorArray = new Float32Array(4)
  public set color(c: Color4) {
    this.colorArray.set(c)
    this.uniformDirtyFlag |= UNI_FLAG_COLOR
    // this.shader.setUniform4fv(UNI_COLOR, arr)
  }

  private _sampler2D = Number.NaN
  public set sampler2D(sampler: number) {
    if (sampler !== this._sampler2D) {
      // this.shader.setUniform1i(UNI_SAMPLER, sampler)
      this.uniformDirtyFlag |= UNI_FLAG_SAMPLER
      this._sampler2D = sampler
    }
  }

  public bind() {
    super.bind();
    const shader = this.shader
    const flag = this.uniformDirtyFlag
    if (hasFlag(flag, UNI_FLAG_ORTH)) {
      shader.setUniformMatrix4fv(UNI_ORTH, this.renderer.currentOrth())
    }
    if (hasFlag(flag, UNI_FLAG_COLOR)) {
      shader.setUniform4fv(UNI_COLOR, this.colorArray)
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