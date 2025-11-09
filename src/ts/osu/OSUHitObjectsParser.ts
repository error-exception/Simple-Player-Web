import type {
  OSUFileHitSoundsGroup,
  OSUFileManiaHoldParam,
  OSUFileStdSlideParam,
  OSUFileStdSpinnerParam
} from "./OSUFile";

export class OSUHitObjectsParser {

  public static simpleParse(line: string) {
    let startIndex = 0,
      endIndex = 0,
      s: number[] = [],
      parseCount = 0

    while (parseCount < 5) {
      endIndex = line.indexOf(',', startIndex)
      const strValue = line.substring(startIndex, endIndex).trim()
      s.push(parseInt(strValue))
      startIndex = endIndex + 1
      parseCount++
    }

    const lastIndex = line.lastIndexOf(',')
    const arr = line.substring(lastIndex + 1).split(':').map(v => v.trim())
    const soundsGroup: OSUFileHitSoundsGroup = {
      normal: parseInt(arr[0]),
      extra: parseInt(arr[1]),
      no: parseInt(arr[2]),
      volume: parseFloat(arr[3]),
      path: arr[4],
    }
    return { simpleInfo: s, range: [endIndex + 1, lastIndex], soundsGroup }
  }

  public static parseSlider(line: string, startIndex: number, endIndex: number): OSUFileStdSlideParam {

  }

  public static parseSpinner(line: string, startIndex: number, endIndex: number): OSUFileStdSpinnerParam {

  }

  public static parseManiaHold(line: string, startIndex: number, endIndex: number): OSUFileManiaHoldParam {

  }

}