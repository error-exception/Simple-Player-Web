import {Vector, Vector2} from "../../graphic/core/Vector2";
import {easeOutBack} from "../../../util/Easing";
import {Rectangle} from "../../graphic/shape/Rectangle";
import {DrawNode} from "../../drawable/DrawNode";
import {WebGLRenderer} from "../../WebGLRenderer";
import {Time} from "../../../global/Time";
import type {Texture} from "../../graphic/core/Texture";
import {TextureStore} from "../../graphic/texture/TextureStore";
import {BeatDrawable} from "../../drawable/BeatDrawable";
import {BeatState} from "../../../global/Beater";
import {Shaders} from "../../graphic/shader/Shaders";
import {Blend} from "../../drawable/Blend";
import type {AlphaTextureShaderWrapper} from "../../graphic/shader/AlphaTextureShaderWrapper";
import {DynamicQuadBuffer} from "../../graphic/buffer/DynamicQuadBuffer";
import {Matrix3} from "../../graphic/core/Matrix3";
import {Transformable} from "../../drawable/Transformable";
import {TransformTransition} from "../../transition/TransformTransition";
import {TransformUtils2} from "../../graphic/core/TransformUtils2";
import {RectangleUtils} from "../../graphic/shape/RectangleUtils";
import {Coordinate2} from "../../base/Coordinate2";

export class StarSmoke extends BeatDrawable {

  private readonly star: Texture
  private readonly STAR_COUNT = 180
  private readonly leftBoost: StarSmokeBoost
  private readonly rightBoost: StarSmokeBoost

  constructor() {
    super({
      size: Coordinate2.size.copy()
    });
    this.star = TextureStore.getTexture('Star')
    this.leftBoost = new StarSmokeBoost(
      this,
      this.STAR_COUNT,
      Vector(Coordinate2.width * 0.25, Coordinate2.height + 80),
      Coordinate2.height / 2 + 80
    )
    this.rightBoost = new StarSmokeBoost(
      this,
      this.STAR_COUNT,
      Vector(Coordinate2.width * 0.75, Coordinate2.height + 80),
      Coordinate2.height / 2 + 80
    )
  }

  onLoad(renderer: WebGLRenderer) {
    super.onLoad(renderer);
    const node = this.drawNode
    node.vertexBuffer = new DynamicQuadBuffer(renderer, 5)
    node.shader = Shaders.AlphaTexture
    node.blend = Blend.Additive
  }


  private isFired = false
  onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number) {
    if (BeatState.isKiai) {
      if (this.isFired) return
      this.isFired = true
      // const random = Math.random()
      // if (random <= 1/3) {
        this.leftBoost.toVertical()
        this.rightBoost.toVertical()
      // } else if (random > 1/3 && random <= 2/3) {
      //   this.leftBoost.toLeft()
      //   this.rightBoost.toRight()
      // } else {
      //   this.leftBoost.toRight()
      //   this.rightBoost.toLeft()
      // }
    } else {
      this.isFired = false
    }
  }

  onUpdate() {
    super.onUpdate();
    const time = Time.currentTime
    this.leftBoost.update(time)
    this.rightBoost.update(time)
    this.drawNode.bufferData = []
  }

  public beforeCommit(node: DrawNode) {
    super.beforeCommit(node);
    const shader = node.shader as AlphaTextureShaderWrapper
    shader.sampler2D = 0
    shader.orth = Coordinate2.orthographicProjectionMatrix4
  }

  onDraw(node: DrawNode, renderer: WebGLRenderer) {
    const leftParticles = this.leftBoost.particles
    const rightParticles = this.rightBoost.particles
    let particle: StarParticle, j = 0
    const star = this.star
    for (let i = 0; i < leftParticles.length; i++) {
      particle = leftParticles[i]
      if (particle.isFinish || !particle.isReady) continue
      node.drawRect(
        particle.rectangle,
        undefined,
        j
      )
      node.drawTexture(star, undefined, undefined, j)
      node.drawOne(particle.getAlpha(), 4, 4, j)
      j++
    }
    for (let i = 0; i < rightParticles.length; i++) {
      particle = rightParticles[i]
      if (particle.isFinish || !particle.isReady) continue
      node.drawRect(
        particle.rectangle,
        undefined,
        j
      )
      node.drawTexture(star, undefined, undefined, j)
      node.drawOne(particle.getAlpha(), 4, 4, j)
      j++
    }
  }

  dispose() {
    super.dispose();
    this.drawNode.vertexBuffer.dispose()
  }

}

class StarSmokeBoost {

  public readonly particles: StarParticle[] = []

  constructor(
    parent: StarSmoke,
    count: number,
    private startFrom: Vector2,
    private distance: number
  ) {
    this.particles = new Array<StarParticle>(count)
    const particles = this.particles;
    for (let i = 0; i < particles.length; i++) {
      particles[i] = new StarParticle(parent.drawNode.matrix)
    }
  }

  public update(time: number) {
    const particles = this.particles
    for (let i = 0; i < particles.length; i++) {
      particles[i].update(time)
    }
  }

  public toVertical() {
    const delayIncrement = 20,
      particles = this.particles,
      from = Vector2.newZero(),
      to = Vector2.newZero(),
      area = 40,
      start = this.startFrom,
      end = Vector(start.x, start.y - this.distance)
    let currentDelay = 0
    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i],
        startXRandom = Math.random() * area,
        startYRandom = Math.random() * area,
        endXRandom = Math.random() * area,
        endYRandom = Math.random() * area
      from.set(
        start.x - area / 2 + startXRandom,
        start.y - area / 2 + startYRandom
      )
      to.set(
        end.x - area / 2 + endXRandom,
        end.y - area / 2 + endYRandom
      )
      particle.setFromAndTo(from, to, currentDelay)
      if (i & 2) {
        currentDelay += delayIncrement
      }
    }
  }

  public toLeft() {
    const delayIncrement = 20,
      particles = this.particles,
      from = Vector2.newZero(),
      to = Vector2.newZero(),
      area = 40,
      start = this.startFrom,
      end = Vector(start.x, start.y - this.distance),
      angleIncrement = 30 / particles.length
    let currentDelay = 0, currentAngle = 270 - 15
    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i],
        startXRandom = Math.random() * area,
        startYRandom = Math.random() * area,
        endXRandom = Math.random() * area,
        endYRandom = Math.random() * area
      from.set(
        start.x - area / 2 + startXRandom,
        start.y - area / 2 + startYRandom
      )
      to.set(
        end.x - area / 2 + endXRandom,
        end.y - area / 2 + endYRandom
      )
      particle.setFromAndTo(from, to, currentDelay)
      currentAngle += angleIncrement
      if (i & 2) {
        currentDelay += delayIncrement
      }
    }
  }

  public toRight() {

  }

}

/**
 * a star particle in square
 */
class StarParticle extends Transformable {

  private moveDuration = 800
  private initRectangle = new Rectangle()
  public rectangle = new Rectangle()
  /**
   * width of square
   */
  public size: number = 80

  public matrix: Matrix3 = Matrix3.newIdentify()

  private transition = new TransformTransition(this)

  constructor(private parentTransform: Matrix3) {
    super();
  }

  public transform(clear: boolean = true): TransformTransition {
    if (clear) {
      return this.transition.clear
    }
    return this.transition
  }

  setWidth(w: number) {
    this.initRectangle.setWidth(w)
  }

  setHeight(h: number) {
    this.initRectangle.setHeight(h)
  }

  getHeight(): number {
    return this.initRectangle.getHeight()
  }

  getWidth(): number {
    return this.initRectangle.getWidth()
  }

  setSize(width: number, height: number) {
    this.setHeight(height)
    this.setWidth(width)
  }

  getSize(): Vector2 {
    return Vector(this.getWidth(), this.getHeight())
  }

  private origin = Vector2.newZero()

  public startTime = 0
  public setFromAndTo(from: Vector2, to: Vector2, delay: number) {
    this.startTime = Time.currentTime + delay
    const size = this.size
    this.setWidth(size)
    this.setHeight(size)
    this.initRectangle.setTopLeft(
      from.x - size / 2,
      from.y - size / 2
    )
    this.origin.setFrom(from)
    this.setAlpha(.8)
    this.transform()
      .delay(delay).moveTo(to, this.moveDuration, easeOutBack)
      .delay(delay).fadeTo(0, this.moveDuration)

    this.isFinish = false
    this.isReady = false
  }

  public isFinish = true
  public isReady = false

  public update(timestamp: number) {
    if (this.isFinish) return
    this.isReady = timestamp >= this.startTime
    if (!this.isReady) return;
    this.transition.updateTransform()
    this.isFinish = timestamp > (this.startTime + this.moveDuration)
    const m = this.matrix
    m.setFrom(this.parentTransform)
    TransformUtils2.applyTransform(
      m,
      this._translate,
      this._rotate,
      this._scale,
      this._skew,
      this.origin
    )
    RectangleUtils.applyTo(this.initRectangle, m, this.rectangle)
  }

}