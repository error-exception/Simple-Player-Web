import {Icon} from "../../icon/Icon";
import {drawCanvas} from "../util/GenTexture";
import {Vector} from "../core/Vector2";
import {TextureStore} from "./TextureStore";

type IconKeys = keyof typeof Icon

const usedIcons: IconKeys[] = [
  'MusicNote', 'Folder', 'PlayArrow', 'Pause', 'SkipNext',
  'SkipPrevious', 'Help', 'Stop', 'Fullscreen',
  'Notifications', 'KeyboardArrowLeft', 'Settings',
  'RadioButtonUnchecked'
]

export type IconAtlas = `Icon-${IconKeys}`

export async function loadIconsAtlas() {

  let atlasText = ``
  const iconLine = Math.ceil(usedIcons.length / 10)
  let iconIdx = 0
  for (let i = 0; i < iconLine; i++) {
    const y = i * 96
    for (let j = 0; j < 10; j++) {
      const x = 96 * j
      if (iconIdx >= usedIcons.length)
        break
      const icon = usedIcons[iconIdx++]
      atlasText += (
        `Icon-${icon}\n`
        + `  x: ${x}\n`
        + `  y: ${y}\n`
        + `  width: 96\n`
        + `  height: 96\n`
      )
    }
  }
  const iconsValue = usedIcons.map(v => Icon[v])

  const iconTexture = drawCanvas(Vector(96 * 10), (context) => {
    context.font = "96px 'Material Icons'"
    context.textAlign = 'left'
    context.fillStyle = '#ffffff'
    let iconIndex = 0
    for (let i = 0; i < iconLine; i++) {
      for (let j = 0; j < 10; j++) {
        if (iconIndex >= iconsValue.length) break
        context.fillText(iconsValue[iconIndex++], j * 96, (i + 1) * 96)
      }
    }
  })
  await TextureStore.addTextureAtlas('Icons-Atlas', atlasText, iconTexture, false)
}