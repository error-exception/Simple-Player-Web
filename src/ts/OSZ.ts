import JSZip from "jszip";
import {OSUParser} from "./OSUParser";
import {OSUFile} from "./OSUFile";
import { NoteData } from "./webgl/mania/ManiaPanel";
import OSUPlayer from "./player/OSUPlayer";
import { BulletTimingPointsItem, newBullet, BulletTimingPoints } from "./type";

export class OSZ {

    public audio: ArrayBuffer | null = null
    public osuFile: OSUFile | null = null
    public backgroundImage: Blob | null = null
    public backgroundVideo: Blob | null = null
    public videoFormat: string = ''
    public maniaNoteData: NoteData[][] | null = null

    private constructor(private oszFile: File) {}

    private async decompress() {
        const zip = await JSZip.loadAsync(this.oszFile)
        const filenames = Object.getOwnPropertyNames(zip.files)
        // const osuFilenames = filenames.filter(filename => filename.endsWith('.osu'))
        const osuFilename = filenames.find(name => name.endsWith('.osu'))
        if (!osuFilename) return
        const content = await zip.file(osuFilename)?.async("string")
        if (!content) return
        const osuFile = OSUParser.parse(content)
        this.osuFile = osuFile
        if (osuFile.General && osuFile.General.AudioFilename) {
            const audio = await zip.file(osuFile.General.AudioFilename)?.async("arraybuffer")
            if (audio) this.audio = audio
        }
        if (osuFile.Events && osuFile.Events.imageBackground) {
            const background = await zip.file(osuFile.Events.imageBackground)?.async('blob')
            if (background) this.backgroundImage = background
        }
        if (osuFile.Events && osuFile.Events.videoBackground) {
            const path = osuFile.Events.videoBackground
            this.videoFormat = path.substring(path.lastIndexOf('.')).toLowerCase()
            const video = await zip.file(osuFile.Events.videoBackground)?.
                async("blob")
            if (video) {
                this.backgroundVideo = video
            }
        }
        if (osuFile.NoteData) {
            this.maniaNoteData = osuFile.NoteData
        }

    }

    public static async newOSZ(file: File): Promise<OSZ> {
        const osz = new OSZ(file)
        await osz.decompress()
        return osz
    }

}


export function loadOSZ(file: File) {
    OSZ.newOSZ(file).then(osz => {
        load(osz)
    })
}
async function load(osz: OSZ) {
    const timingList: BulletTimingPointsItem[] = []
    const osuFile = osz.osuFile!
    const osuTimingList = osuFile.TimingPoints!.timingList
    let needAddNext = false
    for (let i = 0; i < osuTimingList.length; i++) {
        const item = osuTimingList[i]
        if (item.isKiai) {
            needAddNext = true
            timingList.push({
                isKiai: true,
                offset: item.offset
            })
            continue
        }
        if (needAddNext) {
            needAddNext = false
            timingList.push({
                isKiai: false,
                offset: item.offset
            })
        }
    }
    const bullet = newBullet()
    bullet.general.from = 'osu'
    bullet.general.previewTime = osuFile.General!.PreviewTime

    bullet.noteData = osuFile.NoteData
    bullet.stdNotes = osuFile.HitObjects?.stdNotes

    const timing: BulletTimingPoints = {
        beatGap: osuFile.TimingPoints!.beatGap,
        offset: osuFile.TimingPoints!.offset,
        timingList
    }
    bullet.timingPoints = timing
    bullet.metadata.title = osuFile.Metadata!.TitleUnicode
    bullet.metadata.artist = osuFile.Metadata!.ArtistUnicode

    bullet.metadata.source = osz.audio!
    if (osz.backgroundImage) {
        bullet.events.backgroundImage = osz.backgroundImage
    }
    if (osz.backgroundVideo) {
        bullet.events.backgroundVideo = osz.backgroundVideo
    }
    await OSUPlayer.setSource(bullet)
    await OSUPlayer.seek(bullet.general.previewTime)
    await OSUPlayer.play()
}
