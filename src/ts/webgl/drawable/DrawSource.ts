import {BasicVertexBuffer} from "../graphic/buffer/BasicVertexBuffer";
import {ShaderWrapper} from "../graphic/shader/ShaderWrapper";
import {Texture} from "../graphic/core/Texture";
import {ArrayUtils} from "../../util/ArrayUtils";
import {Nullable} from "../../type";
import {Blend} from "./Blend";
import {Buffers} from "../graphic/buffer/Buffers";
import {Shaders} from "../graphic/shader/Shaders";
import {WebGLRenderer} from "../WebGLRenderer";
import {Matrix3} from "../graphic/core/Matrix3";
import {ATTR_ALPHA, ATTR_COLOR, ATTR_POSITION, ATTR_TEXCOORD} from "../graphic/shader/ShaderConstant";

/**
 *
 */
export class DrawSource {

  public POSITION_INDEX = 0
  public COLOR_INDEX = 2
  public TEXTURE_INDEX = 2
  public ALPHA_INDEX = -1
  public static readonly VERTEX_PER_QUAD = 4
  public static readonly VERTEX_PER_TRIANGLE = 3

  public blend: Blend = Blend.Normal

  public vertexBuffer: BasicVertexBuffer = Buffers.SingleQuad;

  public shader: ShaderWrapper = Shaders.Default

  public texture: Nullable<Texture> = null;

  public bufferData: Float32Array | number[] = ArrayUtils.emptyFloat32Array;

  public matrix: Matrix3[] = new Array(16)

  public matrixIndex = -1

  public reset() {
    this.shader = Shaders.Default
    this.texture = null
    this.bufferData = new Float32Array(this.vertexBuffer.elementCount)
    this.vertexBuffer = Buffers.SingleQuad;
    this.blend = Blend.Normal;
    this.matrixIndex = -1
    this.pushMatrix(Matrix3.newIdentify())
  }

  public pushMatrix(matrix: Matrix3) {
    let i = this.matrixIndex++
    this.matrix[i] = matrix
  }

  public popMatrix() {
    this.matrixIndex--
  }

  public setShader(shader: ShaderWrapper) {
    if (this.shader === shader) {
      return
    }
    console.log("new ----------------")
    this.shader = shader
    const attrs = shader.shaderAttributes
    let startIndex = 0
    for (let i = 0; i < attrs.length; i++) {
      const attr = attrs[i]
      if (attr.name === ATTR_POSITION) {
        this.POSITION_INDEX = startIndex
        startIndex += attr.count
      } else if (attr.name === ATTR_TEXCOORD) {
        this.TEXTURE_INDEX = startIndex
        startIndex += attr.count
      } else if (attr.name === ATTR_COLOR) {
        this.COLOR_INDEX = startIndex
        startIndex += attr.count
      } else if (attr.name === ATTR_ALPHA) {
        this.ALPHA_INDEX = startIndex
        startIndex += attr.count
      } else {
        throw Error(`unknown attribute name: ${attr.name}`)
      }
    }
    this.bufferData = new Float32Array(this.vertexBuffer.elementCount)
  }

  public setBuffer(buffer: BasicVertexBuffer) {
    if (this.vertexBuffer === buffer) {
      return
    }
    this.vertexBuffer = buffer
    this.bufferData = new Float32Array(this.vertexBuffer.elementCount)
  }

  /**
   * use webgl draw
   * @param renderer
   */
  public commitGLDraw(renderer: WebGLRenderer) {
    this.shader.bind()
    if (this.texture) {
      renderer.bindTexture(this.texture);
    }
    this.vertexBuffer.bind()
    const data = this.bufferData;

    console.log(data)

    this.vertexBuffer.setVertex(
      data instanceof Float32Array ? data : new Float32Array(data)
    )

    renderer.setBlend(this.blend)

    this.shader.use()
    this.vertexBuffer.draw()

    this.shader.unbind()
    this.vertexBuffer.unbind()
    if (this.texture) {
      renderer.unbindTexture(this.texture);
    }
  }

}