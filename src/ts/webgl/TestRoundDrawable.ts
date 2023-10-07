import {Toaster} from '../global/Toaster';
import Coordinate from './base/Coordinate';
import {Drawable} from './drawable/Drawable';
import ShaderManager from './util/ShaderManager';
import {Shader} from './core/Shader';
import {VertexArray} from './core/VertexArray';
import {VertexBuffer} from './core/VertexBuffer';
import {VertexBufferLayout} from './core/VertexBufferLayout';

export class TestRoundDrawable extends Drawable {

    private readonly shader: Shader
    private readonly buffer: VertexBuffer    
    private readonly layout: VertexBufferLayout
    private readonly vertexArray: VertexArray
    private needUpdateVertex = true

    constructor(
        gl: WebGL2RenderingContext
    ) {
        super(gl, {
            size: ['fill-parent', 'fill-parent']
        })
        const vertexArray = new VertexArray(gl)
        vertexArray.bind()
        const buffer = new VertexBuffer(gl)
        const shader = ShaderManager.newColoredShader()//new Shader(gl, vertexShader, fragmentShader)
        const layout = new VertexBufferLayout(gl)

        buffer.bind()
        shader.bind()

        layout.pushFloat(shader.getAttributeLocation('a_position'), 2)
        layout.pushFloat(shader.getAttributeLocation('a_color'), 4)
        vertexArray.addBuffer(buffer, layout)

        vertexArray.unbind()
        buffer.unbind()
        shader.unbind()

        this.vertexArray = vertexArray
        this.buffer = buffer;
        this.layout = layout
        this.shader = shader

    }

    private vertexCount = 0

    public createVertexArray() {
        const vertexData: number[] = []

   
        this.vertexCount = vertexData.length / 6
        Toaster.show(this.vertexCount + "")
        return new Float32Array(vertexData)
    }

    public onWindowResize(): void {
        super.onWindowResize()
        this.needUpdateVertex = true
    }

    public unbind() {
        this.vertexArray.unbind()
        this.buffer.unbind()
        this.shader.unbind()
    }

    public bind() {
        this.vertexArray.bind()
        this.buffer.bind()
        this.shader.bind()
    }

    public onDraw() {
        const gl = this.gl
        if (this.needUpdateVertex) {
            this.needUpdateVertex = false
            this.buffer.setBufferData(this.createVertexArray())
        }
        this.shader.setUniformMatrix4fv('u_transform', this.matrixArray)
        this.shader.setUniformMatrix4fv('u_orth', Coordinate.orthographicProjectionMatrix4)
        this.vertexArray.addBuffer(this.buffer, this.layout)
        gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount)
    }

    public dispose() {
        this.vertexArray.dispose()
        this.shader.dispose()
        this.buffer.dispose()
    }


}