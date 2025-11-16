import type { View } from "../view/View";
import { ViewGroup } from "../view/ViewGroup";

export class ScreenStackView extends ViewGroup {

  public addIfAbsent(view: View): void {
    if (this.children.indexOf(view) < 0) {
      this.addView(view)
    }
  }
}