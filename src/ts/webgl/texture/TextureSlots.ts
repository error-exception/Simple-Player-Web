import type {Texture} from "../core/Texture";
import type {Nullable} from "../../type";

interface TextureUnit {
  unit: number
  texture: Nullable<Texture>
}

let unitCount = 0
let units: TextureUnit[] = []
let defaultTextureUnit = 0

export function initTextureUnits(gl: WebGL2RenderingContext) {
  unitCount = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS)
  defaultTextureUnit = gl.TEXTURE0
  for (let i = 0; i < unitCount; i++) {
    units.push({
      unit: gl.TEXTURE0 + i,
      texture: null
    })
  }
}

export function getTextureUnit(texture: Texture) {
  if (units.length <= 1)
    return defaultTextureUnit
  let idx = -1
  for (let i = 0; i < units.length; i++)
    if (units[i].texture === texture || units[i].texture === null) {
      idx = i
      break
    }
  const unit = idx >= 0
    ? units[idx]
    : units[units.length - 1]
  for (let i = idx - 1; i >= 0; i--)
    units[i + 1] = units[i]
  units[0] = unit
  unit.texture = texture
  return unit.unit
}