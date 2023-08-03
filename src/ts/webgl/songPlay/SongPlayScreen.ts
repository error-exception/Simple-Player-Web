import {Box} from "./Box";
import {LegacyLogo} from "./LegacyLogo";
import {LegacyLogoAlpha} from "./LegacyLogoAlpha";
import {BaseDrawableConfig} from "./Drawable";
import {Vector2} from "./core/Vector2";
import Coordinate from "./Coordinate";
import {FadeLogo} from "./FadeLogo";
import {Background} from "./MovableBackground";
import {MouseState} from "../MouseState";

export class SongPlayScreen extends Box {

    private readonly background: Background

    constructor(gl: WebGL2RenderingContext) {
        super(gl, {
            width: '100w', height: '100h', x: '-50w', y: '50h'
        });
        const config: BaseDrawableConfig = {
            width: 250,
            height: 250,
            horizontal: "center",
            vertical: "center"
        }
        const translate = new Vector2(-Coordinate.width / 2, 0)
        const background = new Background(gl, {
            x: '-50w',
            y: '50h',
            width: '100w',
            height: '100h'
        })
        this.background = background
        const logo = new LegacyLogo(gl, config)
        const alphaLogo = new LegacyLogoAlpha(gl, config)
        const fadeLogo = new FadeLogo(gl, {
            width: 250,
            height: 250,
            horizontal: "center",
            vertical: "center"
        })
        this.add(background, logo, alphaLogo, fadeLogo)
        logo.translate = translate
        alphaLogo.translate = translate
    }
    protected onUpdate() {
        super.onUpdate();
        const {x, y} = MouseState.position
        const transX = (x - window.innerWidth / 2)
        const transY = (window.innerHeight / 2 - y)
        this.background.translate = new Vector2(transX, transY)
    }
}