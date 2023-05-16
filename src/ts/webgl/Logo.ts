import {BaseDrawableConfig, Drawable} from "./Drawable";
import {Viewport} from "./Viewport";
import {Texture} from "./core/Texture";
import {Shader} from "./core/Shader";
import {VertexBuffer} from "./core/VertexBuffer";
import {VertexBufferLayout} from "./core/VertexBufferLayout";
import {VertexArray} from "./core/VertexArray";
import {TransformUtils} from "./core/TransformUtils";
import {Vector2} from "./core/Vector2";
import {ImageLoader} from "../ImageResources";

interface BeatLogoConfig extends BaseDrawableConfig {}

const vertexShader = `
    attribute vec4 a_position;
    attribute vec2 a_tex_coord;
    varying mediump vec2 v_tex_coord;
    varying mediump float v_texture_alpha;
    uniform mat4 u_transform;
    
    void main() {
        gl_Position = a_position * u_transform;
        v_tex_coord = a_tex_coord;
    }
`

const fragmentShader = `
    varying mediump vec2 v_tex_coord;
    uniform sampler2D u_sampler;
    
    void main() {
        mediump vec4 texelColor = texture2D(u_sampler, v_tex_coord);
        // texelColor.rgb = min(texelColor.rgb + (v_highlight * 0.05), 1.0);
        // texelColor.a = texelColor.a * v_texture_alpha;
        gl_FragColor = texelColor;
    }
`

export class Logo extends Drawable {

    private readonly shader: Shader
    private readonly buffer: VertexBuffer
    private readonly texture: Texture
    private readonly layout: VertexBufferLayout
    private readonly vertexArray: VertexArray
    private readonly textureUnit = 0

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

    protected onTransformApplied() {
        super.onTransformApplied();
        this.shader.bind()
        this.shader.setUniformMatrix4fv('u_transform', this.matrixArray)
        this.shader.unbind()
    }

    public createVertexArray() {
        const width = this.rawSize.x
        const height= this.rawSize.y
        this.position.y -= height * 0.007
        const { x, y } = this.rawPosition

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
        this.texture.dispose()
        this.vertexArray.dispose()
        this.shader.dispose()
        this.buffer.dispose()
    }

}