import { vector2 } from "../graphic/matrix/vec2";

export class Size {

  public static FillParent = -1

  public static FillParentSize = vector2.fromValues(-1, -1)

  public static of(width: number, height?: number) {
    if (height === undefined) {
      height = width
    }
    return vector2.fromValues(width, height)
  }

}