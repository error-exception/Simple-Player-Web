import {Drawable} from "../../drawable/Drawable";
import {ColorDrawableConfig} from "../../drawable/ColorDrawable";
import {Shader} from "../../core/Shader";
import {VertexBuffer} from "../../core/VertexBuffer";
import {VertexBufferLayout} from "../../core/VertexBufferLayout";
import {VertexArray} from "../../core/VertexArray";
import {Shape2D} from "../../util/Shape2D";
import Coordinate from "../../base/Coordinate";
import RoundClipColoredShader from "../../shader/RoundClipColoredShader";
import {UNI_CIRCLE, UNI_ORTH, UNI_TRANSFORM} from "../../shader/ShaderConstant";
import {Vector2} from "../../core/Vector2";

export class RoundColorDrawable extends Drawable<ColorDrawableConfig> {
  private readonly shader: Shader
  private readonly buffer: VertexBuffer
  private readonly layout: VertexBufferLayout
  private readonly vertexArray: VertexArray
  private needUpdateVertex = true

  constructor(
    gl: WebGL2RenderingContext,
    config: ColorDrawableConfig
  ) {
    super(gl, config)
    const vertexArray = new VertexArray(gl)
    vertexArray.bind()
    const buffer = new VertexBuffer(gl)
    const shader = RoundClipColoredShader.newShader(gl)
    const layout = new VertexBufferLayout(gl)

    buffer.bind()
    shader.bind()

    layout.pushFloat(shader.getAttributeLocation('a_position'), 2)
    layout.pushFloat(shader.getAttributeLocation('a_color'), 4)
    vertexArray.addBuffer(layout)

    vertexArray.unbind()
    buffer.unbind()
    shader.unbind()

    this.vertexArray = vertexArray
    this.buffer = buffer;
    this.layout = layout
    this.shader = shader

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
    this.vertexArray.unbind()
    this.buffer.unbind()
    this.shader.unbind()
  }

  public bind() {
    this.vertexArray.bind()
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
    shader.setUniformMatrix4fv(UNI_TRANSFORM, this.matrixArray)
    shader.setUniformMatrix4fv(UNI_ORTH, Coordinate.orthographicProjectionMatrix4)
    shader.setUniform3fv(UNI_CIRCLE, this.uniCircle)
    this.vertexArray.addBuffer(this.layout)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }

  public dispose() {
    this.vertexArray.dispose()
    this.shader.dispose()
    this.buffer.dispose()
  }
}