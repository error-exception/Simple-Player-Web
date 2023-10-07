import {BaseDrawableConfig, Drawable} from "./Drawable";
import {BeatDispatcher, IBeat} from "../../global/Beater";

export abstract class BeatDrawable extends Drawable implements IBeat {

    constructor(gl: WebGL2RenderingContext, config: BaseDrawableConfig) {
        super(gl, config);
        BeatDispatcher.register(this)
    }

    abstract onNewBeat(isKiai: boolean, newBeatTimestamp: number, gap: number): void

    public dispose() {
        super.dispose()
        BeatDispatcher.unregister(this)
    }

}