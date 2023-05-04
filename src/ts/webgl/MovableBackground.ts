import {Drawable} from "./Drawable";
import {VertexArray} from "./core/VertexArray";
import {Shader} from "./core/Shader";
import {VertexBuffer} from "./core/VertexBuffer";
import {VertexBufferLayout} from "./core/VertexBufferLayout";
import {Alignment, Bound, defaultViewport, Viewport} from "./Viewport";
import {Texture} from "./core/Texture";
import backgroundImage from '../../assets/ShovelKun.png'
import {glCall, isUndef} from "./core/Utils";

interface MovableBackgroundConfig extends Bound, Alignment {}

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
    void main() {
        mediump vec4 texelColor = texture2D(u_sampler, v_tex_coord);
        mediump float distance = 0.0;
        mediump float target = 0.0;
        
        mediump float leftDistance = (0.1 - v_tex_coord.x) / 0.1;
        mediump float rightDistance = (v_tex_coord.x - 0.9) / 0.1;
        leftDistance = max(leftDistance, 0.0);
        rightDistance = max(rightDistance, 0.0);
        target = max(u_brightness.x * leftDistance, 0.0);
        target = max(u_brightness.y * rightDistance, target);

        texelColor.rgb = min(texelColor.rgb + target, 1.0);
        gl_FragColor = texelColor;
    }
`

export class MovableBackground implements Drawable {

    private x: number = 0;
    private y: number = 0;
    private width: number = 0;
    private height: number = 0;

    private readonly vertexArray: VertexArray
    private readonly shader: Shader
    private readonly buffer: VertexBuffer
    private readonly layout: VertexBufferLayout
    private readonly texture: Texture

    private viewport: Viewport = defaultViewport

    constructor(
        private gl: WebGL2RenderingContext,
        private config: MovableBackgroundConfig
    ) {
        const vertexArray = new VertexArray(gl);
        vertexArray.bind()
        const buffer = new VertexBuffer(gl)
        const layout = new VertexBufferLayout(gl)
        const shader = new Shader(gl, vertexShader, fragmentShader)
        const texture = new Texture(gl, backgroundImage)

        buffer.bind()
        shader.bind()

        shader.setUniform1i('u_sampler', 1)
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

    private transformMatrix4 = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ])

    public setTransform(transX: number, transY: number) {
        const max = Math.max
        const min = Math.min
        const matrix = this.transformMatrix4;
        const viewport = this.viewport;
        const { imageWidth, imageHeight } = this.texture
        const scale = 1.01

        matrix[0] = scale
        matrix[5] = scale
        // matrix[3] = viewport.convertX(transX)
        // matrix[7] = viewport.convertY(transY)

        const scaledWidth = imageWidth * scale
        const scaledHeight = imageHeight * scale

        const shortOnImage = min(scaledHeight, scaledWidth)
        const shortOnViewport = min(viewport.width, viewport.height)
        const factor = shortOnViewport / shortOnImage

        const widthDiffer = scaledWidth - imageWidth
        const heightDiffer = scaledHeight - imageHeight
        const x = (factor * widthDiffer / viewport.width) * transX
        const y = (factor * heightDiffer / viewport.height) * transY

        matrix[3] = viewport.convertX(x)
        matrix[7] = viewport.convertY(y)

        this.shader.bind()
        this.shader.setUniformMatrix4fv('u_transform', matrix)
        this.shader.unbind()
    }

    private brightnessValues = new Float32Array([0.0, 0.0])

    /**
     *
     * @param {number} left range -> [0, 1]
     * @param right
     */
    public setBrightness(left: number, right: number) {
        const shader = this.shader
        this.brightnessValues[0] = left
        this.brightnessValues[1] = right
        shader.bind()
        shader.setUniform2fv('u_brightness', this.brightnessValues)
        shader.unbind()
    }

    public createVertexArray() {
        const viewport = this.viewport
        return new Float32Array([
            viewport.convertX(this.x),              viewport.convertY(this.y),               0.0, 0.0,
            viewport.convertX(this.x + this.width), viewport.convertY(this.y),               1.0, 0.0,
            viewport.convertX(this.x),              viewport.convertY(this.y - this.height), 0.0, 1.0,
            viewport.convertX(this.x + this.width), viewport.convertY(this.y),               1.0, 0.0,
            viewport.convertX(this.x),              viewport.convertY(this.y - this.height), 0.0, 1.0,
            viewport.convertX(this.x + this.width), viewport.convertY(this.y - this.height), 1.0, 1.0
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
        console.log('MovableBackground', `x=${this.x}, y=${this.y}, width=${this.width}, height=${this.height}`)
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
        this.texture.bind(1)
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