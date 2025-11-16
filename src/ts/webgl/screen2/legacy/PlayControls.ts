import OSUPlayer from "../../../player/OSUPlayer";
import TempOSUPlayManager from "../../../player/TempOSUPlayManager";
import { SingleEvent } from "../../../util/SingleEvent";
import type { MouseEvent } from "../../event/ViewMouseEventSystem";
import { Texture } from "../../graphic/core/Texture";
import { vector2 } from "../../graphic/matrix/vec2";
import type { IconAtlas } from "../../graphic/texture/IconAtlas";
import type { TextureRegin } from "../../graphic/texture/TextureAtlas";
import { TextureStore } from "../../graphic/texture/TextureStore";
import { Row } from "../../layout/Row";
import { ImageView } from "../../view/ImageView";

export class PlayControls extends Row {
  constructor() {
    super();

    const atlas = TextureStore.getAtlas('Icons-Atlas')
    const skipPrevious = new ControlButton(atlas.getRegin<IconAtlas>('Icon-SkipPrevious'))
    {
      skipPrevious.onClickListener.add(() => TempOSUPlayManager.prev())
    }
    const play = new ControlButton(atlas.getRegin<IconAtlas>('Icon-PlayArrow'))
    {
      play.onClickListener.add(() => OSUPlayer.play())
    }
    const pause = new ControlButton(atlas.getRegin<IconAtlas>('Icon-Pause'))
    {
      pause.onClickListener.add(() => OSUPlayer.pause())
    }
    const stop = new ControlButton(atlas.getRegin<IconAtlas>('Icon-Stop'))
    {
      stop.onClickListener.add(() => OSUPlayer.stop())
    }
    const skipNext = new ControlButton(atlas.getRegin<IconAtlas>('Icon-SkipNext'))
    {
      skipNext.onClickListener.add(() => TempOSUPlayManager.next())
    }
    this.addViews([skipPrevious, play, pause, stop, skipNext])
  }
}

class ControlButton extends ImageView {

  public onClickListener = new SingleEvent<MouseEvent>()

  constructor(texture: Texture | TextureRegin) {
    super();
    if (texture instanceof Texture) {
      this.texture = texture
    } else (
      this.textureRegin = texture
    )
    this.size = vector2.fromValues(28, 28)
    this.isMouseEventEnabled = true
  }

  public onClick(event: MouseEvent): void {
    this.onClickListener.invoke(event)
  }

  onHover(ev: MouseEvent) {
    this.clearTransform()
      .scaleTo(vector2.fromValues(1.1, 1.1), 50)
  }

  onHoverLost(ev: MouseEvent) {
    this.clearTransform()
      .scaleTo(vector2.fromValues(1, 1), 50)
  }

  protected onDispose(): void {
    super.onDispose()
    this.onClickListener.removeAll()
  }

}