import {BeatDrawable} from "../../drawable/BeatDrawable";
import {BaseDrawableConfig} from "../../drawable/Drawable";
import {VertexArray} from "../../core/VertexArray";
import {Shader} from "../../core/Shader";
import {VertexBuffer} from "../../core/VertexBuffer";
import {VertexBufferLayout} from "../../core/VertexBufferLayout";
import {ObjectTransition} from "../../transition/Transition";
import {Time} from "../../../global/Time";
import {BeatState} from "../../../global/Beater";
import {easeInQuad} from "../../../util/Easing";
import {Color} from "../../base/Color";
import AudioChannel from "../../../player/AudioChannel";

const vertexShader = `
    attribute vec2 a_position;
    attribute vec4 a_color;
    
    varying mediump vec4 v_color;
    varying mediump float v_coord_x;
    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_coord_x = a_position.x;
        v_color = a_color;
    }
`
const fragmentShader = `
    varying mediump vec4 v_color;
    varying mediump float v_coord_x;
    uniform mediump vec2 u_which;
    
    void main() {
        mediump vec4 color = vec4(v_color);
        mediump float left = 1.0 - step(-0.4, v_coord_x);
        mediump float right = step(0.4, v_coord_x);       
        if (left > 0.99) {
            color.a = color.a * u_which.x;    
        }
        if (right > 0.99) {
            color.a = color.a * u_which.y;
        }
        
        gl_FragColor = color;
    }
`

export interface FlashlightConfig extends BaseDrawableConfig {
    color?: Color
}

export class Flashlight extends BeatDrawable<FlashlightConfig> {

    private readonly vertexArray: VertexArray
    private readonly shader: Shader
    private readonly buffer: VertexBuffer
    private readonly layout: VertexBufferLayout
    public leftLight: number = 0
    public rightLight: number = 0
    private leftTransition: ObjectTransition = new ObjectTransition(this, 'leftLight')
    private rightTransition: ObjectTransition = new ObjectTransition(this, 'rightLight')

    constructor(gl: WebGL2RenderingContext, config: FlashlightConfig) {
        super(gl, config);
        this.color = config.color ?? Color.fromHex(0x0090ff)
        const vertexArray = new VertexArray(gl)
        vertexArray.bind()
        const vertexBuffer = new VertexBuffer(gl, this.createVertex())
        const layout = new VertexBufferLayout(gl)
        const shader = new Shader(gl, vertexShader, fragmentShader)

        vertexBuffer.bind()
        shader.bind()

        layout.pushFloat(shader.getAttributeLocation("a_position"), 2)
        layout.pushFloat(shader.getAttributeLocation("a_color"), 4)
        vertexArray.addBuffer(vertexBuffer, layout)

        vertexArray.unbind()
        vertexBuffer.unbind()
        shader.unbind()

        this.vertexArray = vertexArray
        this.buffer = vertexBuffer
        this.shader = shader
        this.layout = layout
    }

    private leftLightBegin(atTime: number = Time.currentTime) {
        this.leftTransition.setStartTime(atTime)
        return this.leftTransition
    }

    private rightLightBegin(atTime: number = Time.currentTime) {
        this.rightTransition.setStartTime(atTime)
        return this.rightTransition
    }

    private color = Color.fromHex(0x0090ff)
    private createVertex(): Float32Array {
        const color = this.color
        return new Float32Array([
            -1.0, 1.0, color.red, color.green, color.blue, color.alpha,
            -1.0, -1.0, color.red, color.green, color.blue, color.alpha,
            -0.4, -1.0, 0.0, 0.0, 0.0, 0.0,
            -1.0, 1.0, color.red, color.green, color.blue, color.alpha,
            -0.4, 1.0, 0.0, 0.0, 0.0, 0.0,
            -0.4, -1.0, 0.0, 0.0, 0.0, 0.0,

            0.4, 1.0, 0.0, 0.0, 0.0, 0.0,
            1.0, 1.0, color.red, color.green, color.blue, color.alpha,
            1.0, -1.0, color.red, color.green, color.blue, color.alpha,
            1.0, -1.0, color.red, color.green, color.blue, color.alpha,
            0.4, -1.0, 0.0, 0.0, 0.0, 0.0,
            0.4, 1.0, 0.0, 0.0, 0.0, 0.0
        ])
    }

    protected onUpdate() {
        super.onUpdate();
        this.leftTransition.update(Time.currentTime)
        this.rightTransition.update(Time.currentTime)
    }

    public bind(): void {
        this.vertexArray.bind()
        this.shader.bind()
    }

    public onDraw(): void {
        const gl = this.gl
        this.shader.setUniform2fv("u_which", new Float32Array([this.leftLight, this.rightLight]))

        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_CONSTANT_ALPHA);
        this.vertexArray.addBuffer(this.buffer, this.layout)
        gl.drawArrays(gl.TRIANGLES, 0, 12)
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }

    public onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number): void {
        if (!this.isAvailable)
            return
        if (!BeatState.isAvailable)
            return;
        // const adjust = Math.min(BeatState.nextBeatRMS + 0.4, 1)
        let leftAdjust = Math.min(AudioChannel.leftVolume() + 0.4, 1),
          rightAdjust = Math.min(AudioChannel.leftVolume() + 0.4, 1)
        let left = 0, right = 0
        const lightTimeFunc = easeInQuad
        const beatLength = gap
        if (BeatState.isKiai) {
            if ((BeatState.beatIndex & 1) === 0) {
                left = 0.6 * leftAdjust
                this.leftLightBegin()
                    .transitionTo(left, 60)
                    .transitionTo(0, beatLength, lightTimeFunc)
            } else {
                right = 0.6 * rightAdjust
                this.rightLightBegin()
                    .transitionTo(right, 60)
                    .transitionTo(0, beatLength, lightTimeFunc)
            }
        } else {
            if ((BeatState.beatIndex & 0b11) === 0 && BeatState.beatIndex != 0) {
                left = 0.4 * leftAdjust
                right = 0.4 * rightAdjust
                this.leftLightBegin()
                    .transitionTo(left, 60)
                    .transitionTo(0, beatLength, lightTimeFunc)
                this.rightLightBegin()
                    .transitionTo(right, 60)
                    .transitionTo(0, beatLength, lightTimeFunc)
            }
        }
    }

    public unbind(): void {
        this.vertexArray.unbind()
        this.shader.unbind()
    }

    public dispose() {
        super.dispose();
        this.shader.dispose()
        this.vertexArray.dispose()
        this.buffer.dispose()
    }

}