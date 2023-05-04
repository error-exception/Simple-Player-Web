import {Disposable} from "./core/Disposable";
import {Drawable} from "./Drawable";
import {Alignment, Bound, defaultViewport, Viewport} from "./Viewport";
import logo from '../../assets/Logo2.png'
import {Texture} from "./core/Texture";
import {Shader} from "./core/Shader";
import {VertexBuffer} from "./core/VertexBuffer";
import {VertexBufferLayout} from "./core/VertexBufferLayout";
import {VertexArray} from "./core/VertexArray";
import {isUndef} from "./core/Utils";

interface BeatLogoConfig extends Alignment, Bound {}

const vertexShader = `
    attribute vec4 a_position;
    attribute vec2 a_tex_coord;
    attribute mediump float a_texture_alpha;
    
    varying mediump vec2 v_tex_coord;
    varying mediump float v_highlight;
    varying mediump float v_texture_alpha;
    
    uniform mediump float u_highlight;
    uniform mat4 u_transform;
    
    void main() {
        gl_Position = a_position * u_transform;
        v_highlight = u_highlight;
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
        mediump vec4 targetColor = vec4(1.0, 1.0, 1.0, 1.0 - (v_highlight * 0.3));
        mediump float alpha = targetColor.a;
        mediump vec3 difference = targetColor.rgb - texelColor.rgb;
        mediump vec3 overlay = mix(difference, vec3(0.0), alpha);
        mediump vec3 result = texelColor.rgb + overlay.rgb;
//        texelColor.rgb = min(texelColor.rgb + (v_highlight * 0.2), 1.0);
        gl_FragColor = vec4(result, texelColor.a);
    }
`

// TODO: complete this class
export class BeatLogo implements Disposable, Drawable {


    private readonly shader: Shader
    private readonly buffer: VertexBuffer
    private readonly texture: Texture
    private readonly layout: VertexBufferLayout
    private readonly vertexArray: VertexArray

    private viewport: Viewport = defaultViewport

    private x: number = 0
    private y: number = 0
    private width: number = 0
    private height: number = 0

    constructor(
        private gl: WebGL2RenderingContext,
        private config: BeatLogoConfig
    ) {
        const vertexArray = new VertexArray(gl)
        vertexArray.bind()
        const buffer = new VertexBuffer(gl)
        const shader = new Shader(gl, vertexShader, fragmentShader)
        const layout = new VertexBufferLayout(gl)
        const texture = new Texture(gl, logo)

        buffer.bind()
        shader.bind()

        shader.setUniform1i('u_sampler', 0)
        layout.pushFloat(shader.getAttributeLocation('a_position'), 2)
        layout.pushFloat(shader.getAttributeLocation('a_tex_coord'), 2)
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

    private transformMatrix4: Float32Array = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ])

    public setTransform(scale: number, highlight: number, transX: number = 0, transY: number = 0) {
        const matrix = this.transformMatrix4
        const viewport = this.viewport
        matrix[0] = scale
        matrix[5] = scale
        matrix[3] = viewport.convertX(-transX * 0.02)
        matrix[7] = viewport.convertY(-transY * 0.02)

        this.shader.bind()
        this.shader.setUniform1f('u_highlight', highlight)
        this.shader.setUniformMatrix4fv('u_transform', matrix)
        this.shader.unbind()

        //
        // this.shader.bind()
        // this.shader.setUniformMatrix4fv('u_scale_mat', this.transformMatrix4)
        // this.shader.unbind()
    }

    public createVertexArray() {
        const viewport = this.viewport
        return new Float32Array([
            viewport.convertX(this.x),              viewport.convertY(this.y),               0.0, 0.0, 1.0,
            viewport.convertX(this.x + this.width), viewport.convertY(this.y),               1.0, 0.0, 1.0,
            viewport.convertX(this.x),              viewport.convertY(this.y - this.height), 0.0, 1.0, 1.0,
            viewport.convertX(this.x + this.width), viewport.convertY(this.y),               1.0, 0.0, 1.0,
            viewport.convertX(this.x),              viewport.convertY(this.y - this.height), 0.0, 1.0, 1.0,
            viewport.convertX(this.x + this.width), viewport.convertY(this.y - this.height), 1.0, 1.0, 1.0
        ])
    }

    public setViewport(viewport: Viewport) {
        this.viewport = viewport
        const config = this.config
        if (
            isUndef(config.y) && isUndef(config.vertical)
            || isUndef(config.x) && isUndef(config.horizontal)
        ) {
            throw new Error('config error')
        }
        if (this.config.x) {
            this.x = viewport.convertUnitX(this.config.x)
        }
        if (this.config.y) {
            this.y = viewport.convertUnitY(this.config.y)
        }
        this.width = viewport.convertUnitX(this.config.width)
        this.height = viewport.convertUnitY(this.config.height)
        if (this.config.horizontal) {
            this.x = viewport.alignmentX(this.config.horizontal, this.width)
        }
        if (this.config.vertical) {
            this.y = viewport.alignmentY(this.config.vertical, this.height)
        }
        console.log('BeatLogo', `x=${this.x}, y=${this.y}, width=${this.width}, height=${this.height}`)
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
        this.texture.bind()
        this.vertexArray.bind()
        this.shader.bind()
    }

    public draw() {
        const gl = this.gl
        this.vertexArray.addBuffer(this.buffer, this.layout)
        gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

    public dispose() {
        this.texture.dispose()
        this.vertexArray.dispose()
        this.shader.dispose()
        this.buffer.dispose()
    }

}



export class FadeBeatLogo implements Disposable, Drawable {


    private readonly shader: Shader
    private readonly buffer: VertexBuffer
    private readonly texture: Texture
    private readonly layout: VertexBufferLayout
    private readonly vertexArray: VertexArray

    private viewport: Viewport = defaultViewport

    private x: number = 0
    private y: number = 0
    private width: number = 0
    private height: number = 0

    constructor(
        private gl: WebGL2RenderingContext,
        private config: BeatLogoConfig
    ) {
        const vertexArray = new VertexArray(gl)
        vertexArray.bind()
        const buffer = new VertexBuffer(gl)
        const shader = new Shader(gl, vertexShader, fragmentShader)
        const layout = new VertexBufferLayout(gl)
        const texture = new Texture(gl, logo)

        buffer.bind()
        shader.bind()

        shader.setUniform1i('u_sampler', 2)
        layout.pushFloat(shader.getAttributeLocation('a_position'), 2)
        layout.pushFloat(shader.getAttributeLocation('a_tex_coord'), 2)
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

    private transformMatrix4: Float32Array = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ])

    private dataVector2 = new Float32Array([0.0, 0.0])

    public setTransform(scale: number, highlight: number, transX: number = 0, transY: number = 0) {

        const vector = this.dataVector2
        vector[0] = scale
        vector[1] = highlight
        this.shader.bind()
        this.shader.setUniform2fv('u_scale_highlight', vector)
        this.shader.unbind()

        // const matrix = this.transformMatrix4
        // const viewport = this.viewport
        // matrix[0] = scale
        // matrix[5] = scale
        // matrix[3] = viewport.convertX(transX)
        // matrix[7] = viewport.convertY(transY)
        // this.shader.bind()
        // this.shader.setUniformMatrix4fv('u_scale_mat', this.transformMatrix4)
        // this.shader.unbind()
    }

    public createVertexArray() {
        const viewport = this.viewport
        return new Float32Array([
            viewport.convertX(this.x),              viewport.convertY(this.y),               0.0, 0.0, 0.2,
            viewport.convertX(this.x + this.width), viewport.convertY(this.y),               1.0, 0.0, 0.2,
            viewport.convertX(this.x),              viewport.convertY(this.y - this.height), 0.0, 1.0, 0.2,
            viewport.convertX(this.x + this.width), viewport.convertY(this.y),               1.0, 0.0, 0.2,
            viewport.convertX(this.x),              viewport.convertY(this.y - this.height), 0.0, 1.0, 0.2,
            viewport.convertX(this.x + this.width), viewport.convertY(this.y - this.height), 1.0, 1.0, 0.2
        ])
    }

    public setViewport(viewport: Viewport) {
        this.viewport = viewport
        const config = this.config
        if (
            isUndef(config.y) && isUndef(config.vertical)
            || isUndef(config.x) && isUndef(config.horizontal)
        ) {
            throw new Error('config error')
        }
        if (this.config.x) {
            this.x = viewport.convertUnitX(this.config.x)
        }
        if (this.config.y) {
            this.y = viewport.convertUnitY(this.config.y)
        }
        this.width = viewport.convertUnitX(this.config.width)
        this.height = viewport.convertUnitY(this.config.height)
        if (this.config.horizontal) {
            this.x = viewport.alignmentX(this.config.horizontal, this.width)
        }
        if (this.config.vertical) {
            this.y = viewport.alignmentY(this.config.vertical, this.height)
        }
        console.log('BeatLogo', `x=${this.x}, y=${this.y}, width=${this.width}, height=${this.height}`)
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
        this.texture.bind(2)
        this.vertexArray.bind()
        this.shader.bind()
    }

    public draw() {
        const gl = this.gl
        this.vertexArray.addBuffer(this.buffer, this.layout)
        gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

    public dispose() {
        this.texture.dispose()
        this.vertexArray.dispose()
        this.shader.dispose()
        this.buffer.dispose()
    }

}