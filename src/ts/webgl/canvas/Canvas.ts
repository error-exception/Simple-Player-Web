import { Nullable } from "../../type";
import { ArrayUtils } from "../../util/ArrayUtils";
import { nullable } from "../../Utils";
import { color, type Color4 } from "../base/Color";
import { Blend } from "../drawable/Blend";
import { BasicVertexBuffer } from "../graphic/buffer/BasicVertexBuffer";
import { Buffers } from "../graphic/buffer/Buffers";
import { Texture } from "../graphic/core/Texture";
import { matrix3 } from '../graphic/matrix/mat3';
import { vector2 } from "../graphic/matrix/vec2";
import { Shaders } from "../graphic/shader/Shaders";
import { ShaderWrapper } from "../graphic/shader/ShaderWrapper";
import { quad, type Quad4 } from "../graphic/shape/Quad";
import { type Triangle3 } from "../graphic/shape/Triangle";
import { TextureRegin } from "../graphic/texture/TextureAtlas";
import { TextureStore } from "../graphic/texture/TextureStore";
import { WebGLRenderer } from "../WebGLRenderer";

/**
 * Represents the drawing state of a Canvas, including transformation matrices,
 * colors, blending modes, and other rendering properties.
 */
export class DrawState {

  public fillColor: Color4 = color.White
  public previousAlpha: number = 1
  public globalAlpha: number = 1
  public blend: Blend = Blend.Normal
  /**
   * translate -> rotate -> scale
   */
  // public localMatrix: mat3 = matrix3.create()
  // public scaleMatrix: mat3 = matrix3.create()
  // public translateMatrix: mat3 = matrix3.create()
  // public rotateMatrix: mat3 = matrix3.create()
  // public parentWorldMatrix: mat3 = matrix3.create()
  // public pivot: vec2 = vector2.create()  
  public worldMatrix: mat3 = matrix3.create()
  // public invertMatrix: mat3 = matrix3.identity(matrix3.create())
  // public basePosition = vector2.create()
  // don't copy
  public shader: ShaderWrapper = Shaders.Default
  // don't copy
  public vertexBuffer: BasicVertexBuffer = Buffers.SingleQuad

  public copy() {
    const state = new DrawState()
    state.fillColor = this.fillColor
    state.previousAlpha = this.globalAlpha
    state.globalAlpha = this.globalAlpha
    state.blend = this.blend

    // matrix3.identity(state.scaleMatrix)
    // matrix3.identity(state.rotateMatrix)
    // matrix3.identity(state.translateMatrix)
    // matrix3.copy(state.worldMatrix, this.worldMatrix)

    // vector2.copy(state.pivot, this.pivot)
    // matrix3.copy(state.parentWorldMatrix, this.worldMatrix)
    // matrix3.identity(state.localMatrix)
    return state
  }

  public reset() {
    this.fillColor = color.White
    this.globalAlpha = 1
    this.previousAlpha = 1
    this.blend = Blend.Normal

    // matrix3.identity(this.scaleMatrix)
    // matrix3.identity(this.translateMatrix)
    // matrix3.identity(this.rotateMatrix)
    matrix3.identity(this.worldMatrix)
    // matrix3.identity(this.localMatrix)
    // vector2.set(this.pivot, 0, 0)
  }

}

/**
 * A WebGL-based canvas for 2D rendering with transformation support.
 * Provides methods for drawing shapes, textures, and managing rendering state.
 */
export class Canvas {

  private currentState: DrawState = new DrawState()

  private stateStack: DrawState[] = []

  private texture: Nullable<Texture> = null

  constructor(public renderer: WebGLRenderer) {}

  public useShader(shader: ShaderWrapper) {
    this.currentState.shader = shader
  }

  public useVertexBuffer(buffer: BasicVertexBuffer) {
    this.currentState.vertexBuffer = buffer
  }

  // TODO: Add cache for canvas's state
  public save() {
    // this.transform()
    const newState = this.currentState.copy()
    this.stateStack.push(newState)
    // this.currentState = newState
    // this.shouldComputeTransform = true
  }

  public restore() {
    if (this.stateStack.length === 0) {
      console.warn("Canvas.restore(): No saved state to restore")
      return
    }
    this.currentState = this.stateStack.pop()!
    // this.shouldComputeTransform = true
    this.extra = null
  }

  public reset() {
    this.currentState.reset()
    this.stateStack.length = 0
    this.texture = null
    this.extra = null
    // this.shouldComputeTransform = true
    this.isBatching = false
    this.batchData = []
  }

  public setGlobalAlpha(a: number) {
    this.currentState.globalAlpha *= a
  }

  public setColor(color: Color4) {
    this.currentState.fillColor = color
  }

  public setBlend(blend: Blend) {
    this.currentState.blend = blend
  }

  private extra = nullable<Record<string, any>>()

  public setExtra(extra: Record<string, any>) {
    this.extra = extra
  }

  public setMatrix3(matrix: mat3) {
    matrix3.copy(this.currentState.worldMatrix, matrix)
  }

  // TODO: remove this method, use translate to implement
  public base(x: number, y: number) {
  }

  // private temp: vec2 = vector2.create()

  // public translate(x: number, y: number) {
  //   const state = this.currentState
  //   vector2.set(this.temp, x, y)
  //   matrix3.translate(state.translateMatrix, state.translateMatrix, this.temp)
  //   this.shouldComputeTransform = true
  // }

  // public scale(x: number, y: number) {
  //   if (almostEquals(x, 0)) {
  //     x = 1e-5 // avoid divide by zero when compute invert matrix
  //   }
  //   if (almostEquals(y, 0)) {
  //     y = 1e-5 // avoid divide by zero when compute invert matrix
  //   }

  //   vector2.set(this.temp, x, y)
  //   matrix3.scale(this.currentState.scaleMatrix, this.currentState.scaleMatrix, this.temp)
  //   this.shouldComputeTransform = true
  // }

  // public rotate(degree: number) {
  //   matrix3.rotate(this.currentState.rotateMatrix, this.currentState.rotateMatrix, degreeToRadian(degree))
  //   this.shouldComputeTransform = true
  // }

  public pivot(x: number, y: number) {
    // vector2.set(this.currentState.pivot, x, y)
  }

  // private shouldComputeTransform = false

  // private transform() {
  //   if (!this.shouldComputeTransform) {
  //     return
  //   }
  //   this.shouldComputeTransform = false

  //   const { translateMatrix, scaleMatrix, rotateMatrix, worldMatrix, localMatrix, parentWorldMatrix } = this.currentState

  //   matrix3.multiply(localMatrix, translateMatrix, rotateMatrix)
  //   matrix3.multiply(localMatrix, localMatrix, scaleMatrix)
    
  //   matrix3.multiply(worldMatrix, parentWorldMatrix, localMatrix)
  // }
  
  // private isInvertMatrixComputed = false

  // public worldToLocal(x: number, y: number): vec2 {
  //   this.isInvertMatrixComputed = this.shouldComputeTransform
  //   const invertMatrix = this.currentState.invertMatrix
  //   // If transform is changed or not computed, compute invert matrix
  //   if (this.isInvertMatrixComputed) {
  //     // this.transform()
  //     matrix3.invert(invertMatrix, this.currentState.worldMatrix)
  //   }

  //   // discard consider invert matrix is null, because scale transform is not zero
  //   return vector2.transformMat3(vector2.create(), vector2.fromValues(x, y), invertMatrix)
  // }

  // public localToWorld(x: number, y: number): vec2 {
  //   // this.transform()
  //   const { worldMatrix: matrix, pivot } = this.currentState
  //   return transformVector(matrix, vector2.fromValues(x, y), pivot)
  // }

  public drawTriangle(triangle: Triangle3) {
    const state = this.currentState,
      { worldMatrix, /* pivot, */ shader } = this.currentState,
      { angle1, angle2, angle3 } = triangle

    // this.transform()

    const a = transformVector(worldMatrix, angle1/* , pivot */),
      b = transformVector(worldMatrix, angle2/* , pivot */),
      c = transformVector(worldMatrix, angle3/* , pivot */)

    shader.addAction.extra = this.extra
    if (this.isBatching) {
      shader.addAction.addVertex(state, this.batchData, a, b, c)
    } else {
      const data: number[] = []
      shader.addAction.addVertex(state, data, a, b, c)
      this.draw(data)
    }
  }

  public drawQuad(quad: Quad4, texture: Texture = TextureStore.getTexture('Square')) {

    const state = this.currentState,
      { worldMatrix, /* pivot, */ shader } = this.currentState,
      { topLeft, topRight, bottomLeft, bottomRight } = quad

    // this.transform()

    const a = transformVector(worldMatrix, topLeft/* , pivot */),
      b = transformVector(worldMatrix, topRight/* , pivot */),
      c = transformVector(worldMatrix, bottomLeft/* , pivot */),
      d = transformVector(worldMatrix, bottomRight/* , pivot */)

    this.texture = texture
    shader.addAction.extra = this.extra
    if (this.isBatching) {
      shader.addAction.addVertex(state, this.batchData, a, b, c, d)
    } else {
      const data: number[] = []
      shader.addAction.addVertex(state, data, a, b, c, d)
      this.draw(data)
    }

  }

  public drawTextureAtlas(textureRegin: TextureRegin, x: number, y: number, width: number, height: number) {
    const { texTopLeft, texBottomRight } = textureRegin
    this.drawTexturePart(
      textureRegin.texture,
      x, y, width, height,
      texTopLeft[0], texTopLeft[1], texBottomRight[0] - texTopLeft[0], texBottomRight[1] - texTopLeft[1]
    )
  }

  public drawRect(x: number, y: number, width: number, height: number) {
    this.drawTexture(TextureStore.getTexture("Square"), x, y, width, height)
  }

  public drawRoundRect(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) {
    const texture = TextureStore.getTexture("WhiteRound")
    // top left
    this.drawTexturePart(
      texture,
      x, y,
      radius, radius,
      0, 0, 0.5, 0.5
    )
    // top right
    this.drawTexturePart(
      texture,
      x + width - radius, y,
      radius, radius,
      0.5, 0, 0.5, 0.5
    )
    // bottom right
    this.drawTexturePart(
      texture,
      x + width - radius, y + height - radius,
      radius, radius,
      0.5, 0.5, 0.5, 0.5
    )
    // bottom left
    this.drawTexturePart(
      texture,
      x, y + height - radius,
      radius, radius,
      0, 0.5, 0.5, 0.5
    )
    // draw cross rect
    // □■□
    // □■□
    // □■□
    this.drawTexturePart(
      texture,
      x + radius, y,
      width - radius * 2, height,
      0.5, 0.5, 0, 0
    )
    // □□□
    // ■□□
    // □□□
    this.drawTexturePart(
      texture,
      x, y + radius,
      radius, height - radius * 2,
      0.5, 0.5, 0, 0
    )
    // □□□
    // □□■
    // □□□
    this.drawTexturePart(
      texture,
      x + width - radius, y + radius,
      radius, height - radius * 2,
      0.5, 0.5, 0, 0
    )
  }

  private tempQuad = quad.create()

  public drawTexture(texture: Texture, x: number, y: number, width: number, height: number) {
    const quad = this.tempQuad
    vector2.set(quad.topLeft, x, y)
    vector2.set(quad.topRight, x + width, y)
    vector2.set(quad.bottomLeft, x, y + height)
    vector2.set(quad.bottomRight, x + width, y + height)
    this.drawQuad(quad, texture)
  }

  /**
   * Draw a part of a texture on the canvas.
   * @param texture The texture to draw.
   * @param x The x position of the texture on the canvas.
   * @param y The y position of the texture on the canvas.
   * @param width The width of the texture on the canvas.
   * @param height The height of the texture on the canvas.
   * @param texX The offset of the texture on the x axis.
   * @param texY The offset of the texture on the y axis.
   * @param texWidth The width of the texture on the x axis.
   * @param texHeight The height of the texture on the y axis.
   */
  public drawTexturePart(
    texture: Texture,
    x: number,
    y: number,
    width: number,
    height: number,
    texX: number,
    texY: number,
    texWidth: number,
    texHeight: number
  ) {
    // TODO: Implement texture part drawing
    const quad = this.tempQuad
    vector2.set(quad.topLeft, x, y)
    vector2.set(quad.topRight, x + width, y)
    vector2.set(quad.bottomLeft, x, y + height)
    vector2.set(quad.bottomRight, x + width, y + height)

    const state = this.currentState,
      { worldMatrix,/*  pivot, */ shader } = this.currentState,
      { topLeft, topRight, bottomLeft, bottomRight } = quad

    // this.transform()

    const a = transformVector(worldMatrix, topLeft/* , pivot */), 
      texA = vector2.fromValues(texX, texY),
      b = transformVector(worldMatrix, topRight/* , pivot */), 
      texB = vector2.fromValues(texX + texWidth, texY),
      c = transformVector(worldMatrix, bottomLeft/* , pivot */), 
      texC = vector2.fromValues(texX, texY + texHeight),
      d = transformVector(worldMatrix, bottomRight/* , pivot */), 
      texD = vector2.fromValues(texX + texWidth, texY + texHeight)

    this.texture = texture
    shader.addAction.extra = this.extra
    if (this.isBatching) {
      shader.addAction.addVertex(state, this.batchData, a, texA, b, texB, c, texC, d, texD)
    } else {
      const data: number[] = []
      shader.addAction.addVertex(state, data, a, texA, b, texB, c, texC, d, texD)
      this.draw(data)
    }

  }

  private isBatching = false
  private batchData: number[] = []

  /**
   * Start batching drawing operations.
   * All drawing operations will be batched until `endBatch` is called.
   * This can improve performance by reducing the number of draw calls.
   * 
   * **Attention：** batch drawing has follow restrictions:
   * 1. Texture (or TextureAtlas), shader, vertexBuffer cannot be changed during batching.
   * 2. Only one batch can be active at a time.
   * 3. You should call same draw method of this canvas during batching.
   */
  public beginBatch() {
    if (!this.isBatching) {
      this.isBatching = true
      this.batchData = []
    }
  }

  /**
   * End batching drawing operations.
   * All batched drawing operations will be drawn at once.
   */
  public endBatch() {
    if (this.isBatching) {
      this.isBatching = false
      this.draw(this.batchData)
    }
  }

  private isMaskEnabled = false;
  private isMaskBegin = false;

  /**
   * Enable stencil mask.
   * 
   * After calling this method, you should call `beginMask` method before drawing mask content.
   */
  public enableMask() {
    if (this.isMaskEnabled) {
      return
    }
    const gl = this.renderer.gl
    gl.enable(gl.STENCIL_TEST)
    this.isMaskEnabled = true;
  }

  /**
   * Disable stencil mask.
   */
  public disableMask() {
    if (!this.isMaskEnabled) {
      return
    }
    this.isMaskEnabled = false;
    const gl = this.renderer.gl
    gl.disable(gl.STENCIL_TEST)
    gl.stencilMask(0xFF); // 重置模板掩码
  }

  /**
   * Before drawing content with mask, call this method to begin masking.
   * 
   * After calling this method, you should use `Shaders.Mask` to draw mask content.
   * And you must and only use texture draw methods of this canvas to draw mask content.
   */
  public beginMask() {
    if (this.isMaskBegin) {
      return
    }
    const gl = this.renderer.gl
    gl.colorMask(false, false, false, false)
    gl.depthMask(false)
    gl.stencilFunc(gl.ALWAYS, 1, 0xFF);       // 总是通过测试
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE); // 通过时替换为1
    gl.stencilMask(0xFF); 
    // this.debugStencilState("beginMask")
  }

  /**
   * After drawing mask content completed, call this method to end masking.
   * And you can draw any content on canvas to mask.
   * 
   * **Attention:** After calling this method, you should use `Shaders.Default` or any other shader you defined to draw content on canvas.
   * 
   * TODO: Add mask method parameter on this method 
   */
  public endMask() {
    const gl = this.renderer.gl
    gl.colorMask(true, true, true, true);     // 启用颜色写入
    gl.stencilMask(0x00);                     // 禁用模板写入
    gl.stencilFunc(gl.EQUAL, 1, 0xFF);        // 只绘制模板值=1的像素
    // gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE); // 通过时替换为1
    // this.debugStencilState("endMask")
  }

  // public transformVec2(vec: vec2) {
  //   const { worldMatrix: matrix, pivot } = this.currentState
  //   // vector2.add(vec, vec, basePosition)
  //   // this.transform()
  //   return transformVector(matrix, vec, pivot)
  // }

  private draw(data: Float32Array | number[]) {
    const renderer = this.renderer
    const { shader, vertexBuffer } = this.currentState
    shader.bind()
    if (this.texture) {
      renderer.bindTexture(this.texture)
    }
    vertexBuffer.bind()
    vertexBuffer.setVertex(
      data instanceof Float32Array ? data : new Float32Array(data)
    )

    renderer.setBlend(this.currentState.blend)

    shader.use()
    vertexBuffer.draw()

    shader.unbind()
    vertexBuffer.unbind()
    if (this.texture) {
      renderer.unbindTexture(this.texture)
    }
  }

}


function transformVector(matrix: mat3, position: vec2/* , pivot: vec2 */) {
  // Create temporary vector for calculation to avoid modifying input
  // const temp = vector2.subtract(vector2.create(), position, pivot)
  const out = vector2.transformMat3(vector2.create(), position, matrix)
  // vector2.add(out, out, pivot)
  return out
}

/**
 * Record the information of a draw operation.
 * It is convenient to optimize draw operations by grouping them together.
 */
interface DrawOpInfo {
  vertexBuffer: BasicVertexBuffer
  // TODO: use texture array to use multiple textures. texture unit is limited.
  texture: Nullable<Texture>
  blend: Blend
  shader: ShaderWrapper
  orth: Float32Array
  /**
   * A pointer to the start of the data in the draw data array.
   */
  dataOffset: number
}

/**
 * TODO: Add uniform buffer to optimize performance.
 */
class DrawScheduler {

  /**
   * The maximum number of frames to trim the draw data.
   * If the number of frames exceeds this value, 
   * and current data length is reached to 80% of the maximum length, 
   * then the draw data will be trimmed.
   * This value can be adjusted to optimize performance.
   */
  public static readonly MAX_FRAMES_TO_TRIM = 6000

  public drawData: number[] = []
  public drawDataIndex = 0

  public drawOps: DrawOpInfo[] = []
  public drawOpsIndex = 0

  private isSameWithPrevOp(currentIndex: number) {
    const prevIndex = Math.max(currentIndex - 1, 0)
    const prevOp = this.drawOps[prevIndex]
    const op = this.drawOps[currentIndex]
    return this.drawOpInfoEquals(prevOp, op)
  }

  private drawOpInfoEquals(info1: DrawOpInfo, info2: DrawOpInfo) {
    return (
      info1.vertexBuffer === info2.vertexBuffer &&
      info1.texture === info2.texture &&
      info1.blend === info2.blend &&
      info1.shader === info2.shader &&
      ArrayUtils.almostEquals(info1.orth, info2.orth)
    )
  }

  public pushDrawOp(
    vertexBuffer: BasicVertexBuffer,
    texture: Nullable<Texture>,
    blend: Blend,
    shader: ShaderWrapper,
    orth: Float32Array,
    dataOffset = -1
  ) {
    this.drawOpsIndex++
    if (this.drawOpsIndex >= this.drawOps.length) {
      this.drawOps.push({
        vertexBuffer,
        texture,
        blend,
        shader,
        orth,
        dataOffset
      })
    } else {
      const ops = this.drawOps[this.drawOpsIndex]
      ops.vertexBuffer = vertexBuffer
      ops.texture = texture
      ops.blend = blend
      ops.shader = shader
      ops.orth = orth
      ops.dataOffset = dataOffset
    }
    if (!this.isSameWithPrevOp(this.drawOpsIndex)) {
      this.commit()
    }
  }

  public pushDrawData(data: number[]) {
    this.drawData.push(...data)
  }

  public reset() {
    this.drawDataIndex = 0
    this.drawOpsIndex = 0
  }

  private dataBuffer = new Float32Array(1024 * 1024)

  public commit() {
    
  }

  public flushDraw() {

  }

}
