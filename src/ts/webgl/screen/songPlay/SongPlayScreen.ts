import {LogoBounceBox} from "../main/BeatLogoBox";
import {Box} from "../../box/Box";
import {FadeLogo} from "./FadeLogo";
import {Anchor} from "../../drawable/Anchor";
import {ImageDrawable} from "../../drawable/ImageDrawable";
import {TextureStore} from "../../texture/TextureStore";
import {Color} from "../../base/Color";
import {Size} from "../../drawable/Size";
import {Vector} from "../../core/Vector2";
import {Axes} from "../../drawable/Axes";
import {easeOut, easeOutElastic, easeOutQuint} from "../../../util/Easing";
import {BeatDispatcher, type IBeat} from "../../../global/Beater";
import ScreenManager from "../../util/ScreenManager";
import {playSound, Sound} from "../../../player/SoundEffect";
import type {IconAtlas} from "../../texture/IconAtlas";

export class SongPlayScreen extends Box {

  constructor() {
    super({
      size: Size.FillParentSize,
      children: [
        new FadeLogo({
          size: Size.of(180, 180),
          anchor: Anchor.Center,
        }),
        new Box({
          size: Size.of(56, 56),
          anchor: Anchor.BottomLeft,
          autoSize: Axes.X,
          children: [
            new ImageDrawable(TextureStore.get('Square'), {
              size: Size.of(56),
              anchor: Anchor.CenterLeft,
              origin: Anchor.CenterLeft,
              color: Color.fromRGB(236, 72, 153)
            }).apply((bg) => {
              bg.enableMouseEvent()
              bg.setOnHover(() => {
                playSound(Sound.DefaultHover)
                bg.transform()
                  .scaleXTo(1.5, 500, easeOutElastic)
              })
              bg.setOnHoverLost(() => {
                bg.transform()
                  .scaleXTo(1, 500, easeOutElastic)
              })
              bg.setOnClick(() => {
                playSound(Sound.DefaultSelect)
                setTimeout(() => {
                  ScreenManager.activeScreen('main')
                }, 100)
              })
            }),
            new ImageDrawable(TextureStore.getAtlas('Icons-Atlas').getRegin<IconAtlas>('Icon-KeyboardArrowLeft'), {
              size: Size.of(24, 24),
              anchor: Anchor.Center,
            }).apply((icon) => {
              icon.addDisposable(() => {
                const onBeat: IBeat = {
                  onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number) {
                    icon.transform()
                      .scaleTo(Vector(.9), 60, easeOut)
                      .scaleTo(Vector(1), gap * 2, easeOutQuint)
                  }
                }
                BeatDispatcher.register(onBeat)
                return () => {
                  BeatDispatcher.unregister(onBeat)
                }
              })
            })
          ]
        }),
        new LogoBounceBox({
          size: Size.of(200, 200),
          anchor: Anchor.BottomRight,
          offset: Vector(16, 34)
        })
      ]
    });
    // const fadeLogo = new FadeLogo({
    //   size: Size.of(180, 180),
    //   anchor: Anchor.Center,
    // })
    // const logo = new LogoBounceBox({
    //   size: Size.of(225, 225),
    //   anchor: Anchor.BottomRight,
    //   offset: Vector(16, 34)
    // })
    // const bottomBar = new ImageDrawable(TextureStore.get('Square'), {
    //   size: Size.of(Size.FillParent, 56),
    //   anchor: Anchor.BottomLeft,
    //   color: Color.fromHex(0x0, 128)
    // })
    // const backButton = new BackButton()
    // this.add(fadeLogo, bottomBar, backButton, logo)
  }
}