import {Vector2} from "../webgl/core/Vector2";
// import {NoteData} from "../webgl/screen/mania/ManiaPanel";
import {Ease, EventType, LoopType, StoryLayer, StoryOrigin} from "../webgl/screen/story/StoryType";
import {Color} from "../webgl/base/Color";

export interface OSUFile {
    name: string
    General?: OSUFileGeneral
    Metadata?: OSUFileMetadata
    TimingPoints?: OSUFileTimingPoints
    Difficulty?: OSUFileDifficulty
    // NoteData?: NoteData[][]
    Events?: OSUEvent
    // HitObjects?: OSUFileHitObjects
}

export interface OSUFileGeneral {
    AudioFilename: string
    AudioLeadIn: number
    Mode: number
    PreviewTime: number
    Countdown: number
    SampleSet: string
    StackLeniency: number
    EpilepsyWarning: boolean
    WidescreenStoryboard: boolean
    LetterboxInBreaks: boolean
    SpecialStyle: boolean
}

export interface OSUFileMetadata {
    Title: string
    TitleUnicode: string
    Artist: string
    ArtistUnicode: string
    Creator: string
    Version: string
    Source: string
    BeatmapID: string
    Tags: string
    BeatmapSetID: string
}

export interface OSUFileDifficulty {
    HPDrainRate: number
    CircleSize: number
    OverallDifficulty: number
    ApproachRate: number
    SliderMultiplier: number
    SliderTickRate: number
}

export interface OSUFileTimingPoints {
    timingList: OSUFileTimingPointsItem[]
}

export interface OSUFileTimingPointsItem {
    isKiai: boolean
    time: number
    beatLength: number
}

export interface OSUEvent {
    imageBackground?: string
    videoBackground?: string
    /**
     * @deprecated
     */
    imageSource?: Blob
    /**
     * @deprecated
     */
    videoSource?: Blob
    videoOffset?: number
    storyboard?: OSBFile
}

export interface OSUFileHitObjects {

}

export interface OSBFile {
    sprites: OSBSprite[]
}

export interface OSBSprite {
    layer: StoryLayer
    x: number
    y: number
    filePath: string
    origin: StoryOrigin
    events: OSBEvent[]
}

export interface OSBAnimation extends OSBSprite {
    frameCount: number
    frameDelay: number
    loopType: LoopType
}

export function isAnimation(sprite: OSBSprite): sprite is OSBAnimation {
    return "frameCount" in sprite && "frameDelay" in sprite && "loopType" in sprite
}

export interface OSBEvent {
    type: EventType
    startTime: number
}

export interface OSBBaseEvent extends OSBEvent {
    ease: Ease
    endTime: number
}

export interface OSBVectorEvent extends OSBBaseEvent {
    from: Vector2
    to: Vector2
}

export interface OSBValueEvent extends OSBBaseEvent {
    from: number
    to: number
}

export interface OSBColorEvent extends OSBBaseEvent {
    from: Color
    to: Color
}

export interface OSBLoopEvent extends OSBEvent {
    loopCount: number
    children: OSBBaseEvent[]
}

export interface OSBParamEvent extends OSBBaseEvent {
    p: string
}

export function isColorEvent(event: any): event is OSBColorEvent {
    return event.type === "C"
}

export function isValueEvent(event: any): event is OSBValueEvent {
    return event.type === "F" ||
      event.type === "MX" ||
      event.type === "MY" ||
      event.type === "S" ||
      event.type === "R" ||
      event.type === "F"
}

export function isVectorEvent(event: any): event is OSBVectorEvent {
    return event.type === "M" ||
      event.type === "V"
}
export function isLoopEvent(event: any): event is OSBLoopEvent {
    return event.type === "L"
}
export function isParamEvent(event: any): event is OSBParamEvent {
    return event.type === "P"
}