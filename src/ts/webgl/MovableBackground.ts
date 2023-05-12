import {BaseDrawableConfig} from "./Drawable";
import {VertexArray} from "./core/VertexArray";
import {Shader} from "./core/Shader";
import {VertexBuffer} from "./core/VertexBuffer";
import {VertexBufferLayout} from "./core/VertexBufferLayout";
import {Viewport} from "./Viewport";
import {Texture} from "./core/Texture";
import {Vector2} from "./core/Vector2";
import {TransformUtils} from "./core/TransformUtils";
import {BeatState} from "../Beater";
import {BeatDrawable} from "./BeatDrawable";
import {Time} from "../Time";
import {ObjectTransition} from "./Transition";
import {easeOut, easeOutCubic, easeOutQuint, easeOutSine} from "../util/Easing";
import {int} from "../Utils";
import {IEvent} from "../type";
import {EventDispatcher} from "../EventBus";
import {Box} from "./Box";
import {glCall} from "./core/Utils";
import {ImageLoader} from "../ImageResources";
import {isMainThread} from "worker_threads";

interface MovableBackgroundConfig extends BaseDrawableConfig {}

const vertexShader = `
    attribute vec4 a_position;
    attribute vec2 a_tex_coord;
    
    varying mediump vec2 v_tex_coord;
    
    uniform mat4 u_transform;
    
    void main() {
        gl_Position = a_position * u_transform;
        v_tex_coord = a_tex_coord;
    }
`
// TODO: 调整高亮的位置
const fragmentShader = `
    varying mediump vec2 v_tex_coord;
    uniform sampler2D u_sampler;
    uniform mediump vec2 u_brightness;
    uniform mediump float u_alpha;
    void main() {
        mediump vec4 texelColor = texture2D(u_sampler, v_tex_coord);
        mediump float distance = 0.0;
        mediump float target = 0.0;
        
        mediump float leftDistance = (0.15 - v_tex_coord.x) / 0.1;
        mediump float rightDistance = (v_tex_coord.x - 0.85) / 0.1;
        leftDistance = max(leftDistance, 0.0);
        rightDistance = max(rightDistance, 0.0);
        target = max(u_brightness.x * leftDistance, 0.0);
        target = max(u_brightness.y * rightDistance, target);

        texelColor.rgb = min(texelColor.rgb + target, 1.0);
        texelColor.a = texelColor.a * u_alpha;
        gl_FragColor = texelColor;
    }
`

export class MovableBackground extends BeatDrawable {

    private readonly vertexArray: VertexArray
    private readonly shader: Shader
    private readonly buffer: VertexBuffer
    private readonly layout: VertexBufferLayout
    private readonly texture: Texture

    public leftLight: number = 0
    public rightLight: number = 0

    private leftTransition: ObjectTransition = new ObjectTransition(this, 'leftLight')
    private rightTransition: ObjectTransition = new ObjectTransition(this, 'rightLight')

    constructor(
        gl: WebGL2RenderingContext,
        config: MovableBackgroundConfig,
        private textureUnit: number
    ) {
        super(gl, config)
        const vertexArray = new VertexArray(gl);
        vertexArray.bind()
        const buffer = new VertexBuffer(gl)
        const layout = new VertexBufferLayout(gl)
        const shader = new Shader(gl, vertexShader, fragmentShader)
        const texture = new Texture(gl, null)

        buffer.bind()
        shader.bind()

        shader.setUniform1i('u_sampler', this.textureUnit)
        layout.pushFloat(shader.getAttributeLocation('a_position'), 2)
        layout.pushFloat(shader.getAttributeLocation('a_tex_coord'), 2)
        vertexArray.addBuffer(buffer, layout)

        vertexArray.unbind()
        buffer.unbind()
        shader.unbind()

        this.vertexArray = vertexArray;
        this.buffer = buffer;
        this.layout = layout;
        this.texture = texture
        this.shader = shader
    }

    private leftLightBegin(atTime: number = Time.currentTime) {
        this.leftTransition.setStartTime(atTime)
        return this.leftTransition
    }

    private rightLightBegin(atTime: number = Time.currentTime) {
        this.rightTransition.setStartTime(atTime)
        return this.rightTransition
    }

    public onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number) {
        if (!this.isAvailable)
            return
        if (!BeatState.beat.isAvailable) {
            return;
        }
        const adjust = Math.min(BeatState.nextBeatRMS + 0.4, 1)
        let left = 0, right = 0
        if (BeatState.isKiai) {
            if ((BeatState.beatIndex & 1) === 0) {
                left = 0.5 * adjust
                this.leftLightBegin()
                    .transitionTo(left, 60, easeOut)
                    .transitionTo(0, gap * 2, easeOutCubic)
            } else {
                right = 0.5 * adjust
                this.rightLightBegin()
                    .transitionTo(right, 60, easeOut)
                    .transitionTo(0, gap * 2, easeOutCubic)
            }
        } else {
            if ((BeatState.beatIndex & 0b11) === 0 && BeatState.beatIndex != 0) {
                left = 0.3 * adjust
                right = 0.3 * adjust
                this.leftLightBegin()
                    .transitionTo(left, 60, easeOut)
                    .transitionTo(0, gap * 2, easeOutCubic)
                this.rightLightBegin()
                    .transitionTo(right, 60, easeOut)
                    .transitionTo(0, gap * 2, easeOutCubic)
            }
        }
    }

    protected onUpdate() {
        super.onUpdate();
        if (this.fadeTransition.isEnd) {
            this.onFinish?.()
            this.onFinish = null
        }
        this.leftTransition.update(Time.currentTime)
        this.rightTransition.update(Time.currentTime)
        this.brightnessValues[0] = this.leftLight
        this.brightnessValues[1] = this.rightLight


        const min = Math.min
        const viewport = this.viewport;
        const { imageWidth, imageHeight } = this.texture
        const scale = 1.01
        const translate = this.translate

        const scaledWidth = imageWidth * scale
        const scaledHeight = imageHeight * scale

        const shortOnImage = min(scaledHeight, scaledWidth)
        const shortOnViewport = min(viewport.width, viewport.height)
        const factor = shortOnViewport / shortOnImage

        const widthDiffer = scaledWidth - imageWidth
        const heightDiffer = scaledHeight - imageHeight
        const x = (factor * widthDiffer / viewport.width) * translate.x
        const y = (factor * heightDiffer / viewport.height) * translate.y

        this.scale = new Vector2(scale, scale)
        this.translate = new Vector2(x, y)

        const shader = this.shader
        shader.bind()
        shader.setUniform2fv('u_brightness', this.brightnessValues)
        shader.setUniform1f('u_alpha', this._alpha)
    }

    protected onTransformApplied() {
        super.onTransformApplied();
        this.shader.setUniformMatrix4fv('u_transform', this.matrixArray)
        this.shader.unbind()
    }

    private brightnessValues = new Float32Array([0.0, 0.0])

    private createVertexArray() {
        const { x, y } = this.position
        const width = this.size.x
        const height= this.size.y
        const vertex = [
            new Vector2(x,         y),
            new Vector2(x + width, y),
            new Vector2(x,         y - height),
            new Vector2(x + width, y),
            new Vector2(x,         y - height),
            new Vector2(x + width, y - height)
        ]
        for (let i = 0; i < vertex.length; i++) {
            TransformUtils.applyOrigin(vertex[i], this.coordinateScale)
        }
        return new Float32Array([
            vertex[0].x, vertex[0].y, 0.0, 0.0,
            vertex[1].x, vertex[1].y, 1.0, 0.0,
            vertex[2].x, vertex[2].y, 0.0, 1.0,
            vertex[3].x, vertex[3].y, 1.0, 0.0,
            vertex[4].x, vertex[4].y, 0.0, 1.0,
            vertex[5].x, vertex[5].y, 1.0, 1.0
        ])
    }

    public setBackgroundImage(image: HTMLImageElement) {
        this.texture.setTextureImage(image)
    }

    private onFinish: (() => void) | null = null

    public fadeOut(onFinish: () => void) {
        this.fadeBegin()
            .fadeTo(0, 1000)
        this.onFinish = onFinish
    }

    public setViewport(viewport: Viewport) {
        super.setViewport(viewport)
        this.buffer.bind()
        this.buffer.setBufferData(this.createVertexArray())
        this.buffer.unbind()

    }

    public unbind() {
        this.vertexArray.unbind()
        this.texture.unbind()
        this.shader.unbind()
    }

    public bind() {
        this.texture.bind(this.textureUnit)
        this.vertexArray.bind()
        this.shader.bind()
    }

    public onDraw() {
        const gl = this.gl
        this.vertexArray.addBuffer(this.buffer, this.layout)

        gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

    public dispose() {
        super.dispose()
        this.texture.dispose()
        this.vertexArray.dispose()
        this.shader.dispose()
        this.buffer.dispose()
    }
}

export class Background extends Box implements IEvent {

    private textureUnits = [2, 3]
    private textureUnitIndex = 0

    constructor(gl: WebGL2RenderingContext, config: BaseDrawableConfig) {
        super(gl, config);
        const current = new MovableBackground(gl, config, this.nextTextureUnit())
        const next = new MovableBackground(gl, config, this.nextTextureUnit())
        this.add(next, current)
        this.updateBackground(current)
        this.updateBackground(next)
        EventDispatcher.register(this)
    }

    private swap() {
        const temp = this.childrenList[0]
        this.childrenList[0] = this.childrenList[1]
        this.childrenList[1] = temp
    }

    private updateBackground(bg: MovableBackground) {
        const imageUrl = `/res/pics/${1 + int(Math.random() * 14)}.png`
        bg.setBackgroundImage(ImageLoader.get(imageUrl))
    }

    private get currentBackground() {
        return this.childrenList[1] as MovableBackground
    }

    private get nextBackground() {
        return this.childrenList[0] as MovableBackground
    }

    private flag = -1
    private isFading = false
    private displayNext = false
    public onSongChanged(id: number) {
        if (this.isFading) return;
        if (this.flag < 0) {
            this.flag++
            return
        }
        this.isFading = true
        this.displayNext = true
        this.currentBackground.fadeOut(() => {
            console.log("fade out complete")
            this.swap()
            this.updateBackground(this.nextBackground)
            this.nextBackground.alpha = 1
            this.isFading = false
            this.displayNext = false
        })
    }

    set translate(v: Vector2) {
        // super.translate = v;
        for (let i = 0; i < this.childrenList.length; i++) {
            this.childrenList[i].translate = v
        }
    }

    get translate(): Vector2 {
        // return super.translate;
        return Vector2.newZero()
    }

    public updateChildren() {
        if (this.displayNext) {
            this.nextBackground.update()
        }
        this.currentBackground.update()
    }

    public draw() {
        if (this.displayNext) {
            this.nextBackground.draw()
        }
        this.currentBackground.draw()
    }

    private nextTextureUnit(): number {
        this.textureUnitIndex = (this.textureUnitIndex + 1) % this.textureUnits.length
        return this.textureUnits[this.textureUnitIndex]
    }

    public dispose() {
        super.dispose();
        EventDispatcher.unregister(this)
    }

}