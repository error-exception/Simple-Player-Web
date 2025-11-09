import { Nullable } from "../../type";
import { View } from "./View";
import { ViewGroup } from "./ViewGroup";

export class RootView extends ViewGroup {

  private backgroundLayerIndex = 0
  private contentLayerIndex = 1
  private foregroundLayerIndex = 2

  private _contentView: Nullable<View> = null

  public get contentView(): Nullable<View> {
    return this._contentView
  }

  public set contentView(contentView: Nullable<View>) {
    if (this._contentView !== contentView && contentView) {
      this._contentView?.remove()
      this._contentView = contentView
      this.addViewAt(contentView, this.contentLayerIndex)
    }
  }

  private _backgroundView: Nullable<View> = null

  public get backgroundView(): Nullable<View> {
    return this._backgroundView
  }

  public set backgroundView(backgroundView: Nullable<View>) {
    if (this._backgroundView !== backgroundView && backgroundView) {
      this._backgroundView?.remove()
      this._backgroundView = backgroundView
      this.addViewAt(backgroundView, this.backgroundLayerIndex)
    }
  }

  private _foregroundView: Nullable<View> = null

  public get foregroundView(): Nullable<View> {
    return this._foregroundView
  }

  public set foregroundView(foregroundView: Nullable<View>) {
    if (this._foregroundView !== foregroundView && foregroundView) {
      this._foregroundView?.remove()
      this._foregroundView = foregroundView
      this.addViewAt(foregroundView, this.foregroundLayerIndex)
    }
  }

}