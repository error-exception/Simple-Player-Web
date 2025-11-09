import { SingleEvent } from "../../util/SingleEvent";
import { TransformUtils } from "../graphic/core/TransformUtils";
import { vector2 } from "../graphic/matrix/vec2";
import { rect } from "../graphic/shape/Rectangle";

export class Coordinate2 {
  /** 最大宽度限制，用于计算缩放比例 */
  public static MAX_WIDTH = 1280;

  /** 视口矩形区域 */
  public static viewport = rect.create();

  /** 在坐标系中，中间点的坐标 */
  public static center = vector2.create();

  /** canvas 的尺寸，该尺寸为物理像素尺寸 */
  public static resolution = vector2.create();

  /** 正交投影矩阵 */
  public static orthographicProjectionMatrix4 = new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]);

  /** 窗口大小变化事件 */
  public static onWindowResize = new SingleEvent<void>();

  /** 当前尺寸 */
  public static size = vector2.create();

  /**
   * 根据canvas尺寸设置视口
   * @param width canvas宽度，单位为浏览器像素
   * @param height canvas高度，单位为浏览器像素
   */
  public static setViewportByCanvas(width: number, height: number): void {

    const canvasPhysicWidth = width * window.devicePixelRatio;
    const canvasPhysicHeight = height * window.devicePixelRatio;

    vector2.set(this.resolution, canvasPhysicWidth, canvasPhysicHeight)

    const h = canvasPhysicHeight * (this.MAX_WIDTH / canvasPhysicWidth);

    const viewport = this.viewport;
    rect.setWidth(viewport, this.MAX_WIDTH)
    rect.setHeight(viewport, h)

    vector2.set(this.size, this.MAX_WIDTH, h)

    vector2.middle(this.center, viewport.topLeft, viewport.bottomRight);

    TransformUtils.orthTo(
      0, 
      rect.getWidth(viewport),
      rect.getHeight(viewport), 
      0, 0, 1, this.orthographicProjectionMatrix4
    );

    this.onWindowResize.invoke();
  }


  // Getters for convenient access to properties

  /** 中心点X坐标 */
  public static get centerX(): number {
    return this.center[0];
  }

  /** 中心点Y坐标 */
  public static get centerY(): number {
    return this.center[1];
  }

  /** 视口宽度 */
  public static get width(): number {
    return this.size[0];
  }

  /** 视口高度 */
  public static get height(): number {
    return this.size[1];
  }
}
