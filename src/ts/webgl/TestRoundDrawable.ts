import {Toaster} from '../Toaster';
import {degreeToRadian} from '../Utils';
import {Color} from './Color';
import Coordinate from './Coordinate';
import {Drawable} from './Drawable';
import ShaderManager from './ShaderManager';
import { Shape2D } from './Shape2D';
import {Shader} from './core/Shader';
import {TransformUtils} from './core/TransformUtils';
import {Vector2} from './core/Vector2';
import {VertexArray} from './core/VertexArray';
import {VertexBuffer} from './core/VertexBuffer';
import {VertexBufferLayout} from './core/VertexBufferLayout';
import { brightness } from './std/StdNote';

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
        const color = Color.fromHex(0xff2000, 0xff)
        const vertexData: number[] = []
        let offset = 0
        const count = 50
        offset += Shape2D.ring(
            200, 10, color, count,
            vertexData, offset, 6
        )
        offset += Shape2D.ring(
            70, 5, Color.fromHex(0xffffff), count,
            vertexData, offset, 6)
        offset += Shape2D.ring(
            50, 15, color, count,
            vertexData, offset, 6
        )
        brightness(color, -.3)
        offset += Shape2D.ring(
            35, 15, color, count,
            vertexData, offset, 6
        )
        brightness(color, -.3)
        offset += Shape2D.ring(
            0, 35, color, count,
            vertexData, offset, 6
        )

        // const count = 60
        // const innerRadius = 20
        // const width = 2
        // const inner = new Vector2(0, innerRadius)
        // const outer = new Vector2(0, innerRadius + width)
        // const rotate = 360 / count
        // for (let i = 0; i < count; i++) {
        //     const v1 = TransformUtils.applyRotate(
        //         inner, degreeToRadian(rotate * i)
        //     )
        //     const v2 = TransformUtils.applyRotate(
        //         outer, degreeToRadian(rotate * i)
        //     )
        //     const v3 = TransformUtils.applyRotate(
        //         inner, degreeToRadian(rotate * (i + 1))
        //     )
        //     const v4 = TransformUtils.applyRotate(
        //         outer, degreeToRadian(rotate * (i + 1))
        //     )
        //     vertexData.push(
        //         v1.x, v1.y, r, g, b, a,
        //         v2.x, v2.y, r, g, b, a,
        //         v4.x, v4.y, r, g, b, a,
        //         v4.x, v4.y, r, g, b, a,
        //         v1.x, v1.y, r, g, b, a,
        //         v3.x, v3.y, r, g, b, a

        //     )
        // }
   
        this.vertexCount = vertexData.length / 6
        Toaster.show(this.vertexCount + "")
        return new Float32Array(vertexData)
    }
    /**
     * triangle
     */
    private ring2() {

    }

    /**
     * triangle_strip
     */
    private ring() {
        const color = Color.fromHex(0xffffff, 0xff)
        const r = color.red
        const g = color.green
        const b = color.blue
        const a = color.alpha
        const vertexData: number[] = []

        const count = 60
        const degree = 360 / count
        const inner = new Vector2(0, 100)
        const outer = new Vector2(0, 100 + 20)
        for (let i = 0; i <= count; i++) {
            const v1 = TransformUtils.applyRotate(outer, degreeToRadian(degree * i))
            const v2 = TransformUtils.applyRotate(inner, degreeToRadian(degree * i))
            vertexData.push(
                v1.x, v1.y, r, g, b, a,
                v2.x, v2.y, r, g, b, a,
            )
        }
        this.vertexCount = vertexData.length / 6
        return new Float32Array(vertexData)
    }

    /**
     * triangle_strip
     */
    private circle2() {

    }

    private circle() {
        const color = Color.fromHex(0xffffff)
        const r = color.red
        const g = color.green
        const b = color.blue
        const a = color.alpha
        const vertexData: number[] = []

        const radius = 200
        // const length = 2 * radius * Math.PI
        // const unit = 20
        const count = 40
        Toaster.show(count + "")
        const rotate = 360 / count
        vertexData.push(
            0, 0, r, g, b, a,
            0, radius, r, g, b, a
        )
        const v = new Vector2(0, radius)
        for (let i = 0; i < count; i++) {
            const t = TransformUtils.applyRotate(v, degreeToRadian(rotate * (i + 1)))
            vertexData.push(t.x, t.y, r, g, b, a)
        }
        this.vertexCount = vertexData.length / 6
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