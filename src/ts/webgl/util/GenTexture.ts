import {type Vector2} from "../core/Vector2";
import {Texture} from "../core/Texture";

const canvas = new OffscreenCanvas(480, 480)
const context = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D

interface TextureOP {
  resize(size: Vector2): void
}

/**
 * 动态生成一个 Texture
 * @param gl
 * @param size
 * @param draw
 */
export function genTexture(gl: WebGL2RenderingContext, size: Vector2, draw: (context: OffscreenCanvasRenderingContext2D, op: TextureOP) => void) {

  function resize(size: Vector2) {
    canvas.width = size.x
    canvas.height = size.y
  }
  resize(size)
  const op: TextureOP = { resize }
  draw(context, op)
  return new Texture(gl, canvas)
}

export function drawCanvas(size: Vector2, draw: (context: OffscreenCanvasRenderingContext2D, op: TextureOP) => void) {

  function resize(size: Vector2) {
    canvas.width = size.x
    canvas.height = size.y
  }
  resize(size)
  const op: TextureOP = { resize }
  draw(context, op)
  return canvas
}