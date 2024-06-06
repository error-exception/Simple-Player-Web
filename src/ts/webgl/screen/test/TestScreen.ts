import {Box} from "../../box/Box";
import {Vector} from "../../core/Vector2";
import {Drawable} from "../../drawable/Drawable";
import {Anchor} from "../../drawable/Anchor";
import  {type DrawNode} from "../../drawable/DrawNode";
import {TextureStore} from "../../texture/TextureStore";
import type {DefaultShaderWrapper} from "../../shader/DefaultShaderWrapper";
import Coordinate from "../../base/Coordinate";
import type {WebGLRenderer} from "../../WebGLRenderer";

export class TestScreen extends Box {


  // constructor(gl: WebGL2RenderingContext) {
  //   super(gl, {
  //     size: ['fill-parent', 'fill-parent']
  //   });
  //   const size: [number | 'fill-parent', number | 'fill-parent'] = [470, 470]
  //   this.red = new ColoredImageDrawable(gl, {
  //     size,
  //     origin: Axis.X_RIGHT | Axis.Y_CENTER,
  //     image: Images.WhiteRound,
  //     color: Color.fromHex(0xff0000)
  //   })
  //   this.red.rotate = 180
  //   this.red.scale = Vector()
  //   this.yellow = new ColoredImageDrawable(gl, {
  //     size,
  //     origin: Axis.X_LEFT | Axis.Y_CENTER,
  //     image: Images.WhiteRound,
  //     color: Color.fromHex(0xffff00)
  //   })
  //   this.yellow.rotate = 180
  //   this.yellow.scale = Vector()
  //   this.green = new ColoredImageDrawable(gl, {
  //     size,
  //     origin: Axis.X_CENTER | Axis.Y_TOP,
  //     image: Images.WhiteRound,
  //     color: Color.fromHex(0x00ff00)
  //   })
  //   this.green.rotate = 180
  //   this.green.scale = Vector()
  //   this.pink = new ColoredImageDrawable(gl, {
  //     size,
  //     origin: Axis.X_CENTER | Axis.Y_BOTTOM,
  //     image: Images.WhiteRound,
  //     color: Color.fromHex(0xff7db7)
  //   })
  //   this.pink.rotate = 180
  //   this.pink.scale = Vector()
  //   this.add(
  //     new CircleBackground(gl, {
  //       size: ['fill-parent', 'fill-parent']
  //     }),
  //     this.red, this.green, this.yellow, this.pink
  //   )
  //
  //   setTimeout(() => {
  //     const time = Time.currentTime
  //     const targetScale = Vector(1)
  //     const targetDegree = 0
  //     const ease = easeIn
  //     const rounds = [this.red, this.green, this.yellow, this.pink]
  //     const duration = 1000
  //     rounds.forEach((item, i) => {
  //       item.transform()
  //         .delay(time + (i * 50))
  //         .rotateTo(targetDegree, duration - (i * 50), ease)
  //       item.transform()
  //         .delay(time + (i * 50))
  //         .scaleTo(targetScale, duration - (i * 50), ease)
  //     })
  //   }, 0)
  // }

  constructor() {
    super({
      size: [640, 'fill-parent'],
      anchor: Anchor.Center
    });
    const a = new Box({ size: ['fill-parent', 'fill-parent']})
    const rect = new Rect()
    a.add(rect)
    this.add(a)
    rect.transform()
      .delay(2000)
      .scaleTo(Vector(1.2), 500)
      .scaleTo(Vector(1), 500)
      .scaleTo(Vector(1.2), 500)
      .scaleTo(Vector(1), 500)
      .scaleTo(Vector(1.2), 500)
      .scaleTo(Vector(1), 500)
      .scaleTo(Vector(1.2), 500)
      .scaleTo(Vector(1), 500)
      .scaleTo(Vector(1.2), 500)
      .scaleTo(Vector(1), 500)
  }

  public onLoad(renderer: WebGLRenderer) {
    super.onLoad(renderer);
    console.log("size", this.size)
    this.transform()
      .delay(2000)
      .moveXTo(200, 5000)
  }

}

export class Rect extends Drawable {

  constructor() {
    super({
      size: [100, 100],
      origin: Anchor.Center,
      anchor: Anchor.TopLeft
    });
  }

  onLoad(renderer: WebGLRenderer) {
    super.onLoad(renderer);
    console.log(this.origin)
    // this.transform()
    //   .delay(2000)
    //   // .scaleTo(Vector(1.2), 500)
    //   // .scaleTo(Vector(1), 500)
    //   // .clear
    //   // .moveTo(Vector(100), 500)
    //   // .moveTo(Vector(0), 500)
    //   // .clear
    //   .skewXTo(56, 500)
    //   .skewXTo(0, 500)
  }

  public beforeCommit(node: DrawNode) {
    const shader = node.shader as DefaultShaderWrapper
    shader.color = node.color
    shader.orth = Coordinate.orthographicProjectionMatrix4
    shader.sampler2D = 0
  }

  onDraw(node: DrawNode) {
    // if (this.selfTransform.scale.x !== 1) {
    //   console.log(this.selfTransform)
    // }
    node.drawRect(
      this.position,
      this.position.add(this.size)
    )
    node.drawTexture(TextureStore.get("LegacyLogo"))
  }
}