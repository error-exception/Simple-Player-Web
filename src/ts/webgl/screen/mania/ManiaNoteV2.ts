import {Vector2} from "../../core/Vector2";
import {Transition} from "../../transition/Transition";
import {TransitionQueue} from "../story/TransitionQueue";
import {linear} from "../../../util/Easing";
import {Shape2D} from "../../util/Shape2D";

class ManiaNote {

  /**
   * center of note
   * @private
   */
  private position: Vector2 = Vector2.newZero()

  private translateX = new TransitionQueue()
  private translateY = new TransitionQueue()

  public isEnd = false

  constructor(
    private startPosition: Vector2,
    private endPosition: Vector2,
    startTime: number,
    private endTime: number,
    private noteSize: Vector2
  ) {
    const x = new Transition(
      startTime, endTime, linear, endPosition.x, startPosition.x
    )
    const y = new Transition(
      startTime, endTime, linear, endPosition.y, startPosition.y
    )
    this.position.set(startPosition.x, startPosition.y)
    this.translateX.add(x)
    this.translateY.add(y)
  }

  public update(timestamp: number) {
    this.isEnd = timestamp > this.endTime
    const x = this.translateX.update(timestamp) ?? this.startPosition.x
    const y = this.translateY.update(timestamp) ?? this.startPosition.y
    this.position.set(x, y)
    this.isEnd = this.position.equals(this.endPosition)
  }

  public copyTo(target: number[] | Float32Array, offset: number, stride: number) {
    const { x: width, y: height } = this.noteSize
    const { x, y } = this.position
    Shape2D.quad(
      x - width / 2, y + height / 2,
      x + width / 2, y - height / 2,
      target, offset, stride
    )
    Shape2D.quad(
      0, 0,
      1, 1,
      target, offset + 4, stride
    )

    return 4 * 6
  }

}

class ManiaEndPoint {

  constructor(
    private position: Vector2,
    private pointSize: Vector2
  ) {
  }

  public update(timestamp: number) {
    // todo
  }

  public copyTo(target: number[] | Float32Array, offset: number, stride: number) {
    const { x: width, y: height } = this.pointSize
    const { x, y } = this.position
    Shape2D.quad(
      x - width / 2, y + height / 2,
      x + width / 2, y - height / 2,
      target, offset, stride
    )
    Shape2D.quad(
      0, 0,
      1, 1,
      target, offset + 4, stride
    )
    return 4 * 6
  }

}

/**
 * note 的点击特效
 */
//@ts-ignore
class ManiaHitEffect {

}
//@ts-ignore
class ManiaTrackNote {

  constructor(
    private note: ManiaNote,
    private endPoint: ManiaEndPoint,
    //@ts-ignore
    private autoHit: boolean,
    //@ts-ignore
    private onHit: boolean
  ) {
  }

  public update(timestamp: number) {
    this.note.update(timestamp)
    this.endPoint.update(timestamp)
  }

  /**
   * 由键盘或自动触发
   */
  //@ts-ignore
  public onHit(): boolean {
    return false
  }

  public copyNoteTo(target: number[] | Float32Array, offset: number, stride: number) {
    return this.note.copyTo(target, offset, stride)
  }

  public copyEndPointTo(target: number[] | Float32Array, offset: number, stride: number) {
    return this.endPoint.copyTo(target, offset, stride)
  }

}