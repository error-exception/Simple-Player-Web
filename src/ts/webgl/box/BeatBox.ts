import {Box} from "./Box";
import {BeatDispatcher, IBeat} from "../../global/Beater";
import {BaseDrawableConfig} from "../drawable/Drawable";

export abstract class BeatBox extends Box implements IBeat {

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