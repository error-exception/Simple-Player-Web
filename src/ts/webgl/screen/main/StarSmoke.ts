import {Vector, Vector2} from "../../core/Vector2";
import {Time} from "../../../global/Time";
import {BeatDrawable} from "../../drawable/BeatDrawable";
import {VertexArray} from "../../core/VertexArray";
import {VertexBuffer} from "../../core/VertexBuffer";
import {Texture} from "../../core/Texture";
import {Shader} from "../../core/Shader";
import {VertexBufferLayout} from "../../core/VertexBufferLayout";
import BeatBooster from "../../../global/BeatBooster";
import {degreeToRadian, int} from "../../../Utils";
import Coordinate from "../../base/Coordinate";
import {Shape2D} from "../../util/Shape2D";
import {BeatState} from "../../../global/Beater";
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
import {DrawableTransition} from "../../transition/DrawableTransition";
import {Transform} from "../../base/Transform";

class StarParticle extends DrawableTransition {

    private from: Vector2 = Vector(0)
    private to: Vector2 = Vector(0)
    private size = Vector(56)

    public setFromAndTo(from: Vector2, to: Vector2) {
        this.from = from
        this.to = to
        this.transform.translateTo(from)
    }

    public reset() {
        this.transform.alphaTo(0.5)
        this.transform.translateTo(this.from)
    }

    public isEnd() {
        return this.transitionAlpha.isEnd
    }

    public start(separate: boolean) {
        if (separate) {
            this.moveTo(this.to, 1500)
        } else {
            this.moveTo(this.to, 1500, easeOutBack)
        }
        this.delay(1000)
          .fadeTo(0, 500, easeOutQuint)
    }

    public update() {
        this.updateTransform()
    }

    public copyTo(out: Float32Array | number[], offset: number) {
        let currentOffset = offset
        const size = this.size
        const {x, y} = this.transform.translate
        Shape2D.quad(
            x - size.x / 2, y + size.y / 2,
            x + size.x / 2, y - size.y / 2,
            out, currentOffset, 5
        )
        Shape2D.quad(
            0, 0, 1, 1,
            out, currentOffset + 2, 5
        )
        Shape2D.one(this.transform.alpha, out, currentOffset + 4, 5, 6)
        return 5 * 6
    }

}

class SmokeBooster extends DrawableTransition {

    private leftPosition = Vector(0)
    private rightPosition = Vector(0)
    private leftStars: StarParticle[] = []
    private rightStars: StarParticle[] = []
    // private degree = 90
    // private degreeTransition = new ObjectTransition(this, 'degree')

    constructor() {
        super(new Transform())
        this.onWindowResize()
    }

    public onWindowResize() {
        const width6 = Coordinate.width / 6
        const bottom = -Coordinate.height / 2 - 20
        this.leftPosition.set(
            -Coordinate.width / 2 + width6, bottom
        )
        this.rightPosition.set(
            Coordinate.width / 2 - width6, bottom
        )
    }

    // public degreeBegin(startTime = Time.currentTime) {
    //     this.degreeTransition.setStartTime(startTime)
    //     return this.degreeTransition
    // }

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
        console.log("Smoke Booster type", type)
    }

    public fireVertically() {
        // this.degree = 90
        this.transform.rotateTo(90)
    }

    public fireRotateToInner() {
        this.transform.rotateTo(135)
        this.rotateTo(45, this.duration)
    }

    public fireRotateToOuter() {
        this.transform.rotateTo(45)
        this.rotateTo(135, this.duration)
    }

    private duration = 800
    private startTime = -1
    public update() {
        this.updateTransform()
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
        const targetDistance = Coordinate.height / 2
        // let degree = Interpolation.valueAt(Math.random(), this.rotate - 10, this.rotate + 10)
        let degree = this.transform.rotate
        if (position === this.rightPosition)
            degree = 180 - degree
        // const startPosition = Vector(
        //     position.x + Interpolation.valueAt(Math.random(), -20, 20),
        //     position.y
        // )
        const startPosition = position
        if (stars.length === 0) {
            star = new StarParticle(new Transform())
        } else {
            star = stars[0]
            if (star.isEnd()) {
                stars.shift()
            } else {
                star = new StarParticle(new Transform())
            }
        }
        star.setFromAndTo(startPosition, Vector(
            targetDistance * Math.cos(degreeToRadian(degree)) + position.x,
            targetDistance * Math.sin(degreeToRadian(degree)) + position.y
        ))
        star.reset()
        star.start(this.type !== 1)
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
        vertexArray.addBuffer(layout)

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
            const rand = Math.random()
            let type = 1
            if (rand > 0.3333 && rand <= 0.66667) {
                type = 2
            } else if (rand > 0.66667 && rand <= 1) {
                type = 3
            }
            this.booster.fire(type)
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
        this.vertexArray.addBuffer(this.layout)
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
