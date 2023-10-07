import BackgroundLoader from "../../../global/BackgroundLoader";
import {MouseState} from "../../../global/MouseState";
import OSUPlayer, {OSUBackground} from "../../../player/OSUPlayer";
import {LogoBounceBox} from "../main/BeatLogoBox";
import {Box} from "../../box/Box";
import {Background} from "../main/MovableBackground";
import {VideoBackground} from "./VideoBackground";
import {Vector2} from "../../core/Vector2";
import {Axis} from "../../layout/Axis";
import {FadeLogo} from "./FadeLogo";
import {easeOutBack} from "../../../util/Easing";

export class SongPlayScreen extends Box {

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
        });
        console.log("reload song play screen");
        
        this.background = new Background(gl, OSUPlayer.background.value.image)
        this.videoBackground = new VideoBackground(gl, null)
        OSUPlayer.background.collect(this.collector)

        const fadeLogo = new FadeLogo(gl, {
            size: [250, 250]
        })
        const logo = new LogoBounceBox(gl, { 
            size: [520, 520],
            anchor: Axis.X_RIGHT | Axis.Y_BOTTOM,
            offset: [ 250 - 66, -250 + 24]
        })
        logo.scale = new Vector2(0.4, 0.4)
        logo.translate = new Vector2(0, -128)
        logo.translateBegin()
            .translateTo(new Vector2(0, 0), 400, easeOutBack)
        this.add(
            this.background,
            this.videoBackground,
            fadeLogo,
            logo
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