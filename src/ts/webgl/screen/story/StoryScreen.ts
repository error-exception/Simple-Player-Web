import {Sprite} from "./Sprite";
import {Drawable} from "../../drawable/Drawable";
import StoryTextureManager from "./StoryTextureManager";
import {VertexArray} from "../../core/VertexArray";
import ColoredTextureShader from "../../shader/ColoredTextureShader";
import OSUPlayer from "../../../player/OSUPlayer";
import Coordinate from "../../base/Coordinate";
import {TransformUtils} from "../../core/TransformUtils";
import {isAnimation} from "../../../osu/OSUFile";
import {Animation} from "./Animation";

/**
 * TODO: 1. 根据 Texture 和 Layer 进行分组，然后调用实例绘制
 * TODO: 2. 按照 Layer 进行分组绘制
 */
export class StoryScreen extends Drawable {

  public spriteList: Sprite[] = []

  private readonly vertexArray: VertexArray
  // private readonly vertexBuffer: VertexBuffer

  private orth: Float32Array = new Float32Array(16)

  constructor(gl: WebGL2RenderingContext) {
    super(gl, {
      size: ['fill-parent', 'fill-parent']
    });

    const osb = OSUPlayer.currentOSUFile.value.Events?.storyboard
    const osbSource = OSUPlayer.currentOSZFile.value.source.osb
    if (osb) {
      console.log(osb)
      for (let i = 0; i < osb.sprites.length; i++) {
        try {
          const sprite = osb.sprites[i]
          if (isAnimation(sprite)) {
            this.spriteList.push(new Animation(gl, sprite, osbSource))
          } else {
            this.spriteList.push(new Sprite(gl, sprite, osbSource))
          }
        } catch (e: any) {
          // if (e instanceof Error) {
            console.log(e)
            // notifyMessage(e.message)
          // }
        }
      }
    }
    this.vertexArray = new VertexArray(gl)
    this.vertexArray.bind()
    // this.vertexBuffer = new VertexBuffer(gl, new Float32Array(this.spriteList.length * 48), gl.DYNAMIC_DRAW)
    const shader = ColoredTextureShader.getShader(gl)
    shader.bind()
    shader.setUniform1i("u_sampler", 0)
    shader.unbind()
    this.vertexArray.unbind()
    const scale = 480 / Coordinate.height
    const scaledWidth = Coordinate.width * scale
    const s = scaledWidth - 640 < 0 ? 0 : scaledWidth - 640
    this.orth = TransformUtils.orth(
      -s / 2, 640 + s / 2, 480, 0, 0, 1
    )
    // console.log("story size", 0, Coordinate.width * scale, 480, 0)
  }

  public onWindowResize() {
    super.onWindowResize();
    const scale = 480 / Coordinate.height
    const scaledWidth = 640 / scale
    const s = Coordinate.width - scaledWidth
    this.orth = TransformUtils.orth(
      -s / 2, scaledWidth + s / 2, 480, 0, 0, 1
    )
    for (let i = 0; i < this.spriteList.length; i++) {
      this.spriteList[i].onResize()
    }
  }

  protected onUpdate() {
    super.onUpdate();
    for (let i = 0; i < this.spriteList.length; i++) {
      this.spriteList[i].update()
    }
  }

  public bind() {
    ColoredTextureShader.bind()
    this.vertexArray.bind()
    // this.vertexBuffer.bind()
  }

  public onDraw() {
    // this.vertexArray.addBuffer(this.vertexBuffer, ColoredTextureShader.getLayout())
    ColoredTextureShader.getShader(this.gl).setUniformMatrix4fv("u_orth", this.orth)
    const sprites = this.spriteList
    for (let i = 0; i < sprites.length; i++) {
      sprites[i].draw(this.vertexArray)
    }
  }

  public unbind() {
    this.vertexArray.unbind()
  }

  public dispose() {
    super.dispose();
    StoryTextureManager.dispose()
    ColoredTextureShader.dispose()
    this.spriteList.forEach(v => v.dispose())
    this.vertexArray.dispose()
  }

}