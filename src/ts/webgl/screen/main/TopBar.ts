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

export class TopBar extends Box {

  private readonly shadow: TopBarShadow

  constructor() {
    super({
      size: ['fill-parent', 36]
    });
    this.shadow = new TopBarShadow()
    this.shadow.alpha = 0
    this.add(
      new ImageDrawable(TextureStore.get('Square'), {
        size: ['fill-parent', 36],
        color: Color.fromHex(0x191919)
      }),
      new TopBarButtons(),
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

export class TopBarButtons extends RowBox {

  constructor() {
    super({
      size: ['fill-parent', 36]
    });
    const atlas = TextureStore.getAtlas('Icons-Atlas')
    this.add(
      new TopBarButton(atlas.getRegin('icon-settings'), Anchor.TopLeft).setOnClickListener(() => {
        VueUI.settings = true
      }),
      new TopBarButton(atlas.getRegin('icon-note'), Anchor.TopRight).setOnClickListener(() => {
        VueUI.miniPlayer = true
      }),
      new TopBarButton(atlas.getRegin('icon-folder'), Anchor.TopRight).setOnClickListener(() => {
        VueUI.selectBeatmapDirectory = true
      }),
      new TopBarButton(atlas.getRegin('icon-fullscreen'), Anchor.TopRight),
      new TopBarButton(atlas.getRegin('icon-circle'), Anchor.TopRight),
      new TopBarButton(atlas.getRegin('icon-notification'), Anchor.TopRight).setOnClickListener(() => {
        VueUI.notification = true
      }),
    )
  }

}

class TopBarButton extends Box {
  constructor(textureRegin: TextureRegin, anchor: number) {
    super({
      size: [36, 36], anchor
    });
    this.enableMouseEvent()
    this.add(
      new ButtonBackground(),
      new ImageDrawable(textureRegin, {
        size: [20, 20],
        anchor: Anchor.Center,
        color: Color.White.copy()
      })
    )
  }

  private _onClickListener = () => {}

  public setOnClickListener(l: () => void) {
    this._onClickListener = l
    return this
  }


  onClick(which: number): boolean {
    this._onClickListener()
    return true
  }

}

class ButtonBackground extends ImageDrawable {

  constructor() {
    super(TextureStore.get('Square'), {
      size: [36, 36],
      color: Color.White.copy()
    });
    this.enableMouseEvent()
    this.alpha = 0
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
      size: ['fill-parent', 120],
      anchor: Anchor.TopCenter,
      offset: [0, 36]
    });
  }

  private color = Color.Black.copy()
  public beforeCommit(node: DrawNode) {
    const shader = node.shader as DefaultShaderWrapper
    shader.orth = Coordinate.orthographicProjectionMatrix4
    shader.sampler2D = 0
    this.color.alpha = this.appliedTransform.alpha
    shader.color = this.color
  }

  onDraw(node: DrawNode) {
    node.drawRect(this.position, this.position.add(this.size))
    node.drawTexture(
      TextureStore.get('VerticalGradiant'),
      Vector(0, 0),
      Vector(1, 1)
    )
  }
}