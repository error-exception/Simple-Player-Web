import {Box} from "./Box";
import {BeatDispatcher, BeatState, IBeat} from "../Beater";
import {BaseDrawableConfig} from "./Drawable";
import {Logo} from "./Logo";
import {Ripple} from "./Ripple";
import {RoundVisualizer} from "./RoundVisualizer";
import {easeInCubic, easeOut, easeOutCubic, easeOutElastic, easeOutQuint} from "../util/Easing";
import AudioPlayerV2 from "../player/AudioPlayer";
import {Time} from "../Time";
import {Vector2, createV2} from "./core/Vector2";
import {LogoTriangles} from "./LogoTriangles";
import {MouseState} from "../MouseState";
import {Interpolation} from "./Interpolation";
import { init } from "../Utils";
import { Axis } from "./layout/Axis";
import Coordinate from "./Coordinate";
import { onEnterMenu } from "../GlobalState";

class BeatLogo extends Box implements IBeat {

    // @ts-ignore
    private readonly logo: Logo
    private readonly ripple: Ripple
    private readonly triangles: LogoTriangles

    constructor(gl: WebGL2RenderingContext, config: BaseDrawableConfig) {
        super(gl, config);
        // const logo = new Logo(gl, {
        //     width: 520,
        //     height: 520,
        //     vertical: "center",
        //     horizontal: "center"
        // })

        // this.size = createV2(Coordinate.width, Coordinate.height)
        // this.anchor = Axis.X_CENTER | Axis.Y_CENTER

        const logo = new Logo(gl, {
            size: [520, 520],
        })
        // const ripple = new Ripple(gl, {
        //     width: 500,
        //     height: 500,
        //     vertical: "center",
        //     horizontal: "center"
        // })
        const ripple = new Ripple(gl, {
            size: [500, 500]
        })
        // const triangles = new LogoTriangles(gl, {
        //     width: 500,
        //     height: 500,
        //     vertical: "center",
        //     horizontal: "center"
        // })
        const triangles = new LogoTriangles(gl, {
            size: [500, 500]
        })
        this.logo = logo
        this.ripple = ripple
        this.triangles = triangles
        this.add(
            ripple,
            triangles,
            logo
        )
        BeatDispatcher.register(this)

    }

    public onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number) {
        if (!BeatState.isAvailable) {
            return;
        }
        const volume = BeatState.nextBeatRMS
        const adjust = Math.min(volume + 0.4, 1)
        this.scaleBegin()
            .scaleTo(1 - adjust * 0.03, 60, easeOut)
            .scaleTo(1, gap * 2, easeOutQuint)

        this.triangles.velocityBegin()
            .transitionTo(1 + adjust + (BeatState.isKiai ? 4 : 0), 60, easeOut)
            .transitionTo(0, gap * 2, easeOutQuint)

        if (BeatState.isKiai) {
            this.triangles.lightBegin()
                .transitionTo(0.2, 60, easeOut)
                .transitionTo(0, gap * 2, easeOutQuint)
        }

        const ripple = this.ripple
        ripple.scaleBegin()
            .scaleTo(1)
            .scaleTo(1.1, gap, easeOutQuint)
        ripple.fadeBegin()
            .fadeTo(0.6)
            .fadeTo(0, gap, easeOutQuint)
    }

    public dispose() {
        super.dispose();
        BeatDispatcher.unregister(this)
    }

}

class LogoBeatBox extends Box {

    private readonly beatLogo: BeatLogo

    constructor(gl: WebGL2RenderingContext, config: BaseDrawableConfig) {
        super(gl, config);
        // this.size = createV2(Coordinate.width, Coordinate.height)
        // this.anchor = Axis.X_CENTER | Axis.Y_CENTER

        this.beatLogo = new BeatLogo(gl, config)
        this.add(
            this.beatLogo
        )
    }

    protected onUpdate() {
        if (AudioPlayerV2.isPlaying()) {
            if (BeatState.isAvailable) {
                const scale = this.scale
                const a = Interpolation.dump(
                    scale.x,
                    1 - Math.min(BeatState.currentRMS - 0.4,1) * 0.0635,
                    0.9,
                    Time.elapsed
                )
                scale.x = a
                scale.y = a
                this.scale = scale
            } else {
                const a = 1 - BeatState.currentRMS * 0.08
                this.scale = new Vector2(a, a)
            }
        }
    }

}

class LogoAmpBox extends Box {

    private readonly visualizer: RoundVisualizer
    private readonly logoBeatBox: LogoBeatBox

    constructor(gl: WebGL2RenderingContext, config: BaseDrawableConfig) {
        super(gl, config);
        // this.size = createV2(Coordinate.width, Coordinate.height);
        // this.anchor = Axis.X_CENTER | Axis.Y_CENTER;

        this.visualizer = new RoundVisualizer(gl, { size: ['fill-parent', 'fill-parent'] })

        this.logoBeatBox = new LogoBeatBox(gl, config)
        this.add(
            this.visualizer,
            this.logoBeatBox
        )
    }

    public onHover(): boolean {
        this.scaleBegin()
            .scaleTo(1.1, 500, easeOutElastic)
        return true
    }

    public onHoverLost(): boolean {
        this.scaleBegin()
            .scaleTo(1, 500, easeOutElastic)
        return true
    }
}

export class LogoBounceBox extends Box {

    private readonly logoAmpBox: LogoAmpBox

    constructor(gl: WebGL2RenderingContext, config: BaseDrawableConfig) {
        super(gl, config);

        this.logoAmpBox = new LogoAmpBox(gl, { size: config.size })
        this.add(this.logoAmpBox)
    }

    // public onMouseDown(which: number): boolean {
    //     this.scaleBegin()
    //         .scaleTo(0.9 * this._scale.x, 1000, easeOutSine)
    //     return true
    // }
    //
    // private flag = true
    // public onMouseUp(which: number): boolean {
    //     if (this.flag) {
    //         this.translateBegin()
    //             .translateTo(new Vector2(-600, 50), 400, easeInCubic)
    //         this.scaleBegin()
    //             .scaleTo(0.4, 400, easeInCubic)
    //     } else {
    //         this.translateBegin()
    //             .translateTo(new Vector2(0, 0), 400, easeOutCubic)
    //         this.scaleBegin()
    //             .scaleTo(1, 400, easeOutCubic)
    //     }
    //     this.flag = !this.flag
    //     return true
    // }

    private flag = false
    private startPosition = Vector2.newZero()
    public onDrag(which: number): boolean {
        const position = MouseState.position
        if (!this.flag) {
            this.flag = true
            this.startPosition.x = MouseState.position.x
            this.startPosition.y = MouseState.position.y
        }
        this.translate = new Vector2(
            (position.x - this.startPosition.x) * 0.05,
            (position.y - this.startPosition.y) * 0.05
        )
        // console.log(this._translate)
        return true
    }

    public onDragLost(which: number): boolean {
        this.flag = false
        this.translateBegin()
            .translateTo(new Vector2(0, 0), 600, easeOutElastic)
        return true
    }
}

export class BeatLogoBox extends Box {

    private readonly logoBounceBox: Box

    constructor(gl: WebGL2RenderingContext, config: BaseDrawableConfig) {
        super(gl, config);
        // this.size = createV2(Coordinate.width, Coordinate.height)
        // this.anchor = Axis.X_CENTER | Axis.Y_CENTER

        this.logoBounceBox = new LogoBounceBox(gl, { size: config.size })
        this.add(this.logoBounceBox)
    }

    private flag = true
    public onClick(which: number): boolean {
        if (this.flag) {
            this.translateBegin()
                .translateTo(new Vector2(-400, 80), 400, easeInCubic)
            this.scaleBegin()
                .scaleTo(0.5, 400, easeInCubic)
        } else {
            this.translateBegin()
                .translateTo(new Vector2(0, 0), 400, easeOutCubic)
            this.scaleBegin()
                .scaleTo(1, 400, easeOutCubic)
        }
        const v = this.flag
        setTimeout(() => onEnterMenu.emit(v), 400);
        this.flag = !this.flag
        return true
    }

}