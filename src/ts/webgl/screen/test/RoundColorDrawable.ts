import {Drawable} from "../../drawable/Drawable";
import {ColorDrawableConfig} from "../../drawable/ColorDrawable";
import {VertexBuffer} from "../../core/VertexBuffer";
import {Shape2D} from "../../util/Shape2D";
import Coordinate from "../../base/Coordinate";
import {Vector2} from "../../core/Vector2";
import type {RoundClipShaderWrapper} from "../../shader/RoundClipShaderWrapper";
import {Shaders} from "../../shader/Shaders";

export class RoundColorDrawable extends Drawable<ColorDrawableConfig> {
  private readonly shader: RoundClipShaderWrapper
  private readonly buffer: VertexBuffer
  private needUpdateVertex = true

  constructor(
    gl: WebGL2RenderingContext,
    config: ColorDrawableConfig
  ) {
    super(gl, config)
    this.buffer = new VertexBuffer(gl);
    this.shader = Shaders.RoundClip

  }

  public createVertexArray() {
    const width = this.width
    const height= this.height
    const { x, y } = this.position
    const vertexData: number[] = []
    Shape2D.quad(
      x, y,
      x + width, y - height,
      vertexData, 0, 6
    )

    Shape2D.oneColor(this.config.color, vertexData, 2, 6)
    return new Float32Array(vertexData)
  }

  private uniCircle = new Float32Array([0, 0, 0])
  protected onTransformApplied() {
    super.onTransformApplied();
    const transform = this.appliedTransform
    const scaledWidth = this.width * window.devicePixelRatio * transform.scale.x
    const scaledHeight = this.height * window.devicePixelRatio * transform.scale.y
    const circleMaxRadius = Math.min(scaledWidth, scaledHeight) / 2
    const circleCenter = new Vector2(
      (Coordinate.width / 2 + transform.translate.x) * window.devicePixelRatio,
      (Coordinate.height / 2 + transform.translate.y) * window.devicePixelRatio
      // transform.translate.x,
      // transform.translate.y
      // 0, 0
    )
    this.uniCircle[0] = circleCenter.x
    this.uniCircle[1] = circleCenter.y
    this.uniCircle[2] = circleMaxRadius
  }

  public onWindowResize(): void {
    super.onWindowResize()
    this.needUpdateVertex = true
  }

  public unbind() {
    this.buffer.unbind()
    this.shader.unbind()
  }

  public bind() {
    this.buffer.bind()
    this.shader.bind()
  }

  public onDraw() {
    const gl = this.gl
    if (this.needUpdateVertex) {
      this.needUpdateVertex = false
      this.buffer.setBufferData(this.createVertexArray())
    }
    const shader = this.shader
    shader.transform = this.matrixArray
    shader.orth = Coordinate.orthographicProjectionMatrix4
    shader.circle = this.uniCircle
    shader.use()
    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }

  public dispose() {
    this.buffer.dispose()
  }
}