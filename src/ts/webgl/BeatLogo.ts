import {BaseDrawableConfig} from "./Drawable";
import {Viewport} from "./Viewport";
import logo from '../../assets/Logo2.png'
import {Texture} from "./core/Texture";
import {Shader} from "./core/Shader";
import {VertexBuffer} from "./core/VertexBuffer";
import {VertexBufferLayout} from "./core/VertexBufferLayout";
import {VertexArray} from "./core/VertexArray";
import {TransformUtils} from "./core/TransformUtils";
import {Vector2} from "./core/Vector2";
import {BeatState} from "../Beater";
import {Time} from "../Time";
import {AudioPlayerV2} from "../AudioPlayerV2";
import {BeatDrawable} from "./BeatDrawable";
import {easeOut, easeOutQuint} from "../util/Easing";
import {ObjectTransition} from "./Transition";
import {ImageLoader} from "../ImageResources";
import {loadConfigFromFile} from "vite";

interface BeatLogoConfig extends BaseDrawableConfig {}

const vertexShader = `
    attribute vec4 a_position;
    attribute vec2 a_tex_coord;
    attribute mediump float a_scale_factor;
    attribute mediump float a_texture_alpha;
    
    varying mediump vec2 v_tex_coord;
    varying mediump float v_highlight;
    varying mediump float v_texture_alpha;
    
    uniform mediump vec2 u_kiai;
    uniform mat4 u_transform;
    
    void main() {
        mediump float factor = a_scale_factor * u_kiai.y;
        mediump float enhance = 1.8;
        mediump vec2 finalScale = vec2(
            u_transform[0][0] * (1.0 - factor - enhance * factor) + enhance * factor + factor, 
            u_transform[1][1] * (1.0 - factor - enhance * factor) + enhance * factor + factor
        );
        mat4 transform = mat4(
            finalScale.x, 0.0, 0.0, u_transform[0][3],
            0.0, finalScale.y, 0.0, u_transform[1][3],
            0.0, 0.0, 1.0, 0.0, 
            0.0, 0.0, 0.0, 1.0
        );
        gl_Position = a_position * transform;
        v_highlight = u_kiai.x; 
        v_tex_coord = a_tex_coord;
        v_texture_alpha = a_texture_alpha;
    }
`

const fragmentShader = `
    varying mediump vec2 v_tex_coord;
    varying mediump float v_highlight;
    varying mediump float v_texture_alpha;
    
    uniform sampler2D u_sampler;
    
    void main() {
        mediump vec4 texelColor = texture2D(u_sampler, v_tex_coord);
        texelColor.rgb = min(texelColor.rgb + (v_highlight * 0.05), 1.0);
        texelColor.a = texelColor.a * v_texture_alpha;
        gl_FragColor = texelColor;
    }
`

// TODO: complete this class
export class BeatLogo extends BeatDrawable {

    private readonly shader: Shader
    private readonly buffer: VertexBuffer
    private readonly texture: Texture
    private readonly layout: VertexBufferLayout
    private readonly vertexArray: VertexArray
    private readonly textureUnit = 0
    public light: number = 0

    private lightTransition: ObjectTransition | null = null

    constructor(
        gl: WebGL2RenderingContext,
        config: BeatLogoConfig
    ) {
        super(gl, config)
        const vertexArray = new VertexArray(gl)
        vertexArray.bind()
        const buffer = new VertexBuffer(gl)
        const shader = new Shader(gl, vertexShader, fragmentShader)
        const layout = new VertexBufferLayout(gl)
        const texture = new Texture(gl, ImageLoader.get("logo"))

        buffer.bind()
        shader.bind()

        shader.setUniform1i('u_sampler', this.textureUnit)
        layout.pushFloat(shader.getAttributeLocation('a_position'), 2)
        layout.pushFloat(shader.getAttributeLocation('a_tex_coord'), 2)
        layout.pushFloat(shader.getAttributeLocation('a_scale_factor'), 1)
        layout.pushFloat(shader.getAttributeLocation('a_texture_alpha'), 1)
        vertexArray.addBuffer(buffer, layout)

        vertexArray.unbind()
        buffer.unbind()
        shader.unbind()

        this.vertexArray = vertexArray
        this.buffer = buffer;
        this.layout = layout
        this.shader = shader
        this.texture = texture

    }

    public lightBegin(atTime: number = Time.currentTime) {
        if (this.lightTransition === null) {
            this.lightTransition = new ObjectTransition(this, 'light')
        }
        this.lightTransition.setStartTime(atTime)
        return this.lightTransition
    }

    public onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number) {
        // const volume = BeatState.nextBeatRMS
        // const logoScale = 1 - Math.min(volume + 0.4, 1) * 0.02
        // this.scaleBegin()
        //     .scaleTo(logoScale, 60, easeOut)
        //     .scaleTo(1, gap * 2, easeOutQuint)
        //
        // if (BeatState.isKiai) {
        //     this.lightBegin()
        //         .transitionTo(1, 60, easeOut)
        //         .transitionTo(0, gap * 2, easeOutQuint)
        // }

    }

    private kiaiInfo = new Float32Array(2)

    protected onUpdate() {
        super.onUpdate();
        this.lightTransition?.update(Time.currentTime)
        if (this.lightTransition?.isEnd) {
            this.lightTransition = null
        }
        // if (AudioPlayerV2.instance.isPlaying.value) {

            // this.parentScale = this.interpolationDump(
            //     this.parentScale,
            //     1 - Math.max(0, Math.min(1, 1)) * 0.04,
            //     0.9,
            //     Time.elapsed
            // )
            // const targetScale = this._scale.x * 0.97
            // if (targetScale < 0.8) {
            //     console.log(targetScale)
            // }
            // this.scale = new Vector2(targetScale, targetScale)
        // }


        this.shader.bind()
        // this.shader.setUniform1f('u_highlight', BeatState.isKiai ? BeatState.currentBeat : 0)
        this.kiaiInfo[0] = this.light
        this.kiaiInfo[1] = BeatState.isKiai ? 0 : 1
        this.shader.setUniform2fv('u_kiai', this.kiaiInfo)
    }

    protected onTransformApplied() {
        super.onTransformApplied();
        this.shader.setUniformMatrix4fv('u_transform', this.matrixArray)
        this.shader.unbind()
    }

    private interpolationDump(start: number, final: number, base: number, exponent: number) {
        const amount = 1 - Math.pow(base, exponent)
        return start + (final - start) * amount
    }

    public createVertexArray() {
        const width = this.size.x
        const height= this.size.y
        this.position.y -= height * 0.007
        const { x, y } = this.position

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
            vertex[0].x, vertex[0].y, 0.0, 0.0, 0.0, 1.0,
            vertex[1].x, vertex[1].y, 1.0, 0.0, 0.0, 1.0,
            vertex[2].x, vertex[2].y, 0.0, 1.0, 0.0, 1.0,
            vertex[3].x, vertex[3].y, 1.0, 0.0, 0.0, 1.0,
            vertex[4].x, vertex[4].y, 0.0, 1.0, 0.0, 1.0,
            vertex[5].x, vertex[5].y, 1.0, 1.0, 0.0, 1.0,

            vertex[0].x, vertex[0].y, 0.0, 0.0, 1.0, 0.11,
            vertex[1].x, vertex[1].y, 1.0, 0.0, 1.0, 0.11,
            vertex[2].x, vertex[2].y, 0.0, 1.0, 1.0, 0.11,
            vertex[3].x, vertex[3].y, 1.0, 0.0, 1.0, 0.11,
            vertex[4].x, vertex[4].y, 0.0, 1.0, 1.0, 0.11,
            vertex[5].x, vertex[5].y, 1.0, 1.0, 1.0, 0.11
        ])
    }

    public setViewport(viewport: Viewport) {
        super.setViewport(viewport)
        // console.log('BeatLogo', `x=${this.x}, y=${this.y}, width=${this.width}, height=${this.height}`)
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
        gl.drawArrays(gl.TRIANGLES, 0, 12)
    }

    public dispose() {
        this.texture.dispose()
        this.vertexArray.dispose()
        this.shader.dispose()
        this.buffer.dispose()
    }

}