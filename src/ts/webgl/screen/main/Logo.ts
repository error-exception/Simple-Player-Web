import {ImageLoader} from "../../../ImageResources";
import Coordinate from "../../base/Coordinate";
import {BaseDrawableConfig, Drawable} from "../../drawable/Drawable";
import {Shape2D} from "../../util/Shape2D";
import {Shader} from "../../core/Shader";
import {Texture} from "../../core/Texture";
import {Vector2} from "../../core/Vector2";
import {VertexArray} from "../../core/VertexArray";
import {VertexBuffer} from "../../core/VertexBuffer";
import {VertexBufferLayout} from "../../core/VertexBufferLayout";

const vertexShader = `
    attribute vec4 a_position;
    attribute vec2 a_tex_coord;
    varying mediump vec2 v_tex_coord;
    varying mediump float v_texture_alpha;
    uniform mat4 u_orth;
    uniform mat4 u_transform;
    
    void main() {
        vec4 position = a_position * u_transform;
        gl_Position = position * u_orth;
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
        config: BaseDrawableConfig
    ) {
        super(gl, config)
        console.log(this.anchor.toString(2));
        
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

    public createVertexArray() {
        const width = this.width
        const height = this.height
        // this.position.y -= height * 0.007
        const { x, y } = this.position
        // let x = -width / 2, y = height / 2
        console.log("create vertex", x, y)
        
        const topLeft = new Vector2(x, y)
        const bottomRight = new Vector2(x + width, y - height)
        // TransformUtils.applyOrigin(topLeft, Coordinate.orthographicProjection)
        // TransformUtils.applyOrigin(bottomRight, Coordinate.orthographicProjection)
        const vertexData: number[] = []
        Shape2D.quadVector2(
            topLeft, bottomRight,
            vertexData, 0, 4
        )
        Shape2D.quad(
            0, 0, 1, 1,
            vertexData, 2, 4
        )
        console.log(vertexData);
        
        return new Float32Array(vertexData)
    }

    public onLoad(): void {
        // console.log(this.position.x, this.position.y)
        // console.log(this.width, this.height)
        this.buffer.bind()
        this.buffer.setBufferData(this.createVertexArray())
        this.buffer.unbind()
    }

    public onWindowResize(): void {
        super.onWindowResize()
        console.log("resize")
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
        this.shader.setUniformMatrix4fv('u_orth', Coordinate.orthographicProjectionMatrix4)
        this.shader.setUniformMatrix4fv('u_transform', this.matrixArray)
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