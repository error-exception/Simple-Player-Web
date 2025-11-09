import {Drawable} from "../../drawable/Drawable";
import {Interpolation} from "../../util/Interpolation";
import {Rectangle} from "../../graphic/shape/Rectangle";
import {type DrawNode} from "../../drawable/DrawNode";
import {type WebGLRenderer} from "../../WebGLRenderer";
import {DynamicQuadBuffer} from "../../graphic/buffer/DynamicQuadBuffer";
import type {Texture} from "../../graphic/core/Texture";
import {TextureStore} from "../../graphic/texture/TextureStore";
import type {DefaultShaderWrapper} from "../../graphic/shader/DefaultShaderWrapper";
import {Color} from "../../base/Color";
import {Blend} from "../../drawable/Blend";
import {Time} from "../../../global/Time";
import {Coordinate2} from "../../base/Coordinate2";

export class Snow extends Drawable {

  public static MAX_SIZE = 30
  public static MIN_SIZE = 10

  public particles: SnowParticle[]
  public SNOW_COUNT = 60
  public snow: Texture

  constructor() {
    super({
      size: Coordinate2.size
    });
    this.particles = new Array<SnowParticle>(this.SNOW_COUNT)
    const particles = this.particles
    for (let i = 0; i < particles.length; i++) {
      particles[i] = new SnowParticle()
      particles[i].reset()
    }
    this.snow = TextureStore.getTexture('Star')
    this.setColor(Color.White)
    this.setAlpha(.6)
  }

  onLoad(renderer: WebGLRenderer) {
    super.onLoad(renderer);
    const node = this.drawNode
    node.blend = Blend.Additive
    node.vertexBuffer = new DynamicQuadBuffer(renderer)
  }

  onUpdate() {
    super.onUpdate();
    const particles = this.particles
    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i]
      if (particle.isFinish) {
        particle.reset()
      } else {
        particle.update()
      }
    }
    this.drawNode.bufferData = []
  }

  public beforeCommit(node: DrawNode) {
    super.beforeCommit(node);
    const shader = node.shader as DefaultShaderWrapper
    shader.color = this.computeColor()
    shader.orth = Coordinate2.orthographicProjectionMatrix4
    shader.sampler2D = 0
  }

  public onDraw(node: DrawNode, renderer: WebGLRenderer) {
    const particles = this.particles
    let j = 0
    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i]
      if (particle.isFinish) continue
      node.drawRect(
        particle.rectangle,
        undefined,
        j
      )
      node.drawTexture(this.snow, undefined, undefined, j)
      j++
    }
  }

  dispose() {
    super.dispose();
    this.drawNode.vertexBuffer.dispose()
  }

}

class SnowParticle {

  public x = 0
  public y = 0
  public size: number = Interpolation.valueAt(.5, Snow.MAX_SIZE, Snow.MIN_SIZE)
  public rectangle = new Rectangle()

  public reset() {
    this.size = Interpolation.valueAt(
      Math.random(),
      Snow.MIN_SIZE,
      Snow.MAX_SIZE
    )
    this.y = -this.size / 2
    this.x = Interpolation.valueAt(
      Math.random(),
      0,
      Coordinate2.width
    )
    this.isFinish = false
  }

  public isFinish = false

  public update() {
    if (this.isFinish) return
    const size = this.size,
      rectangle = this.rectangle,
      elapsed = Time.elapsed
    this.y += 1.666667 / elapsed  + this.size / Snow.MAX_SIZE * (33.333334 / elapsed)
    this.isFinish = this.y >= (Coordinate2.height + size / 2)

    rectangle.setHeight(size)
    rectangle.setWidth(size)
    rectangle.setTopLeft(
      this.x - size / 2,
      this.y - size / 2
    )
  }
}