import { Texture } from "../graphic/core/Texture";

const canvas = new OffscreenCanvas(480, 480)
const context = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D

interface TextureOP {
  resize(size: vec2): void
}

/**
 * 动态生成一个 Texture
 * @param gl
 * @param size
 * @param draw
 */
export function genTexture(gl: WebGL2RenderingContext, size: vec2, draw: (context: OffscreenCanvasRenderingContext2D, op: TextureOP) => void) {

  function resize(size: vec2) {
    canvas.width = size[0]
    canvas.height = size[1]
  }
  resize(size)
  const op: TextureOP = { resize }
  draw(context, op)
  return new Texture(gl, canvas)
}

export function drawCanvas(size: vec2, draw: (context: OffscreenCanvasRenderingContext2D, op: TextureOP) => void) {

  function resize(size: vec2) {
    canvas.width = size[0]
    canvas.height = size[1]
  }
  resize(size)
  const op: TextureOP = { resize }
  draw(context, op)
  return canvas
}