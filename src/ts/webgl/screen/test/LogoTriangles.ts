import {Time} from "../../../global/Time";
import {Color} from "../../base/Color";
import {BaseDrawableConfig, Drawable} from "../../drawable/Drawable";
import {Interpolation} from "../../util/Interpolation";
import {ObjectTransition} from "../../transition/Transition";
import {Vector, Vector2} from "../../graphic/core/Vector2";
import {Shaders} from "../../graphic/shader/Shaders";
import {BasicVertexBuffer} from "../../graphic/buffer/BasicVertexBuffer";
import {type DrawNode} from "../../drawable/DrawNode";
import {type WebGLRenderer} from "../../WebGLRenderer";
import {Triangle} from "../../graphic/shape/Triangle";
import {TriangleUtils} from "../../graphic/shape/TriangleUtils";
import {Vector2Utils} from "../../graphic/core/Vector2Utils";
import type {SimpleShaderWrapper} from "../../graphic/shader/SimpleShaderWrapper";
import {Coordinate2} from "../../base/Coordinate2";

export class LogoTriangles extends Drawable {

  private particles: TriangleParticle[] = []
  private startColor = Color.fromHex(0xff7db7)
  private endColor = Color.fromHex(0xde5b95)
  private MAX_SIZE = 300
  private MIN_SIZE = 20

  public light: number = 0
  private lightTransition = new ObjectTransition(this, 'light')

  public velocityIncrement = 0
  private velocityTransition = new ObjectTransition(this, 'velocityIncrement')

  constructor(config: BaseDrawableConfig) {
    super(config);
    for (let i = 0; i < 32; i++) {
      const triangle = new TriangleParticle()
      this.particles.push(triangle)
    }
  }

  public lightBegin(atTime: number = Time.currentTime) {
    this.lightTransition.setStartTime(atTime)
    return this.lightTransition
  }

  public velocityBegin(atTime: number = Time.currentTime) {
    this.velocityTransition.setStartTime(atTime)
    return this.velocityTransition
  }

  private circleInfo = new Float32Array(3)

  public onUpdate() {
    super.onUpdate();
    this.lightTransition.update(Time.currentTime)
    this.velocityTransition.update(Time.currentTime)
    this.initParticles()
    this.updateParticles()
  }

  private updateParticles() {
    for (let i = 0; i < this.particles.length; i++) {
      const triangle = this.particles[i]
      if (triangle.isFinish()) {
        triangle.size = Interpolation.valueAt(Math.random(), this.MIN_SIZE, this.MAX_SIZE)
        triangle.position = new Vector2(
          Interpolation.valueAt(Math.random(), 0, this.getWidth()),
          this.getHeight() + triangle.size
        )
        triangle.color = Interpolation.colorAt(Math.random(), this.startColor, this.endColor)
      } else {
        const size = triangle.size
        triangle.position.y -= (3.33333334 / Time.elapsed) + size / 400 + this.velocityIncrement * (size / 400)
      }
      triangle.update()
    }
  }

  public onLoad(renderer: WebGLRenderer): void {
    super.onLoad(renderer)
    this.MAX_SIZE = this.getWidth() * 0.7
    this.MIN_SIZE = this.MAX_SIZE * 0.066667
    const node = this.drawNode
    node.shader = Shaders.Simple
    node.vertexBuffer = new BasicVertexBuffer(
      renderer,
      this.particles.length * 3,
      6,
      renderer.gl.STREAM_DRAW
    )
    console.log('triangle load')
    node.apply()
  }

  private isInitialed = false

  private initParticles() {
    if (this.isInitialed) return
    this.isInitialed = true
    for (let i = 0; i < this.particles.length; i++) {
      const triangle = this.particles[i]
      triangle.size = Interpolation.valueAt(Math.random(), this.MIN_SIZE, this.MAX_SIZE);
      triangle.position.set(
        Interpolation.valueAt(Math.random(), 0, this.getWidth()),
        Interpolation.valueAt(Math.random(), 0, this.getHeight())
      )
      triangle.color = Interpolation.colorAt(Math.random(), this.startColor, this.endColor)
      triangle.update()
    }
  }

  onTransformUpdated() {
    super.onTransformUpdated();

    const topLeft = this.rectangle.topLeft
    const bottomRight = this.rectangle.bottomRight
    const size = Vector(this.rectangle.getWidth(), this.rectangle.getHeight())
    const radius = Math.min(size.x, size.y) / 2
    const center = Vector2Utils.middle(topLeft, bottomRight)

    const minLength = Math.min(Coordinate2.size.x, Coordinate2.size.y)

    this.circleInfo[0] = center.x / minLength
    this.circleInfo[1] = center.y / minLength
    this.circleInfo[2] = radius / minLength

    const alpha = this.appliedColor.alpha
    const particles = this.particles
    for (let i = 0; i < particles.length; i++) {
      particles[i].color.alpha = alpha
    }
  }

  public beforeCommit(node: DrawNode) {
    const shader = node.shader as SimpleShaderWrapper
    shader.orth = Coordinate2.orthographicProjectionMatrix4
    shader.alpha = this.computeColor().alpha
  }

  public onDraw(node: DrawNode): void {
    const startColor = this.startColor,
      matrix = this.drawNode.matrix
    startColor.alpha = this.appliedColor.alpha

    const t1 = new Triangle(), t2 = new Triangle()
    t1.setVector(Vector2.zero, Vector(0, this.getHeight()), this.size)
    t2.setVector(Vector2.zero, Vector(this.getWidth(), 0), this.size)

    TriangleUtils.applySelf(t1, matrix)
    TriangleUtils.applySelf(t2, matrix)

    node.drawTriangle(t1, startColor, 0)
    node.drawTriangle(t2, startColor, 1)

    const particles = this.particles
    const particleTriangle = t1
    for (let i = 0; i < particles.length; i++) {
      const particle = this.particles[i]
      TriangleUtils.applyTo(particle.triangle, matrix, particleTriangle)
      node.drawTriangle(
        particleTriangle,
        particle.color,
        i + 2
      )
    }
  }

  public dispose() {
    super.dispose();
    this.drawNode.vertexBuffer.dispose()
  }
}

class TriangleParticle {

  public triangle = new Triangle()

  public position: Vector2 = Vector2.newZero() // center of triangle
  public size: number = 0
  public color: Color = Color.fromHex(0xff7db7)

  constructor() {}

  private cos30 = Math.sqrt(3) / 2
  private sin30 = 0.5

  public isFinish(): boolean {
    return this.triangle.angle2.y <= 0
  }

  public update() {
    const position = this.position
    const size = this.size
    const triangle = this.triangle
    // top
    triangle.angle1.set(
      position.x,
      position.y - size
    )
    // bottom left
    triangle.angle2.set(
      position.x - size * this.cos30,
      position.y + size * this.sin30
    )
    // bottom right
    triangle.angle3.set(
      position.x + size * this.cos30,
      position.y + size * this.sin30
    )
  }

}