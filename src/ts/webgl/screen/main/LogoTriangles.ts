import {Time} from "../../../global/Time";
import {Color} from "../../base/Color";
import Coordinate from "../../base/Coordinate";
import {BaseDrawableConfig, Drawable} from "../../drawable/Drawable";
import {Interpolation} from "../../util/Interpolation";
import {ObjectTransition} from "../../transition/Transition";
import {Vector, Vector2} from "../../core/Vector2";
import type {RoundClipShaderWrapper} from "../../shader/RoundClipShaderWrapper";
import {Shaders} from "../../shader/Shaders";
import {BasicVertexBuffer} from "../../buffer/BasicVertexBuffer";
import {type DrawNode} from "../../drawable/DrawNode";
import {type WebGLRenderer} from "../../WebGLRenderer";

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
            const triangle = new TriangleParticle(this)
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

    /**
     * todo: 解决高帧率下的移动速度过快
     * @private
     */
    private updateParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            const triangle = this.particles[i]
            if (triangle.isFinish()) {
                triangle.size = Interpolation.valueAt(Math.random(), this.MIN_SIZE, this.MAX_SIZE)
                const { x, y } = this.initRectangle.topLeft
                triangle.position = new Vector2(
                    Interpolation.valueAt(Math.random(), x, x + this.getWidth()),
                    y + this.getHeight() + triangle.size
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
        // this.initParticles()
        this.MAX_SIZE = this.initRectangle.getWidth() * 0.7
        this.MIN_SIZE = this.MAX_SIZE * 0.066667
        const node = this.drawNode
        node.shader = Shaders.RoundClip
        node.vertexBuffer = new BasicVertexBuffer(
          renderer,
          this.particles.length * 3,
          6,
          renderer.gl.STREAM_DRAW
        )
        node.apply()
    }

    private isInitialed = false

    private initParticles() {
        if (this.isInitialed) return
        this.isInitialed = true
        for (let i = 0; i < this.particles.length; i++) {
            const triangle = this.particles[i]
            triangle.size = Interpolation.valueAt(Math.random(), this.MIN_SIZE, this.MAX_SIZE);
            const { x, y } = this.initRectangle.topLeft
            triangle.position.set(
                Interpolation.valueAt(Math.random(), x, x + this.getWidth()),
                Interpolation.valueAt(Math.random(), y, y + this.getHeight())
            )
            triangle.color = Interpolation.colorAt(Math.random(), this.startColor, this.endColor)
            triangle.update()
        }
    }

    onTransformApplied() {
        super.onTransformApplied();

        const topLeft = this.rectangle.topLeft
        const bottomRight = this.rectangle.bottomRight
        const size = bottomRight.minus(topLeft)
        const radius = Math.min(size.x, size.y) / 2
        const center = topLeft.add(size.divValue(2))

        const minLength = Math.min(Coordinate.size.x, Coordinate.size.y)

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
        const shader = node.shader as RoundClipShaderWrapper
        shader.orth = Coordinate.orthographicProjectionMatrix4
        shader.circle = this.circleInfo
        shader.light = this.light
        shader.resolution = Coordinate.resolution
    }

    public onDraw(node: DrawNode): void {
        const startColor = this.startColor
        startColor.alpha = this.appliedColor.alpha
        const position = this.initRectangle.topLeft
        node.drawTriangle(
          position,
          Vector(position.x, position.y + this.getHeight()),
          this.initRectangle.bottomRight,
          startColor,
          0
        )
        node.drawTriangle(
          position,
          Vector(position.x + this.getWidth(), position.y),
          this.initRectangle.bottomRight,
          startColor,
          1
        )
        const particles = this.particles
        for (let i = 0; i < particles.length; i++) {
            const particle = this.particles[i]
            node.drawTriangle(
              particle.top,
              particle.bottomLeft,
              particle.bottomRight,
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

    public top: Vector2 = Vector2.newZero()
    public bottomLeft: Vector2 = Vector2.newZero()
    public bottomRight: Vector2 = Vector2.newZero()

    public position: Vector2 = Vector2.newZero() // center of triangle
    public size: number = 0
    public color: Color = Color.fromHex(0xff7db7)

    constructor(private parent: LogoTriangles) {}

    private cos30 = Math.sqrt(3) / 2
    private sin30 = 0.5

    public isFinish(): boolean {
        return this.bottomLeft.y <= this.parent.initRectangle.topLeft.y
    }

    public update() {
        const position = this.position
        const size = this.size
        this.top.set(
            position.x,
            position.y - size
        )
        this.bottomLeft.set(
            position.x - size * this.cos30,
            position.y + size * this.sin30
        )
        this.bottomRight.set(
            position.x + size * this.cos30,
            position.y + size * this.sin30
        )
    }

}