import { Time } from "../../../global/Time";
import { OSUApplication } from "../../../OSUApplication";
import { color, type Color4 } from "../../base/Color";
import type { Canvas } from "../../canvas/Canvas";
import { anchor } from "../../drawable/Anchor";
import { BasicVertexBuffer } from "../../graphic/buffer/BasicVertexBuffer";
import { Buffers } from "../../graphic/buffer/Buffers";
import { almostEquals } from "../../graphic/core/Utils";
import { vector2 } from "../../graphic/matrix/vec2";
import { Shaders } from "../../graphic/shader/Shaders";
import { triangle } from "../../graphic/shape/Triangle";
import { TextureStore } from "../../graphic/texture/TextureStore";
import { ObjectTransition } from "../../transition/Transition";
import { Interpolation } from "../../util/Interpolation";
import { View } from "../../view/View";

export class LogoTriangles extends View {

  private particles: TriangleParticle[] = []
  private startColor = color.fromHex(0xff7db7)
  private endColor = color.fromHex(0xde5b95)
  private MAX_SIZE = 300
  private MIN_SIZE = 20

  public velocityIncrement = 0
  private velocityTransition = new ObjectTransition(this, 'velocityIncrement')

  constructor() {
    super();
    for (let i = 0; i < 32; i++) {
      const triangle = new TriangleParticle()
      this.particles.push(triangle)
    }
    this.origin = anchor.Center
  }

  public velocityBegin(atTime: number = Time.currentTime) {
    this.velocityTransition.setStartTime(atTime)
    return this.velocityTransition
  }

  public onUpdate() {
    super.onUpdate();
    this.velocityTransition.update(Time.currentTime)
    this.initParticles()
    this.updateParticles()
  }

  private updateParticles() {
    for (let i = 0; i < this.particles.length; i++) {
      const triangle = this.particles[i]
      if (triangle.isFinish()) {
        triangle.size = Interpolation.valueAt(Math.random(), this.MIN_SIZE, this.MAX_SIZE)
        triangle.position = vector2.fromValues(
          Interpolation.valueAt(Math.random(), 0, this.width),
          this.height + triangle.size
        )
        triangle.color = Interpolation.colorAt(Math.random(), this.startColor, this.endColor)
      } else {
        const size = triangle.size
        triangle.position[1] -= (3.33333334 / Time.elapsed) + size / 400 + this.velocityIncrement * (size / 400)
      }
      triangle.update()
    }
  }

  //@ts-ignore
  private basicVertexBuffer: BasicVertexBuffer

  public onLoad(): void {
    super.onLoad()
    this.MAX_SIZE = this.width * 0.7
    this.MIN_SIZE = this.MAX_SIZE * 0.066667
    const renderer = OSUApplication.renderer
    if (renderer == null) {
      return
    }
    this.basicVertexBuffer = new BasicVertexBuffer(
      renderer,
      this.particles.length * 3,
      6,
      renderer.gl.STREAM_DRAW
    )
  }

  private isInitialed = false

  private initParticles() {
    if (this.isInitialed) return
    this.isInitialed = true
    for (let i = 0; i < this.particles.length; i++) {
      const triangle = this.particles[i]
      triangle.size = Interpolation.valueAt(Math.random(), this.MIN_SIZE, this.MAX_SIZE);
      const x = Interpolation.valueAt(Math.random(), 0, this.width)
      const y = Interpolation.valueAt(Math.random(), 0, this.height)
      vector2.set(triangle.position, x, y)
      triangle.color = Interpolation.colorAt(Math.random(), this.startColor, this.endColor)
      triangle.update()
    }
  }

  public onDraw(canvas: Canvas): void {
    const startColor = this.startColor;

    canvas.enableMask()
    canvas.beginMask()
    canvas.useShader(Shaders.Mask)
    canvas.useVertexBuffer(Buffers.SingleQuad)
    canvas.drawTexture(
      TextureStore.getTexture("WhiteRound"),
      0, 0,
      this.width,
      this.height
    )
    canvas.endMask()
    canvas.useShader(Shaders.Simple)
    canvas.useVertexBuffer(this.basicVertexBuffer)

    // draw background
    canvas.beginBatch()
    const t1 = triangle.create(),
      t2 = triangle.create()
    triangle.set(t1, vector2.create(), vector2.fromValues(0, this.height), this.size)
    triangle.set(t2, vector2.create(), vector2.fromValues(this.width, 0), this.size)
    canvas.setColor(startColor)
    canvas.drawTriangle(t1)
    canvas.drawTriangle(t2)

    // Draw particles
    const particles = this.particles
    for (let i = 0; i < particles.length; i++) {
      const particle = this.particles[i]
      canvas.setColor(particle.color)
      canvas.drawTriangle(particle.triangle)
    }

    canvas.endBatch()
    canvas.disableMask()
  }

  public dispose() {
    super.dispose();
    this.basicVertexBuffer.dispose()
  }
}

class TriangleParticle {

  public triangle = triangle.create()

  public position = vector2.create() // center of triangle
  public size: number = 0
  public color: Color4 = color.fromHex(0xff7db7)

  constructor() { }

  private cos30 = Math.sqrt(3) / 2
  private sin30 = 0.5

  public isFinish(): boolean {
    return this.triangle.angle2[1] <= 0
  }

  public update() {
    const position = this.position
    const size = this.size
    const triangle = this.triangle
    // top
    vector2.set(triangle.angle1, position[0], position[1] - size)
    // bottom left
    vector2.set(triangle.angle2, position[0] - size * this.cos30, position[1] + size * this.sin30)
    // bottom right
    vector2.set(triangle.angle3, position[0] + size * this.cos30, position[1] + size * this.sin30)
  }

}