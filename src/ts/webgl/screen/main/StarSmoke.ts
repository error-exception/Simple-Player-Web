import {Vector, Vector2} from "../../core/Vector2";
import {Vector2Transition} from "../../transition/Vector2Transition";
import {ObjectTransition} from "../../transition/Transition";
import {Time} from "../../../global/Time";
import {BeatDrawable} from "../../drawable/BeatDrawable";
import {VertexArray} from "../../core/VertexArray";
import {VertexBuffer} from "../../core/VertexBuffer";
import {Texture} from "../../core/Texture";
import {Shader} from "../../core/Shader";
import {VertexBufferLayout} from "../../core/VertexBufferLayout";
import BeatBooster from "../../../global/BeatBooster";
import {clamp, degreeToRadian, int} from "../../../Utils";
import Coordinate from "../../base/Coordinate";
import {Shape2D} from "../../util/Shape2D";
import {BeatState} from "../../../global/Beater";
import {Interpolation} from "../../util/Interpolation";
import {easeOutBack, easeOutQuint} from "../../../util/Easing";
import DynamicTextureShader from "../../shader/DynamicTextureShader";
import {
    ATTR_ALPHA,
    ATTR_POSITION,
    ATTR_TEXCOORD,
    UNI_ORTH,
    UNI_SAMPLER,
    UNI_TRANSFORM
} from "../../shader/ShaderConstant";
import {Images} from "../../util/ImageResource";

class StarParticle {

    private from: Vector2 = Vector(0)
    private to: Vector2 = Vector(0)
    private alpha = 0.5
    private translate = Vector(0)
    private size = Vector(56)

    private translateTransition = new Vector2Transition(this, 'translate')
    private alphaTransition = new ObjectTransition(this, 'alpha')

    public setFromAndTo(from: Vector2, to: Vector2) {
        this.from = from
        this.to = to
        this.translate = from
    }

    public translateBegin(startTime = Time.currentTime) {
        this.translateTransition.setStartTime(startTime)
        return this.translateTransition
    }

    public alphaBegin(startTime = Time.currentTime) {
        this.alphaTransition.setStartTime(startTime)
        return this.alphaTransition
    }

    public reset() {
        this.alpha = 0.5
        this.translate = this.from
    }

    public isEnd() {
        return this.alphaTransition.isEnd
    }

    public start() {
        this.translateBegin()
            .to(this.to, 1500, easeOutBack)
        this.alphaBegin(Time.currentTime + 1000)
            .transitionTo(0, 500, easeOutQuint)
    }

    public update() {
        this.alphaTransition.update(Time.currentTime)
        this.translateTransition.update(Time.currentTime)
    }

    public copyTo(out: Float32Array | number[], offset: number) {
        let currentOffset = offset
        const size = this.size
        const position = this.translate
        Shape2D.quad(
            position.x - size.x / 2, position.y + size.y / 2,
            position.x + size.x / 2, position.y - size.y / 2,
            out, currentOffset, 5
        )
        Shape2D.quad(
            0, 0, 1, 1,
            out, currentOffset + 2, 5
        )
        Shape2D.one(this.alpha, out, currentOffset + 4, 5, 6)
        return 5 * 6
    }

}

class SmokeBooster {

    private leftPosition = Vector(0)
    private rightPosition = Vector(0)
    private leftStars: StarParticle[] = []
    private rightStars: StarParticle[] = []
    private degree = 90
    private degreeTransition = new ObjectTransition(this, 'degree')

    constructor() {
        this.onWindowResize()
    }

    public onWindowResize() {
        const width6 = Coordinate.width / 6
        const bottom = -Coordinate.height / 2 - 100
        this.leftPosition.set(
            -Coordinate.width / 2 + width6, bottom
        )
        this.rightPosition.set(
            Coordinate.width / 2 - width6, bottom
        )
    }

    public degreeBegin(startTime = Time.currentTime) {
        this.degreeTransition.setStartTime(startTime)
        return this.degreeTransition
    }

    private type: number | undefined = undefined
    public fire(type: number) {
        this.type = type
        if (type === 1) {
            this.fireVertically()
        } else if (type === 2) {
            this.fireRotateToInner()
        } else if (type === 3) {
            this.fireRotateToOuter()
        }
    }

    public fireVertically() {
        this.degree = 90
    }

    public fireRotateToInner() {
        this.degree = 157.5
        this.degreeBegin()
            .transitionTo(22.5, this.duration)
    }

    public fireRotateToOuter() {
        this.degree = 22.5
        this.degreeBegin()
            .transitionTo(157.5, this.duration)
    }

    private duration = 800
    private startTime = -1
    public update() {
        this.degreeTransition.update(Time.currentTime)
        const type = this.type
        if (type) {
            for (let i = 0; i < 3; i++) {
                this.createOrReuse(this.leftStars, this.leftPosition)
                this.createOrReuse(this.rightStars, this.rightPosition)
            }
        }

        if (this.startTime < 0 && type) {
            this.startTime = Time.currentTime
            console.time('s')
        }

        for (let i = 0; i < this.leftStars.length; i++) {
            this.leftStars[i].update()
        }
        for (let i = 0; i < this.rightStars.length; i++) {
            this.rightStars[i].update()
        }

        if (Time.currentTime - this.startTime >= this.duration && type) {
            this.startTime = -1
            this.type = undefined
            console.timeEnd('s')
        }
    }

    public createOrReuse(stars: StarParticle[], position: Vector2) {
        let star: StarParticle
        const targetDistance = Interpolation.valueAt(Math.random(), -40, 20)
        let degree = Interpolation.valueAt(Math.random(), this.degree - 10, this.degree + 10)
        if (position === this.rightPosition)
            degree = 180 - degree
        const startPosition = Vector(
            position.x + Interpolation.valueAt(Math.random(), -20, 20),
            position.y
        )
        if (stars.length === 0) {
            star = new StarParticle()
        } else {
            star = stars[0]
            if (star.isEnd()) {
                stars.shift()
            } else {
                star = new StarParticle()
            }
        }
        star.setFromAndTo(startPosition, Vector(
            targetDistance * Math.cos(degreeToRadian(degree)) + position.x,
            targetDistance * Math.sin(degreeToRadian(degree))
        ))
        star.reset()
        star.start()
        stars.push(star)
        // console.log('star length', stars.length)
    }

    public copyTo(out: Float32Array | number[], offset: number) {
        let currentOffset = offset
        let stars = this.leftStars
        for (let i = 0; i < stars.length; i++) {
            currentOffset += stars[i].copyTo(out, currentOffset)
        }
        stars = this.rightStars
        for (let i = 0; i < stars.length; i++) {
            currentOffset += stars[i].copyTo(out, currentOffset)
        }
        return currentOffset - offset
    }
}

export class StarSmoke extends BeatDrawable {

    private readonly vertexArray: VertexArray
    private readonly buffer: VertexBuffer
    private readonly texture: Texture
    private readonly shader: Shader
    private readonly layout: VertexBufferLayout
    private readonly textureUnit: number = 1
    private booster: SmokeBooster = new SmokeBooster()

    constructor(
        gl: WebGL2RenderingContext
    ) {
        super(gl, {
            size: ['fill-parent', 'fill-parent']
        })
        const vertexArray = new VertexArray(gl)
        vertexArray.bind()
        const buffer = new VertexBuffer(gl, null, gl.STREAM_DRAW)
        const layout = new VertexBufferLayout(gl)
        const shader = DynamicTextureShader.newShader(gl)
        // const shader = new Shader(gl, vertexShader, fragmentShader)

        const texture = new Texture(gl, Images.Star)

        buffer.bind()
        shader.bind()
        layout.pushFloat(shader.getAttributeLocation(ATTR_POSITION), 2)
        layout.pushFloat(shader.getAttributeLocation(ATTR_TEXCOORD), 2)
        layout.pushFloat(shader.getAttributeLocation(ATTR_ALPHA), 1)
        vertexArray.addBuffer(buffer, layout)

        vertexArray.unbind()
        buffer.unbind()
        shader.unbind()

        this.vertexArray = vertexArray
        this.buffer = buffer
        this.texture = texture
        this.layout = layout
        this.shader = shader
    }

    private lastKiai = false
    public onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number) {
        if (!BeatBooster.isAvailable) {
            return
        }
        if (BeatState.isKiai && !this.lastKiai) {
            this.booster.fire(clamp(
              Math.round(Interpolation.valueAt(Math.random(), 1, 3)), 1, 3
            ))
            this.lastKiai = true
            console.log('fire', Time.currentTime)
        }
         this.lastKiai = BeatState.isKiai
    }

    public bind() {
        this.vertexArray.bind()
        this.buffer.bind()
        this.texture.bind(this.textureUnit)
        this.shader.bind()
    }

    private vertexData = new Float32Array([])
    private vertexCount = 0
    protected onUpdate() {
        super.onUpdate();
        const data: number[] = []
        this.booster.update()
        this.booster.copyTo(data, 0)
        this.vertexData = new Float32Array(data)
        this.vertexCount = int(data.length / 5)
    }

    public unbind() {
        this.vertexArray.unbind()
        this.buffer.unbind()
        this.texture.unbind()
        this.shader.unbind()
    }

    public onWindowResize() {
        super.onWindowResize();
        this.booster.onWindowResize()
    }

    public onDraw() {
        const gl = this.gl
        const shader = this.shader

        shader.setUniform1i(UNI_SAMPLER, this.textureUnit)
        shader.setUniformMatrix4fv(UNI_TRANSFORM, this.matrixArray)
        shader.setUniformMatrix4fv(UNI_ORTH, Coordinate.orthographicProjectionMatrix4)
        if (this.vertexCount === 0) return

        this.buffer.setBufferData(this.vertexData)
        this.vertexArray.addBuffer(this.buffer, this.layout)
        gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount)
    }

    public dispose() {
        super.dispose()
        this.texture.dispose()
        this.vertexArray.dispose()
        this.shader.dispose()
        this.buffer.dispose()
    }

}
