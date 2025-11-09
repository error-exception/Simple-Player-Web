import { ArrayUtils } from "../../../util/ArrayUtils";
import type { WebGLRenderer } from "../../WebGLRenderer";
import { DrawState } from "../../canvas/Canvas";
import { hasFlag } from "../../util/flagUtils";
import { Shader } from "../core/Shader";
import { ATTR_COLOR, ATTR_POSITION, UNI_ALPHA, UNI_FLAG_ALPHA, UNI_FLAG_ORTH, UNI_ORTH } from "./ShaderConstant";
import { ShaderSource } from "./ShaderSource";
import { ShaderWrapper, VerticesAddAction } from "./ShaderWrapper";

class SimpleVerticesAddAction extends VerticesAddAction {

  addVertex(state: DrawState, target: number[], ...vertex: vec2[]) {
    if (vertex.length === 0) {
      return
    }
    const shader = this.shader as SimpleShaderWrapper
    const color = state.fillColor
    shader.orth = shader.renderer.currentOrth()
    shader.alpha = state.globalAlpha
    for (let i = 0; i < vertex.length; i++) {
      target.push(
        vertex[i][0], vertex[i][1],
        color[0], color[1], color[2], color[3]
      )
    }

  }

}

export class SimpleShaderWrapper extends ShaderWrapper {

  public addAction: SimpleVerticesAddAction = new SimpleVerticesAddAction(this)

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
      // this.shader.setUniformMatrix4fv(UNI_ORTH, mat4)
      this.uniformDirtyFlag |= UNI_FLAG_ORTH
      this._orth = mat4
    }
  }

  private _alpha = Number.NaN
  public set alpha(a: number) {
    if (this._alpha !== a) {
      // this.shader.setUniform1f(UNI_ALPHA, a)
      this.uniformDirtyFlag |= UNI_FLAG_ALPHA
      this._alpha = a
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
    this.uniformDirtyFlag = 0
  }

  public unbind() {
    super.unbind();
    this._orth = ArrayUtils.emptyFloat32Array
    this._alpha = Number.NaN
  }

}