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

}