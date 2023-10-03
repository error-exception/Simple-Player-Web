import {Vector2} from "./webgl/core/Vector2";
import {NoteData} from "./webgl/mania/ManiaPanel";

export interface OSUFile {
    General?: OSUFileGeneral
    Metadata?: OSUFileMetadata
    TimingPoints?: OSUFileTimingPoints
    NoteData?: NoteData[][]
    Events?: OSUEvent
    HitObjects?: OSUFileHitObjects
}

export interface OSUFileGeneral {
    AudioFilename: string
    Mode: number
    PreviewTime: number
}

export interface OSUFileMetadata {
    Title: string
    TitleUnicode: string
    Artist: string
    ArtistUnicode: string
    Version: string
    BeatmapID: string
}

export interface OSUFileTimingPoints {
    offset: number
    beatGap: number
    timingList: OSUFileTimingPointsItem[]
}

export interface OSUFileTimingPointsItem {
    isKiai: boolean
    offset: number
}

export interface OSUEvent {
    imageBackground?: string
    videoBackground?: string
}

export interface OSUFileHitObjects {
    stdNotes: OSUStdNote[]
}

export interface OSUStdNote {
    x: number
    y: number
    startTime: number
    type: number
}

export interface OSUStdNoteCircle extends OSUStdNote {}

export interface OSUStdNoteSlide extends OSUStdNote {
    slideType: string,
    controlPoints: Vector2[]
    slideCount: number
    slideLength: number
}

export interface OSUStdNoteSpinner extends OSUStdNote {
    endTime: number
}

export function isStdCircle(stdNote: OSUStdNote): stdNote is OSUStdNoteCircle {
    return (stdNote.type & 1) === 1
}

export function isStdSlider(stdNote: OSUStdNote): stdNote is OSUStdNoteSlide {
    return (stdNote.type & 2) === 2
}

export function isStdSpinner(stdNote: OSUStdNote): stdNote is OSUStdNoteSpinner {
    return ((stdNote.type >> 7) & 0b10) === 2
}