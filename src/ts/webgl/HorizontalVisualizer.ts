/* will be deleted */
export {}
// import {Disposable} from "./core/Disposable";
// import {Drawable} from "./Drawable";
// import {convertX, convertY, defaultViewport, Viewport} from "./Viewport";
// import {VertexBuffer} from "./core/VertexBuffer";
// import {Shader} from "./core/Shader";
// import {VertexArray} from "./core/VertexArray";
// import {VertexBufferLayout} from "./core/VertexBufferLayout";
//
// interface VisualizeConfig {
//     x: number
//     y: number
//     width: number
//     height: number
// }
//
// const vertexShader = `
//     attribute vec2 aVertexPosition;
//
//     void main() {
//         gl_Position = vec4(aVertexPosition, 0.0, 1.0);
//     }
// `
//
// const fragmentShader = `
//     #ifdef GL_ES
//     precision highp float;
//     #endif
//
//     uniform vec4 u_color;
//
//     void main() {
//         gl_FragColor = u_color;
//     }
// `
//
// export class HorizontalVisualizer implements Disposable, Drawable {
//
//     private readonly buffer: VertexBuffer
//     private readonly layout: VertexBufferLayout
//     private readonly shader: Shader
//     private readonly vertexArray: VertexArray
//     private config: VisualizeConfig
//     private vertexCount: number = 0
//     private viewport: Viewport = defaultViewport
//
//     constructor(private gl: WebGL2RenderingContext, config: VisualizeConfig) {
//         this.config = config
//         this.vertexArray = new VertexArray(gl)
//         this.vertexArray.bind()
//
//         this.buffer = new VertexBuffer(gl, null, gl.DYNAMIC_DRAW)
//         this.shader = new Shader(gl, vertexShader, fragmentShader)
//         this.layout = new VertexBufferLayout(gl)
//         this.buffer.bind()
//         this.shader.bind()
//
//         this.layout.pushFloat(this.shader.getAttributeLocation('aVertexPosition'), 2)
//         this.vertexArray.addBuffer(this.buffer, this.layout)
//
//         this.vertexArray.unbind()
//         this.buffer.unbind()
//         this.shader.unbind()
//     }
//
//     public writeData(data: number[], length: number = data.length) {
//         const sliceWidth: number = this.config.width / length - 1
//         const viewport: Viewport = this.viewport
//         let x: number = this.config.x
//         const vertexArray = new Float32Array(length * 12)
//         for (let i = 0, j = 0; i < data.length; i++, j += 12) {
//             const y = data[i] * this.config.height + this.config.y
//
//             vertexArray[j]      = convertX(viewport, x)
//             vertexArray[j + 1]  = convertY(viewport, this.config.y)
//
//             vertexArray[j + 2]  = convertX(viewport, x + sliceWidth)
//             vertexArray[j + 3]  = convertY(viewport, this.config.y)
//
//             vertexArray[j + 4]  = convertX(viewport, x)
//             vertexArray[j + 5]  = convertY(viewport, y)
//
//             vertexArray[j + 6]  = convertX(viewport, x + sliceWidth)
//             vertexArray[j + 7]  = convertY(viewport, this.config.y)
//
//             vertexArray[j + 8]  = convertX(viewport, x + sliceWidth)
//             vertexArray[j + 9]  = convertY(viewport, y)
//
//             vertexArray[j + 10] = convertX(viewport, x)
//             vertexArray[j + 11] = convertY(viewport, y)
//             x += (sliceWidth + 1)
//         }
//         this.vertexCount = length * 6
//
//         this.buffer.bind()
//         this.buffer.setBufferData(vertexArray)
//         this.buffer.unbind()
//     }
//
//     public setViewport(viewport: Viewport) {
//         this.viewport = viewport
//     }
//
//     public bind() {
//         this.shader.bind()
//         this.vertexArray.unbind()
//     }
//
//     public unbind() {
//         this.shader.unbind()
//         this.vertexArray.unbind()
//     }
//
//     public draw() {
//         const gl = this.gl
//         this.shader.setUniform4fv('u_color', [1.0, 1.0, 1.0, 0.5])
//         this.vertexArray.addBuffer(this.buffer, this.layout)
//         gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount)
//
//     }
//
//     public dispose() {
//         this.buffer.dispose()
//         this.shader.dispose()
//         this.vertexArray.dispose()
//     }
//
// }