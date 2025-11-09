import {BeatLogoBox} from "./BeatLogoBox";
import {Box} from "../../box/Box";
import {Menu} from "./Menu";
import {Vector, Vector2} from "../../graphic/core/Vector2";
import {easeOutCubic} from "../../../util/Easing";
import {onLeftSide, onRightSide} from "../../../global/GlobalState";
import {Anchor} from "../../drawable/Anchor";
import {SideFlashlight} from "./SideFlashlight";
import {Color} from "../../base/Color";
import {TopBar} from "./TopBar";
import {Size} from "../../drawable/Size";
import {Coordinate2} from "../../base/Coordinate2";

export class MainScreen extends Box {

  private leftSideCollector = (value: boolean) => {
    const translate = value ? new Vector2(40, 0) : Vector2.newZero()
    this.transform().moveTo(translate, 500, easeOutCubic)
  }

  private rightSideCollector = (value: boolean) => {
    const translate = value ? new Vector2(-40, 0) : Vector2.newZero()
    this.transform().moveTo(translate, 500, easeOutCubic)
  }

  constructor() {
    super({
      size: Size.FillParentSize,
      children: [
        new Menu(),
        new SideFlashlight(
          Color.fromHex(0x0090ff),
          Coordinate2.width / 5
        ),
        new BeatLogoBox({
          size: Size.of(460),
          anchor: Anchor.Center
        }),
        new TopBar().apply(it => {
          it.setTranslate(Vector(0, -36))
        })
      ]
    });
    this.addDisposable(() => {
      onLeftSide.collect(this.leftSideCollector)
      onRightSide.collect(this.rightSideCollector)
      return () => {
        onLeftSide.removeCollect(this.leftSideCollector)
        onRightSide.removeCollect(this.rightSideCollector)
      }
    })

    if (__DEV__) {
      // const smoke = new StartSmoke()
      // this.add(new Snow(), /*smoke*/)
    }
  }

}