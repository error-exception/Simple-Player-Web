import {OSUFile, type OSUFileDifficulty, OSUFileGeneral, OSUFileMetadata, OSUFileTimingPoints} from "./OSUFile";
import {OSBParser} from "./OSBParser";

export class OSUParser {

  private static readonly general = "[General]"
  private static readonly metadata = "[Metadata]"
  private static readonly timingPoints = "[TimingPoints]"
  private static readonly events = "[Events]"
  private static readonly difficulty = "[Difficulty]"

  public static parse(textContent: string, osuFilename: string): OSUFile {
    const osuFile: OSUFile = { name: osuFilename }
    const lines = textContent.split("\n").map(v => v.trimEnd())
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (line === this.general) {
        this.parseGeneral(lines, i + 1, osuFile)
      } else if (line === this.metadata) {
        this.parseMetadata(lines, i + 1, osuFile)
      } else if (line === this.timingPoints) {
        this.parseTimingPoints(lines, i + 1, osuFile)
      } else if (line === this.events) {
        this.parseEvents(lines, i + 1, osuFile)
      } else if (line === this.difficulty) {
        this.parseDifficulty(lines, i + 1, osuFile)
      }
    }
    return osuFile
  }

  private static parseEvents(lines: string[], index: number, out: OSUFile) {
    let i = index, hasStoryboard = false
    out.Events = {}
    const storyLines: string[] = [
      '[Events]'
    ]
    while (lines[i].length > 0 && lines[i].charAt(0) !== '[') {
      const line = lines[i++]
      if (line.startsWith("Video")) {
        let firstIndex = line.indexOf('"');
        let lastIndex = line.lastIndexOf('"');
        if (firstIndex >= 0 && lastIndex > 0) {
          out.Events.videoBackground = line.substring(firstIndex + 1, lastIndex).toLowerCase()
        }
        firstIndex = line.indexOf(',')
        lastIndex = line.indexOf(',', firstIndex + 1)
        if (firstIndex >= 0 && lastIndex > 0) {
          try {
            out.Events.videoOffset = parseInt(line.substring(firstIndex + 1, lastIndex).trim())
          } catch (_) {
            out.Events.videoOffset = 0
          }
        }
      } else if (line.startsWith('0,0')) {
        const firstIndex = line.indexOf('"')
        const lastIndex = line.lastIndexOf('"')
        if (firstIndex >= 0 && lastIndex > 0) {
          out.Events.imageBackground = line.substring(firstIndex + 1, lastIndex).toLowerCase()
        }
      } else if (hasStoryboard) {
        storyLines.push(line)
      } else if (line.startsWith('Sprite') || line.startsWith('Animation')) {
        hasStoryboard = true
        storyLines.push(line)
      }
    }
    out.Events.storyboard = OSBParser.parse(storyLines.join('\n'))
  }

  private static parseGeneral(lines: string[], index: number, out: OSUFile) {
    let i = index
    const general: OSUFileGeneral = {
      AudioFilename: "",
      PreviewTime: 0,
      Mode: 3,
      AudioLeadIn: 0,
      Countdown: 0,
      SampleSet: "",
      StackLeniency: 0,
      SpecialStyle: false,
      WidescreenStoryboard: false,
      LetterboxInBreaks: false,
      EpilepsyWarning: false,
    }
    while (lines[i].length > 0 && lines[i].charAt(0) !== '[') {
      const [ key, value ] = lines[i++].split(':').map(v => v.trim())
      if (key === "AudioFilename") {
        general.AudioFilename = value.toLowerCase()
      } else if (key === "PreviewTime") {
        general.PreviewTime = parseInt(value)
      } else if (key === "Mode") {
        general.Mode = parseInt(value)
      } else if (key === "AudioLeadIn") {
        general.AudioLeadIn = parseInt(value)
      } else if (key === "Countdown") {
        general.Countdown = parseInt(value)
      } else if (key === "SampleSet") {
        general.SampleSet = value
      } else if (key === 'StackLeniency') {
        general.StackLeniency = parseFloat(value)
      } else if (key === 'EpilepsyWarning') {
        general.EpilepsyWarning = value === '1'
      } else if (key === 'SpecialStyle') {
        general.SpecialStyle = value === '1'
      } else if (key === 'WidescreenStoryboard') {
        general.WidescreenStoryboard = value === '1'
      } else if (key === 'LetterboxInBreaks') {
        general.LetterboxInBreaks = value === '1'
      }
    }
    out.General = general
  }

  private static parseMetadata(lines: string[], index: number, out: OSUFile) {
    let i = index
    const metadata: OSUFileMetadata = {
      Title: '',
      TitleUnicode: '',
      Artist: '',
      ArtistUnicode: '',
      Version: '',
      BeatmapID: '-1',
      BeatmapSetID: '',
      Tags: '',
      Source: '',
      Creator: ''
    }
    while (lines[i].length > 0 && lines[i].charAt(0) !== '[') {
      const [ key, value ] = lines[i++].split(':').map(v => v.trim())
      if (key === "Title") {
        metadata.Title = value
      } else if (key === "TitleUnicode") {
        metadata.TitleUnicode = value
      } else if (key === "Artist") {
        metadata.Artist = value
      } else if (key === "ArtistUnicode") {
        metadata.ArtistUnicode = value
      } else if (key === "Version") {
        metadata.Version = value
      } else if (key === 'Creator') {
        metadata.Creator = value
      } else if (key === 'Source') {
        metadata.Source = value
      } else if (key === 'BeatmapID') {
        metadata.BeatmapID = value
      } else if (key === 'BeatmapSetID') {
        metadata.BeatmapSetID = value
      } else if (key === 'Tags') {
        metadata.Tags = value
      }
    }
    out.Metadata = metadata
  }

  private static parseTimingPoints(lines: string[], index: number, out: OSUFile) {
    let i = index
    const timingPoints: OSUFileTimingPoints = {
      timingList: []
    }
    while (lines[i].length > 0 && lines[i].charAt(0) !== '[') {
      const [time, beatLength, _1, _2, _3, _4, _5, isKiai] = lines[i++].split(",").map(v => v.trim())
      timingPoints.timingList.push({
        time: parseInt(time),
        beatLength: parseFloat(beatLength),
        isKiai: isKiai === '1'
      })
    }
    out.TimingPoints = timingPoints
  }

  private static parseDifficulty(lines: string[], index: number, out: OSUFile) {
    let i = index
    const difficulty: OSUFileDifficulty = {
      HPDrainRate: 0,
      OverallDifficulty: 0,
      SliderMultiplier: 0,
      SliderTickRate: 0,
      CircleSize: 0,
      ApproachRate: 0
    }
    while (lines[i].length > 0 && lines[i].charAt(0) !== '[') {
      const [ key, value ] = lines[i++].split(':').map(v => v.trim())
      if (key === 'HPDrainRate') {
        difficulty.HPDrainRate = parseFloat(value)
      } else if (key === 'OverallDifficulty') {
        difficulty.OverallDifficulty = parseFloat(value)
      } else if (key === 'SliderMultiplier') {
        difficulty.SliderMultiplier = parseFloat(value)
      } else if (key === 'SliderTickRate') {
        difficulty.SliderTickRate = parseFloat(value)
      } else if (key === 'CircleSize') {
        difficulty.CircleSize = parseFloat(value)
      } else if (key === 'ApproachRate') {
        difficulty.ApproachRate = parseFloat(value)
      }
    }
    out.Difficulty = difficulty
  }
}