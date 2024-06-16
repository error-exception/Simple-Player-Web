import {Box} from "../../box/Box";
import {Anchor} from "../../drawable/Anchor";
import {Drawable} from "../../drawable/Drawable";
import {Color} from "../../base/Color";
import Coordinate from "../../base/Coordinate";
import {TextureStore} from "../../texture/TextureStore";
import {type DrawNode} from "../../drawable/DrawNode";
import type {DefaultShaderWrapper} from "../../shader/DefaultShaderWrapper";
import {Vector} from "../../core/Vector2";
import {ImageDrawable} from "../../drawable/ImageDrawable";
import type {TextureRegin} from "../../texture/TextureAtlas";
import {RowBox} from "../../box/RowBox";
import {easeOutQuint} from "../../../util/Easing";
import {playSound, Sound} from "../../../player/SoundEffect";
import {VueUI} from "../../../global/GlobalState";
import {Size} from "../../drawable/Size";
import {OSUPanelStack} from "../../../osu/OSUPanelStack";
import type {IconAtlas} from "../../texture/IconAtlas";

export class TopBar extends Box {

  private readonly shadow: TopBarShadow

  constructor() {
    super({
      size: Size.of(Size.FillParent, 36)
    });
    this.enableMouseEvent()
    this.shadow = new TopBarShadow()
    this.shadow.setAlpha(0)
    const atlas = TextureStore.getAtlas('Icons-Atlas')
    this.add(
      new ImageDrawable(TextureStore.get('Square'), {
        size: Size.of(Size.FillParent, 36),
        color: Color.fromHex(0x191919)
      }),
      new RowBox({
        size: Size.of(Size.FillParent, 36),
        children: [
          new TopBarButton(atlas.getRegin<IconAtlas>('Icon-Settings'), Anchor.TopLeft)
            .setOnClick(() => {
              VueUI.settings = true
            }),
          new TopBarButton(atlas.getRegin<IconAtlas>('Icon-Help'), Anchor.TopLeft)
            .setOnClick(() => {
              OSUPanelStack.push({ name: 'help' })
            }),
          new TopBarButton(atlas.getRegin<IconAtlas>('Icon-Help'), Anchor.TopLeft)
            .setOnClick(() => {
              OSUPanelStack.push({ name: 'test' })
            }),
          new TopBarButton(atlas.getRegin<IconAtlas>('Icon-MusicNote'), Anchor.TopRight)
            .setOnClick(() => {
              VueUI.miniPlayer = true
            }),
          new TopBarButton(atlas.getRegin<IconAtlas>('Icon-Folder'), Anchor.TopRight)
            .setOnClick(() => {
              // VueUI.selectBeatmapDirectory = true
              OSUPanelStack.push({ name: 'beatmapList' })
            }),
          new TopBarButton(atlas.getRegin<IconAtlas>('Icon-Fullscreen'), Anchor.TopRight),
          new TopBarButton(atlas.getRegin<IconAtlas>('Icon-RadioButtonUnchecked'), Anchor.TopRight)
            .setOnClick(() => {
              OSUPanelStack.push({ name: 'beatmapDetails' })
            }),
          new TopBarButton(atlas.getRegin<IconAtlas>('Icon-Notifications'), Anchor.TopRight)
            .setOnClick(() => {
              VueUI.notification = true
            }),
        ]
      }),
      this.shadow
    )
  }

  onHover(): boolean {
    this.shadow.transform()
      .fadeTo(1, 300)
    return true
  }

  onHoverLost(): boolean {
    this.shadow.transform()
      .fadeTo(0, 300)
    return true
  }

}

class TopBarButton extends Box {
  constructor(textureRegin: TextureRegin, anchor: number) {
    super({
      size: Size.of(36), anchor
    });
    this.enableMouseEvent()
    this.add(
      new ButtonBackground(),
      new ImageDrawable(textureRegin, {
        size: Size.of(20),
        anchor: Anchor.Center,
        color: Color.White.copy()
      })
    )
  }

}

class ButtonBackground extends ImageDrawable {

  constructor() {
    super(TextureStore.get('Square'), {
      size: Size.of(36),
      color: Color.White.copy()
    });
    this.enableMouseEvent()
    this.setAlpha(0)
  }

  onMouseDown(which: number): boolean {
    this.transform()
      .fadeTo(.4, 40)
    return true
  }

  onMouseUp(which: number): boolean {
    this.transform()
      .fadeTo(.8, 45)
      .fadeTo(.25, 400, easeOutQuint)
    playSound(Sound.ButtonSelect)
    return true
  }

  onHover(): boolean {
    this.transform()
      .fadeTo(.25, 200)
    playSound(Sound.ButtonHover)
    return true
  }

  onHoverLost(): boolean {
    this.transform()
      .fadeTo(0, 200)
    return true
  }

}

class TopBarShadow extends Drawable {

  constructor() {
    super({
      size: Size.of(Size.FillParent, 120),
      anchor: Anchor.TopCenter,
      offset: Vector(0, 36)
    });
    this.setColor(Color.Black)
  }


  public beforeCommit(node: DrawNode) {
    const shader = node.shader as DefaultShaderWrapper
    shader.orth = Coordinate.orthographicProjectionMatrix4
    shader.sampler2D = 0
    shader.color = this.computeColor()
  }

  onDraw(node: DrawNode) {
    node.drawRect(
      this.initRectangle.topLeft,
      this.initRectangle.bottomRight
    )
    node.drawTexture(
      TextureStore.get('VerticalGradiant'),
      Vector(0, 0),
      Vector(1, 1)
    )
  }
}