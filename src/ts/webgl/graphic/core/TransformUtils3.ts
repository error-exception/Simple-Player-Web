import {Vector2} from "./Vector2";
import {Transformable} from "../../drawable/Transformable";

export class TransformUtils3 {

  public static rotateVector(rx: number, vec: Vector2): void {
    const cosRx = Math.cos(rx);
    const sinRx = Math.sin(rx);

    const newX = cosRx * vec.x - sinRx * vec.y;
    const newY = sinRx * vec.x + cosRx * vec.y;

    vec.x = newX;
    vec.y = newY;
  }

  public static scaleVector(sx: number, sy: number, vec: Vector2): void {
    vec.x *= sx;
    vec.y *= sy;
  }

  public static translateVector(tx: number, ty: number, vec: Vector2): void {
    vec.x += tx
    vec.y += ty
  }

  public static skewVector(sx: number, sy: number, vec: Vector2): void {
    const newX = vec.x + vec.y * sx;
    const newY = vec.y + vec.x * sy;

    vec.x = newX;
    vec.y = newY;
  }

  public static rotate(rx: number, data: Float32Array | number[], offset: number = 0): void {
    const cosRx = Math.cos(rx);
    const sinRx = Math.sin(rx);

    const x = data[offset];
    const y = data[offset + 1];

    data[offset] = cosRx * x - sinRx * y;
    data[offset + 1] = sinRx * x + cosRx * y;
  }

  public static scale(sx: number, sy: number, data: Float32Array | number[], offset: number = 0): void {
    data[offset] *= sx;
    data[offset + 1] = sx;
  }

  public static translate(tx: number, ty: number, data: Float32Array | number[], offset: number = 0): void {
    data[offset] += tx;
    data[offset + 1] += ty;
  }

  public static skew(sx: number, sy: number, data: Float32Array | number[], offset: number = 0): void {
    const x = data[offset];
    const y = data[offset + 1];

    data[offset] = x + y * sx;      // X 轴扭曲
    data[offset + 1] = y + x * sy;  // Y 轴扭曲
  }

  public static applyTo(transformable: Transformable, v: Vector2, out: Float32Array | number[], offset: number = 0, origin: Vector2): void {
    const translate = transformable._translate,
      scale = transformable._scale,
      rotate = transformable._rotate,
      skew = transformable._skew
    out[offset] = v.x
    out[offset + 1] = v.y

    this.translate(-origin.x, -origin.y, out, offset);
    this.translate(translate.x, translate.y, out, offset);
    this.scale(scale.x, scale.y, out, offset);
    this.rotate(rotate, out, offset);
    this.skew(skew.x, skew.y, out, offset);
    this.translate(origin.x, origin.y, out, offset);

  }

}

export class TransformInfo {

  public static Empty = new TransformInfo();

  public translate = new Vector2();
  public scale = new Vector2();
  public rotate = new Vector2();
  public skew = new Vector2();

  public setFrom(info: TransformInfo): void {
    this.translate.setFrom(info.translate);
    this.scale.setFrom(info.scale);
    this.rotate.setFrom(info.rotate);
    this.skew.setFrom(info.skew);
  }
}