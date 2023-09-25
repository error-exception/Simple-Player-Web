import {BeatBox} from "../BeatBox";
import {ImageDrawable} from "../ImageDrawable";
import {ImageLoader} from "../../ImageResources";
import {easeOut, easeOutElastic, easeOutQuint} from "../../util/Easing";
import {Vector2} from "../core/Vector2";
import Coordinate from "../Coordinate";
import {Drawable} from "../Drawable";
import {VertexArray} from "../core/VertexArray";
import {VertexBuffer} from "../core/VertexBuffer";
import {Shader} from "../core/Shader";
import {VertexBufferLayout} from "../core/VertexBufferLayout";
import {Shape2D} from "../Shape2D";
import {int} from "../../Utils";
import {Color} from "../Color";
import {TransformUtils} from "../core/TransformUtils";
import {Box} from "../Box";

export class BackButton extends BeatBox {

    private readonly buttonIcon: ImageDrawable

    constructor(gl: WebGL2RenderingContext) {
        super(gl, {
            size: ['fill-parent', 'fill-parent']
        });
        this.buttonIcon = new ImageDrawable(gl, , ImageLoader.get('backIcon'), undefined, {
            size: [36, 36]
        })
        this.buttonIcon.translate = new Vector2(
            -Coordinate.width / 2 + 32,
            -Coordinate.height / 2 + 64
        )
        // const backgroundBox = new Box(gl, {
        //     width: 100, height: 50, vertical: "center", horizontal: "center"
        // })
        //
        // backgroundBox.add(new ButtonBackground(gl))
        // backgroundBox.translate = new Vector2(
        //     -Coordinate.width / 2 + 500, 0
        // )
        const box = new (class extends Box {
            constructor(gl: WebGL2RenderingContext) {
                super(gl, {
                    width: 100, height: 50, vertical: "center", horizontal: "center"
                });
                this.add(
                    new ButtonBackground(gl)
                )

                this.translate = new Vector2(
                    -448,
                    -204
                    // -Coordinate.height / 2 + 50 * window.devicePixelRatio
                )
            }

            // onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number) {
            //     this.translateBegin()
            //         .translateTo(new Vector2(20, 0), 60, easeOut)
            //         .translateTo(new Vector2(0, 0), gap * 2, easeOutQuint)
            // }


        })(gl, )
        this.add(
            box,
            this.buttonIcon
        )
    }

    public onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number): void {
        this.buttonIcon.scaleBegin()
            .scaleTo(0.9, 60, easeOut)
            .scaleTo(1, gap * 2, easeOutQuint)

    }

}

const vertexShader = `
    attribute vec2 a_position;
    attribute vec4 a_color;
//    attribute vec2 a_tex_coord;
    
//    varying mediump vec2 v_tex_coord;
    varying mediump vec4 v_color;
    
   uniform mat4 u_transform;
    
    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0) * u_transform;
//        v_tex_coord = a_tex_coord;
        v_color = a_color;
    }
`

const fragmentShader = `
//    varying mediump vec2 v_tex_coord;
//    uniform sampler2D u_sampler;
    varying mediump vec4 v_color;
    void main() {
//        mediump vec4 texelColor = texture2D(u_sampler, v_tex_coord);
//        gl_FragColor = texelColor;
//         gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        gl_FragColor = v_color;
    }
`

export class ButtonBackground extends Drawable {

    private readonly vertexArray: VertexArray
    private readonly vertexBuffer: VertexBuffer
    private readonly shader: Shader
    private readonly layout: VertexBufferLayout


    constructor(gl: WebGL2RenderingContext) {
        super(gl, {
            width: 100, height: 50, vertical: "center", horizontal: "center"
        });
        const vertexArray = new VertexArray(gl)
        vertexArray.bind()
        const vertexBuffer = new VertexBuffer(gl, null, gl.STREAM_DRAW)
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

        this.vertexBuffer = vertexBuffer
        this.layout = layout
        this.shader = shader
        this.vertexArray = vertexArray
    }

    private vertexData = new Float32Array()
    private vertexArrayData: number[] = []
    private vertexCount = 0

    public bind() {
        this.vertexArray.bind()
        this.vertexBuffer.bind()
        this.shader.bind()
    }

    protected onUpdate() {
        super.onUpdate()
        this.vertexArrayData = []

        let offset = 0
        this.topBar(offset)

        this.vertexData = new Float32Array(this.vertexArrayData)
        this.vertexCount = int(this.vertexArrayData.length / 6)
    }

    private color = Color.fromHex(0xff7db7)

    private topBar(offset: number) {
        const {x, y} = this.position
        const topLeft = new Vector2(
            x, y
        )
        const bottomLeft = new Vector2(
            x + this.size.x,
            y - this.size.y
        )
        TransformUtils.applyOrigin(topLeft, this.coordinateScale)
        TransformUtils.applyOrigin(bottomLeft, this.coordinateScale)
        Shape2D.quad(
            topLeft.x, topLeft.y,
            bottomLeft.x, bottomLeft.y,
            this.vertexArrayData,
            offset,
            6
        )
        Shape2D.color(
            this.color.red, this.color.green, this.color.blue, this.color.alpha,
            this.color.red, this.color.green, this.color.blue, this.color.alpha,
            this.color.red, this.color.green, this.color.blue, this.color.alpha,
            this.color.red, this.color.green, this.color.blue, this.color.alpha,
            this.vertexArrayData,
            offset + 2,
            6
        )
        return offset + 36
    }

    public onHover(): boolean {
        // alert("fa")
        this.translateBegin()
            .translateTo(new Vector2(20, 0), 500, easeOutElastic)
        return true
    }

    public onHoverLost(): boolean {
        this.translateBegin()
            .translateTo(new Vector2(0, 0), 500, easeOutElastic)
        return true
    }

    public unbind() {
        this.shader.unbind()
        this.vertexBuffer.unbind()
        this.vertexArray.unbind()
    }

    public onDraw() {
        const gl = this.gl
        this.shader.setUniformMatrix4fv('u_transform', this.matrixArray)
        this.vertexBuffer.setBufferData(this.vertexData)
        this.vertexArray.addBuffer(this.vertexBuffer, this.layout)
        gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount)
    }

    public dispose() {
        super.dispose();
        this.shader.dispose()
        this.vertexArray.dispose()
        this.vertexBuffer.dispose()

    }

}