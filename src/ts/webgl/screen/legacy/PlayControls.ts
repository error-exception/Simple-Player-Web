import {RowBox, RowBoxConfig} from "../../box/RowBox";
import {ImageDrawable} from "../../drawable/ImageDrawable";
import type {Texture} from "../../core/Texture";
import type {TextureRegin} from "../../texture/TextureAtlas";
import {Vector, Vector2} from "../../core/Vector2";
import {TextureStore} from "../../texture/TextureStore";
import {Anchor} from "../../drawable/Anchor";
import {Size} from "../../drawable/Size";
import TempOSUPlayManager from "../../../player/TempOSUPlayManager";
import OSUPlayer from "../../../player/OSUPlayer";
import type {IconAtlas} from "../../texture/IconAtlas";

export class PlayControls extends RowBox {
  constructor(config: RowBoxConfig) {
    super(config);

    const atlas = TextureStore.getAtlas('Icons-Atlas')
    this.add(
      new ControlButton(atlas.getRegin<IconAtlas>('Icon-SkipPrevious'))
        .setOnClick(() => {
          TempOSUPlayManager.prev()
        }),
      new ControlButton(atlas.getRegin<IconAtlas>('Icon-PlayArrow'))
        .setOnClick(() => {
          OSUPlayer.play()
        }),
      new ControlButton(atlas.getRegin<IconAtlas>('Icon-Pause'))
        .setOnClick(() => {
          OSUPlayer.pause()
        }),
      new ControlButton(atlas.getRegin<IconAtlas>('Icon-Stop'))
        .setOnClick(() => {
          OSUPlayer.stop()
        }),
      new ControlButton(atlas.getRegin<IconAtlas>('Icon-SkipNext'))
        .setOnClick(() => {
          TempOSUPlayManager.next()
        })
    )

  }
}

class ControlButton extends ImageDrawable {

  constructor(texture: Texture | TextureRegin, anchor: number = Anchor.TopLeft) {
    super(texture, {
      size: Size.of(28),
      anchor: Anchor.CenterRight
    });
    this.enableMouseEvent()
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