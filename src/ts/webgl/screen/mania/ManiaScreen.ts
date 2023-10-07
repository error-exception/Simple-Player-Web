import BackgroundLoader from "../../../global/BackgroundLoader";
import {MouseState} from "../../../global/MouseState";
import {Toaster} from "../../../global/Toaster";
import OSUPlayer, {OSUBackground} from "../../../player/OSUPlayer";
import {Box} from "../../box/Box";
import {Color} from "../../base/Color";
import {ColorDrawable} from "../../drawable/ColorDrawable";
import {Background} from "../main/MovableBackground";
import {VideoBackground} from "../songPlay/VideoBackground";
import {ManiaPanel, NoteData, osuFile} from "./ManiaPanel";

export class ManiaScreen extends Box {
    private readonly background: Background
    private readonly videoBackground: VideoBackground;

    private collector = (bg: OSUBackground) => {
        
        if (bg.video) {
            this.videoBackground.isVisible = true
            this.videoBackground.setVideo(bg.video)
            this.background.isVisible = false
        } else if (bg.image) {
            // this.post(() => {
                this.background.isVisible = true
                this.videoBackground.isVisible = false
                this.background.updateBackground2(bg.image!)
            // })
        } else {
            // this.post(() => {
                this.background.isVisible = true
                this.videoBackground.isVisible = false
                this.background.updateBackground2(BackgroundLoader.getBackground())
            // })
        }

        // console.log(this.background.isVisible, this.videoBackground.isVisible)

    }

    constructor(gl: WebGL2RenderingContext) {
        super(gl, { 
            size: ['fill-parent', 'fill-parent']
        })
        this.background = new Background(gl, OSUPlayer.background.value.image)
        this.videoBackground = new VideoBackground(gl, null)
        OSUPlayer.background.collect(this.collector)

        const trackWidth: number[] = new Array(4).fill(80)
        const offsetLeft = 400
        const trackGap = 8
        let data: NoteData[][]
        if (OSUPlayer.maniaNoteData.value !== null) {
            data = OSUPlayer.maniaNoteData.value
        } else {
            data = osuFile.NoteData!
            Toaster.show("Mania Note is Empty, use default")
        }
        const mania = new ManiaPanel(
            gl,
            offsetLeft,
            trackWidth[0],
            trackGap,
            data
        )
        const mask = new ColorDrawable(gl, {
            size: ['fill-parent', 'fill-parent'],
            color: Color.fromHex(0x000000, 0xcc)
        })
        this.add(
            this.background,
            this.videoBackground,
            mask,
            mania
        )
    }

    protected onUpdate() {
        super.onUpdate();
        this.background.translate = MouseState.position.copy()
    }

    public dispose() {
        super.dispose();
        OSUPlayer.background.removeCollect(this.collector)
    }

}