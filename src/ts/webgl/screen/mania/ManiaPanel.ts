import noteEffect from "../../../../assets/soft-hitwhistle.wav"
import {OSUParser} from "../../../osu/OSUParser"
import {Score} from "../../../Score"
import {Time} from "../../../global/Time"
import {clamp, int} from "../../../Utils"
import AudioPlayer from "../../../player/AudioPlayer"
import {ease, easeOut} from "../../../util/Easing"
import {Color} from "../../base/Color"
import Coordinate from "../../base/Coordinate"
import {Drawable} from "../../drawable/Drawable"
import {Shape2D} from "../../util/Shape2D"
import {ObjectTransition} from "../../transition/Transition"
import {Shader} from "../../core/Shader"
import {Vector2} from "../../core/Vector2"
import {VertexArray} from "../../core/VertexArray"
import {VertexBuffer} from "../../core/VertexBuffer"
import {VertexBufferLayout} from "../../core/VertexBufferLayout"

const vertexShader = `
    attribute vec2 a_position;
    attribute vec4 a_color;
//    attribute vec2 a_tex_coord;
    
//    varying mediump vec2 v_tex_coord;
    varying mediump vec4 v_color;
    
//    uniform mat4 u_transform;
    uniform mat4 u_orth;
    
    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0) * u_orth;
//        v_tex_coord = a_tex_coord;
        v_color = a_color;
    }
`

const fragmentShader = `
//    varying mediump vec2 v_tex_coord;
//    uniform sampler2D u_sampler;
    varying mediump vec4 v_color;
    void main() {
//        mediump vec4 texelColor = texture2D(u_sampler, v_tex_coord);
//        gl_FragColor = texelColor;
//         gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        gl_FragColor = v_color;
    }
`

const yellow = Color.fromHex(0xffff00)
const green = Color.fromHex(0x00ff00)
const red = Color.fromHex(0xff0000)
const purple = Color.fromHex(0xff00ff)

export class ManiaPanel extends Drawable {

    private trackCount = 4
    private tracks: ManiaTrack[] = []
    private keys = ['KeyS', 'KeyD', 'KeyJ', 'KeyK']
    private keyState = [false, false, false, false]
    private judgementLinePosition = 80 // from top to bottom, percent


    private readonly vertexArray: VertexArray
    private readonly vertexBuffer: VertexBuffer
    private readonly shader: Shader
    private readonly layout: VertexBufferLayout

    private songProgress = new SongProgress()

    private onKeyDown = (e: KeyboardEvent) => {
        const index = this.keys.indexOf(e.code)
        if (index < 0 || index >= this.tracks.length)
            return
        if (!this.keyState[index]) {
            this.keyState[index] = true
            this.tracks[index].hit()
        }
    }

    constructor(
        gl: WebGL2RenderingContext, 
        private offsetLeft = 800,
        private trackWidth = 120,
        private trackGap = 12,
        noteData: NoteData[][]
    ) {
        super(gl, {
            size: [trackWidth * 4 + trackGap * 5 + 20, 'fill-parent']
        });
        window.addEventListener('keydown', this.onKeyDown, {
            passive: true
        })
        window.addEventListener('keyup', (e) => {
            const index = this.keys.indexOf(e.code)
            if (index < 0 || index >= this.tracks.length)
                return
            this.tracks[index].hitUp()
            this.keyState[index] = false
        })

        const vertexArray = new VertexArray(gl)
        vertexArray.bind()
        const vertexBuffer = new VertexBuffer(gl, null, gl.STREAM_DRAW)
        const layout = new VertexBufferLayout(gl)
        const shader = new Shader(gl, vertexShader, fragmentShader)

        vertexBuffer.bind()
        shader.bind()

        layout.pushFloat(shader.getAttributeLocation("a_position"), 2)
        layout.pushFloat(shader.getAttributeLocation("a_color"), 4)
        vertexArray.addBuffer(vertexBuffer, layout)

        vertexArray.unbind()
        vertexBuffer.unbind()
        shader.unbind()

        this.vertexBuffer = vertexBuffer
        this.layout = layout
        this.shader = shader
        this.vertexArray = vertexArray
        this.offsetLeft = this.position.x + 10 + this.trackGap
        let currentOffsetLeft = this.offsetLeft
        const colors = [yellow, green, red, purple]
        for (let i = 0; i < this.trackCount; i++) {
            const track = new ManiaTrack(
                noteData[i],
                this.judgementLinePosition,
                350,
                currentOffsetLeft,
                this.trackWidth,
                colors[i],
                this
            )
            currentOffsetLeft += this.trackWidth + this.trackGap
            this.tracks.push(track)
        }
        // console.log(this.tracks)
    }

    private vertexData = new Float32Array()
    private vertexArrayData: number[] = []
    private vertexCount = 0

    public bind() {
        this.vertexArray.bind()
        this.vertexBuffer.bind()
        this.shader.bind()
    }

    protected onUpdate() {
        super.onUpdate()
        for (let i = 0; i < this.tracks.length; i++) {
            this.tracks[i].update()
        }
        this.songProgress.update()
        this.vertexArrayData = []
        // const { x, y } = this.position
        let offset = 0
        // left edge
        // Shape2D.quad(
        //     x, y,
        //     x + 10, y - this.height,
        //     this.vertexArrayData,
        //     offset,
        //     6
        // )
        // Shape2D.color(
        //     1, 1, 1, 1,
        //     1, 1, 1, 1,
        //     1, 1, 1, 1,
        //     1, 1, 1, 1,
        //     this.vertexArrayData,
        //     offset + 2,
        //     6
        // )
        // offset += 36

        for (let i = 0; i < this.tracks.length; i++) {
            offset += this.tracks[i].copyTo(this.vertexArrayData, offset)
        }
        // right edge
        // Shape2D.quad(
        //     x + 10 + this.trackWidth * this.trackCount + this.trackGap * (this.trackCount + 1), y,
        //     x + 20 + this.trackWidth * this.trackCount + this.trackGap * (this.trackCount + 1), y - this.height,
        //     this.vertexArrayData,
        //     offset,
        //     6
        // )
        // Shape2D.color(
        //     1, 1, 1, 1,
        //     1, 1, 1, 1,
        //     1, 1, 1, 1,
        //     1, 1, 1, 1,
        //     this.vertexArrayData,
        //     offset + 2,
        //     6
        // )
        // offset += 36
        // judgementLine
        // Shape2D.quad(
        //     x + 10,
        //     y - this.height * (this.judgementLinePosition / 100),
        //     x + 10 + this.trackWidth * (this.trackCount) + this.trackGap * (this.trackCount + 1),
        //     y - this.height * (this.judgementLinePosition / 100) - 10,
        //     // -1 + Coordinate.glXLength(this.offsetLeft - 10), 1 - 2 * (this.judgementLinePosition / 100),
        //     // -1 + Coordinate.glXLength(this.offsetLeft + this.trackWidth * this.trackCount + this.trackGap * (this.trackCount) + 10), 1 - 2 * (this.judgementLinePosition / 100) - Coordinate.glYLength(10),
        //     this.vertexArrayData,
        //     offset,
        //     6
        // )
        // Shape2D.color(
        //     1, 1, 1, 1,
        //     1, 1, 1, 1,
        //     1, 1, 1, 1,
        //     1, 1, 1, 1,
        //     this.vertexArrayData,
        //     offset + 2,
        //     6
        // )
        // offset += 36
        // offset += this.songProgress.copyTo(this.vertexArrayData, offset, 6)
        this.vertexData = new Float32Array(this.vertexArrayData)
        this.vertexCount = int(this.vertexArrayData.length / 6)
    }

    public unbind() {
        this.vertexArray.unbind()
        this.vertexBuffer.unbind()
        this.shader.unbind()
    }

    public onDraw() {
        const gl = this.gl
        this.shader.setUniformMatrix4fv('u_orth', Coordinate.orthographicProjectionMatrix4)
        this.vertexBuffer.setBufferData(this.vertexData)
        this.vertexArray.addBuffer(this.vertexBuffer, this.layout)
        gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount)
    }

    public dispose() {
        super.dispose();
        window.removeEventListener("keydown", this.onKeyDown)
    }

}

const key = new Audio(noteEffect)
key.load()

class ManiaTrack {

    private noteList: Note[] = []
    private isFinish = false
    private alpha = 0

    private fadeTransition = new ObjectTransition(this, 'alpha')
    constructor(
        noteDataList: NoteData[], // sorted by start time
        private judgementLinePosition: number,
        private movementDuration: number, // 运动时间
        private offsetLeft: number,
        private trackWidth: number,
        private mainColor: Color,
        private panel: ManiaPanel
    ) {
        // this.updateNoteQueue(0)
        for (let i = 0; i < noteDataList.length; i++) {
            const note = new Note(
                panel,
                this.trackWidth,
                12,
                this.offsetLeft,
                this.movementDuration,
                this.judgementLinePosition,
                this.mainColor,
                noteDataList[i],
                (isHold, isHoldEnd) => {
                    if (isHold) {
                        if (isHoldEnd) {
                            this.fadeBegin()
                              .transitionTo(0, 200, ease)
                        } else {
                            this.fadeBegin()
                              .transitionTo(0.3, 60, easeOut)
                        }
                    } else {
                        this.fadeBegin()
                          .transitionTo(0.3, 60, easeOut)
                          .transitionTo(0, 200, ease)
                    }

                }
            )
            this.noteList.push(note)
        }
    }

    private fadeBegin(time = Time.currentTime) {
        this.fadeTransition.setStartTime(time)
        return this.fadeTransition
    }

    public update() {
        if (this.isFinish) {
            return
        }
        this.fadeTransition.update(Time.currentTime)
        const currentTime = AudioPlayer.currentTime()
        this.updateNoteQueue(currentTime)
    }

    private updateNoteQueue(startTime: number) {
        // const endTime = startTime + this.movementDuration
        const noteList = this.noteList
        // const noteDataList = this.noteDataList
        for (let i = 0; i < noteList.length; i++) {
            noteList[i].update()
        }
    }

    public hit() {
        const noteList = this.noteList
        this.alpha = .3
        key.play()
        for (let i = 0; i < noteList.length; i++) {
            if (noteList[i].hit()) {
                return
            }
        }
    }

    public hitUp() {
        this.alpha = 0
    }

    public copyTo(out: number[], offset: number): number {
        const noteList = this.noteList
        const currentTime = AudioPlayer.currentTime()
        const endTime = currentTime + this.movementDuration

        const { red, green, blue } = this.mainColor

        // track bg
        Shape2D.quad(
          this.offsetLeft, Coordinate.height / 2,
          this.offsetLeft + this.trackWidth,
          // this.panel.position.y - this.panel.height * (this.judgementLinePosition / 100),
          -this.panel.height / 2,
          out, offset, 6
        )
        const brightness = 0.8
        Shape2D.color(
          clamp(red - brightness, 0, 1), clamp(green - brightness, 0, 1), clamp(blue - brightness, 0, 1), 1,
          clamp(red - brightness, 0, 1), clamp(green - brightness, 0, 1), clamp(blue - brightness, 0, 1), 1,
          clamp(red - brightness, 0, 1), clamp(green - brightness, 0, 1), clamp(blue - brightness, 0, 1), 1,
          clamp(red - brightness, 0, 1), clamp(green - brightness, 0, 1), clamp(blue - brightness, 0, 1), 1,
          out, offset + 2, 6
        )

        let currentOffset = offset + 36
        // hit
        Shape2D.quad(
            this.offsetLeft, Coordinate.height / 2 * 0.4,
            this.offsetLeft + this.trackWidth, 
            this.panel.position.y - this.panel.height * (this.judgementLinePosition / 100),
            out, currentOffset, 6
        )
        Shape2D.color(
            0, 0, 0, 0,
            red, green, blue, this.alpha,
            0, 0, 0, 0,
            red, green, blue, this.alpha,
            out, currentOffset + 2, 6
        )

        currentOffset += 36

        // 画 key 座
        Shape2D.quad(
            this.offsetLeft,
            this.panel.position.y - (this.judgementLinePosition / 100) * this.panel.height,
            this.offsetLeft + this.trackWidth,
            -this.panel.height / 2,
            out, currentOffset, 6
        )
        const stageAlpha = Math.min(
          this.alpha, 1
        )
        Shape2D.color(
          red, green, blue, stageAlpha,
          red, green, blue, stageAlpha,
          red, green, blue, stageAlpha,
          red, green, blue, stageAlpha,
          out, currentOffset + 2, 6
        )

        currentOffset += 36


        for (let i = 0; i < noteList.length; i++) {
            const data = noteList[i].noteData
            if (data.startTime > endTime) {
                continue
            }
            if (data.endTime > 0 && data.endTime < currentTime) {
                continue
            }
            if (data.startTime < currentTime && data.endTime === 0) {
                continue
            }
            currentOffset += noteList[i].copyTo(out, currentOffset, 6)
        }
        // 判定线
        Shape2D.quad(
          this.offsetLeft,
          this.panel.position.y - (this.judgementLinePosition / 100) * this.panel.height,
          this.offsetLeft + this.trackWidth,
          this.panel.position.y - (this.judgementLinePosition / 100) * this.panel.height + 5,
          out, currentOffset, 6
        )
        Shape2D.color(
          1, 1, 1, 1,
          1, 1, 1, 1,
          1, 1, 1, 1,
          1, 1, 1, 1,
          out, currentOffset + 2, 6
        )
        currentOffset += 36
        return currentOffset
    }

}

class Note {
    public static readonly JUDGE_NONE = -1;
    public static readonly JUDGE_MISS = 0;
    public static readonly JUDGE_BAD = 1;
    public static readonly JUDGE_GOOD = 2;
    public static readonly JUDGE_PERFECT = 3;

    public static readonly VERTEX_COUNT = 6;
    public judgeResult = Note.JUDGE_NONE;

    public position = Vector2.newZero();
    public topLeft = Vector2.newZero();
    public bottomRight = Vector2.newZero();

    constructor(
        private panel: ManiaPanel,
        noteWidth: number,
        private noteHeight: number,
        offsetLeft: number,
        private movementDuration: number,
        private judgementLinePosition: number,
        color: Color,
        public noteData: NoteData,
        public onNoteReceive: (isHold: boolean, isHoldEnd: boolean) => void
    ) {
        this.color = color
        this.position.x = offsetLeft;
        this.position.y = panel.height / 2;
        const topLeft = this.topLeft;
        const bottomRight = this.bottomRight;
        topLeft.x = this.position.x;
        topLeft.y = this.position.y;
        bottomRight.x = this.position.x + noteWidth;
        bottomRight.y = this.position.y - noteHeight;
    }

    public update() {
        const currentTime = AudioPlayer.currentTime();
        const endTime = currentTime + this.movementDuration;
        if (this.startTime > endTime) {
            return;
        }
        this.autoHit()
        this.updateVertex()
        if (this.judgeResult >= 0) {
            return;
        }
        const diffTime = this.startTime - currentTime;
        if (diffTime <= -120 && this.judgeResult === Note.JUDGE_NONE) {
            this.judgeResult = Note.JUDGE_MISS;
            Score.miss.value++;
            // EventDispatcher.fireOnManiaHit(++count)
        }
    }
    public updateVertex() {
        const currentTime = AudioPlayer.currentTime(); // 判定线处
        const noteArea = this.panel.height * (this.judgementLinePosition / 100);
        const endTime = currentTime + this.movementDuration; // 顶部
        const noteStartTime = this.noteData.startTime;
        const noteEndTime = this.noteData.endTime;
        const startPercent =
            (noteStartTime - currentTime) / (endTime - currentTime);
        const endPercent =
            (noteEndTime - currentTime) / (endTime - currentTime);
        const noteHeight = this.noteHeight;

        const panelTop = this.panel.height / 2;
        let topY = panelTop,
            bottomY = -this.panel.height / 2;
        if (noteEndTime > 0) {
            // hold
            if (noteEndTime > endTime) {
                topY = panelTop;
            } else if (endPercent < 0) {
                // finish hold
                // if (this.isHoldStart) {
                //     this.triggerNoteReceive(true, true)
                //     this.isHoldStart = false
                // }
                topY = panelTop - noteArea;
            } else {
                // holding
                // this.isHoldStart && this.triggerNoteReceive(true, false)
                topY = panelTop - (1 - endPercent) * noteArea;
            }
            if (startPercent < 0) {
                // if (!this.isHoldStart) {
                //     console.log('start hold')
                //     this.triggerNoteReceive(true, false)
                //     this.isHoldStart = true
                // }
                bottomY = panelTop - noteArea;
            } else {
                // start hold
                bottomY = panelTop - (1 - startPercent) * noteArea;
            }
        } else {
            // this.triggerNoteReceive(false, true, false)
            // note
            topY = panelTop - (1 - startPercent) * noteArea - noteHeight;
            bottomY = panelTop - (1 - startPercent) * noteArea;
        }

        this.position.y = bottomY;
        this.topLeft.y = topY;
        this.bottomRight.y = this.position.y;
    }

    private lastTrigger = [false, false]
    // @ts-ignore
    private triggerNoteReceive(isHold: boolean, isHoldEnd: boolean, check: boolean = true) {
        if (check && this.lastTrigger[0] === isHold && this.lastTrigger[1] === isHoldEnd) {
            return
        }
        this.lastTrigger[0] = isHold
        this.lastTrigger[1] = isHoldEnd
        this.onNoteReceive(isHold, isHoldEnd)
    }

    public hit() {
        // console.log('hit start', this.noteData)
        if (this.judgeResult !== Note.JUDGE_NONE) {
            return false;
        }
        // console.log('hit unjudge')
        const currentTime = AudioPlayer.currentTime();
        const endTime = currentTime + this.movementDuration;
        const data = this.noteData;
        if (data.startTime > endTime) {
            return false;
        }
        if (data.endTime > 0 && data.endTime < currentTime) {
            return false;
        }
        // console.log('hit start judge')
        const diffTime = this.startTime - currentTime;
        const absDiffTime = Math.abs(diffTime);
        if (absDiffTime <= 60) {
            this.judgeResult = Note.JUDGE_PERFECT;
            Score.perfect.value++;
        } else if (absDiffTime <= 80) {
            this.judgeResult = Note.JUDGE_GOOD;
            Score.good.value++;
        } else if (absDiffTime <= 100) {
            this.judgeResult = Note.JUDGE_BAD;
            Score.bad.value++;
        } else if (diffTime >= 120) {
            this.judgeResult = Note.JUDGE_MISS;
            Score.miss.value++;
        } else {
            return false;
        }
        // console.log('hit me')
        return true;
    }

    private autoHit() {
        // console.log('hit start', this.noteData)
        if (this.judgeResult !== Note.JUDGE_NONE) {
            return false;
        }
        // console.log('hit unjudge')
        const currentTime = AudioPlayer.currentTime();
        const endTime = currentTime + this.movementDuration;
        const data = this.noteData;
        if (data.startTime > endTime) {
            return false;
        }
        if (data.endTime > 0 && data.endTime < currentTime) {
            return false;
        }
        const diffTime = this.startTime - currentTime;
        const absDiffTime = Math.abs(diffTime);
        if (absDiffTime <= 60 || diffTime < 0) {
            this.judgeResult = Note.JUDGE_PERFECT;
            Score.perfect.value++;
            this.onNoteReceive(false, true)
        }
    }

    public get startTime() {
        return this.noteData.startTime;
    }
    private color = Color.fromHex(0x00ffff);
    public copyTo(out: number[], offset: number, stride: number) {
        // 12
        Shape2D.quadVector2(
            this.topLeft,
            this.bottomRight,
            out,
            offset,
            stride
        );
        // 24
        Shape2D.oneColor(this.color, out, offset + 2, stride);
        return 36;
    }
}

class SongProgress {

    private topLeft: Vector2 = Vector2.newZero()
    private bottomRight: Vector2 = Vector2.newZero()
    private color = Color.fromHex(0xffff00, 0x80)
    private height = 10

    public update() {
        const percent = AudioPlayer.currentTime() / AudioPlayer.duration()
        const height = Coordinate.glYLength(this.height)
        this.topLeft.set( -1, -1 + height)
        this.bottomRight.set(-1 + 2 * percent, -1)
    }

    public copyTo(out: number[], offset: number, stride: number) {
        Shape2D.quad(
            this.topLeft.x, this.topLeft.y,
            this.bottomRight.x, this.bottomRight.y,
            out,
            offset,
            stride
        )
        const r = this.color.red
        const g = this.color.green
        const b = this.color.blue
        const a = this.color.alpha
        Shape2D.color(
            r, g, b, a,
            r, g, b, a,
            r, g, b, a,
            r, g, b, a,
            out, offset + 2, stride
        )
        return 36
    }

}

export interface NoteData {

    noteIndex: number
    startTime: number
    endTime: number

}

var text = `osu file format v14

[General]
AudioFilename: audio.ogg
AudioLeadIn: 0
PreviewTime: 164959
Countdown: 0
SampleSet: None
StackLeniency: 0.7
Mode: 3
LetterboxInBreaks: 0
SpecialStyle: 0
WidescreenStoryboard: 1

[Editor]
Bookmarks: 120516
DistanceSpacing: 0.8
BeatDivisor: 3
GridSize: 32
TimelineZoom: 1.800001

[Metadata]
Title:Idol
TitleUnicode:アイドル
Artist:YOASOBI
ArtistUnicode:YOASOBI
Creator:Akasha-
Version:CS' Hard
Source:【推しの子】
Tags:【Oshi no Ko】Oshi no Ko her fans Their idol's children 星野 愛久愛海 瑠美衣 Hoshino Akuamarin Aquamarine Aqua アクア Ruby Rubii ai アイ Aidoru My Star 幾田りら ikuta lilas ikura ayase jpop j-pop pop rap anime japanese opening op Kuo Kyoka Critical_Star Mirsaaa
BeatmapID:4147032
BeatmapSetID:1982752

[Difficulty]
HPDrainRate:7.5
CircleSize:4
OverallDifficulty:7.5
ApproachRate:5
SliderMultiplier:1.4
SliderTickRate:1

[Events]
//Background and Video events
Video,-135,"video.mp4"
0,0,"BG2.jpg",0,0
//Break Periods
//Storyboard Layer 0 (Background)
//Storyboard Layer 1 (Fail)
//Storyboard Layer 2 (Pass)
//Storyboard Layer 3 (Foreground)
//Storyboard Layer 4 (Overlay)
//Storyboard Sound Samples
Sample,40274,0,"Tom1.wav",40
Sample,78045,0,"Tom2.wav",40

[TimingPoints]
335,361.44578313253,4,2,1,40,1,0
55274,-100,4,2,1,40,0,1
59973,-100,4,2,1,40,0,0
60334,-100,4,2,1,40,0,1
60425,-100,4,2,1,40,0,0
60696,-100,4,2,1,40,0,1
60786,-100,4,2,1,40,0,0
61057,-100,4,2,1,40,0,1
66479,-100,4,2,1,40,0,0
66841,-100,4,2,1,40,0,1
78407,-100,4,2,1,40,0,0
101539,-100,4,2,1,40,0,1
106238,-100,4,2,1,40,0,0
106600,-100,4,2,1,40,0,1
106690,-100,4,2,1,40,0,0
106961,-100,4,2,1,40,0,1
107051,-100,4,2,1,40,0,0
107322,-100,4,2,1,40,0,1
112563,-100,4,2,1,40,0,0
113106,-100,4,2,1,40,0,1
123949,400,4,2,1,40,1,1
123949,-90.0900900900901,4,2,1,40,0,1
124749,400,4,2,1,40,1,0
124749,-90.0900900900901,4,2,1,40,0,0
150349,379.746835443038,4,2,1,40,1,0
150349,-95.2380952380952,4,2,1,40,0,0
164779,361.44578313253,4,2,1,40,1,0
165501,361.44578313253,4,2,1,40,1,0
171284,-100,4,2,1,40,0,1
176705,-100,4,2,1,40,0,0
177067,-100,4,2,1,40,0,1
188633,-100,4,2,1,40,0,0


[HitObjects]
64,192,335,128,2,696:0:0:0:0:
192,192,335,1,0,0:0:0:0:
448,192,335,1,0,0:0:0:0:
448,192,515,1,0,0:0:0:0:
320,192,696,1,0,0:0:0:0:
192,192,786,1,0,0:0:0:0:
448,192,877,1,0,0:0:0:0:
320,192,967,1,0,0:0:0:0:
64,192,1057,1,8,0:0:0:0:
192,192,1057,1,0,0:0:0:0:
320,192,1238,1,0,0:0:0:0:
448,192,1419,1,0,0:0:0:0:
192,192,1600,1,0,0:0:0:0:
320,192,1690,1,0,0:0:0:0:
64,192,1780,1,0,0:0:0:0:
320,192,1961,1,0,0:0:0:0:
64,192,2142,1,2,0:0:0:0:
192,192,2142,1,0,0:0:0:0:
448,192,2142,128,0,2503:0:0:0:0:
64,192,2322,1,0,0:0:0:0:
320,192,2503,1,8,0:0:0:0:
64,192,2684,1,2,0:0:0:0:
192,192,2684,128,0,3045:0:0:0:0:
448,192,2684,1,0,0:0:0:0:
448,192,2865,1,0,0:0:0:0:
64,192,3045,1,0,0:0:0:0:
64,192,3226,1,2,0:0:0:0:
320,192,3226,1,0,0:0:0:0:
448,192,3226,128,0,3588:0:0:0:0:
64,192,3407,1,0,0:0:0:0:
192,192,3588,1,0,0:0:0:0:
320,192,3678,1,0,0:0:0:0:
64,192,3768,1,0,0:0:0:0:
192,192,3859,1,0,0:0:0:0:
320,192,3949,1,8,0:0:0:0:
448,192,3949,1,0,0:0:0:0:
192,192,4130,1,0,0:0:0:0:
64,192,4310,1,0,0:0:0:0:
320,192,4491,1,0,0:0:0:0:
192,192,4581,1,0,0:0:0:0:
448,192,4672,1,0,0:0:0:0:
192,192,4853,1,0,0:0:0:0:
320,192,4943,1,0,0:0:0:0:
64,192,5033,128,2,5395:0:0:0:0:
448,192,5033,1,0,0:0:0:0:
448,192,5214,1,0,0:0:0:0:
192,192,5395,1,8,0:0:0:0:
64,192,5575,1,2,0:0:0:0:
320,192,5575,128,0,5937:0:0:0:0:
448,192,5575,1,0,0:0:0:0:
64,192,5756,1,0,0:0:0:0:
448,192,5937,1,0,0:0:0:0:
64,192,6118,128,2,6479:0:0:0:0:
192,192,6118,1,0,0:0:0:0:
320,192,6118,1,0,0:0:0:0:
320,192,6298,1,0,0:0:0:0:
448,192,6479,1,0,0:0:0:0:
320,192,6569,1,0,0:0:0:0:
64,192,6660,1,0,0:0:0:0:
192,192,6750,1,0,0:0:0:0:
320,192,6841,1,8,0:0:0:0:
448,192,6841,1,0,0:0:0:0:
64,192,7021,1,0,0:0:0:0:
448,192,7202,1,0,0:0:0:0:
320,192,7383,1,0,0:0:0:0:
192,192,7473,1,0,0:0:0:0:
64,192,7563,1,0,0:0:0:0:
320,192,7744,1,0,0:0:0:0:
64,192,7925,128,2,8286:0:0:0:0:
192,192,7925,1,0,0:0:0:0:
448,192,7925,1,0,0:0:0:0:
448,192,8106,1,0,0:0:0:0:
192,192,8286,1,8,0:0:0:0:
64,192,8467,1,2,0:0:0:0:
320,192,8467,128,0,8828:0:0:0:0:
448,192,8467,1,0,0:0:0:0:
64,192,8648,1,0,0:0:0:0:
448,192,8828,1,0,0:0:0:0:
192,192,9009,1,2,0:0:0:0:
320,192,9009,1,0,0:0:0:0:
448,192,9009,128,0,9371:0:0:0:0:
192,192,9190,1,0,0:0:0:0:
64,192,9371,1,0,0:0:0:0:
192,192,9461,1,0,0:0:0:0:
448,192,9551,1,0,0:0:0:0:
320,192,9642,1,0,0:0:0:0:
64,192,9732,1,8,0:0:0:0:
192,192,9732,1,0,0:0:0:0:
448,192,9913,1,0,0:0:0:0:
64,192,10094,1,0,0:0:0:0:
192,192,10274,1,0,0:0:0:0:
320,192,10365,1,0,0:0:0:0:
448,192,10455,1,0,0:0:0:0:
320,192,10636,1,0,0:0:0:0:
192,192,10726,1,0,0:0:0:0:
64,192,10816,1,2,0:0:0:0:
448,192,10816,128,0,11178:0:0:0:0:
64,192,10997,1,0,0:0:0:0:
320,192,11178,1,8,0:0:0:0:
64,192,11359,1,2,0:0:0:0:
192,192,11359,128,0,11720:0:0:0:0:
448,192,11359,1,0,0:0:0:0:
448,192,11539,1,0,0:0:0:0:
64,192,11720,1,0,0:0:0:0:
64,192,11901,1,2,0:0:0:0:
320,192,11901,128,8,12081:0:0:0:0:
448,192,11901,128,0,12443:0:0:0:0:
192,192,12262,128,0,12443:0:0:0:0:
64,192,12624,128,2,12985:0:0:0:0:
320,192,12624,128,8,12804:0:0:0:0:
448,192,12624,1,0,0:0:0:0:
448,192,12985,128,0,13166:0:0:0:0:
64,192,13166,1,2,0:0:0:0:
192,192,13166,128,4,13437:0:0:0:0:
320,192,13166,1,8,0:0:0:0:
192,192,13527,1,2,0:0:0:0:
320,192,13527,128,8,13798:0:0:0:0:
448,192,13527,1,0,0:0:0:0:
64,192,13889,1,2,0:0:0:0:
192,192,13889,1,8,0:0:0:0:
448,192,13889,1,0,0:0:0:0:
64,192,14069,128,2,14431:0:0:0:0:
320,192,14069,1,8,0:0:0:0:
448,192,14069,128,0,14431:0:0:0:0:
192,192,14431,1,0,0:0:0:0:
320,192,14431,1,0,0:0:0:0:
64,192,14792,128,2,14973:0:0:0:0:
320,192,14792,1,4,0:0:0:0:
448,192,14792,1,0,0:0:0:0:
192,192,15154,128,0,15334:0:0:0:0:
320,192,15515,128,0,15696:0:0:0:0:
448,192,15877,128,0,16057:0:0:0:0:
64,192,16238,128,2,16419:0:0:0:0:
320,192,16600,128,0,16780:0:0:0:0:
192,192,16961,128,0,17142:0:0:0:0:
448,192,17322,128,0,17684:0:0:0:0:
64,192,17684,1,2,0:0:0:0:
192,192,17684,1,4,0:0:0:0:
320,192,17865,1,0,0:0:0:0:
64,192,18045,1,2,0:0:0:0:
448,192,18045,1,8,0:0:0:0:
192,192,18226,1,0,0:0:0:0:
64,192,18407,1,2,0:0:0:0:
320,192,18407,1,0,0:0:0:0:
192,192,18768,1,2,0:0:0:0:
448,192,18768,1,8,0:0:0:0:
64,192,18949,1,0,0:0:0:0:
320,192,19130,1,2,0:0:0:0:
448,192,19130,1,0,0:0:0:0:
192,192,19310,1,0,0:0:0:0:
64,192,19491,1,2,0:0:0:0:
448,192,19491,1,8,0:0:0:0:
320,192,19672,1,0,0:0:0:0:
64,192,19853,1,2,0:0:0:0:
192,192,19853,1,0,0:0:0:0:
64,192,20214,1,2,0:0:0:0:
448,192,20214,1,8,0:0:0:0:
320,192,20395,1,0,0:0:0:0:
64,192,20575,1,2,0:0:0:0:
192,192,20575,1,0,0:0:0:0:
192,192,20756,1,0,0:0:0:0:
64,192,20937,1,2,0:0:0:0:
448,192,20937,1,8,0:0:0:0:
448,192,21118,1,0,0:0:0:0:
64,192,21298,1,2,0:0:0:0:
320,192,21298,1,0,0:0:0:0:
64,192,21479,1,0,0:0:0:0:
192,192,21660,1,2,0:0:0:0:
448,192,21660,1,8,0:0:0:0:
448,192,21841,1,0,0:0:0:0:
64,192,22021,1,2,0:0:0:0:
192,192,22021,1,0,0:0:0:0:
320,192,22202,1,0,0:0:0:0:
64,192,22383,1,2,0:0:0:0:
448,192,22383,1,8,0:0:0:0:
192,192,22563,1,0,0:0:0:0:
320,192,22744,1,2,0:0:0:0:
448,192,22744,1,0,0:0:0:0:
64,192,23106,1,2,0:0:0:0:
320,192,23106,1,8,0:0:0:0:
192,192,23286,1,0,0:0:0:0:
64,192,23467,1,2,0:0:0:0:
192,192,23467,1,0,0:0:0:0:
448,192,23467,1,0,0:0:0:0:
320,192,23648,1,0,0:0:0:0:
64,192,23828,1,2,0:0:0:0:
448,192,23828,1,8,0:0:0:0:
192,192,24009,1,0,0:0:0:0:
320,192,24190,1,2,0:0:0:0:
448,192,24190,1,0,0:0:0:0:
64,192,24551,1,2,0:0:0:0:
320,192,24551,1,8,0:0:0:0:
192,192,24732,1,0,0:0:0:0:
64,192,24913,1,2,0:0:0:0:
448,192,24913,1,0,0:0:0:0:
320,192,25094,1,0,0:0:0:0:
192,192,25274,1,2,0:0:0:0:
448,192,25274,1,8,0:0:0:0:
64,192,25455,1,0,0:0:0:0:
320,192,25636,1,2,0:0:0:0:
448,192,25636,1,0,0:0:0:0:
64,192,25997,1,2,0:0:0:0:
320,192,25997,1,8,0:0:0:0:
448,192,26178,1,0,0:0:0:0:
64,192,26359,1,2,0:0:0:0:
192,192,26359,1,0,0:0:0:0:
192,192,26539,1,0,0:0:0:0:
64,192,26720,1,2,0:0:0:0:
448,192,26720,1,8,0:0:0:0:
448,192,26901,1,0,0:0:0:0:
64,192,27081,1,2,0:0:0:0:
320,192,27081,1,0,0:0:0:0:
64,192,27262,1,0,0:0:0:0:
192,192,27443,1,2,0:0:0:0:
448,192,27443,1,8,0:0:0:0:
192,192,27624,1,0,0:0:0:0:
64,192,27804,1,2,0:0:0:0:
448,192,27804,1,0,0:0:0:0:
320,192,27985,1,0,0:0:0:0:
64,192,28166,1,2,0:0:0:0:
192,192,28166,1,8,0:0:0:0:
320,192,28347,1,0,0:0:0:0:
64,192,28527,1,2,0:0:0:0:
448,192,28527,1,0,0:0:0:0:
192,192,28708,1,0,0:0:0:0:
320,192,28889,1,2,0:0:0:0:
448,192,28889,128,8,29250:0:0:0:0:
64,192,29250,128,2,29431:0:0:0:0:
192,192,29250,128,4,29431:0:0:0:0:
192,192,29521,128,0,29702:0:0:0:0:
320,192,29521,128,0,29702:0:0:0:0:
320,192,29792,128,0,29973:0:0:0:0:
448,192,29792,128,0,29973:0:0:0:0:
64,192,29973,128,2,30154:0:0:0:0:
192,192,29973,1,0,0:0:0:0:
448,192,30154,128,0,30334:0:0:0:0:
192,192,30334,128,2,30515:0:0:0:0:
320,192,30334,1,8,0:0:0:0:
64,192,30515,128,0,30696:0:0:0:0:
320,192,30696,128,2,30877:0:0:0:0:
448,192,30696,128,0,30877:0:0:0:0:
192,192,30967,128,0,31148:0:0:0:0:
320,192,30967,128,0,31148:0:0:0:0:
64,192,31238,128,0,31419:0:0:0:0:
192,192,31238,128,0,31419:0:0:0:0:
448,192,31419,1,2,0:0:0:0:
320,192,31600,128,0,31780:0:0:0:0:
64,192,31780,128,2,31961:0:0:0:0:
448,192,31780,1,8,0:0:0:0:
192,192,31961,128,0,32142:0:0:0:0:
320,192,32142,1,2,0:0:0:0:
448,192,32142,128,0,32322:0:0:0:0:
64,192,32322,128,0,32684:0:0:0:0:
320,192,32503,128,2,32684:0:0:0:0:
448,192,32503,128,8,32684:0:0:0:0:
64,192,32865,128,2,33045:0:0:0:0:
192,192,32865,1,0,0:0:0:0:
448,192,33045,128,0,33407:0:0:0:0:
64,192,33226,128,2,33407:0:0:0:0:
192,192,33226,128,8,33407:0:0:0:0:
320,192,33588,128,2,33768:0:0:0:0:
448,192,33588,1,0,0:0:0:0:
64,192,33768,128,0,33949:0:0:0:0:
320,192,33949,128,2,34130:0:0:0:0:
448,192,33949,1,8,0:0:0:0:
64,192,34130,1,0,0:0:0:0:
64,192,34310,1,2,0:0:0:0:
448,192,34310,1,0,0:0:0:0:
448,192,34491,1,8,0:0:0:0:
320,192,34581,1,8,0:0:0:0:
64,192,34672,1,2,0:0:0:0:
192,192,34672,1,0,0:0:0:0:
192,192,34853,1,2,0:0:0:0:
64,192,35033,1,2,0:0:0:0:
320,192,35033,128,4,35214:0:0:0:0:
448,192,35033,128,0,35214:0:0:0:0:
192,192,35304,128,0,35485:0:0:0:0:
320,192,35304,128,0,35485:0:0:0:0:
64,192,35575,128,0,35756:0:0:0:30:Hat Open.wav
192,192,35575,128,0,35756:0:0:0:0:
320,192,35756,1,2,0:0:0:0:
448,192,35756,128,0,35937:0:0:0:0:
64,192,35937,128,0,36118:0:0:0:30:Hat Open.wav
192,192,36118,1,2,0:0:0:0:
320,192,36118,128,8,36298:0:0:0:0:
448,192,36298,128,0,36479:0:0:0:30:Hat Open.wav
64,192,36479,128,2,36660:0:0:0:0:
192,192,36479,128,0,36660:0:0:0:0:
192,192,36750,128,0,36931:0:0:0:0:
320,192,36750,128,0,36931:0:0:0:0:
320,192,37021,128,0,37202:0:0:0:30:Hat Open.wav
448,192,37021,128,0,37202:0:0:0:0:
64,192,37202,1,2,0:0:0:0:
320,192,37383,1,0,0:0:0:30:Hat Open.wav
192,192,37473,1,0,0:0:0:0:
64,192,37563,1,2,0:0:0:0:
448,192,37563,128,8,37744:0:0:0:0:
320,192,37744,128,0,37925:0:0:0:30:Hat Open.wav
64,192,37925,128,2,38106:0:0:0:0:
192,192,37925,1,0,0:0:0:0:
448,192,38106,128,0,38467:0:0:0:30:Hat Open.wav
64,192,38286,128,2,38467:0:0:0:0:
192,192,38286,128,8,38467:0:0:0:0:
320,192,38648,1,2,0:0:0:0:
448,192,38648,128,0,38828:0:0:0:0:
64,192,38828,128,0,39190:0:0:0:30:Hat Open.wav
320,192,39009,1,2,0:0:0:0:
448,192,39009,128,8,39190:0:0:0:0:
192,192,39190,128,0,39371:0:0:0:30:Hat Open.wav
64,192,39371,1,2,0:0:0:0:
448,192,39371,1,0,0:0:0:0:
320,192,39551,1,0,0:0:0:30:Hat Open.wav
192,192,39732,1,2,0:0:0:0:
448,192,39732,1,8,0:0:0:0:
64,192,39913,1,8,0:0:0:0:
192,192,40003,1,8,0:0:0:0:
320,192,40094,1,2,0:0:0:0:
448,192,40094,1,0,0:0:0:0:
64,192,40184,1,0,0:0:0:0:
320,192,40274,1,2,0:0:0:0:
192,192,40365,1,0,0:0:0:0:
64,192,40455,1,8,0:0:0:0:
448,192,40455,1,0,0:0:0:40:Tom2.wav
320,192,40636,1,0,0:0:0:0:
64,192,40816,1,2,0:0:0:0:
192,192,40816,1,4,0:0:0:0:
448,192,40816,128,0,41539:0:0:0:0:
64,192,41359,1,2,0:0:0:0:
64,192,41539,1,2,0:0:0:0:
64,192,41901,1,8,0:0:0:0:
192,192,41901,128,0,42081:0:0:0:0:
448,192,41901,1,0,0:0:0:0:
448,192,42081,1,2,0:0:0:0:
448,192,42443,1,2,0:0:0:0:
448,192,42804,1,2,0:0:0:0:
64,192,42985,1,2,0:0:0:0:
448,192,42985,1,0,0:0:0:0:
192,192,43347,1,8,0:0:0:0:
320,192,43347,128,0,43527:0:0:0:0:
64,192,43708,128,2,44431:0:0:0:0:
448,192,43708,1,0,0:0:0:0:
448,192,44250,1,2,0:0:0:0:
448,192,44431,1,2,0:0:0:0:
64,192,44792,1,8,0:0:0:0:
320,192,44792,128,0,44973:0:0:0:0:
448,192,44792,1,0,0:0:0:0:
192,192,45154,1,2,0:0:0:0:
448,192,45154,128,0,45334:0:0:0:0:
64,192,45515,128,2,45696:0:0:0:0:
320,192,45515,1,0,0:0:0:0:
448,192,45877,1,2,0:0:0:0:
192,192,45967,1,2,0:0:0:0:
320,192,46057,1,2,0:0:0:0:
64,192,46148,1,2,0:0:0:0:
192,192,46238,128,8,46419:0:0:0:0:
448,192,46238,1,0,0:0:0:0:
64,192,46600,1,2,0:0:0:0:
448,192,46600,1,0,0:0:0:0:
320,192,46780,1,0,0:0:0:30:Hat Open.wav
64,192,46961,128,8,47142:0:0:0:0:
192,192,46961,1,2,0:0:0:0:
320,192,47142,1,0,0:0:0:30:Hat Open.wav
64,192,47322,1,2,0:0:0:0:
448,192,47322,1,0,0:0:0:0:
192,192,47503,1,0,0:0:0:30:Hat Open.wav
64,192,47684,128,8,47865:0:0:0:0:
448,192,47684,1,2,0:0:0:0:
320,192,47865,1,0,0:0:0:30:Hat Open.wav
64,192,48045,1,2,0:0:0:0:
192,192,48045,1,0,0:0:0:0:
320,192,48226,1,0,0:0:0:30:Hat Open.wav
64,192,48407,1,8,0:0:0:0:
448,192,48407,128,2,48588:0:0:0:0:
192,192,48588,1,0,0:0:0:30:Hat Open.wav
320,192,48768,1,2,0:0:0:0:
448,192,48768,1,0,0:0:0:0:
192,192,48949,1,0,0:0:0:30:Hat Open.wav
64,192,49130,1,8,0:0:0:0:
448,192,49130,128,2,49310:0:0:0:0:
320,192,49310,1,0,0:0:0:30:Hat Open.wav
64,192,49491,1,2,0:0:0:0:
192,192,49491,1,4,0:0:0:0:
448,192,49491,1,0,0:0:0:0:
64,192,49853,128,2,50033:0:0:0:0:
320,192,49853,1,0,0:0:0:0:
64,192,50214,1,2,0:0:0:0:
448,192,50214,1,0,0:0:0:0:
64,192,50575,128,2,50756:0:0:0:0:
192,192,50575,1,0,0:0:0:0:
64,192,50937,1,2,0:0:0:0:
448,192,50937,1,0,0:0:0:0:
320,192,51298,1,2,0:0:0:0:
448,192,51298,128,0,51479:0:0:0:0:
64,192,51660,1,2,0:0:0:0:
448,192,51660,1,0,0:0:0:0:
192,192,52021,1,2,0:0:0:0:
448,192,52021,128,0,52202:0:0:0:0:
64,192,52383,1,8,0:0:0:0:
448,192,52383,1,2,0:0:0:0:
192,192,52563,1,0,0:0:0:0:
192,192,52744,1,0,0:0:0:0:
320,192,52925,1,8,0:0:0:0:
448,192,52925,1,2,0:0:0:0:
64,192,53106,1,8,0:0:0:0:
192,192,53106,1,2,0:0:0:0:
320,192,53286,1,10,0:0:0:0:
192,192,53377,1,0,0:0:0:40:Tom1.wav
448,192,53467,1,0,0:0:0:40:Tom2.wav
320,192,53557,1,0,0:0:0:40:Tom3.wav
64,192,53648,1,8,0:0:0:0:
192,192,53648,128,2,53919:0:0:0:0:
320,192,54009,128,8,54280:0:0:0:0:
448,192,54009,1,2,0:0:0:0:
64,192,54371,1,8,0:0:0:0:
192,192,54371,1,2,0:0:0:0:
64,192,54551,128,8,54913:0:0:0:0:
320,192,54551,1,2,0:0:0:0:
448,192,54551,128,0,54913:0:0:0:0:
64,192,55274,1,2,0:0:0:0:
448,192,55274,128,4,55455:0:0:0:0:
192,192,55455,1,0,0:0:0:0:
64,192,55636,128,8,55816:0:0:0:0:
320,192,55636,1,2,0:0:0:0:
448,192,55636,1,0,0:0:0:0:
192,192,55816,1,0,0:0:0:0:
64,192,55997,1,2,0:0:0:0:
320,192,55997,128,0,56178:0:0:0:0:
192,192,56178,1,0,0:0:0:0:
320,192,56359,1,2,0:0:0:0:
448,192,56359,128,8,56539:0:0:0:0:
64,192,56539,128,0,56720:0:0:0:0:
320,192,56720,1,2,0:0:0:0:
448,192,56720,1,0,0:0:0:0:
192,192,56901,128,0,57081:0:0:0:0:
64,192,57081,1,8,0:0:0:0:
448,192,57081,128,2,57262:0:0:0:0:
64,192,57262,128,0,57443:0:0:0:0:
320,192,57443,128,2,57624:0:0:0:0:
448,192,57443,1,0,0:0:0:0:
192,192,57624,1,0,0:0:0:0:
64,192,57804,1,2,0:0:0:0:
448,192,57804,1,8,0:0:0:0:
192,192,57985,1,0,0:0:0:0:
320,192,57985,1,0,0:0:0:0:
64,192,58166,128,2,58347:0:0:0:0:
448,192,58166,1,0,0:0:0:0:
320,192,58347,1,0,0:0:0:0:
64,192,58527,1,8,0:0:0:0:
192,192,58527,128,2,58708:0:0:0:0:
448,192,58708,1,0,0:0:0:0:
64,192,58889,1,2,0:0:0:0:
320,192,58889,128,0,59069:0:0:0:0:
192,192,59069,1,0,0:0:0:0:
64,192,59250,1,2,0:0:0:0:
448,192,59250,128,8,59431:0:0:0:0:
192,192,59431,128,0,59612:0:0:0:0:
64,192,59612,1,2,0:0:0:0:
448,192,59612,1,0,0:0:0:0:
320,192,59792,128,0,59883:0:0:0:0:
192,192,59973,128,8,60063:0:0:0:0:
448,192,59973,1,2,0:0:0:0:
64,192,60154,128,8,60244:0:0:0:0:
320,192,60334,1,2,0:0:0:0:
448,192,60334,128,0,60515:0:0:0:0:
192,192,60515,1,8,0:0:0:0:
320,192,60606,1,8,0:0:0:0:
64,192,60696,128,2,60877:0:0:0:0:
448,192,60696,1,0,0:0:0:0:
320,192,60877,1,8,0:0:0:0:
192,192,60967,1,8,0:0:0:0:
64,192,61057,1,2,0:0:0:0:
448,192,61057,128,4,61238:0:0:0:0:
192,192,61238,1,0,0:0:0:0:
64,192,61419,1,2,0:0:0:0:
320,192,61419,128,8,61600:0:0:0:0:
448,192,61600,1,0,0:0:0:0:
64,192,61780,128,2,61961:0:0:0:0:
192,192,61780,1,0,0:0:0:0:
448,192,61961,1,0,0:0:0:0:
64,192,62142,1,8,0:0:0:0:
320,192,62142,128,2,62322:0:0:0:0:
448,192,62322,128,0,62503:0:0:0:0:
64,192,62503,1,2,0:0:0:0:
192,192,62503,1,0,0:0:0:0:
320,192,62684,128,0,62865:0:0:0:0:
64,192,62865,128,2,63045:0:0:0:0:
192,192,62865,1,8,0:0:0:0:
448,192,63045,128,0,63226:0:0:0:0:
192,192,63226,128,2,63407:0:0:0:0:
320,192,63226,1,0,0:0:0:0:
64,192,63407,1,0,0:0:0:0:
320,192,63588,1,8,0:0:0:0:
448,192,63588,1,2,0:0:0:0:
192,192,63768,1,0,0:0:0:0:
320,192,63768,1,0,0:0:0:0:
64,192,63949,128,2,64130:0:0:0:0:
448,192,63949,1,0,0:0:0:0:
192,192,64130,1,0,0:0:0:0:
64,192,64310,1,2,0:0:0:0:
448,192,64310,128,8,64491:0:0:0:0:
320,192,64491,1,0,0:0:0:0:
192,192,64672,128,2,64853:0:0:0:0:
448,192,64672,1,0,0:0:0:0:
320,192,64853,1,0,0:0:0:0:
64,192,65033,128,8,65214:0:0:0:0:
192,192,65033,1,2,0:0:0:0:
448,192,65214,128,0,65395:0:0:0:0:
64,192,65395,1,2,0:0:0:0:
192,192,65395,1,0,0:0:0:0:
320,192,65575,128,0,65756:0:0:0:0:
64,192,65756,1,2,0:0:0:0:
448,192,65756,1,8,0:0:0:0:
192,192,65937,128,0,66118:0:0:0:0:
64,192,66118,128,2,66298:0:0:0:0:
448,192,66118,1,0,0:0:0:0:
320,192,66298,1,8,0:0:0:0:
192,192,66389,1,8,0:0:0:0:
64,192,66479,1,2,0:0:0:0:
448,192,66479,128,0,66660:0:0:0:0:
192,192,66660,1,8,0:0:0:0:
320,192,66750,1,8,0:0:0:0:
64,192,66841,1,2,0:0:0:0:
448,192,66841,1,4,0:0:0:0:
64,192,67202,1,2,0:0:0:0:
448,192,67202,1,8,0:0:0:0:
64,192,67563,1,2,0:0:0:0:
192,192,67563,1,0,0:0:0:0:
448,192,67834,1,0,0:0:0:0:
64,192,67925,1,8,0:0:0:0:
192,192,67925,1,2,0:0:0:0:
320,192,68106,1,0,0:0:0:0:
64,192,68286,1,2,0:0:0:0:
448,192,68286,1,0,0:0:0:0:
192,192,68467,1,0,0:0:0:0:
64,192,68648,1,2,0:0:0:0:
448,192,68648,1,8,0:0:0:0:
320,192,68828,1,0,0:0:0:0:
64,192,69009,1,2,0:0:0:0:
192,192,69009,1,0,0:0:0:0:
320,192,69190,1,0,0:0:0:0:
64,192,69371,1,8,0:0:0:0:
448,192,69371,1,2,0:0:0:0:
192,192,69551,1,0,0:0:0:0:
320,192,69732,1,2,0:0:0:0:
448,192,69732,1,0,0:0:0:0:
320,192,70094,1,2,0:0:0:0:
448,192,70094,1,8,0:0:0:0:
64,192,70455,1,2,0:0:0:0:
448,192,70455,1,0,0:0:0:0:
448,192,70726,1,0,0:0:0:0:
64,192,70816,1,8,0:0:0:0:
192,192,70816,1,2,0:0:0:0:
320,192,70997,1,0,0:0:0:0:
64,192,71178,1,2,0:0:0:0:
448,192,71178,1,0,0:0:0:0:
448,192,71359,128,0,71539:0:0:0:0:
192,192,71539,1,2,0:0:0:0:
320,192,71539,1,8,0:0:0:0:
320,192,71720,128,0,71901:0:0:0:0:
64,192,71901,1,2,0:0:0:0:
448,192,71901,1,0,0:0:0:0:
64,192,72081,128,0,72262:0:0:0:0:
192,192,72262,1,8,0:0:0:0:
320,192,72262,1,2,0:0:0:0:
192,192,72443,128,0,72624:0:0:0:0:
64,192,72624,1,2,0:0:0:0:
448,192,72624,1,0,0:0:0:0:
64,192,72985,1,2,0:0:0:0:
448,192,72985,1,8,0:0:0:0:
320,192,73347,1,2,0:0:0:0:
448,192,73347,1,0,0:0:0:0:
64,192,73618,1,0,0:0:0:0:
320,192,73708,1,8,0:0:0:0:
448,192,73708,1,2,0:0:0:0:
192,192,73889,1,0,0:0:0:0:
64,192,74069,1,2,0:0:0:0:
448,192,74069,1,0,0:0:0:0:
320,192,74250,1,0,0:0:0:0:
64,192,74431,1,2,0:0:0:0:
448,192,74431,1,8,0:0:0:0:
192,192,74612,1,0,0:0:0:0:
320,192,74792,1,2,0:0:0:0:
448,192,74792,1,0,0:0:0:0:
192,192,74973,1,0,0:0:0:0:
64,192,75154,1,8,0:0:0:0:
448,192,75154,1,2,0:0:0:0:
320,192,75334,1,0,0:0:0:0:
64,192,75515,1,2,0:0:0:0:
192,192,75515,1,0,0:0:0:0:
192,192,75696,1,0,0:0:0:0:
320,192,75877,1,2,0:0:0:0:
448,192,75877,1,8,0:0:0:0:
320,192,76057,1,0,0:0:0:0:
64,192,76238,1,2,0:0:0:0:
448,192,76238,1,0,0:0:0:0:
192,192,76419,1,0,0:0:0:0:
64,192,76509,1,0,0:0:0:0:
320,192,76600,1,8,0:0:0:0:
448,192,76600,1,2,0:0:0:0:
64,192,76780,128,2,77503:0:0:0:0:
192,192,76780,1,4,0:0:0:0:
448,192,76780,1,0,0:0:0:0:
448,192,77142,128,8,77503:0:0:0:0:
192,192,77503,1,8,0:0:0:0:
64,192,77684,1,2,0:0:0:0:
320,192,77684,1,0,0:0:0:0:
448,192,77684,128,0,78226:0:0:0:0:
64,192,78045,1,2,0:0:0:0:
64,192,78407,1,2,0:0:0:0:
192,192,78407,128,0,78768:0:0:0:0:
448,192,78407,1,0,0:0:0:0:
448,192,78768,128,0,78949:0:0:0:0:
64,192,79130,1,8,0:0:0:0:
448,192,79130,128,0,79310:0:0:0:0:
192,192,79491,128,0,79672:0:0:0:0:
320,192,79853,1,0,0:0:0:0:
192,192,80033,1,0,0:0:0:0:
320,192,80214,128,0,80395:0:0:0:0:
320,192,80575,128,8,80756:0:0:0:0:
320,192,80937,1,0,0:0:0:0:
64,192,81118,1,2,0:0:0:0:
192,192,81118,1,0,0:0:0:0:
64,192,81298,1,2,0:0:0:0:
448,192,81298,1,0,0:0:0:0:
448,192,81660,128,0,81841:0:0:0:0:
64,192,81841,128,0,82021:0:0:0:0:
320,192,82021,1,8,0:0:0:0:
448,192,82021,128,0,82202:0:0:0:0:
64,192,82202,128,0,82383:0:0:0:0:
448,192,82383,1,0,0:0:0:0:
320,192,82563,1,0,0:0:0:0:
192,192,82744,1,0,0:0:0:0:
320,192,82925,1,0,0:0:0:0:
192,192,83106,128,0,83286:0:0:0:0:
448,192,83467,1,8,0:0:0:0:
64,192,83648,1,0,0:0:0:0:
192,192,83828,128,0,84190:0:0:0:0:
64,192,84190,1,2,0:0:0:0:
320,192,84190,128,0,84551:0:0:0:0:
448,192,84190,1,0,0:0:0:0:
64,192,84551,1,0,0:0:0:0:
192,192,84732,1,0,0:0:0:0:
448,192,84913,1,8,0:0:0:0:
64,192,85094,1,0,0:0:0:0:
448,192,85274,128,0,85455:0:0:0:0:
192,192,85636,1,0,0:0:0:0:
320,192,85816,1,0,0:0:0:0:
192,192,85997,128,0,86178:0:0:0:0:
192,192,86359,128,8,86539:0:0:0:0:
192,192,86720,1,0,0:0:0:0:
320,192,86901,1,2,0:0:0:0:
448,192,86901,1,0,0:0:0:0:
64,192,87081,1,2,0:0:0:0:
448,192,87081,1,0,0:0:0:0:
64,192,87443,1,0,0:0:0:0:
192,192,87624,1,0,0:0:0:0:
448,192,87804,128,8,87985:0:0:0:0:
448,192,88166,1,0,0:0:0:0:
192,192,88347,1,0,0:0:0:0:
320,192,88437,1,0,0:0:0:0:
64,192,88527,1,0,0:0:0:0:
320,192,88708,1,0,0:0:0:0:
192,192,88798,1,0,0:0:0:0:
448,192,88889,1,0,0:0:0:0:
64,192,89069,1,0,0:0:0:0:
320,192,89250,1,2,0:0:0:0:
448,192,89250,1,0,0:0:0:0:
320,192,89371,128,0,89491:0:0:0:0:
64,192,89612,1,2,0:0:0:0:
192,192,89612,1,0,0:0:0:0:
192,192,89732,128,0,89853:0:0:0:0:
64,192,89973,1,2,0:0:0:0:
448,192,89973,128,0,90334:0:0:0:0:
192,192,90334,1,0,0:0:0:0:
64,192,90455,1,0,0:0:0:0:
448,192,90575,1,0,0:0:0:0:
320,192,90696,128,0,91057:0:0:0:0:
448,192,91057,1,0,0:0:0:0:
64,192,91178,1,0,0:0:0:0:
320,192,91298,1,0,0:0:0:0:
192,192,91419,1,0,0:0:0:0:
448,192,91660,1,0,0:0:0:0:
64,192,91780,128,2,92021:0:0:0:0:
192,192,91780,1,0,0:0:0:0:
320,192,92021,1,0,0:0:0:0:
448,192,92142,128,0,92503:0:0:0:0:
64,192,92322,128,2,92684:0:0:0:0:
192,192,92322,1,0,0:0:0:0:
320,192,92503,1,0,0:0:0:0:
192,192,92684,1,0,0:0:0:0:
320,192,92774,1,0,0:0:0:0:
64,192,92865,1,2,0:0:0:0:
448,192,92865,128,0,93226:0:0:0:0:
64,192,93226,1,0,0:0:0:0:
320,192,93347,1,0,0:0:0:0:
192,192,93467,1,0,0:0:0:0:
64,192,93588,1,0,0:0:0:0:
448,192,93708,1,0,0:0:0:0:
192,192,93828,1,0,0:0:0:0:
448,192,93949,128,0,94190:0:0:0:0:
64,192,94190,1,0,0:0:0:0:
320,192,94310,1,0,0:0:0:0:
192,192,94431,1,0,0:0:0:0:
64,192,94551,1,0,0:0:0:0:
320,192,94672,1,0,0:0:0:0:
448,192,94792,1,0,0:0:0:0:
192,192,94913,1,0,0:0:0:0:
64,192,95033,1,2,0:0:0:0:
320,192,95033,128,0,95214:0:0:0:0:
64,192,95395,1,2,0:0:0:0:
320,192,95395,128,0,95575:0:0:0:0:
448,192,95756,1,0,0:0:0:0:
192,192,95877,1,0,0:0:0:0:
320,192,95997,1,0,0:0:0:0:
64,192,96118,128,2,96479:0:0:0:0:
448,192,96479,1,0,0:0:0:0:
320,192,96600,1,0,0:0:0:0:
192,192,96720,1,0,0:0:0:0:
64,192,96841,1,2,0:0:0:0:
448,192,96961,1,0,0:0:0:0:
192,192,97081,1,0,0:0:0:0:
320,192,97202,128,0,97443:0:0:0:0:
64,192,97443,1,0,0:0:0:0:
192,192,97563,1,2,0:0:0:0:
320,192,97804,1,0,0:0:0:0:
64,192,97925,1,0,0:0:0:0:
448,192,98045,1,0,0:0:0:0:
64,192,98166,1,0,0:0:0:0:
192,192,98286,128,0,98648:0:0:0:0:
448,192,98648,128,2,98889:0:0:0:0:
64,192,98889,1,0,0:0:0:0:
192,192,99009,128,0,99130:0:0:0:0:
320,192,99130,128,0,99250:0:0:0:0:
448,192,99250,128,0,99371:0:0:0:0:
64,192,99371,128,2,99732:0:0:0:0:
192,192,99371,1,0,0:0:0:0:
448,192,99732,128,0,99853:0:0:0:0:
320,192,99853,128,0,99973:0:0:0:0:
192,192,99973,1,0,0:0:0:0:
64,192,100094,1,2,0:0:0:0:
448,192,100094,1,0,0:0:0:0:
192,192,100274,1,0,0:0:0:0:
448,192,100455,1,2,0:0:0:0:
320,192,100545,1,8,0:0:0:0:
64,192,100636,1,8,0:0:0:0:
192,192,100726,1,8,0:0:0:0:
320,192,100816,1,2,0:0:0:0:
448,192,100816,1,0,0:0:0:0:
64,192,100907,1,2,0:0:0:0:
320,192,100997,1,2,0:0:0:0:
448,192,100997,1,0,0:0:0:0:
192,192,101088,1,2,0:0:0:0:
64,192,101178,1,8,0:0:0:0:
448,192,101178,1,0,0:0:0:0:
320,192,101359,1,0,0:0:0:0:
64,192,101539,1,2,0:0:0:0:
192,192,101539,1,4,0:0:0:0:
320,192,101630,1,0,0:0:0:0:
448,192,101720,1,0,0:0:0:0:
192,192,101810,1,0,0:0:0:0:
64,192,101901,1,8,0:0:0:0:
448,192,101901,1,2,0:0:0:0:
320,192,101991,1,0,0:0:0:0:
192,192,102081,1,0,0:0:0:0:
64,192,102172,1,0,0:0:0:0:
320,192,102262,1,2,0:0:0:0:
448,192,102262,1,0,0:0:0:0:
64,192,102353,1,0,0:0:0:0:
192,192,102443,1,0,0:0:0:0:
320,192,102533,1,0,0:0:0:0:
64,192,102624,1,2,0:0:0:0:
448,192,102624,128,8,102804:0:0:0:0:
192,192,102804,128,0,102985:0:0:0:0:
320,192,102985,1,2,0:0:0:0:
448,192,102985,1,0,0:0:0:0:
64,192,103166,128,0,103347:0:0:0:0:
192,192,103347,1,8,0:0:0:0:
448,192,103347,128,2,103527:0:0:0:0:
320,192,103527,128,0,103708:0:0:0:0:
64,192,103708,128,2,103889:0:0:0:0:
448,192,103708,1,0,0:0:0:0:
320,192,103889,1,0,0:0:0:0:
64,192,104069,1,2,0:0:0:0:
192,192,104069,128,8,104250:0:0:0:0:
448,192,104250,128,0,104431:0:0:0:0:
64,192,104431,1,2,0:0:0:0:
320,192,104431,1,0,0:0:0:0:
192,192,104521,1,0,0:0:0:0:
448,192,104612,1,0,0:0:0:0:
320,192,104702,1,0,0:0:0:0:
64,192,104792,1,8,0:0:0:0:
192,192,104792,1,2,0:0:0:0:
320,192,104883,1,0,0:0:0:0:
448,192,104973,1,0,0:0:0:0:
192,192,105063,1,0,0:0:0:0:
64,192,105154,1,2,0:0:0:0:
448,192,105154,1,0,0:0:0:0:
320,192,105244,1,0,0:0:0:0:
192,192,105334,1,0,0:0:0:0:
320,192,105425,1,0,0:0:0:0:
64,192,105515,128,2,105696:0:0:0:0:
448,192,105515,1,8,0:0:0:0:
320,192,105696,128,0,105877:0:0:0:0:
192,192,105877,1,2,0:0:0:0:
448,192,105877,1,0,0:0:0:0:
448,192,106057,128,0,106148:0:0:0:0:
64,192,106238,128,8,106328:0:0:0:0:
192,192,106238,1,2,0:0:0:0:
320,192,106419,128,8,106509:0:0:0:0:
64,192,106600,1,2,0:0:0:0:
192,192,106600,1,0,0:0:0:0:
448,192,106600,128,0,106871:0:0:0:0:
192,192,106780,1,8,0:0:0:0:
64,192,106961,128,2,107232:0:0:0:0:
320,192,106961,1,0,0:0:0:0:
448,192,106961,1,0,0:0:0:0:
320,192,107142,1,8,0:0:0:0:
64,192,107322,1,2,0:0:0:0:
448,192,107322,1,4,0:0:0:0:
192,192,107413,1,0,0:0:0:0:
320,192,107503,1,0,0:0:0:0:
448,192,107594,1,0,0:0:0:0:
64,192,107684,1,2,0:0:0:0:
192,192,107684,1,8,0:0:0:0:
448,192,107774,1,0,0:0:0:0:
320,192,107865,1,0,0:0:0:0:
192,192,107955,1,0,0:0:0:0:
64,192,108045,1,2,0:0:0:0:
448,192,108045,1,0,0:0:0:0:
320,192,108136,1,0,0:0:0:0:
192,192,108226,1,0,0:0:0:0:
320,192,108316,1,0,0:0:0:0:
64,192,108407,128,8,108588:0:0:0:0:
448,192,108407,1,2,0:0:0:0:
320,192,108588,128,0,108768:0:0:0:0:
64,192,108768,1,2,0:0:0:0:
192,192,108768,1,0,0:0:0:0:
448,192,108949,128,0,109130:0:0:0:0:
64,192,109130,128,2,109310:0:0:0:0:
320,192,109130,1,8,0:0:0:0:
192,192,109310,128,0,109491:0:0:0:0:
64,192,109491,1,2,0:0:0:0:
448,192,109491,128,0,109672:0:0:0:0:
192,192,109672,1,0,0:0:0:0:
320,192,109853,128,8,110033:0:0:0:0:
448,192,109853,1,2,0:0:0:0:
64,192,110033,128,0,110214:0:0:0:0:
192,192,110214,1,2,0:0:0:0:
448,192,110214,1,0,0:0:0:0:
320,192,110304,1,0,0:0:0:0:
64,192,110395,1,0,0:0:0:0:
192,192,110485,1,0,0:0:0:0:
320,192,110575,1,2,0:0:0:0:
448,192,110575,1,8,0:0:0:0:
192,192,110666,1,0,0:0:0:0:
64,192,110756,1,0,0:0:0:0:
320,192,110847,1,0,0:0:0:0:
192,192,110937,1,2,0:0:0:0:
448,192,110937,128,0,111118:0:0:0:0:
64,192,111208,128,2,111389:0:0:0:0:
320,192,111208,1,0,0:0:0:0:
64,192,111479,1,4,0:0:0:0:
192,192,111479,1,2,0:0:0:0:
448,192,111479,128,0,111841:0:0:0:0:
64,192,111841,1,8,0:0:0:0:
192,192,112021,1,2,0:0:0:0:
448,192,112021,1,8,0:0:0:0:
320,192,112202,1,8,0:0:0:0:
64,192,112383,1,2,0:0:0:0:
192,192,112383,1,0,0:0:0:0:
320,192,112563,1,8,0:0:0:0:
64,192,112744,1,2,0:0:0:0:
448,192,112744,1,0,0:0:0:0:
192,192,112834,1,8,0:0:0:0:
320,192,112925,1,8,0:0:0:0:
192,192,113015,1,8,0:0:0:0:
64,192,113106,1,2,0:0:0:0:
320,192,113106,1,4,0:0:0:0:
448,192,113106,128,0,113377:0:0:0:0:
64,192,113467,1,2,0:0:0:0:
192,192,113467,128,8,113738:0:0:0:0:
448,192,113467,1,0,0:0:0:0:
64,192,113828,128,2,114100:0:0:0:0:
320,192,113828,1,0,0:0:0:0:
448,192,114009,1,0,0:0:0:0:
320,192,114100,1,0,0:0:0:0:
64,192,114190,1,8,0:0:0:0:
192,192,114190,1,2,0:0:0:0:
320,192,114371,128,0,114551:0:0:0:0:
64,192,114551,1,2,0:0:0:0:
448,192,114551,1,0,0:0:0:0:
192,192,114732,128,0,114822:0:0:0:0:
64,192,114913,1,2,0:0:0:0:
320,192,114913,128,8,115003:0:0:0:0:
448,192,115094,128,0,115184:0:0:0:0:
64,192,115274,128,2,115455:0:0:0:0:
192,192,115274,128,0,115455:0:0:0:0:
320,192,115455,128,0,115636:0:0:0:0:
448,192,115455,128,0,115636:0:0:0:0:
64,192,115636,128,8,115816:0:0:0:0:
192,192,115636,128,2,115816:0:0:0:0:
320,192,115816,128,0,115997:0:0:0:0:
448,192,115816,128,0,115997:0:0:0:0:
64,192,115997,128,2,116268:0:0:0:0:
192,192,115997,1,0,0:0:0:0:
320,192,116359,1,2,0:0:0:0:
448,192,116359,128,8,116630:0:0:0:0:
64,192,116720,1,2,0:0:0:0:
192,192,116720,128,0,116991:0:0:0:0:
448,192,116901,1,0,0:0:0:0:
320,192,116991,1,0,0:0:0:0:
64,192,117081,1,8,0:0:0:0:
192,192,117081,1,2,0:0:0:0:
320,192,117262,128,0,117443:0:0:0:0:
192,192,117443,1,2,0:0:0:0:
448,192,117443,1,0,0:0:0:0:
64,192,117624,128,0,117804:0:0:0:0:
320,192,117804,1,2,0:0:0:0:
448,192,117804,128,8,117985:0:0:0:0:
192,192,117985,128,0,118166:0:0:0:0:
64,192,118166,128,2,118347:0:0:0:0:
448,192,118166,1,0,0:0:0:0:
192,192,118347,128,0,118527:0:0:0:0:
320,192,118347,1,0,0:0:0:0:
64,192,118527,1,8,0:0:0:0:
448,192,118527,128,2,118708:0:0:0:0:
192,192,118708,1,0,0:0:0:0:
320,192,118708,128,0,118889:0:0:0:0:
64,192,118889,128,2,119160:0:0:0:0:
448,192,118889,1,0,0:0:0:0:
64,192,119250,1,2,0:0:0:0:
320,192,119250,128,8,119521:0:0:0:0:
448,192,119250,1,0,0:0:0:0:
192,192,119612,1,2,0:0:0:0:
448,192,119612,128,0,119883:0:0:0:0:
64,192,119792,1,0,0:0:0:0:
192,192,119883,1,0,0:0:0:0:
320,192,119973,1,8,0:0:0:0:
448,192,119973,1,2,0:0:0:0:
192,192,120154,128,0,120334:0:0:0:0:
64,192,120334,1,2,0:0:0:0:
448,192,120334,1,0,0:0:0:0:
320,192,120515,128,0,120606:0:0:0:0:
192,192,120696,128,2,120786:0:0:0:0:
448,192,120696,1,8,0:0:0:0:
64,192,120877,128,0,120967:0:0:0:0:
320,192,121057,128,2,121238:0:0:0:0:
448,192,121057,128,0,121238:0:0:0:0:
64,192,121238,128,0,121419:0:0:0:0:
192,192,121238,128,0,121419:0:0:0:0:
320,192,121419,128,8,121600:0:0:0:0:
448,192,121419,128,2,121600:0:0:0:0:
64,192,121600,128,0,121780:0:0:0:0:
192,192,121600,128,0,121780:0:0:0:0:
320,192,121780,1,2,0:0:0:0:
448,192,121780,128,0,122051:0:0:0:0:
64,192,122142,128,2,122413:0:0:0:0:
192,192,122142,1,8,0:0:0:0:
320,192,122503,128,2,122684:0:0:0:0:
448,192,122503,1,0,0:0:0:0:
192,192,122774,128,2,122955:0:0:0:0:
320,192,122774,1,0,0:0:0:0:
64,192,123045,1,2,0:0:0:0:
320,192,123045,1,4,0:0:0:0:
448,192,123045,128,0,123588:0:0:0:0:
192,192,123407,1,8,0:0:0:0:
64,192,123588,1,8,0:0:0:0:
320,192,123588,1,0,0:0:0:0:
192,192,123768,1,8,0:0:0:0:
64,192,123949,128,2,124349:0:0:0:0:
320,192,123949,1,0,0:0:0:0:
448,192,123949,1,0,0:0:0:0:
192,192,124349,1,2,0:0:0:0:
448,192,124349,1,0,0:0:0:0:
64,192,124749,1,4,0:0:0:0:
320,192,124749,1,2,0:0:0:0:
448,192,124749,1,0,0:0:0:0:
64,192,125149,1,0,0:0:0:20:soft-hitclap.wav
192,192,125349,1,0,0:0:0:0:
448,192,125549,1,8,0:0:0:0:
320,192,125749,1,0,0:0:0:0:
64,192,125949,1,0,0:0:0:20:soft-hitclap.wav
320,192,126149,1,0,0:0:0:0:
448,192,126349,1,0,0:0:0:20:soft-hitclap.wav
192,192,126549,1,0,0:0:0:0:
320,192,126649,1,0,0:0:0:0:
64,192,126749,1,0,0:0:0:20:soft-hitclap.wav
192,192,126949,1,0,0:0:0:0:
64,192,127149,1,2,0:0:0:0:
320,192,127149,1,8,0:0:0:0:
448,192,127149,128,0,127349:0:0:0:0:
192,192,127349,128,0,127549:0:0:0:0:
64,192,127549,128,2,127849:0:0:0:0:
320,192,127549,1,0,0:0:0:20:soft-hitclap.wav
448,192,127549,128,0,127849:0:0:0:0:
64,192,127949,1,2,0:0:0:0:
192,192,127949,1,0,0:0:0:20:soft-hitclap.wav
448,192,127949,1,0,0:0:0:0:
448,192,128349,1,0,0:0:0:20:soft-hitclap.wav
320,192,128549,1,0,0:0:0:0:
64,192,128749,1,8,0:0:0:0:
192,192,128949,1,0,0:0:0:0:
448,192,129149,1,0,0:0:0:20:soft-hitclap.wav
192,192,129349,1,0,0:0:0:0:
64,192,129549,1,0,0:0:0:20:soft-hitclap.wav
320,192,129749,1,0,0:0:0:0:
192,192,129949,1,0,0:0:0:20:soft-hitclap.wav
320,192,130149,1,0,0:0:0:0:
64,192,130349,128,2,130549:0:0:0:0:
192,192,130349,1,8,0:0:0:0:
448,192,130349,1,0,0:0:0:0:
320,192,130549,128,0,130749:0:0:0:0:
64,192,130749,128,2,131049:0:0:0:0:
192,192,130749,1,0,0:0:0:20:soft-hitclap.wav
448,192,130749,128,0,131049:0:0:0:0:
64,192,131149,1,2,0:0:0:0:
320,192,131149,1,4,0:0:0:0:
448,192,131149,1,0,0:0:0:0:
192,192,131349,1,0,0:0:0:0:
448,192,131549,1,0,0:0:0:20:soft-hitclap.wav
320,192,131749,1,0,0:0:0:0:
64,192,131949,1,8,0:0:0:0:
448,192,132349,1,0,0:0:0:20:soft-hitclap.wav
320,192,132549,1,0,0:0:0:0:
64,192,132749,1,0,0:0:0:20:soft-hitclap.wav
320,192,132949,1,0,0:0:0:0:
192,192,133149,1,0,0:0:0:20:soft-hitclap.wav
448,192,133349,1,0,0:0:0:0:
64,192,133549,128,2,133749:0:0:0:0:
192,192,133549,1,8,0:0:0:0:
320,192,133549,1,0,0:0:0:0:
448,192,133749,128,0,133949:0:0:0:0:
64,192,133949,128,2,134249:0:0:0:0:
192,192,133949,128,0,134249:0:0:0:20:soft-hitclap.wav
320,192,133949,1,0,0:0:0:0:
64,192,134349,1,2,0:0:0:0:
192,192,134349,1,0,0:0:0:20:soft-hitclap.wav
448,192,134349,1,0,0:0:0:0:
64,192,134749,1,0,0:0:0:20:soft-hitclap.wav
320,192,134949,1,0,0:0:0:0:
448,192,135149,1,8,0:0:0:0:
192,192,135349,1,0,0:0:0:0:
64,192,135549,1,0,0:0:0:20:soft-hitclap.wav
192,192,135749,1,0,0:0:0:0:
448,192,135949,1,0,0:0:0:20:soft-hitclap.wav
192,192,136149,1,0,0:0:0:0:
320,192,136349,1,0,0:0:0:20:soft-hitclap.wav
64,192,136549,1,0,0:0:0:0:
192,192,136749,1,2,0:0:0:0:
320,192,136749,1,8,0:0:0:0:
448,192,136749,128,0,136949:0:0:0:0:
64,192,136949,128,0,137149:0:0:0:0:
192,192,137149,1,2,0:0:0:0:
320,192,137149,128,0,137449:0:0:0:20:soft-hitclap.wav
448,192,137149,128,0,137449:0:0:0:0:
64,192,137549,1,2,0:0:0:0:
320,192,137549,1,4,0:0:0:0:
448,192,137549,1,0,0:0:0:0:
448,192,137949,1,0,0:0:0:20:soft-hitclap.wav
192,192,138082,1,0,0:0:0:20:soft-hitclap.wav
448,192,138215,1,0,0:0:0:20:soft-hitclap.wav
64,192,138349,128,8,138482:0:0:0:0:
320,192,138482,128,0,138615:0:0:0:0:
192,192,138615,128,0,138749:0:0:0:0:
448,192,138749,1,0,0:0:0:20:soft-hitclap.wav
64,192,138882,1,0,0:0:0:20:soft-hitclap.wav
448,192,139015,1,0,0:0:0:20:soft-hitclap.wav
192,192,139149,128,0,139282:0:0:0:20:soft-hitclap.wav
320,192,139282,128,0,139415:0:0:0:0:
64,192,139415,128,0,139549:0:0:0:0:
448,192,139549,1,0,0:0:0:20:soft-hitclap.wav
192,192,139682,1,0,0:0:0:20:soft-hitclap.wav
448,192,139815,1,0,0:0:0:20:soft-hitclap.wav
64,192,139949,1,2,0:0:0:0:
192,192,139949,1,8,0:0:0:0:
320,192,140082,1,0,0:0:0:0:
64,192,140215,1,0,0:0:0:0:
320,192,140349,1,2,0:0:0:0:
448,192,140349,1,0,0:0:0:20:soft-hitclap.wav
192,192,140482,1,0,0:0:0:20:soft-hitclap.wav
448,192,140615,1,0,0:0:0:20:soft-hitclap.wav
64,192,140749,1,2,0:0:0:0:
192,192,140749,1,0,0:0:0:20:soft-hitclap.wav
64,192,141149,1,0,0:0:0:20:soft-hitclap.wav
320,192,141282,1,0,0:0:0:20:soft-hitclap.wav
64,192,141415,1,0,0:0:0:20:soft-hitclap.wav
448,192,141549,128,8,141682:0:0:0:0:
192,192,141682,128,0,141815:0:0:0:0:
320,192,141815,128,0,141949:0:0:0:0:
64,192,141949,1,0,0:0:0:20:soft-hitclap.wav
448,192,142082,1,0,0:0:0:20:soft-hitclap.wav
64,192,142215,1,0,0:0:0:20:soft-hitclap.wav
320,192,142349,128,0,142482:0:0:0:20:soft-hitclap.wav
192,192,142482,128,0,142615:0:0:0:0:
448,192,142615,128,0,142749:0:0:0:0:
64,192,142749,1,0,0:0:0:20:soft-hitclap.wav
320,192,142882,1,0,0:0:0:20:soft-hitclap.wav
64,192,143015,1,0,0:0:0:20:soft-hitclap.wav
320,192,143149,1,2,0:0:0:0:
448,192,143149,1,8,0:0:0:0:
192,192,143282,1,0,0:0:0:0:
448,192,143415,1,0,0:0:0:0:
64,192,143549,1,2,0:0:0:0:
192,192,143549,1,0,0:0:0:20:soft-hitclap.wav
320,192,143682,1,0,0:0:0:20:soft-hitclap.wav
64,192,143815,1,0,0:0:0:20:soft-hitclap.wav
320,192,143949,1,2,0:0:0:0:
448,192,143949,1,4,0:0:0:0:
192,192,144349,1,0,0:0:0:20:soft-hitclap.wav
448,192,144482,1,0,0:0:0:20:soft-hitclap.wav
192,192,144615,1,0,0:0:0:20:soft-hitclap.wav
320,192,144749,128,8,144882:0:0:0:0:
64,192,144882,128,0,145015:0:0:0:0:
192,192,145015,128,0,145149:0:0:0:0:
448,192,145149,1,0,0:0:0:20:soft-hitclap.wav
64,192,145282,1,0,0:0:0:20:soft-hitclap.wav
448,192,145415,1,0,0:0:0:20:soft-hitclap.wav
192,192,145549,128,0,145682:0:0:0:20:soft-hitclap.wav
320,192,145682,128,0,145815:0:0:0:0:
64,192,145815,128,0,145949:0:0:0:0:
448,192,145949,1,0,0:0:0:20:soft-hitclap.wav
192,192,146082,1,0,0:0:0:20:soft-hitclap.wav
448,192,146215,1,0,0:0:0:20:soft-hitclap.wav
64,192,146349,1,2,0:0:0:0:
320,192,146349,1,8,0:0:0:0:
192,192,146482,1,0,0:0:0:0:
448,192,146615,1,0,0:0:0:0:
64,192,146749,1,2,0:0:0:0:
192,192,146749,1,0,0:0:0:20:soft-hitclap.wav
448,192,146882,1,0,0:0:0:20:soft-hitclap.wav
320,192,147015,1,0,0:0:0:20:soft-hitclap.wav
64,192,147149,1,2,0:0:0:0:
448,192,147149,1,0,0:0:0:20:soft-hitclap.wav
320,192,147549,1,0,0:0:0:20:soft-hitclap.wav
64,192,147682,1,0,0:0:0:20:soft-hitclap.wav
320,192,147815,1,0,0:0:0:20:soft-hitclap.wav
192,192,147949,128,8,148082:0:0:0:0:
448,192,148082,128,0,148215:0:0:0:0:
320,192,148215,128,0,148349:0:0:0:0:
64,192,148349,1,0,0:0:0:20:soft-hitclap.wav
448,192,148482,1,0,0:0:0:20:soft-hitclap.wav
64,192,148615,1,0,0:0:0:20:soft-hitclap.wav
320,192,148749,128,2,148882:0:0:0:0:
448,192,148749,1,0,0:0:0:20:soft-hitclap.wav
192,192,148882,128,0,149015:0:0:0:0:
448,192,149015,128,0,149149:0:0:0:0:
64,192,149149,128,2,149282:0:0:0:0:
192,192,149149,1,0,0:0:0:20:soft-hitclap.wav
320,192,149282,128,0,149415:0:0:0:20:soft-hitclap.wav
64,192,149415,128,0,149549:0:0:0:20:soft-hitclap.wav
192,192,149549,1,2,0:0:0:0:
320,192,149549,1,0,0:0:0:20:soft-hitclap.wav
448,192,149549,128,0,149949:0:0:0:0:
64,192,150349,128,2,150602:0:0:0:0:
448,192,150349,128,0,150475:0:0:0:0:
320,192,150475,128,0,150602:0:0:0:0:
192,192,150602,128,0,150728:0:0:0:0:
64,192,150728,128,2,150855:0:0:0:0:
448,192,150728,128,0,150981:0:0:0:0:
192,192,150855,128,0,150981:0:0:0:0:
320,192,150981,128,0,151108:0:0:0:0:
64,192,151108,128,2,151488:0:0:0:0:
448,192,151108,128,0,151488:0:0:0:0:
192,192,151488,1,0,0:0:0:0:
320,192,151678,1,0,0:0:0:0:
64,192,151867,128,0,151962:0:0:0:0:
448,192,151867,1,0,0:0:0:0:
192,192,152247,128,0,152342:0:0:0:0:
448,192,152437,128,0,152532:0:0:0:0:
320,192,152817,128,0,152912:0:0:0:0:
64,192,153197,128,0,153292:0:0:0:0:
320,192,153576,128,0,153671:0:0:0:0:
192,192,153766,128,0,153861:0:0:0:0:
448,192,153956,128,0,154051:0:0:0:0:
64,192,154146,128,0,154241:0:0:0:0:
448,192,154526,128,0,154621:0:0:0:0:
320,192,154716,128,0,154811:0:0:0:0:
64,192,154905,128,0,155000:0:0:0:0:
192,192,155285,128,0,155380:0:0:0:0:
64,192,155475,128,0,155570:0:0:0:0:
448,192,155665,128,0,155760:0:0:0:0:
320,192,156045,128,0,156140:0:0:0:0:
448,192,156235,128,0,156330:0:0:0:0:
192,192,156424,128,0,156519:0:0:0:0:
64,192,156614,128,0,156709:0:0:0:0:
320,192,156804,128,0,156899:0:0:0:0:
192,192,156994,128,0,157089:0:0:0:0:
448,192,157184,128,0,157279:0:0:0:0:
64,192,157564,128,0,157659:0:0:0:0:
192,192,157754,128,0,157849:0:0:0:0:
320,192,157943,128,0,158038:0:0:0:0:
192,192,158323,128,0,158418:0:0:0:0:
64,192,158513,128,0,158608:0:0:0:0:
448,192,158893,128,0,158988:0:0:0:0:
192,192,159273,128,0,159367:0:0:0:0:
448,192,159652,128,0,159747:0:0:0:0:
320,192,159842,128,0,159937:0:0:0:0:
192,192,160032,128,0,160127:0:0:0:0:
64,192,160222,128,0,160317:0:0:0:0:
320,192,160602,128,0,160697:0:0:0:0:
448,192,160792,128,0,160886:0:0:0:0:
64,192,160981,128,0,161076:0:0:0:0:
320,192,161361,128,0,161456:0:0:0:0:
64,192,161551,128,0,161646:0:0:0:0:
448,192,161741,128,0,161836:0:0:0:0:
320,192,162121,128,0,162216:0:0:0:0:
64,192,162311,128,0,162405:0:0:0:0:
448,192,162690,128,0,162785:0:0:0:0:
192,192,163070,128,0,163165:0:0:0:0:
64,192,163260,128,0,163355:0:0:0:0:
320,192,163830,128,0,164209:0:0:0:0:
448,192,164209,1,0,0:0:0:0:
320,192,164399,1,0,0:0:0:0:
192,192,164589,1,0,0:0:0:0:
64,192,164779,1,0,0:0:0:0:
192,192,164959,128,0,165050:0:0:0:0:
320,192,165140,128,0,165230:0:0:0:0:
448,192,165321,128,0,165411:0:0:0:0:
64,192,165501,1,2,0:0:0:0:
192,192,165501,1,0,0:0:0:40:Hat Open.wav
64,192,165862,1,2,0:0:0:0:
192,192,165862,1,0,0:0:0:0:
64,192,166223,1,2,0:0:0:0:
320,192,166223,1,0,0:0:0:0:
64,192,166585,1,2,0:0:0:0:
320,192,166585,1,0,0:0:0:0:
320,192,166946,1,2,0:0:0:0:
448,192,166946,1,0,0:0:0:0:
320,192,167308,1,2,0:0:0:0:
448,192,167308,1,0,0:0:0:0:
192,192,167669,1,2,0:0:0:0:
448,192,167669,1,0,0:0:0:0:
192,192,168031,1,2,0:0:0:0:
448,192,168031,1,0,0:0:0:0:
64,192,168392,1,2,0:0:0:0:
192,192,168392,1,0,0:0:0:0:
192,192,168754,1,2,0:0:0:0:
320,192,168754,1,0,0:0:0:0:
320,192,169115,1,2,0:0:0:0:
448,192,169115,1,0,0:0:0:0:
64,192,169476,1,2,0:0:0:0:
448,192,169476,1,0,0:0:0:0:
64,192,169657,1,4,0:0:0:0:
320,192,169657,128,2,170019:0:0:0:0:
448,192,169657,128,0,170019:0:0:0:0:
64,192,170019,1,2,0:0:0:0:
192,192,170019,1,0,0:0:0:0:
192,192,170199,1,2,0:0:0:0:
320,192,170199,1,0,0:0:0:0:
320,192,170380,1,0,0:0:0:0:
448,192,170380,1,0,0:0:0:0:
64,192,170561,1,8,0:0:0:0:
192,192,170561,128,2,170741:0:0:0:0:
448,192,170561,1,0,0:0:0:0:
64,192,170922,1,8,0:0:0:0:
320,192,170922,128,2,171103:0:0:0:0:
448,192,170922,1,0,0:0:0:0:
320,192,171284,1,2,0:0:0:0:
448,192,171284,1,4,0:0:0:0:
192,192,171374,1,0,0:0:0:0:
64,192,171464,1,0,0:0:0:0:
320,192,171555,1,0,0:0:0:0:
64,192,171645,1,8,0:0:0:0:
448,192,171645,1,2,0:0:0:0:
192,192,171735,1,0,0:0:0:0:
320,192,171826,1,0,0:0:0:0:
448,192,171916,1,0,0:0:0:0:
64,192,172007,1,2,0:0:0:0:
192,192,172007,1,0,0:0:0:0:
448,192,172097,1,0,0:0:0:0:
320,192,172187,1,0,0:0:0:0:
192,192,172278,1,0,0:0:0:0:
64,192,172368,128,2,172549:0:0:0:0:
448,192,172368,1,8,0:0:0:0:
320,192,172549,128,0,172729:0:0:0:0:
64,192,172729,1,2,0:0:0:0:
192,192,172729,1,0,0:0:0:0:
448,192,172910,128,0,173091:0:0:0:0:
64,192,173091,128,8,173272:0:0:0:0:
320,192,173091,1,2,0:0:0:0:
192,192,173272,128,0,173452:0:0:0:0:
64,192,173452,1,2,0:0:0:0:
448,192,173452,128,0,173633:0:0:0:0:
192,192,173633,1,0,0:0:0:0:
320,192,173814,128,2,173994:0:0:0:0:
448,192,173814,1,8,0:0:0:0:
64,192,173994,128,0,174175:0:0:0:0:
192,192,174175,1,2,0:0:0:0:
448,192,174175,1,0,0:0:0:0:
320,192,174266,1,0,0:0:0:0:
64,192,174356,1,0,0:0:0:0:
192,192,174446,1,0,0:0:0:0:
320,192,174537,1,8,0:0:0:0:
448,192,174537,1,2,0:0:0:0:
192,192,174627,1,0,0:0:0:0:
64,192,174717,1,0,0:0:0:0:
320,192,174808,1,0,0:0:0:0:
64,192,174898,1,2,0:0:0:0:
448,192,174898,1,0,0:0:0:0:
192,192,174988,1,0,0:0:0:0:
320,192,175079,1,0,0:0:0:0:
192,192,175169,1,0,0:0:0:0:
64,192,175260,1,2,0:0:0:0:
448,192,175260,128,8,175440:0:0:0:0:
192,192,175440,128,0,175621:0:0:0:0:
64,192,175621,1,2,0:0:0:0:
448,192,175621,1,0,0:0:0:0:
320,192,175802,128,0,175982:0:0:0:0:
64,192,175982,1,8,0:0:0:0:
448,192,175982,1,2,0:0:0:0:
192,192,176163,128,0,176344:0:0:0:0:
64,192,176344,1,2,0:0:0:0:
320,192,176344,1,0,0:0:0:0:
448,192,176344,128,0,176525:0:0:0:0:
320,192,176525,1,8,0:0:0:0:
192,192,176615,1,8,0:0:0:0:
64,192,176705,128,2,176886:0:0:0:0:
448,192,176705,1,8,0:0:0:0:
192,192,176886,1,8,0:0:0:0:
320,192,176976,1,8,0:0:0:0:
64,192,177067,1,2,0:0:0:0:
448,192,177067,1,4,0:0:0:0:
320,192,177157,1,0,0:0:0:0:
192,192,177247,1,0,0:0:0:0:
64,192,177338,1,0,0:0:0:0:
320,192,177428,1,2,0:0:0:0:
448,192,177428,1,8,0:0:0:0:
64,192,177609,128,0,177790:0:0:0:0:
320,192,177790,1,2,0:0:0:0:
448,192,177790,128,0,177970:0:0:0:0:
192,192,177970,128,0,178151:0:0:0:0:
64,192,178151,128,8,178332:0:0:0:0:
448,192,178151,1,2,0:0:0:0:
320,192,178332,128,0,178513:0:0:0:0:
64,192,178513,1,2,0:0:0:0:
448,192,178513,1,0,0:0:0:0:
192,192,178603,1,0,0:0:0:0:
320,192,178693,1,0,0:0:0:0:
448,192,178784,1,0,0:0:0:0:
64,192,178874,1,2,0:0:0:0:
192,192,178874,1,8,0:0:0:0:
448,192,179055,128,0,179235:0:0:0:0:
192,192,179235,128,2,179416:0:0:0:0:
320,192,179235,1,0,0:0:0:0:
64,192,179416,128,0,179597:0:0:0:0:
320,192,179597,128,8,179778:0:0:0:0:
448,192,179597,1,2,0:0:0:0:
192,192,179778,128,0,179958:0:0:0:0:
64,192,179958,1,2,0:0:0:0:
448,192,179958,128,0,180139:0:0:0:0:
320,192,180139,1,0,0:0:0:0:
64,192,180320,128,2,180501:0:0:0:0:
192,192,180320,1,8,0:0:0:0:
448,192,180320,1,0,0:0:0:0:
320,192,180501,1,0,0:0:0:0:
64,192,180681,1,2,0:0:0:0:
448,192,180681,128,0,180862:0:0:0:0:
192,192,180862,128,0,181043:0:0:0:0:
64,192,181043,128,8,181223:0:0:0:0:
448,192,181043,1,2,0:0:0:0:
320,192,181223,128,0,181404:0:0:0:0:
64,192,181404,1,2,0:0:0:0:
448,192,181404,128,0,181585:0:0:0:0:
320,192,181585,128,0,181766:0:0:0:0:
64,192,181766,128,2,181946:0:0:0:0:
448,192,181766,1,8,0:0:0:0:
192,192,181946,128,0,182127:0:0:0:0:
64,192,182127,1,2,0:0:0:0:
448,192,182127,128,0,182308:0:0:0:0:
320,192,182308,128,0,182488:0:0:0:0:
64,192,182488,128,8,182669:0:0:0:0:
448,192,182488,128,2,182669:0:0:0:0:
64,192,182850,1,2,0:0:0:0:
448,192,182850,1,0,0:0:0:0:
192,192,182940,1,0,0:0:0:0:
320,192,183031,1,0,0:0:0:0:
448,192,183121,1,0,0:0:0:0:
64,192,183211,1,2,0:0:0:0:
192,192,183211,1,8,0:0:0:0:
448,192,183392,128,0,183573:0:0:0:0:
64,192,183573,128,2,183754:0:0:0:0:
192,192,183573,1,0,0:0:0:0:
320,192,183754,128,0,183934:0:0:0:0:
64,192,183934,1,8,0:0:0:0:
448,192,183934,128,2,184115:0:0:0:0:
192,192,184115,128,0,184296:0:0:0:0:
64,192,184296,1,2,0:0:0:0:
448,192,184296,1,0,0:0:0:0:
320,192,184386,1,0,0:0:0:0:
192,192,184476,1,0,0:0:0:0:
64,192,184567,1,0,0:0:0:0:
320,192,184657,1,2,0:0:0:0:
448,192,184657,1,8,0:0:0:0:
64,192,184838,1,0,0:0:0:0:
192,192,184928,1,0,0:0:0:0:
320,192,185019,128,2,185199:0:0:0:0:
448,192,185019,1,0,0:0:0:0:
64,192,185199,128,0,185380:0:0:0:0:
192,192,185380,128,8,185561:0:0:0:0:
448,192,185380,1,2,0:0:0:0:
320,192,185561,128,0,185741:0:0:0:0:
192,192,185741,1,2,0:0:0:0:
448,192,185741,128,0,185922:0:0:0:0:
64,192,185922,128,0,186103:0:0:0:0:
192,192,186103,128,2,186284:0:0:0:0:
320,192,186103,1,8,0:0:0:0:
448,192,186284,128,0,186464:0:0:0:0:
64,192,186464,1,2,0:0:0:0:
320,192,186464,128,0,186645:0:0:0:0:
192,192,186645,128,0,186826:0:0:0:0:
64,192,186826,1,8,0:0:0:0:
448,192,186826,1,0,0:0:0:0:
320,192,187007,128,2,187368:0:0:0:0:
448,192,187007,1,0,0:0:0:0:
64,192,187368,1,8,0:0:0:0:
320,192,187549,1,2,0:0:0:0:
448,192,187549,128,8,187729:0:0:0:0:
192,192,187729,1,8,0:0:0:0:
320,192,187820,1,8,0:0:0:0:
64,192,187910,1,8,0:0:0:0:
448,192,187910,1,0,0:0:0:0:
320,192,188091,1,0,0:0:0:40:Tom1.wav
64,192,188272,128,2,188633:0:0:0:0:
192,192,188272,1,0,0:0:0:40:Tom2.wav
192,192,188633,1,2,0:0:0:0:
448,192,188633,1,0,0:0:0:0:
320,192,188814,1,0,0:0:0:0:
64,192,188994,1,2,0:0:0:0:
448,192,188994,1,0,0:0:0:0:
320,192,189175,1,0,0:0:0:0:
64,192,189356,1,2,0:0:0:0:
448,192,189356,1,0,0:0:0:0:
192,192,189537,1,0,0:0:0:0:
64,192,189717,1,2,0:0:0:0:
320,192,189717,1,0,0:0:0:0:
192,192,189898,1,0,0:0:0:0:
64,192,190079,1,2,0:0:0:0:
448,192,190079,1,0,0:0:0:0:
320,192,190260,1,0,0:0:0:0:
64,192,190440,1,2,0:0:0:0:
192,192,190440,1,0,0:0:0:0:
320,192,190621,1,0,0:0:0:0:
64,192,190802,1,2,0:0:0:0:
448,192,190802,1,0,0:0:0:0:
192,192,190982,1,0,0:0:0:0:
320,192,191163,1,2,0:0:0:0:
448,192,191163,1,0,0:0:0:0:
192,192,191344,1,0,0:0:0:0:
64,192,191525,1,2,0:0:0:0:
448,192,191525,1,0,0:0:0:0:
64,192,191886,1,2,0:0:0:0:
320,192,191886,1,0,0:0:0:0:
192,192,192067,1,0,0:0:0:0:
64,192,192247,1,2,0:0:0:0:
448,192,192247,1,0,0:0:0:0:
320,192,192428,1,0,0:0:0:0:
192,192,192609,1,2,0:0:0:0:
448,192,192609,1,0,0:0:0:0:
64,192,192790,1,8,0:0:0:0:
320,192,192790,128,0,193061:0:0:0:0:
192,192,193151,128,0,193422:0:0:0:0:
64,192,193513,128,0,193693:0:0:0:0:
320,192,193693,1,2,0:0:0:0:
448,192,193693,1,0,0:0:0:0:
64,192,193874,1,8,0:0:0:0:
192,192,193874,1,0,0:0:0:0:
320,192,193964,1,8,0:0:0:0:
64,192,194055,1,2,0:0:0:0:
448,192,194055,1,8,0:0:0:0:
192,192,194145,1,8,0:0:0:0:
320,192,194235,1,8,0:0:0:0:
192,192,194326,1,8,0:0:0:0:
64,192,194416,1,4,0:0:0:0:
448,192,194416,128,2,194597:0:0:0:0:
192,192,194597,128,0,194778:0:0:0:30:Hat Open.wav
320,192,194778,1,2,0:0:0:0:
448,192,194778,128,8,194958:0:0:0:0:
64,192,194958,128,0,195139:0:0:0:30:Hat Open.wav
320,192,195139,1,2,0:0:0:0:
448,192,195139,1,0,0:0:0:0:
64,192,195320,128,0,195501:0:0:0:30:Hat Open.wav
192,192,195501,1,8,0:0:0:0:
448,192,195501,1,2,0:0:0:0:
64,192,195681,128,0,195862:0:0:0:30:Hat Open.wav
192,192,195862,1,2,0:0:0:0:
320,192,195862,128,0,196043:0:0:0:0:
448,192,196043,128,0,196223:0:0:0:30:Hat Open.wav
64,192,196223,1,8,0:0:0:0:
192,192,196223,128,2,196404:0:0:0:0:
320,192,196404,128,0,196585:0:0:0:30:Hat Open.wav
64,192,196585,1,2,0:0:0:0:
192,192,196585,1,0,0:0:0:0:
448,192,196766,128,0,196946:0:0:0:30:Hat Open.wav
192,192,196946,128,2,197127:0:0:0:0:
320,192,196946,1,8,0:0:0:0:
448,192,197127,128,0,197308:0:0:0:30:Hat Open.wav
64,192,197308,128,2,197488:0:0:0:0:
192,192,197308,1,0,0:0:0:0:
320,192,197488,128,0,197669:0:0:0:30:Hat Open.wav
64,192,197669,128,2,197850:0:0:0:0:
192,192,197669,1,8,0:0:0:0:
448,192,197850,128,0,198031:0:0:0:30:Hat Open.wav
64,192,198031,1,2,0:0:0:0:
192,192,198031,1,0,0:0:0:0:
448,192,198211,128,0,198392:0:0:0:30:Hat Open.wav
64,192,198392,1,8,0:0:0:0:
320,192,198392,1,2,0:0:0:0:
448,192,198573,128,0,198754:0:0:0:30:Hat Open.wav
192,192,198754,128,2,198934:0:0:0:0:
320,192,198754,1,0,0:0:0:0:
64,192,198934,128,0,199115:0:0:0:30:Hat Open.wav
320,192,199115,128,8,199296:0:0:0:0:
448,192,199115,1,2,0:0:0:0:
192,192,199296,128,0,199476:0:0:0:30:Hat Open.wav
320,192,199476,1,2,0:0:0:0:
448,192,199476,1,0,0:0:0:0:
64,192,199657,128,0,199838:0:0:0:30:Hat Open.wav
192,192,199838,1,2,0:0:0:0:
448,192,199838,128,8,200019:0:0:0:0:
64,192,200199,128,2,200380:0:0:0:0:
448,192,200199,1,0,0:0:0:0:
320,192,200380,128,0,200561:0:0:0:30:Hat Open.wav
64,192,200561,128,2,200741:0:0:0:0:
192,192,200561,1,8,0:0:0:0:
448,192,200741,128,0,200922:0:0:0:30:Hat Open.wav
64,192,200922,1,2,0:0:0:0:
192,192,200922,1,0,0:0:0:0:
448,192,201103,128,0,201284:0:0:0:30:Hat Open.wav
64,192,201284,1,8,0:0:0:0:
320,192,201284,1,2,0:0:0:0:
448,192,201464,128,0,201645:0:0:0:30:Hat Open.wav
192,192,201645,128,2,201826:0:0:0:0:
320,192,201645,1,0,0:0:0:0:
64,192,201826,128,0,202007:0:0:0:30:Hat Open.wav
320,192,202007,128,8,202187:0:0:0:0:
448,192,202007,1,2,0:0:0:0:
192,192,202187,128,0,202368:0:0:0:30:Hat Open.wav
320,192,202368,1,2,0:0:0:0:
448,192,202368,1,0,0:0:0:0:
64,192,202549,128,0,202729:0:0:0:30:Hat Open.wav
192,192,202729,1,2,0:0:0:0:
320,192,202729,128,8,202910:0:0:0:0:
64,192,202910,128,0,203091:0:0:0:30:Hat Open.wav
320,192,203091,1,2,0:0:0:0:
448,192,203091,128,0,203272:0:0:0:0:
192,192,203272,128,0,203452:0:0:0:30:Hat Open.wav
320,192,203452,1,2,0:0:0:0:
448,192,203452,128,8,203633:0:0:0:0:
64,192,203633,128,0,203814:0:0:0:30:Hat Open.wav
320,192,203814,1,2,0:0:0:0:
448,192,203814,1,0,0:0:0:0:
64,192,203994,128,0,204175:0:0:0:30:Hat Open.wav
192,192,204175,1,8,0:0:0:0:
448,192,204175,1,2,0:0:0:0:
64,192,204356,128,0,204537:0:0:0:30:Hat Open.wav
192,192,204537,1,2,0:0:0:0:
320,192,204537,128,0,204717:0:0:0:0:
448,192,204717,128,0,204898:0:0:0:30:Hat Open.wav
64,192,204898,1,8,0:0:0:0:
192,192,204898,128,2,205079:0:0:0:0:
320,192,205079,128,0,205260:0:0:0:30:Hat Open.wav
64,192,205260,1,2,0:0:0:0:
192,192,205260,1,0,0:0:0:0:
448,192,205440,128,0,205621:0:0:0:30:Hat Open.wav
64,192,205621,128,2,205802:0:0:0:0:
320,192,205621,1,8,0:0:0:0:
192,192,205802,1,0,0:0:0:0:
64,192,205982,1,4,0:0:0:0:
448,192,205982,128,2,206163:0:0:0:0:
64,192,206344,1,2,0:0:0:0:
320,192,206344,128,0,206525:0:0:0:0:
192,192,206705,128,2,206886:0:0:0:0:
448,192,206705,1,0,0:0:0:0:
64,192,207067,128,2,207247:0:0:0:0:
448,192,207067,1,0,0:0:0:0:
64,192,207428,1,2,0:0:0:0:
192,192,207428,128,0,207609:0:0:0:0:
64,192,207790,1,2,0:0:0:0:
320,192,207790,128,0,207970:0:0:0:0:
320,192,208151,1,2,0:0:0:0:
448,192,208151,128,0,208332:0:0:0:0:
64,192,208513,128,2,208693:0:0:0:0:
320,192,208513,1,0,0:0:0:0:
64,192,208874,1,2,0:0:0:0:
448,192,208874,128,0,209055:0:0:0:0:
64,192,209235,1,2,0:0:0:0:
320,192,209235,128,0,209416:0:0:0:0:
192,192,209597,128,2,209778:0:0:0:0:
448,192,209597,1,0,0:0:0:0:
64,192,209958,128,2,210139:0:0:0:0:
448,192,209958,1,0,0:0:0:0:
320,192,210320,1,2,0:0:0:0:
448,192,210320,1,0,0:0:0:0:
64,192,210410,1,0,0:0:0:0:
192,192,210501,1,0,0:0:0:0:
320,192,210591,1,2,0:0:0:0:
448,192,210591,1,0,0:0:0:0:
192,192,210681,1,0,0:0:0:0:
64,192,210772,1,0,0:0:0:0:
320,192,210862,1,2,0:0:0:0:
448,192,210862,1,0,0:0:0:0:
`;
export var osuFile = OSUParser.parse(text)
