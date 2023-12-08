import {Box} from "../../box/Box";
import {CircleBackground} from "./CircleBackground";
import {Color} from "../../base/Color";
import {Axis} from "../../layout/Axis";
import {ColoredImageDrawable} from "./ColoredImageDrawable";
import {Vector} from "../../core/Vector2";
import {Images} from "../../util/ImageResource";
import {Time} from "../../../global/Time";
import {easeIn} from "../../../util/Easing";

export class TestScreen extends Box {

  private readonly red: ColoredImageDrawable
  private readonly green: ColoredImageDrawable
  private readonly yellow: ColoredImageDrawable
  private readonly pink: ColoredImageDrawable

  constructor(gl: WebGL2RenderingContext) {
    super(gl, {
      size: ['fill-parent', 'fill-parent']
    });
    const size: [number | 'fill-parent', number | 'fill-parent'] = [470, 470]
    this.red = new ColoredImageDrawable(gl, {
      size,
      origin: Axis.X_RIGHT | Axis.Y_CENTER,
      image: Images.WhiteRound,
      color: Color.fromHex(0xff0000)
    })
    this.red.rotate = 180
    this.red.scale = Vector()
    this.yellow = new ColoredImageDrawable(gl, {
      size,
      origin: Axis.X_LEFT | Axis.Y_CENTER,
      image: Images.WhiteRound,
      color: Color.fromHex(0xffff00)
    })
    this.yellow.rotate = 180
    this.yellow.scale = Vector()
    this.green = new ColoredImageDrawable(gl, {
      size,
      origin: Axis.X_CENTER | Axis.Y_TOP,
      image: Images.WhiteRound,
      color: Color.fromHex(0x00ff00)
    })
    this.green.rotate = 180
    this.green.scale = Vector()
    this.pink = new ColoredImageDrawable(gl, {
      size,
      origin: Axis.X_CENTER | Axis.Y_BOTTOM,
      image: Images.WhiteRound,
      color: Color.fromHex(0xff7db7)
    })
    this.pink.rotate = 180
    this.pink.scale = Vector()
    this.add(
      new CircleBackground(gl, {
        size: ['fill-parent', 'fill-parent']
      }),
      this.red, this.green, this.yellow, this.pink
    )

    setTimeout(() => {
      const time = Time.currentTime
      const targetScale = Vector(1)
      const targetDegree = 0
      const ease = easeIn
      const rounds = [this.red, this.green, this.yellow, this.pink]
      const duration = 1000
      rounds.forEach((item, i) => {
        item.rotateBegin(time + (i * 50))
          .transitionTo(targetDegree, duration - (i * 50), ease)
        item.scaleBegin(time + (i * 50))
          .to(targetScale, duration - (i * 50), ease)
      })
    })
  }

}