export class Axes {

  public static X = 1
  public static Y = 1 << 1
  public static Both = this.X | this.Y

  public static hasX(axes: number) {
    return (axes & this.X) > 0
  }
  public static hasY(axes: number) {
    return (axes & this.Y) > 0
  }
}