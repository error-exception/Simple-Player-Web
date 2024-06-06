import {BeatLogoBox} from "./BeatLogoBox";
import {Box} from "../../box/Box";
import {Menu} from "../../menu/Menu";
import {Vector, Vector2} from "../../core/Vector2";
import {easeOutCubic} from "../../../util/Easing";
import {onLeftSide, onRightSide} from "../../../global/GlobalState";
import {effectScope} from "vue";
import {Anchor} from "../../drawable/Anchor";
import {SideFlashlight} from "./SideFlashlight";
import {Color} from "../../base/Color";
import {TopBar} from "./TopBar";
import Coordinate from "../../base/Coordinate";

export class MainScreen extends Box {

  private leftSideCollector = (value: boolean) => {
    const translate = value ? new Vector2(40, 0) : Vector2.newZero()
    this.transform().moveTo(translate, 500, easeOutCubic)
  }

  private rightSideCollector = (value: boolean) => {
    const translate = value ? new Vector2(-40, 0) : Vector2.newZero()
    this.transform().moveTo(translate, 500, easeOutCubic)
  }

  private scope = effectScope()

  constructor() {
    super({
      size: ['fill-parent', 'fill-parent'],
    });
    const menu = new Menu()
    const beatLogo = new BeatLogoBox({
      size: [460, 460],
      anchor: Anchor.Center
    })
    const flashlight = new SideFlashlight(
      Color.fromHex(0x0090ff),
      Coordinate.width / 5
    )
    const topBar = new TopBar()
    topBar.translate = Vector(0, -36)
    // let smoke = new StarSmoke(gl)
    this.add(
      menu,
      flashlight,
      beatLogo,
      // smoke,
      topBar
    )
    onLeftSide.collect(this.leftSideCollector)
    onRightSide.collect(this.rightSideCollector)
    // this.scope.run(() => {
    //   watch(() => UIState.starSmoke, value => {
    //     smoke.isVisible = value
    //   }, {immediate: true})
    //
    // })
  }

  public dispose(): void {
    super.dispose()
    onLeftSide.removeCollect(this.leftSideCollector)
    onRightSide.removeCollect(this.rightSideCollector)
    this.scope.stop()
  }

}