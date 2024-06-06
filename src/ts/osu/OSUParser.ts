import {NoteData} from '../webgl/screen/mania/ManiaPanel';
import {OSUFile, OSUFileGeneral, OSUFileMetadata, OSUFileTimingPoints} from "./OSUFile";
import {OSBParser} from "./OSBParser";

export class OSUParser {

  private static readonly hitObject = "[HitObjects]"
  private static readonly general = "[General]"
  private static readonly metadata = "[Metadata]"
  private static readonly timingPoints = "[TimingPoints]"
  private static readonly events = "[Events]"

  public static parse(textContent: string): OSUFile {
    const osuFile: OSUFile = {}
    const lines = textContent.split("\n").map(v => v.trimEnd())
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (line === this.hitObject && osuFile.General) {
        if (osuFile.General.Mode === 3) {
          this.parseMania(lines, i + 1, osuFile)
        }
      } else if (line === this.general) {
        this.parseGeneral(lines, i + 1, osuFile)
      } else if (line === this.metadata) {
        this.parseMetadata(lines, i + 1, osuFile)
      } else if (line === this.timingPoints) {
        this.parseTimingPoints(lines, i + 1, osuFile)
      } else if (line === this.events) {
        this.parseEvents(lines, i + 1, osuFile)
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

  // track, none, startTime, none, none, endTime
  private static parseMania(lines: string[], index: number, out: OSUFile) {
    let i = index
    const tracks: NoteData[][] = []
    while (lines[i] && lines[i].length > 0 && lines[i].charAt(0) !== '[') {
      const line = lines[i++]
      const [track, _1, startTime, _2, _3, endTime] = line.split(",")
      const trackNumber = parseInt(track)
      const startTimeNumber = parseInt(startTime)
      const endTimeNumber = parseInt(endTime)
      let trackIndex = 0
      if (trackNumber === 64)
        trackIndex = 0
      else if (trackNumber === 192)
        trackIndex = 1
      else if (trackNumber === 320)
        trackIndex = 2
      else if (trackNumber === 448)
        trackIndex = 3
      let list = tracks[trackIndex]
      if (!list) {
        list = []
        tracks[trackIndex] = list
      }
      list.push({
        noteIndex: 0,
        startTime: startTimeNumber,
        endTime: endTimeNumber
      })
    }
    for (let j = 0; j < tracks.length; j++) {
      for (let k = 0; k < tracks[j].length; k++) {
        tracks[j][k].noteIndex = k
      }
    }
    out.NoteData = tracks
  }

  private static parseGeneral(lines: string[], index: number, out: OSUFile) {
    let i = index
    const general: OSUFileGeneral = {
      AudioFilename: "",
      PreviewTime: 0,
      Mode: 3
    }
    while (lines[i].length > 0 && lines[i].charAt(0) !== '[') {
      const [ key, value ] = lines[i++].split(':').map(v => v.trim())
      if (key === "AudioFilename") {
        general.AudioFilename = value.toLowerCase()
      } else if (key === "PreviewTime") {
        general.PreviewTime = parseInt(value)
      } else if (key === "Mode") {
        general.Mode = parseInt(value)
      }
    }
    out.General = general
  }

  private static parseMetadata(lines: string[], index: number, out: OSUFile) {
    let i = index
    const metadata: OSUFileMetadata = { Title: '', TitleUnicode: '', Artist: '', ArtistUnicode: '', Version: '', BeatmapID: '-1' }
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
}