import {BaseDrawableConfig, Drawable} from "../../drawable/Drawable";
import {VertexBuffer} from "../../core/VertexBuffer";
import Coordinate from "../../base/Coordinate";
import {Shape2D} from "../../util/Shape2D";
import {ObjectTransition} from "../../transition/Transition";
import {Time} from "../../../global/Time";
import {Color} from "../../base/Color";
import {easeIn} from "../../../util/Easing";
import {Shaders} from "../../shader/Shaders";
import type {RoundClipShaderWrapper} from "../../shader/RoundClipShaderWrapper";

export class CircleBackground extends Drawable {

  private readonly shader: RoundClipShaderWrapper
  private readonly buffer: VertexBuffer
  private radius = 240
  private thickWidth = 0
  private radiusTransition = new ObjectTransition(this, 'radius')
  private thickWidthTransition = new ObjectTransition(this, 'thickWidth')

  constructor(
    gl: WebGL2RenderingContext,
    config: BaseDrawableConfig
  ) {
    super(gl, config)
    this.buffer = new VertexBuffer(gl, null, gl.STREAM_DRAW);
    this.shader = Shaders.RoundClip

    setTimeout(() => {
      const ease = easeIn
      this.radiusBegin()
        .transitionTo(260 * window.devicePixelRatio, 1000, ease)
      this.thickWidthBegin()
        .transitionTo(520, 1000, ease)
      this.transform()
        .rotateTo(-90, 1000, ease)
    })


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
    this.buffer.unbind()
    this.shader.unbind()
  }

  public bind() {
    this.buffer.bind()
    this.shader.bind()
  }

  public onDraw() {
    const gl = this.gl
    this.buffer.setBufferData(this.vertex)
    const shader = this.shader
    shader.transform = this.matrixArray
    shader.orth = Coordinate.orthographicProjectionMatrix4
    shader.circle = this.uniCircle
    shader.use()
    gl.drawArrays(gl.TRIANGLES, 0, 12)
  }

  public dispose() {
    this.buffer.dispose()
  }



}