import { vector2 } from "../webgl/graphic/matrix/vec2";

export const MOUSE_LEFT_DOWN = 0b1
export const MOUSE_RIGHT_DOWN = 0b10
export const MOUSE_MOVE = 0b100
export const MOUSE_NONE = 0
export const MOUSE_KEY_LEFT = 0b1
export const MOUSE_KEY_RIGHT = 0b10
export const MOUSE_KEY_NONE = 0

export class MouseState {

  private static state: number = MOUSE_NONE
  private static downPosition = vector2.create() // Vector2.newZero()
  private static upPosition = vector2.create() // Vector2.newZero()
  public static position = vector2.create() // Vector2.newZero()
  public static which: number = MOUSE_KEY_NONE

  public static onClick: ((which: number) => void) | null = null
  public static onMouseDown: ((which: number) => void) | null = null
  public static onMouseMove: (() => void) | null = null
  public static onMouseUp: ((which: number) => void) | null = null

  public static receiveMouseDown(which: number, x: number, y: number) {
    MouseState.which |= which
    MouseState.state |= which === MOUSE_KEY_LEFT ? MOUSE_LEFT_DOWN : MOUSE_RIGHT_DOWN
    vector2.set(MouseState.position, x, y)
    vector2.set(MouseState.downPosition, x, y)
    MouseState.fireOnMousedown(which)
    // MouseEventFire.fireMouseDown(which, MouseState.position)
  }

  public static receiveMouseUp(which: number, x: number, y: number) {
    MouseState.which ^= which
    MouseState.state ^= which === MOUSE_KEY_LEFT ? MOUSE_LEFT_DOWN : MOUSE_RIGHT_DOWN
    vector2.set(MouseState.position, x, y)
    vector2.set(MouseState.upPosition, x, y)
    MouseState.fireOnMouseUp(which)
    // MouseEventFire.fireMouseUp(which, MouseState.position)
    if (vector2.equals(MouseState.downPosition, MouseState.upPosition)) {
      MouseState.fireOnClick(which)
    }
    // if (MouseState.downPosition.equals(MouseState.upPosition)) {
    //   MouseState.fireOnClick(which)
    // }
  }

  public static receiveMouseMove(x: number, y: number) {
    MouseState.state |= MOUSE_MOVE
    vector2.set(MouseState.position, x, y)
    MouseState.fireOnMouseMove()
    // MouseEventFire.fireMouseMove(MouseState.which, MouseState.position)
  }

  public static isLeftDown() {
    return (MouseState.state & MOUSE_LEFT_DOWN) === 1
  }

  public static isRightDown() {
    return ((MouseState.state >> 1) & MOUSE_RIGHT_DOWN) === 1
  }

  public static isLeftUp() {
    return (MouseState.state & MOUSE_LEFT_DOWN) !== 1
  }

  public static isRightUp() {
    return ((MouseState.state >> 1) & MOUSE_RIGHT_DOWN) !== 1
  }

  public static isMove() {
    return ((MouseState.state >> 2) & MOUSE_MOVE) === 1
  }

  public static fireOnClick(which: number) {
    MouseState.onClick?.(which)
    // console.log('on click')
  }

  public static fireOnMousedown(which: number) {
    MouseState.onMouseDown?.(which)
    // console.log("on mousedown")
  }

  public static fireOnMouseUp(which: number) {
    MouseState.onMouseUp?.(which)
    // console.log("on mouseup")
  }

  public static fireOnMouseMove() {
    MouseState.onMouseMove?.()
    // console.log("on mousemove")
  }

  public static hasKeyDown() {
    return (MouseState.state & 0b11) !== 0
  }

  public static isLeftKey(which: number) {
    return (which & MOUSE_KEY_LEFT) != 0
  }

  public static isRightKey(which: number) {
    return (which & MOUSE_KEY_RIGHT) != 0
  }
}

export interface IMouseEvent {

  onClick?(which: number): boolean

  onMouseDown?(which: number): boolean

  onMouseUp?(which: number): boolean

  onMouseMove?(): boolean

  onHover?(): boolean

  onHoverLost?(): boolean

  onDrag?(which: number): boolean

  onDragLost?(which: number): boolean

  placeholder?(): void

}