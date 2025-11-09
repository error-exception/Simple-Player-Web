
/**
 * TODO: Implement OverlayScreen to display TopBar
 */

import { effect, effectScope } from "vue";
import AudioPlayer from "../../../player/AudioPlayer";
import { PlayerState } from "../../../player/PlayerState";
import { collectLatest } from "../../../util/eventRef";
import { anchor } from "../../drawable/Anchor";
import { vector2 } from "../../graphic/matrix/vec2";
import { Screen } from "../../util/Screen";
import { SizeMode } from "../../view/View";
import { TopBar } from "../main/TopBar";

export class OverlayScreen extends Screen {

  private topBar: TopBar

  private scope = effectScope()

  constructor() {
    super();
    this.view.size = SizeMode.fill();
    this.view.origin = anchor.Center
    const topBar = new TopBar()
    {
      topBar.size = vector2.fromValues(SizeMode.FILL_WIDTH, 36)
      this.topBar = topBar
    }
    this.view.addView(topBar)
    this.scope.run(() => {
      collectLatest(AudioPlayer.playState, stateCode => {
        topBar.stateText = {
          [PlayerState.STATE_DOWNLOADING]: 'Downloading',
          [PlayerState.STATE_DECODING]: 'Decoding',
          [PlayerState.STATE_PLAYING]: 'Playing',
          [PlayerState.STATE_DECODE_DONE]: 'Ready',
          [PlayerState.STATE_PAUSING]: 'Paused'
        }[stateCode] ?? ""
      })
    })
  }

  public dispose(): void {
    super.dispose();
    this.scope.stop();
  }

}