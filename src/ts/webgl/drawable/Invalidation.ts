export class Invalidation {

  public static None = 0
  // public static Position = 1
  public static Size = 1 << 1
  public static Position = 1 << 2
  public static Draw = 1 << 4
  // position and size of parent is not depend on child's position and size.
  // But if child's position or size is changed, other children's position and size should be invalidated.
  public static ChildLayout = 1 << 5

  public static All = this.Size | this.Position | this.Draw
}

/**
 * 保留
 */
export class InvalidationSource {
  public static Child = 1
  public static Self = 1 << 1
  public static Parent = 1 << 2

  public static All = this.Child | this.Self | this.Parent
}