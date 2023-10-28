import {BaseDrawableConfig, Drawable} from "../../drawable/Drawable";
import {Shader} from "../../core/Shader";
import {VertexBuffer} from "../../core/VertexBuffer";
import {VertexBufferLayout} from "../../core/VertexBufferLayout";
import {VertexArray} from "../../core/VertexArray";
import Coordinate from "../../base/Coordinate";
import RoundClipColoredShader from "../../shader/RoundClipColoredShader";
import {ATTR_COLOR, ATTR_POSITION, UNI_CIRCLE, UNI_ORTH, UNI_TRANSFORM} from "../../shader/ShaderConstant";
import {Shape2D} from "../../util/Shape2D";
import {ObjectTransition} from "../../transition/Transition";
import {Time} from "../../../global/Time";
import {Color} from "../../base/Color";

export class CircleBackground extends Drawable {

  private readonly shader: Shader
  private readonly buffer: VertexBuffer
  private readonly layout: VertexBufferLayout
  private readonly vertexArray: VertexArray

  private radius = 50
  private thickWidth = 10
  private radiusTransition = new ObjectTransition(this, 'radius')
  private thickWidthTransition = new ObjectTransition(this, 'thickWidth')

  constructor(
    gl: WebGL2RenderingContext,
    config: BaseDrawableConfig
  ) {
    super(gl, config)
    const vertexArray = new VertexArray(gl)
    vertexArray.bind()
    const buffer = new VertexBuffer(gl, null, gl.STREAM_DRAW)
    const shader = RoundClipColoredShader.newShader(gl)
    const layout = new VertexBufferLayout(gl)

    buffer.bind()
    shader.bind()

    layout.pushFloat(shader.getAttributeLocation(ATTR_POSITION), 2)
    layout.pushFloat(shader.getAttributeLocation(ATTR_COLOR), 4)
    vertexArray.addBuffer(buffer, layout)

    vertexArray.unbind()
    buffer.unbind()
    shader.unbind()

    this.vertexArray = vertexArray
    this.buffer = buffer;
    this.layout = layout
    this.shader = shader

    setTimeout(() => {
      this.radiusBegin()
        .transitionTo(200 * window.devicePixelRatio, 1000)
      this.thickWidthBegin()
        .transitionTo(400, 1000)
      this.rotateBegin()
        .transitionTo(-90, 1000)
    }, 1000)


  }

  private radiusBegin(atTime: number = Time.currentTime) {
    this.radiusTransition.setStartTime(atTime)
    return this.radiusTransition
  }

  private thickWidthBegin(atTime: number = Time.currentTime) {
    this.thickWidthTransition.setStartTime(atTime)
    return this.thickWidthTransition
  }

  private vertex = new Float32Array([])
  private uniCircle = new Float32Array([0, 0, 0])
  private white = Color.fromHex(0xffffff)
  private gray = Color.fromHex(0x808080, 0x80)
  protected onUpdate() {
    super.onUpdate();
    this.radiusTransition.update(Time.currentTime)
    this.thickWidthTransition.update(Time.currentTime)

    const data: number[] = []
    Shape2D.quad(
      -500, this.thickWidth / 2,
      500, -this.thickWidth / 2,
      data, 0, 6
    )
    Shape2D.oneColor(this.gray, data, 2, 6)
    Shape2D.quad(
      -this.thickWidth / 2, 500,
      this.thickWidth / 2, -500,
      data, 36, 6
    )
    Shape2D.oneColor(this.white, data, 38, 6)
    this.vertex = new Float32Array(data)
  }

  protected onTransformApplied() {
    super.onTransformApplied();
    this.uniCircle[0] = Coordinate.width / 2 * window.devicePixelRatio
    this.uniCircle[1] = Coordinate.height / 2 * window.devicePixelRatio
    this.uniCircle[2] = this.radius
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
    this.buffer.setBufferData(this.vertex)
    const shader = this.shader
    shader.setUniformMatrix4fv(UNI_TRANSFORM, this.matrixArray)
    shader.setUniformMatrix4fv(UNI_ORTH, Coordinate.orthographicProjectionMatrix4)
    shader.setUniform3fv(UNI_CIRCLE, this.uniCircle)
    this.vertexArray.addBuffer(this.buffer, this.layout)
    gl.drawArrays(gl.TRIANGLES, 0, 12)
  }

  public dispose() {
    this.vertexArray.dispose()
    this.shader.dispose()
    this.buffer.dispose()
  }



}