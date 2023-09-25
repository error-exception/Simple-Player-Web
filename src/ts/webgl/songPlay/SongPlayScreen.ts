import BackgroundLoader from "../../BackgroundLoader";
import { MouseState } from "../../MouseState";
import OSUPlayer, { OSUBackground } from "../../player/OSUPlayer";
import { BeatLogoBox, LogoBounceBox } from "../BeatLogoBox";
import { Box } from "../Box";
import Coordinate from "../Coordinate";
import { Logo } from "../Logo";
import { Background } from "../MovableBackground";
import { VideoBackground } from "../VideoBackground";
import { Vector2 } from "../core/Vector2";
import { Axis } from "../layout/Axis";
import { FadeLogo } from "./FadeLogo";
import { LegacyLogo } from "./LegacyLogo";
import { LegacyLogoAlpha } from "./LegacyLogoAlpha";
import { BackButton } from './BackButton';

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
        
        // const logo = new LegacyLogo(gl, {
        //     size: [250, 250],
        //     anchor: Axis.X_RIGHT | Axis.Y_BOTTOM,
        //     offset: [38, -65]
        // })
        // const alphaLogo = new LegacyLogoAlpha(gl, {
        //     size: [250, 250],
        //     anchor: Axis.X_RIGHT | Axis.Y_BOTTOM,
        //     offset: [38, -65]
        // })
        const fadeLogo = new FadeLogo(gl, {
            size: [250, 250]
        })
        const logo = new LogoBounceBox(gl, { 
            size: [520, 520],
            anchor: Axis.X_RIGHT | Axis.Y_BOTTOM,
            offset: [ 250 - 66, -250 + 24]
        })
        // logo.translate = new Vector2(
        //     Coordinate.width / 2 - 250 + 38,
        //     -(Coordinate.height / 2 - 250)
        // )
        logo.scale = new Vector2(0.4, 0.4)
        // const navigate = new Navigate(gl)
        // const backButton = new BackButton(gl)
        this.add(
            this.background,
            this.videoBackground,
            // navigate,
            // logo,
            // alphaLogo,
            fadeLogo,
            logo,
            // backButton
        )

    }
    protected onUpdate() {
        super.onUpdate();
        const {x, y} = MouseState.position
        // const transX = (x - window.innerWidth / 2)
        // const transY = (window.innerHeight / 2 - y)
        this.background.translate = new Vector2(x, y)
    }

    public dispose() {
        super.dispose();
        OSUPlayer.background.removeCollect(this.collector)
    }
}