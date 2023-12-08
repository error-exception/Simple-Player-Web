import {
  isColorEvent,
  isLoopEvent, isParamEvent,
  isValueEvent,
  isVectorEvent, OSBAnimation,
  OSBBaseEvent,
  OSBEvent,
  OSBFile,
  OSBSprite
} from "./OSUFile";
import {Ease, EventType, LoopType, StoryLayer, StoryOrigin} from "../webgl/screen/story/StoryType";
import {Vector} from "../webgl/core/Vector2";
import {Color} from "../webgl/base/Color";
import {isUndef} from "../webgl/core/Utils";

export class OSBParser {

  public static parse(content: string): OSBFile {
    const lines = content.split("\n").map(s => s.trimEnd())
    const osb: OSBFile = {
      sprites: []
    }
    for (let i = 0; i < lines.length;) {
      const line = lines[i]
      if (line.startsWith("[")) {
        i++
        continue
      }
      if (line.startsWith("Sprite")) {
        i = this.parseSprite(lines, i, osb)
      } else if (line.startsWith("Animation")) {
        i = this.parseAnimation(lines, i, osb)
      } else {
        i++
      }
    }
    return osb
  }

  private static parseSprite(lines: string[], lineIndex: number, out: OSBFile): number {
    let i = lineIndex
    const line = lines[i++]
    const spriteInfo: string[] = []

    const firstQuotationIndex = line.indexOf("\"")
    const lastQuotationIndex = line.lastIndexOf("\"")

    const pre = line.substring(0, firstQuotationIndex).replaceAll(",", " ").trim()
    const after = line.substring(lastQuotationIndex + 1).replaceAll(",", " ").trim()
    const filePath = line.substring(firstQuotationIndex + 1, lastQuotationIndex).replaceAll("\\", "/").toLowerCase()
    const preList = pre.split(" ").map(v => v.trim())
    const afterList = after.split(" ").map(v => v.trim())
    spriteInfo.push(...preList, filePath, ...afterList)

    const sprite: OSBSprite = {
      layer: spriteInfo[1] as StoryLayer,
      origin: spriteInfo[2] as StoryOrigin,
      filePath: spriteInfo[3],
      x: parseInt(spriteInfo[4]),
      y: parseInt(spriteInfo[5]),
      events: []
    }
    while (!isUndef(lines[i]) && lines[i].startsWith(" ")) {
      i = this.parseEvent(lines, i, sprite.events)
    }
    out.sprites.push(sprite)
    return i
  }

  private static parseAnimation(lines: string[], lineIndex: number, out: OSBFile): number {
    let i = lineIndex
    const line = lines[i++]
    const animeInfo: string[] = []

    const firstQuotationIndex = line.indexOf("\"")
    const lastQuotationIndex = line.lastIndexOf("\"")

    const pre = line.substring(0, firstQuotationIndex).replaceAll(",", " ").trim()
    const after = line.substring(lastQuotationIndex + 1).replaceAll(",", " ").trim()
    const filePath = line.substring(firstQuotationIndex + 1, lastQuotationIndex).replaceAll("\\", "/").toLowerCase()
    const preList = pre.split(" ").map(v => v.trim())
    const afterList = after.split(" ").map(v => v.trim())
    animeInfo.push(...preList, filePath, ...afterList)

    const animation: OSBAnimation = {
      layer: animeInfo[1] as StoryLayer,
      origin: animeInfo[2] as StoryOrigin,
      filePath: animeInfo[3],
      x: parseInt(animeInfo[4]),
      y: parseInt(animeInfo[5]),
      events: [],
      frameCount: parseInt(animeInfo[6]),
      frameDelay: parseInt(animeInfo[7]),
      loopType: animeInfo[8] as LoopType
    }
    while (!isUndef(lines[i]) && lines[i].startsWith(" ")) {
      i = this.parseEvent(lines, i, animation.events)
    }
    out.sprites.push(animation)
    return i - 1
  }

  /**
   *
   * @param lines
   * @param lineIndex
   * @param events
   * @return next line index
   * @private
   */
  private static parseEvent(lines: string[], lineIndex: number, events: OSBEvent[]): number {
    const line = lines[lineIndex]
    const splits = line.split(",").map(s => s.trim())
    const eventType = splits[0] as EventType
    // if (eventType === "C") {
    //   debugger
    // }

    const event: OSBEvent = {
      type: eventType, startTime: 0
    }
    if (isLoopEvent(event)) {
      event.startTime = parseInt(splits[1])
      event.loopCount = parseInt(splits[2])
      event.children = []
      events.push(event)
      let nextLineIndex = lineIndex + 1
      while (!isUndef(lines[nextLineIndex]) && lines[nextLineIndex].startsWith("  ")) {
        nextLineIndex = this.parseEvent(lines, nextLineIndex, event.children)
      }
      return nextLineIndex
    }
    const baseEvent = event as OSBBaseEvent
    baseEvent.ease = parseInt(splits[1]) as Ease
    baseEvent.startTime = parseInt(splits[2])
    baseEvent.endTime = this.toInt(splits[3]) ?? baseEvent.startTime

    if (isValueEvent(baseEvent)) {
      const from = parseFloat(splits[4]),
        to = this.toFloat(splits[5]) ?? from
      baseEvent.from = from
      baseEvent.to = to
      events.push(baseEvent)
      // const remainsLength = splits.length - 6
      for (let index = 6; index < splits.length; index++) {
        const copied = this.shallowCopy(baseEvent)
        const duration = copied.endTime - copied.startTime
        copied.startTime += duration
        copied.endTime += duration
        copied.from = copied.to
        copied.to = parseFloat(splits[index])
        events.push(copied)
      }
    } else if (isVectorEvent(baseEvent)) {
      baseEvent.from = Vector(parseFloat(splits[4]), parseFloat(splits[5]))
      if (splits.length === 6) {
        baseEvent.to = baseEvent.from
      } else {
        baseEvent.to = Vector(parseFloat(splits[6]), parseFloat(splits[7]))
      }
      events.push(baseEvent)
      // const remainsLength = splits.length - 8
      for (let index = 8; index < splits.length; index += 2) {
        const copied = this.shallowCopy(baseEvent)
        const duration = copied.endTime - copied.startTime
        copied.startTime += duration
        copied.endTime += duration
        copied.from = copied.to
        copied.to = Vector(parseFloat(splits[index]), parseFloat(splits[index + 1]))
        events.push(copied)
      }
    } else if (isColorEvent(baseEvent)) {
      baseEvent.from = new Color(
        parseInt(splits[4]) / 255,
        parseInt(splits[5]) / 255,
        parseInt(splits[6]) / 255,
        1
      )
      if (splits.length === 7) {
        baseEvent.to = baseEvent.from
      } else {
        baseEvent.to = new Color(
          parseInt(splits[7]) / 255,
          parseInt(splits[8]) / 255,
          parseInt(splits[9]) / 255,
          1
        )
      }
      events.push(baseEvent)
      for (let index = 10; index < splits.length; index += 3) {
        const copied = this.shallowCopy(baseEvent)
        const duration = copied.endTime - copied.startTime
        copied.startTime += duration
        copied.endTime += duration
        copied.from = copied.to
        copied.to = new Color(
          parseInt(splits[index]) / 255,
          parseInt(splits[index + 1]) / 255,
          parseInt(splits[index + 2]) / 255,
          1,
        )
        events.push(copied)
      }
    } else if (isParamEvent(baseEvent)) {
      baseEvent.p = splits[4]
      events.push(baseEvent)
    }
    return lineIndex + 1
    // if (isValueEvent(baseEvent) && (baseEvent.type === "S" || baseEvent.type === "R" || baseEvent.type === "F")) {
    //   baseEvent.from = parseFloat(splits[4])
    //   baseEvent.to = this.toFloat(splits[5]) ?? baseEvent.from
    // } else if (isVectorEvent(baseEvent) && baseEvent.type === "M") {
    //   baseEvent.from = Vector(parseInt(splits[4]), parseInt(splits[5]))
    //   if (splits.length === 6) {
    //     baseEvent.to = baseEvent.from
    //   } else {
    //     baseEvent.to = Vector(parseInt(splits[6]), parseInt(splits[7]))
    //   }
    // } else if (isVectorEvent(baseEvent)) {
    //   baseEvent.from = Vector(parseFloat(splits[4]), parseFloat(splits[5]))
    //   if (splits.length === 6) {
    //     baseEvent.to = baseEvent.from
    //   } else {
    //     baseEvent.to = Vector(parseFloat(splits[6]), parseFloat(splits[7]))
    //   }
    // } else if (isValueEvent(baseEvent)) {
    //   baseEvent.from = parseInt(splits[4])
    //   baseEvent.to = this.toInt(splits[5]) ?? baseEvent.from
    // } else if (isColorEvent(baseEvent)) {
    //   baseEvent.from = new Color(
    //     parseInt(splits[4]) / 255,
    //     parseInt(splits[5]) / 255,
    //     parseInt(splits[6]) / 255,
    //     1
    //   )
    //   if (splits.length === 7) {
    //     baseEvent.to = baseEvent.from
    //   } else {
    //     baseEvent.to = new Color(
    //       parseInt(splits[7]) / 255,
    //       parseInt(splits[8]) / 255,
    //       parseInt(splits[9]) / 255,
    //       1
    //     )
    //   }
    // }
  }

  private static toInt(s: string) {
    try {
      const maybeInt = parseInt(s)
      return isNaN(maybeInt) ? undefined : maybeInt
    } catch (e) {
      return undefined
    }
  }

  private static toFloat(s: string) {
    try {
      const maybeFloat = parseFloat(s)
      return isNaN(maybeFloat) ? undefined : maybeFloat
    } catch (e) {
      return undefined
    }
  }

  private static shallowCopy<T extends object>(source: T): T {
    const result = {}
    const keys = Object.getOwnPropertyNames(source)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      //@ts-ignore
      result[key] = source[key]
    }
    return result as T
  }

}

export function testOSBParser() {
  const osb = OSBParser.parse(source)
  console.log(osb)
}

const source =
`[Events]
//Background and Video events
//Storyboard Layer 0 (Background)
Sprite,Background,Centre,"sb\\bgs\\alice.jpg",0,0
 F,0,209786,,0,1
 S,0,209786,,0.2314815
 M,0,209786,252000,305,330
 F,0,210002,252460,1
Sprite,Background,Centre,"sb\\bgs\\rin.jpg",320,240
 S,0,100435,,0.537037
 F,0,100435,104435,0.25,1
 F,0,152443,155443,1,0
Sprite,Background,Centre,"sb\\bgs\\aya.jpg",320,240
 F,0,47093,,0,1
 S,0,47093,,0.2777778
 F,0,47093,100435,1
Sprite,Background,Centre,"sb\\bgs\\BlondHairBlackHairGirlsThatAreGayForEachother.jpg",0,0
 S,0,0,,0.4722222
 M,0,0,46093,350,240
 F,0,420,5754,0,1
 F,0,5754,47093,1
Sprite,Background,Centre,"sb\\bgs\\daiyousei.jpg",320,240
 F,0,399816,,0,1
 S,0,399816,,0.5555556
 F,0,400002,431821,1
Sprite,Background,Centre,"sb\\bgs\\flanXkoishi.jpg",0,0
 F,0,559843,,1
 S,0,559843,,1.074074
 M,0,559843,569844,317,380,317,480
 F,0,559844,569844,1
 F,0,569844,572209,1,0
Sprite,Background,Centre,"sb\\bgs\\kagiyama.jpg",320,240
 F,0,378479,,0,1
 S,0,378479,,0.4722222
 F,0,378479,399816,1
Sprite,Background,Centre,"sb\\bgs\\kaguya.jpg",320,240
 F,0,252460,,0,1
 S,0,252460,,0.2777778
 F,0,295799,296799,1,0
Sprite,Background,Centre,"sb\\bgs\\kokoro.jpg",320,240
 S,0,156444,,0.2777778
 F,0,156444,161778,0,1
 F,0,161778,209786,1
Sprite,Background,Centre,"sb\\bgs\\smol.jpg",320,240
 F,0,431821,,0,1
 S,0,431821,,0.462963
 F,0,495832,498499,1,0
Sprite,Background,Centre,"sb\\bgs\\smol.jpg",320,240
 F,0,453158,453658,1,0
 S,19,453158,453658,0.462963,0.5
 F,0,463826,464326,1,0
 S,19,463826,464326,0.462963,0.5
 F,0,474495,474995,1,0
 S,19,474495,474995,0.462963,0.5
 F,0,485163,485663,1,0
 S,19,485163,485663,0.462963,0.5
Sprite,Background,Centre,"sb\\bgs\\speaknoevil.jpg",0,0
 F,0,297133,,0,1
 S,0,297133,,0.3564815
 M,0,297133,339807,320,300
 F,0,297133,339807,1
Sprite,Background,Centre,"sb\\bgs\\sweetpotato.jpg",0,0
 M,0,339807,,320,320
 F,0,339807,,0,1
 S,0,339807,,0.2222222
 F,0,339807,378479,1
Sprite,Background,Centre,"sb\\bgs\\flanfull.jpg",0,0
 F,0,501166,503833,0,1
 M,0,503833,,319,321
 S,0,503833,,0.5555556
 F,0,533171,533172,1,0
 F,0,538506,,0,1
 F,0,538507,,1
 F,0,538507,559843,1
Sprite,Background,Centre,"sb\\bgs\\flanfull.jpg",0,0
 M,0,538506,,319,321
 F,0,538506,539006,1,0
 S,19,538506,539006,0.5555556,0.6
 F,0,551841,552341,1,0
 S,19,551841,552341,0.5555556,0.6
 F,0,554508,555008,1,0
 S,19,554508,555008,0.5555556,0.6
 F,0,555842,556342,1,0
 S,19,555842,556342,0.5555556,0.6
 F,0,557175,557675,1,0
 S,19,557175,557675,0.5555556,0.6
 F,0,557842,558342,1,0
 S,19,557842,558342,0.5555556,0.6
 F,0,558509,559009,1,0
 S,19,558509,559009,0.5555556,0.6
 F,0,559176,559676,1,0
 S,19,559176,559676,0.5555556,0.6
Sprite,Background,Centre,"sb\\bgs\\flanfullgrayout.png",0,0
 M,0,533171,,319,321
 F,0,533171,,0,1
 S,0,533171,,0.5555556
 F,0,533172,538506,1
 F,0,538506,,1,0
 M,0,549174,,319,321
 F,0,549174,,0,1
 S,0,549174,,0.5555556
 F,0,549175,551841,1
Sprite,Background,Centre,"sb\\bgs\\flanfullgrayout.png",0,0
 M,0,533171,,319,321
 F,0,533171,533671,1,0
 S,19,533171,533671,0.5555556,0.6
Sprite,Background,Centre,"sb\\bgs\\flanfull.jpg",0,0
 S,0,537172,,0.5555556
 F,0,537172,537505,1,0
 M,0,537172,538506,319,321
 F,0,537505,537838,1,0
 F,0,537839,538172,1,0
 F,0,538172,538505,1,0
Sprite,Background,Centre,"sb\\bgs\\koishislice.png",0,0
 S,0,521500,,0.5555556
 F,0,521500,521501,0,1
 F,0,521502,533171,1
 M,19,522500,522750,821,-381,319,321
 F,0,533171,533172,1,0
 M,0,549174,,319,321
 F,0,549174,,0,1
 S,0,549174,,0.5555556
 F,0,549175,559843,1
Sprite,Background,Centre,"sb\\bgs\\koishislice.png",0,0
 M,19,549174,,821,-381,319,321
 F,0,549174,549674,1,0
 S,19,549174,549674,0.5555556,0.6
 F,0,554508,555008,1,0
 S,19,554508,555008,0.5555556,0.6
 F,0,555842,556342,1,0
 S,19,555842,556342,0.5555556,0.6
 F,0,557175,557675,1,0
 S,19,557175,557675,0.5555556,0.6
 F,0,557842,558342,1,0
 S,19,557842,558342,0.5555556,0.6
 F,0,558509,559009,1,0
 S,19,558509,559009,0.5555556,0.6
 F,0,559176,559676,1,0
 S,19,559176,559676,0.5555556,0.6
Sprite,Background,Centre,"sb\\bgs\\koishislicegray.png",0,0
 M,0,533171,,319,321
 F,0,533171,,0,1
 S,0,533171,,0.5555556
 F,0,533172,549174,1
Sprite,Background,Centre,"sb\\bgs\\koishislicegray.png",0,0
 M,0,533171,,319,321
 F,0,533171,533671,1,0
 S,19,533171,533671,0.5555556,0.6
Sprite,Background,Centre,"sb\\bgs\\1.png",0,0
 S,0,5754,,0.4444444
 M,19,5754,7087,-180,240,290,240
 M,0,7087,46093,290,240
 M,18,46426,47092,290,240,-180,240
Sprite,Background,Centre,"sb\\bgs\\2.png",0,0
 S,0,47093,,0.4444444
 M,19,47093,47760,-180,240,290,240
 M,0,48093,99769,290,240
 M,18,99769,100435,290,240,-180,240
Sprite,Background,Centre,"sb\\bgs\\3.png",0,0
 S,0,104000,,0.4444444
 M,19,104435,105101,-180,240,290,240
 M,0,105101,151776,290,240
 M,18,151776,152442,290,240,-180,240
Sprite,Background,Centre,"sb\\bgs\\4.png",0,0
 S,0,156444,,0.4444444
 M,19,156444,157110,-180,240,290,240
 M,0,159000,209119,290,240
 M,18,209119,209785,290,240,-180,240
Sprite,Background,Centre,"sb\\bgs\\5.png",0,0
 S,0,209786,,0.4444444
 M,19,209786,210453,-180,240,290,240
 M,0,210453,251793,290,240
 M,18,251793,252459,290,240,-180,240
Sprite,Background,Centre,"sb\\bgs\\7.png",0,0
 S,0,252460,,0.4444444
 M,19,252460,253126,-180,240,290,240
 M,0,253126,295799,290,240
 M,18,295799,296465,290,240,-180,240
Sprite,Background,Centre,"sb\\bgs\\8.png",0,0
 S,0,297133,,0.4444444
 M,19,297133,297716,-180,240,290,240
 M,0,297716,339140,290,240
 M,18,339140,339806,290,240,-180,240
Sprite,Background,Centre,"sb\\bgs\\9.png",0,0
 S,0,339807,,0.4444444
 M,19,339807,340473,-180,240,290,240
 M,0,340473,377812,290,240
 M,18,377812,378478,290,240,-180,240
Sprite,Background,Centre,"sb\\bgs\\10.png",0,0
 S,0,378479,,0.4444444
 M,19,378479,379146,-180,240,290,240
 M,0,379146,399149,290,240
 M,18,399149,399815,290,240,-180,240
Sprite,Background,Centre,"sb\\bgs\\11.png",0,0
 S,0,399816,,0.4444444
 M,19,399816,400483,-180,240,290,240
 M,0,400483,431154,290,240
 M,18,431154,431820,290,240,-180,240
Sprite,Background,Centre,"sb\\bgs\\12.png",0,0
 S,0,431821,,0.4444444
 M,19,431821,432488,-180,240,290,240
 M,0,432488,495832,290,240
 M,18,495832,496498,290,240,-180,240
Sprite,Background,Centre,"sb\\bgs\\13.png",0,0
 S,0,501166,,0.4444444
 M,19,503833,504499,-180,240,290,240
 M,0,504499,521169,290,240
 M,18,521169,521836,290,240,-180,240
Sprite,Background,Centre,"sb\\bgs\\WasHerHartmann.png",0,0
 S,0,522503,,0.4444444
 M,19,522503,523170,-180,240,290,240
 M,0,523170,533171,290,240
 M,18,533171,533837,290,240,-180,240
Sprite,Background,Centre,"sb\\bgs\\16.png",0,0
 S,0,538506,,0.4444444
 M,19,538506,539172,-180,240,290,240
 M,0,539172,548507,290,240
 M,18,548507,549173,290,240,-180,240
Sprite,Background,Centre,"sb\\bgs\\17.png",0,0
 S,0,549174,,0.4444444
 M,19,549174,549841,-180,240,290,240
 M,0,549841,551174,290,240
 M,18,551174,551840,290,240,-180,240
Sprite,Background,Centre,"sb\\bgs\\17b.png",0,0
 S,0,551841,,0.4444444
 M,19,551841,552508,-180,240,290,240
 M,0,552508,553675,290,240
 M,18,553841,554507,290,240,-180,240
Sprite,Background,Centre,"sb\\bgs\\18.png",0,0
 S,0,554508,,0.4444444
 M,19,554508,555174,-180,240,290,240
 M,0,555174,557175,290,240
 M,18,557175,558508,290,240,-180,240
Sprite,Background,Centre,"sb\\bgs\\rat.png",0,0
 S,0,566510,,0.15
 F,0,566510,566677,0,1
 M,10,566510,567143,517,290,517,240
 M,9,567177,567843,517,240,517,190
 F,0,567677,567844,1,0
Sprite,Background,Centre,"sb\\bgs\\totsugeki.png",0,0
 S,0,565177,,0.2
 F,0,565177,565343,0,1
 M,10,565177,565810,117,220,117,170
 M,9,565843,566509,117,170,117,120
 F,0,566344,566510,1,0
Sprite,Background,Centre,"sb\\bgs\\thankyouyesyou.png",0,0
 S,0,567844,,0.15
 F,0,567844,568511,0,1
 M,10,567844,569844,320,480,320,240
 F,0,569844,572209,1,0
Sprite,Background,Centre,"sb\\bgs\\white.jpg",320,240
 F,0,47093,47593,0.8,0
 F,0,100435,100935,0.8,0
 F,0,209786,210286,0.8,0
 F,0,252460,252960,0.8,0
 F,0,297133,297633,0.8,0
 F,0,339807,340307,0.8,0
 F,0,378479,378979,0.8,0
 F,0,399816,400316,0.8,0
 F,0,431821,432321,0.8,0
 F,0,453158,453658,0.8,0
 F,0,463826,464326,0.8,0
 F,0,474495,474995,0.8,0
 F,0,485163,485663,0.8,0
 F,0,503833,504333,0.8,0
 S,0,533171,,1.111111
 F,0,538506,539006,0.8,0
 F,0,557175,559843,0,1
 F,0,559843,561843,1,0
Sprite,Background,Centre,"sb\\bgs\\flann\\flann0.jpg",0,0
 S,0,499833,,0.6
 F,0,499833,500166,0,1
 M,0,500166,500499,320,200
Animation,Background,Centre,"sb\\bgs\\flann\\flann.jpg",320,240,80,30,LoopForever
 S,0,500499,,0.6
 M,0,500499,501166,320,200
Sprite,Background,Centre,"sb\\bgs\\particle.png",0,0
 L,538365,7
  F,1,0,619,0,1
  M,0,0,3095,222.9475,717.6158,422.3499,-708.5115
  F,2,2476,3095,1,0
 R,0,538365,,-1.431876
 C,0,538365,,254,254,254
Sprite,Background,Centre,"sb\\bgs\\particle.png",0,0
 L,538462,7
  F,1,0,619,0,1
  M,0,0,3095,615.2432,543.4005,1329.158,-707.1696
  F,2,2476,3095,1,0
 R,0,538462,,-1.05207
 C,0,538462,,235,235,235
Sprite,Background,Centre,"sb\\bgs\\particle.png",0,0
 L,538558,7
  F,1,0,619,0,1
  M,0,0,3095,422.3015,177.3434,1131.701,-1075.794
  F,2,2476,3095,1,0
 R,0,538558,,-1.055678
 C,0,538558,,247,247,247
Sprite,Background,Centre,"sb\\bgs\\particle.png",0,0
 L,538655,7
  F,1,0,619,0,1
  M,0,0,3095,-56.18689,422.8024,224.9211,-989.4932
  F,2,2476,3095,1,0
 R,0,538655,,-1.374321
 C,0,538655,,229,229,229
Sprite,Background,Centre,"sb\\bgs\\particle.png",0,0
 L,538752,7
  F,1,0,619,0,1
  M,0,0,3095,380.2853,703.7165,76.72229,-703.9233
  F,2,2476,3095,1,0
 R,0,538752,,-1.783197
 C,0,538752,,244,244,244
Sprite,Background,Centre,"sb\\bgs\\particle.png",0,0
 L,538849,7
  F,1,0,619,0,1
  M,0,0,3095,292.1065,417.4458,113.1296,-1011.389
  F,2,2476,3095,1,0
 R,0,538849,,-1.695408
 C,0,538849,,253,253,253
Sprite,Background,Centre,"sb\\bgs\\particle.png",0,0
 L,538945,7
  F,1,0,619,0,1
  M,0,0,3095,-17.45639,470.1846,-576.9272,-856.6887
  F,2,2476,3095,1,0
 R,0,538945,,-1.969823
 C,0,538945,,252,252,252
Sprite,Background,Centre,"sb\\bgs\\particle.png",0,0
 L,539042,7
  F,1,0,619,0,1
  M,0,0,3095,345.0234,279.1785,280.5175,-1159.376
  F,2,2476,3095,1,0
 R,0,539042,,-1.615607
 C,0,539042,,234,234,234
Sprite,Background,Centre,"sb\\bgs\\particle.png",0,0
 L,539139,7
  F,1,0,619,0,1
  M,0,0,3095,29.2359,643.4156,209.4618,-785.2617
  F,2,2476,3095,1,0
 R,0,539139,,-1.44531
 C,0,539139,,232,232,232
Sprite,Background,Centre,"sb\\bgs\\particle.png",0,0
 L,539236,7
  F,1,0,619,0,1
  M,0,0,3095,522.8643,253.4104,874.2512,-1143.059
  F,2,2476,3095,1,0
 R,0,539236,,-1.324289
 C,0,539236,,245,245,245
Sprite,Background,Centre,"sb\\bgs\\particle.png",0,0
 L,539332,7
  F,1,0,619,0,1
  M,0,0,3095,167.9346,361.1347,747.24,-957.1997
  F,2,2476,3095,1,0
 R,0,539332,,-1.156774
 C,0,539332,,227,227,227
Sprite,Background,Centre,"sb\\bgs\\particle.png",0,0
 L,539429,7
  F,1,0,619,0,1
  M,0,0,3095,365.4446,353.9169,581.9415,-1069.716
  F,2,2476,3095,1,0
 R,0,539429,,-1.419879
 C,0,539429,,231,231,231
Sprite,Background,Centre,"sb\\bgs\\particle.png",0,0
 L,539526,7
  F,1,0,619,0,1
  M,0,0,3095,536.7699,479.9572,765.3195,-941.7902
  F,2,2476,3095,1,0
 R,0,539526,,-1.411407
 C,0,539526,,249,249,249
Sprite,Background,Centre,"sb\\bgs\\particle.png",0,0
 L,539623,7
  F,1,0,619,0,1
  M,0,0,3095,534.6201,662.1396,861.1704,-740.3458
  F,2,2476,3095,1,0
 R,0,539623,,-1.342035
 C,0,539623,,252,252,252
Sprite,Background,Centre,"sb\\bgs\\particle.png",0,0
 L,539719,7
  F,1,0,619,0,1
  M,0,0,3095,379.7813,710.6213,441.2805,-728.065
  F,2,2476,3095,1,0
 R,0,539719,,-1.528076
 C,0,539719,,246,246,246
Sprite,Background,Centre,"sb\\bgs\\particle.png",0,0
 L,539816,7
  F,1,0,619,0,1
  M,0,0,3095,-35.20789,544.8328,422.9556,-820.3362
  F,2,2476,3095,1,0
 R,0,539816,,-1.246999
 C,0,539816,,248,248,248
Sprite,Background,Centre,"sb\\bgs\\particle.png",0,0
 L,539913,7
  F,1,0,619,0,1
  M,0,0,3095,467.6642,405.2202,502.0205,-1034.37
  F,2,2476,3095,1,0
 R,0,539913,,-1.546936
 C,0,539913,,235,235,235
Sprite,Background,Centre,"sb\\bgs\\particle.png",0,0
 L,540010,7
  F,1,0,619,0,1
  M,0,0,3095,212.4201,797.4727,-200.1494,-582.1602
  F,2,2476,3095,1,0
 R,0,540010,,-1.861375
 C,0,540010,,230,230,230
Sprite,Background,Centre,"sb\\bgs\\particle.png",0,0
 L,540106,7
  F,1,0,619,0,1
  M,0,0,3095,74.58011,268.5847,270.5998,-1158.011
  F,2,2476,3095,1,0
 R,0,540106,,-1.434248
 C,0,540106,,231,231,231
Sprite,Background,Centre,"sb\\bgs\\particle.png",0,0
 L,540203,7
  F,1,0,619,0,1
  M,0,0,3095,370.6898,439.7853,956.5342,-875.6562
  F,2,2476,3095,1,0
 R,0,540203,,-1.151808
 C,0,540203,,228,228,228
Sprite,Background,Centre,"sb\\bgs\\particle.png",0,0
 L,540300,7
  F,1,0,619,0,1
  M,0,0,3095,356.7473,574.8629,522.0624,-855.6165
  F,2,2476,3095,1,0
 R,0,540300,,-1.45574
 C,0,540300,,239,239,239
Sprite,Background,Centre,"sb\\bgs\\particle.png",0,0
 L,540397,7
  F,1,0,619,0,1
  M,0,0,3095,464.1003,717.6005,569.3553,-718.5477
  F,2,2476,3095,1,0
 R,0,540397,,-1.497637
 C,0,540397,,244,244,244
Sprite,Background,Centre,"sb\\bgs\\particle.png",0,0
 L,540493,7
  F,1,0,619,0,1
  M,0,0,3095,503.1713,486.9052,1019.904,-857.1884
  F,2,2476,3095,1,0
 R,0,540493,,-1.203769
 C,0,540493,,236,236,236
Sprite,Background,Centre,"sb\\bgs\\particle.png",0,0
 L,540590,7
  F,1,0,619,0,1
  M,0,0,3095,188.614,141.5444,893.9546,-1113.882
  F,2,2476,3095,1,0
 R,0,540590,,-1.058913
 C,0,540590,,241,241,241
Sprite,Background,Centre,"sb\\bgs\\particle.png",0,0
 L,540687,7
  F,1,0,619,0,1
  M,0,0,3095,238.4735,731.5898,286.085,-707.6229
  F,2,2476,3095,1,0
 R,0,540687,,-1.537727
 C,0,540687,,236,236,236
Sprite,Background,Centre,"sb\\bgs\\particle.png",0,0
 L,540784,7
  F,1,0,619,0,1
  M,0,0,3095,-44.10251,488.1593,126.1365,-941.7426
  F,2,2476,3095,1,0
 R,0,540784,,-1.452298
 C,0,540784,,248,248,248
Sprite,Background,Centre,"sb\\bgs\\particle.png",0,0
 L,540880,7
  F,1,0,619,0,1
  M,0,0,3095,3.230286,681.103,-539.8851,-652.5483
  F,2,2476,3095,1,0
 R,0,540880,,-1.957528
 C,0,540880,,243,243,243
Sprite,Background,Centre,"sb\\bgs\\particle.png",0,0
 L,540977,7
  F,1,0,619,0,1
  M,0,0,3095,431.4841,219.3916,536.5598,-1216.77
  F,2,2476,3095,1,0
 R,0,540977,,-1.497762
 C,0,540977,,233,233,233
Sprite,Background,Centre,"sb\\bgs\\particle.png",0,0
 L,541074,7
  F,1,0,619,0,1
  M,0,0,3095,147.4604,365.8698,863.6893,-883.3765
  F,2,2476,3095,1,0
 R,0,541074,,-1.050219
 C,0,541074,,228,228,228
Sprite,Background,Centre,"whatbgdoievenuse.jpg",320,240
 F,0,-500,0,0
 S,0,0,,0.341394
 F,0,569844,570344,0
//Storyboard Layer 1 (Fail)
//Storyboard Layer 2 (Pass)
//Storyboard Layer 3 (Foreground)
//Storyboard Layer 4 (Overlay)
//Storyboard Sound Samples
`