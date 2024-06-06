import {RowBox} from "../../box/RowBox";
import {ImageDrawable} from "../../drawable/ImageDrawable";
import type {Texture} from "../../core/Texture";
import type {TextureRegin} from "../../texture/TextureAtlas";
import {Vector, Vector2} from "../../core/Vector2";
import type {BaseDrawableConfig} from "../../drawable/Drawable";
import {TextureStore} from "../../texture/TextureStore";
import {Anchor} from "../../drawable/Anchor";

export class PlayControls extends RowBox {
  constructor(config: BaseDrawableConfig) {
    super(config);

    const atlas = TextureStore.getAtlas('Icons-Atlas')
    this.add(
      new ControlButton(atlas.getRegin('icon-skip-previous')),
      new ControlButton(atlas.getRegin('icon-play')),
      new ControlButton(atlas.getRegin('icon-pause')),
      new ControlButton(atlas.getRegin('icon-stop')),
      new ControlButton(atlas.getRegin('icon-skip-next'))
    )

  }
}

class ControlButton extends ImageDrawable {

  constructor(texture: Texture | TextureRegin, anchor: number = Anchor.TopLeft) {
    super(texture, {
      size: [24, 24]
    });
  }

  private _onClick = () => {}
  public setOnClickListener(l: () => void) {
    this._onClick = l
    return this
  }

  onClick(which: number): boolean {
    this._onClick()
    return true
  }

  onHover(): boolean {
    this.transform()
      .scaleTo(Vector(1.1), 50)
    return true
  }

  onHoverLost(): boolean {
    this.transform()
      .scaleTo(Vector2.one, 50)
    return true
  }

}