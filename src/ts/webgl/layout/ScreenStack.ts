import type { View } from "../view/View";
import { ViewGroup } from "../view/ViewGroup";

export class ScreenStack extends ViewGroup {
  constructor() {
    super();
  }

  public addIfAbsent(view: View): void {
    if (this.children.indexOf(view) < 0) {
      this.addView(view)
    }
  }
}