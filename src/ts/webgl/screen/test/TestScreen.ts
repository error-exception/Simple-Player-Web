import {Box} from "../../box/Box";
import {CircleBackground} from "./CircleBackground";
import {Color} from "../../base/Color";
import {Axis} from "../../layout/Axis";
import {ColoredImageDrawable} from "./ColoredImageDrawable";
import {Vector} from "../../core/Vector2";
import {Images} from "../../util/ImageResource";

export class TestScreen extends Box {

  private readonly red: ColoredImageDrawable
  private readonly green: ColoredImageDrawable
  private readonly yellow: ColoredImageDrawable
  private readonly blue: ColoredImageDrawable

  constructor(gl: WebGL2RenderingContext) {
    super(gl, {
      size: ['fill-parent', 'fill-parent']
    });
    this.red = new ColoredImageDrawable(gl, {
      size: [50, 50],
      origin: Axis.X_RIGHT | Axis.Y_CENTER,
      // offset: [-200, 0],
      image: Images.WhiteRound,
      color: Color.fromHex(0xff0000)
    })
    this.red.scale = Vector(2.2)
    this.yellow = new ColoredImageDrawable(gl, {
      size: [480, 480],
      origin: Axis.X_LEFT | Axis.Y_CENTER,
      offset: [200, 0],
      image: Images.WhiteRound,
      color: Color.fromHex(0xffff00)
    })
    this.yellow.scale = Vector(0.2)
    this.green = new ColoredImageDrawable(gl, {
      size: [480, 480],
      origin: Axis.X_CENTER | Axis.Y_TOP,
      offset: [0, -200],
      image: Images.WhiteRound,
      color: Color.fromHex(0x00ff00)
    })
    this.green.scale = Vector(0.2)
    this.blue = new ColoredImageDrawable(gl, {
      size: [480, 480],
      origin: Axis.X_CENTER | Axis.Y_BOTTOM,
      offset: [0, 200],
      image: Images.WhiteRound,
      color: Color.fromHex(0x0000ff)
    })
    this.blue.scale = Vector(0.2)
    this.add(
      new CircleBackground(gl, {
        size: ['fill-parent', 'fill-parent']
      }),
      this.red, /*this.green, this.yellow, this.blue*/
    )

    // setTimeout(() => {
    //   const time = Time.currentTime
    //   this.red.rotateBegin(time).transitionTo(-180, 1000)
    //   this.green.rotateBegin(time + 100).transitionTo(-180, 1000)
    //   this.yellow.rotateBegin(time + 200).transitionTo(-180, 1000)
    //   this.blue.rotateBegin(time + 300).transitionTo(-180, 1000)
    // })
  }

}