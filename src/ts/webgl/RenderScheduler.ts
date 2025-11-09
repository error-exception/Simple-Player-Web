import type { Disposable } from "./graphic/core/Disposable";
import type { Loadable } from "./graphic/core/Loadable";
import type { Updatable } from "./graphic/core/Updatable";
import type { WebGLRenderer } from "./WebGLRenderer";

export class RenderScheduler {

  private static disposableList: Disposable[] = []
  private static disposeCallbackList: (() => void)[] = []

  public static scheduleDispose(disposable: Disposable) {
    this.disposableList.push(disposable)
  }

  public static scheduleDisposeCallback(callback: () => void) {
    this.disposeCallbackList.push(callback)
  }

  public static executeDispose() {
    if (this.disposableList.length <= 0) {
      return
    }
    const disposables = this.disposableList
    for (let i = 0; i < disposables.length; i++) {
      disposables[i].dispose()
    }
    disposables.length = 0

    const callbacks = this.disposeCallbackList
    for (let i = 0; i < callbacks.length; i++) {
      callbacks[i]()
    }
    callbacks.length = 0
  }

}