import { OSUApplication } from "../../OSUApplication";
import { anchor } from "../drawable/Anchor";
import { SizeMode } from "../view/View";
import { ViewGroup } from "../view/ViewGroup";
import { ScreenLayer } from "./ScreenManager";

export class Screen extends ViewGroup {

  /**
   * Whether the screen should be cached.
   */
  public shouldCache = true

  public screenClosed = false

  constructor() {
    super()
    this.size = SizeMode.fill()
    this.anchor = anchor.Center
  }

  public close(layer: ScreenLayer = ScreenLayer.Content) {
    this.screenClosed = true
    const screenManager = OSUApplication.screenManager
    if (this === screenManager.current(layer)) {
      screenManager.pop()
    }
  }

  public update(): void {
    super.update()
    if (this.screenClosed && this.isNotPresent) {
      this.remove()
    }
  }

  /**
   * It will be called follow conditions:
   * 1. The screen is popped to the stack.
   */
  public onResuming() {

  }

  /**
   * This method will be called when the screen is pushed to the stack.
   */
  public onSuspending() {

  }

  /**
   * This method will be called when the screen is destroyed.
   */
  public onExiting() {

  }

  /**
   * This method will be called when the screen is created.
   */
  public onEntering() {

  }

}