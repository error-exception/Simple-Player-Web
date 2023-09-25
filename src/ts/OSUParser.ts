import { NoteData } from './webgl/mania/ManiaPanel';
import {OSUFile, OSUFileGeneral, OSUFileMetadata, OSUFileTimingPoints, OSUStdNote, isStdSpinner} from "./OSUFile";
import { type } from './webgl/Viewport';

export class OSUParser {

    private static hitObject = "[HitObjects]"
    private static general = "[General]"
    private static metadata = "[Metadata]"
    private static timingPoints = "[TimingPoints]"
    private static events = "[Events]"

    public static parse(textContent: string): OSUFile {
        const osuFile: OSUFile = {}
        const lines = textContent.split("\n").map(v => v.trim())
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i]
            if (line === this.hitObject && osuFile.General) {
                if (osuFile.General.Mode === 3) {
                    this.parseMania(lines, i + 1, osuFile)
                } else if (osuFile.General.Mode === 0) {
                    this.parseStd(lines, i + 1, osuFile)
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
        let i = index
        out.Events = {}
        while (lines[i].length > 0 && lines[i].charAt(0) !== '[') {
            const line = lines[i++]
            if (line.startsWith("Video")) {
                const firstIndex = line.indexOf('"');
                const lastIndex = line.lastIndexOf('"');
                if (firstIndex >= 0 && lastIndex > 0) {
                    out.Events.videoBackground = line.substring(firstIndex + 1, lastIndex)
                }
            } else if (line.startsWith('0,0')) {
                const firstIndex = line.indexOf('"')
                const lastIndex = line.lastIndexOf('"')
                if (firstIndex >= 0 && lastIndex > 0) {
                    out.Events.imageBackground = line.substring(firstIndex + 1, lastIndex)
                }
            }
        }
    }

    // track, none, startTime, none, none, endTime
    private static parseMania(lines: string[], index: number, out: OSUFile) {
        let i = index
        const tracks: NoteData[][] = []
        while (lines[i].length > 0 && lines[i].charAt(0) !== '[') {
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

    private static parseStd(lines: string[], index: number, out: OSUFile) {
        let i = index
        const stdNotes: OSUStdNote[] = []
        while (lines[i].length > 0 && lines[i].charAt(0) !== '[') {
            const line = lines[i++]
            const [x, y, startTime, objectType] = line.split(",")
            const note: OSUStdNote = {
                x: parseInt(x),
                y: parseInt(y),
                type: parseInt(objectType),
                startTime: parseInt(startTime)
            }
            stdNotes.push(note)
        }
        out.HitObjects = {
            stdNotes
        }
        console.log(stdNotes)
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
                general.AudioFilename = value
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
            offset: 0,
            beatGap: 200,
            timingList: []
        }
        let lineIndex = 0
        while (lines[i].length > 0 && lines[i].charAt(0) !== '[') {
            if (lineIndex === 0) {
                const [offset, beatGap] = lines[i++]
                    .split(",")
                    .map((v) => v.trim());
                const offsetNumber = parseInt(offset);
                const beatGapNumber = parseFloat(beatGap);
                timingPoints.beatGap = beatGapNumber;
                timingPoints.offset = offsetNumber;
            } else {
                const [offset, _0, _1, _2, _3, _4, _5, isKiai] = lines[i++].split(',').map(s => {
                    return parseInt(s.trim());
                })
                timingPoints.timingList.push({
                    offset, isKiai: isKiai === 1
                })
            }
            lineIndex++
        }
        out.TimingPoints = timingPoints
    }
}
