import {Vector2} from "../../core/Vector2";
import {type BaseDrawableConfig, Drawable} from "../../drawable/Drawable";

// export class ManiaNoteV2 {
//
//   private position: Vector2 = Vector2.newZero()
//
//   private translateX = new ObjectTransition(this.position, "x")
//   private translateY = new ObjectTransition(this.position, "y")
//
//   public isEnd = false
//
//   constructor(
//     private startPosition: Vector2,
//     private endPosition: Vector2,
//     private startTime: number,
//     private endTime: number
//   ) {
//     this.position.set(startPosition.x, startPosition.y)
//     this.translateX.setStartTime(startTime)
//     this.translateY.setStartTime(startTime)
//     this.translateX.transitionTo(endPosition.x, endTime - startTime)
//     this.translateY.transitionTo(endPosition.y, endTime - startTime)
//   }
//
//   public update(timestamp: number) {
//     this.isEnd = timestamp > this.endTime
//     this.translateX.update(timestamp)
//     this.translateY.update(timestamp)
//   }
//
//   public copyTo(target: number[], offset: number, stride: number) {
//
//   }
//
// }

export interface ManiaNoteV2Config extends BaseDrawableConfig {
  startPosition: Vector2
  endPosition: Vector2
  startTime: Vector2
  endTime: Vector2
}

//@ts-ignore
export class ManiaNoteV2 extends Drawable {

  constructor(gl: WebGL2RenderingContext, config: ManiaNoteV2Config) {
    super(gl, config);
  }

}