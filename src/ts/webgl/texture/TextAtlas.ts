import {drawCanvas} from "../util/GenTexture";
import {Vector} from "../core/Vector2";
import {type TextureAtlasKey, TextureStore} from "./TextureStore";
import {toTexReginString} from "./TextureAtlas";

const fontFamily = '微软雅黑'
const fontSize = '64px'

export async function loadAsciiTextAtlas() {

  const visibleCharCode = [
    106, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44,
    45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56,
    57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68,
    69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80,
    81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92,
    93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103,
    104, 105, 107, 108, 109, 110, 111, 112, 113,
    114, 115, 116, 117, 118, 119, 120, 121, 122, 123,
    124, 125, 126
  ]

  const text = String.fromCharCode(...visibleCharCode);

  await generateTextAtlas(text, '', fontSize, 'Ascii-Normal-Text-Atlas')
  await generateTextAtlas(text, 'bold', fontSize, 'Ascii-Bold-Text-Atlas')
  await generateTextAtlas(text, 'italic', fontSize, 'Ascii-Italic-Text-Atlas')
  await generateTextAtlas(text, 'lighter', fontSize, 'Ascii-Light-Text-Atlas')
}

async function generateTextAtlas(text: string, style: string, fontSize: string, name: TextureAtlasKey) {
  const atlasSize = Vector(960, 960)
  let textAtlasContent = ''
  const textImage = drawCanvas(atlasSize, (context, op) => {
    if (style === '')
      context.font = `${fontSize} '${fontFamily}'`
    else
      context.font = `${style} ${fontSize} '${fontFamily}'`
    context.fillStyle = '#fff'
    context.textBaseline = 'bottom'
    context.textAlign = 'left'
    context.fontKerning = 'none'

    const lineMetrics = context.measureText(text)
    const maxLineHeight = lineMetrics.fontBoundingBoxAscent + lineMetrics.fontBoundingBoxDescent
    let x = 0, y = 0

    for (const char of text) {
      const metrics = context.measureText(char);
      const width = Math.max(
        metrics.width,
        Math.abs(metrics.actualBoundingBoxLeft) + Math.abs(metrics.actualBoundingBoxRight)
      )
      if (width + x > atlasSize.x) {
        x = 0
        y += maxLineHeight
      }
      textAtlasContent += toTexReginString({
        name: `char-${char.charCodeAt(0).toString(16)}`,
        x, y, width,
        height: maxLineHeight
      })
      context.fillText(char, x, y + lineMetrics.fontBoundingBoxAscent)
      x += width
    }
  })
  await TextureStore.addTextureAtlas(name, textAtlasContent, textImage, false)
}