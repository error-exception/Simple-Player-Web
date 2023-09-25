import OSUPlayer from "../../player/OSUPlayer";
import PlayManager from "../../player/PlayManager";
import { Box } from "../Box";
import { StdPanel } from "./StdPanel";

export class StdScreen extends Box {

    constructor(gl: WebGL2RenderingContext) {
        super(gl, {
            size: ['fill-parent', 'fill-parent']
        })
        const notes = OSUPlayer.osuStdNotes.value
        if (notes) {
            const panel = new StdPanel(gl, {
                size: ['fill-parent', 'fill-parent'],
                stdNotes: notes
            })
            this.add(panel)
        }
    }

}