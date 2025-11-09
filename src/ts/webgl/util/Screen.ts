import type { Disposable } from "../graphic/core/Disposable";
import { ViewGroup } from "../view/ViewGroup";
import { addInstance, removeInstance } from "./InstanceInject";

export class Screen implements Disposable {

  /**
   * The view of the screen.
   */
  public view: ViewGroup = new ViewGroup()

  /**
   * Whether the screen should be cached.
   */
  public shouldCache = true

  constructor() {
    addInstance(this)
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

  public dispose(): void {
    removeInstance(this)
    this.view.dispose()
  }

}