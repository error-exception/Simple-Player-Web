import {Vector} from "../core/Vector2";

export class Size {

  public static FillParent = -1

  public static FillParentSize = Vector(-1, -1)

  public static of(width: number, height?: number) {
    return Vector(width, height)
  }

}