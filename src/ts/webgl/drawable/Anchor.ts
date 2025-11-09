import { almostEquals } from "../graphic/core/Utils";
import { vector2 } from "../graphic/matrix/vec2";
import {Axis} from "./Axis";

export class Anchor {

  static TopLeft = Axis.X_LEFT | Axis.Y_TOP
  static TopCenter = Axis.X_CENTER | Axis.Y_TOP
  static TopRight = Axis.X_RIGHT | Axis.Y_TOP
  static CenterLeft = Axis.X_LEFT | Axis.Y_CENTER
  static Center = Axis.X_CENTER | Axis.Y_CENTER
  static CenterRight = Axis.X_RIGHT | Axis.Y_CENTER
  static BottomLeft = Axis.X_LEFT | Axis.Y_BOTTOM
  static BottomCenter  = Axis.X_CENTER | Axis.Y_BOTTOM
  static BottomRight = Axis.X_RIGHT | Axis.Y_BOTTOM
  static Custom = -1

  static x(anchor: number): number {
    const x = Axis.getXAxis(anchor)
    return x === Axis.X_LEFT ? 0
      : x === Axis.X_CENTER ? 0.5
        : 1
  }

  static y(anchor: number): number {
    const y = Axis.getYAxis(anchor)
    return y === Axis.Y_TOP ? 0
      : y === Axis.Y_CENTER ? 0.5
        : 1
  }

}

export namespace anchor {
  export const TopLeft = vector2.fromValues(0, 0)
  export const TopCenter = vector2.fromValues(0.5, 0)
  export const TopRight = vector2.fromValues(1, 0)
  export const CenterLeft = vector2.fromValues(0, 0.5)
  export const Center = vector2.fromValues(0.5, 0.5)
  export const CenterRight = vector2.fromValues(1, 0.5)
  export const BottomLeft = vector2.fromValues(0, 1)
  export const BottomCenter = vector2.fromValues(0.5, 1)
  export const BottomRight = vector2.fromValues(1, 1)

  export function isTop(anchor: vec2) {
    return almostEquals(anchor[1], 0)
  }

  export function isVerticalCenter(anchor: vec2) {
    return almostEquals(anchor[1], 0.5)
  }

  export function isBottom(anchor: vec2) {
    return almostEquals(anchor[1], 1)
  }

  export function isLeft(anchor: vec2) {
    return almostEquals(anchor[0], 0)
  }

  export function isHorizontalCenter(anchor: vec2) {
    return almostEquals(anchor[0], 0.5)
  }

  export function isRight(anchor: vec2) {
    return almostEquals(anchor[0], 1)
  }
}