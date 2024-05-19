import {Vector2} from "../core/Vector2";
import {Shader} from "../core/Shader";
import {Texture} from "../core/Texture";

let webgl: WebGL2RenderingContext | null = null
let gl = webgl!
export enum DrawType {
  Quad, Circle, Ring, Triangle
}
export const AttribLayouts: Record<string, AttribLayout[]> = {
  Colored: [
    {
      position: 0,
      count: 2,
      type: gl.FLOAT,
      normalized: false,
      stride: 6 * 4,
      offset: 0
    }, {
      position: 1,
      count: 4,
      type: gl.FLOAT,
      normalized: false,
      stride: 6 * 4,
      offset: 2 * 4
    }
  ],
  StaticTexture: [
    {
      position: 0,
      count: 2,
      type: gl.FLOAT,
      normalized: false,
      stride: 4 * 4,
      offset: 0
    }, {
      position: 1,
      count: 2,
      type: gl.FLOAT,
      normalized: false,
      stride: 4 * 4,
      offset: 2 * 4
    }
  ],
  DynamicTexture: [
    {
      position: 0,
      count: 2,
      type: gl.FLOAT,
      normalized: false,
      stride: 5 * 4,
      offset: 0
    }, {
      position: 1,
      count: 2,
      type: gl.FLOAT,
      normalized: false,
      stride: 5 * 4,
      offset: 2 * 4
    }, {
      position: 2,
      count: 1,
      type: gl.FLOAT,
      normalized: false,
      stride: 5 * 4,
      offset: 4 * 4
    }
  ],
  ColoredTexture: [
    {
      position: 0,
      count: 2,
      type: gl.FLOAT,
      normalized: false,
      stride: 4 * 4,
      offset: 0
    }, {
      position: 1,
      count: 2,
      type: gl.FLOAT,
      normalized: false,
      stride: 4 * 4,
      offset: 2 * 4
    }
  ]
}
interface AttribLayout {
  position: number // position in shader
  count: number // byte count
  type: number // data type
  normalized: boolean // false
  stride: number // attribs byte count
  offset: number // attrib byte offset
}
interface DrawNode {
  attribs: AttribLayout[],
  offset: number
  vertexCount: number
}

export function SetupGL(webgl: WebGL2RenderingContext) {
  gl = webgl
}
// @ts-ignore
const bufferData: number[] = []
// @ts-ignore
let currentIndex = 0, currentOffset = 0, currentVertexCount = 0

/**
 * 提交 BufferData，
 */
export function EndBatch() {}

// @ts-ignore
let currentDrawType: DrawType = DrawType.Quad
/**
 * 加入 BufferData 数组
 */
export function Quad(topLeft: Vector2, bottomRight: Vector2) {
  currentDrawType = DrawType.Quad
}
export function Circle(center: Vector2, radius: number) {
  currentDrawType = DrawType.Circle
}
export function Ring(center: Vector2, innerRadius: Vector2, thickWidth: number) {
  currentDrawType = DrawType.Ring
}
export function Triangle(v1: Vector2, v2: Vector2, v3: Vector2) {
  currentDrawType = DrawType.Triangle
}
let drawNodes: DrawNode[] = []
/**
 * 调用 GL 的 draw call, 消费 draw call task
 */
export function Draw() {
  for (let i = 0; i < drawNodes.length; i++) {
    const node = drawNodes[i]
    const attribs = node.attribs
    for (let j = 0; j < attribs.length; j++) {
      const attrib = attribs[j]
      gl.enableVertexAttribArray(attrib.position)
      gl.vertexAttribPointer(
        attrib.position,
        attrib.count,
        attrib.type,
        attrib.normalized,
        attrib.stride,
        attrib.offset
      )
    }
    gl.drawArrays(gl.TRIANGLES, node.offset, node.vertexCount)
    for (let j = 0; j < attribs.length; j++) {
      gl.disableVertexAttribArray(attribs[j].position)
    }
  }
  drawNodes.length = 0
}

/**
 * 添加一个 draw call task，根据 DrawType 设置 AttribPointer
 */
export function DrawNode(type: AttribLayout[]) {
  drawNodes.push({
    attribs: type,
    offset: 0, // TODO:,
    vertexCount: 0 // TODO:
  })
}
export let currentShader: Shader | null = null, currentTexture: Texture | null = null
export function BindTexture() {}
export function BindShader() {}
/**
 * Unbind Texture and Shader
 */
export function UnbindAll() {
  currentShader && currentShader.unbind()
  currentTexture && currentTexture.unbind()
}

/**
 * 1. shader bufferLayout vertexArray 合并
 * 2. 绘制时，检查 shader, texture, indexBuffer 是否改变，若未改变，添加到buffer，不绘制，
 * 当有一个发生改变，立即绘制之前的数据，并将当前的信息记录，加入buffer，等待下次改变时进行绘制
 * 3. 一轮渲染结束，将未渲染的部分进行渲染
 */