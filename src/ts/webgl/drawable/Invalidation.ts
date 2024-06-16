export class Invalidation {

  public static None = 0
  // public static Position = 1
  public static Size = 1 << 1
  public static Layout = 1 << 2
  public static ParentAutoSize = 1 << 3

  public static All = this.Size | this.Layout | this.ParentAutoSize
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