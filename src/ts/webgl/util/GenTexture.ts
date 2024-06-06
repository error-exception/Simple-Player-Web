import {type Vector2} from "../core/Vector2";
import {Texture} from "../core/Texture";

const canvas = new OffscreenCanvas(480, 480)
const context = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D

/**
 * 动态生成一个 Texture
 * @param gl
 * @param size
 * @param draw
 */
export function genTexture(gl: WebGL2RenderingContext, size: Vector2, draw: (context: OffscreenCanvasRenderingContext2D) => void) {
  canvas.width = size.x
  canvas.height = size.y
  draw(context)
  return new Texture(gl, canvas)
}