import {Toaster} from "../../../global/Toaster";
import OSUPlayer from "../../../player/OSUPlayer";
import {Box} from "../../box/Box";
import {Color} from "../../base/Color";
import {ColorDrawable} from "../../drawable/ColorDrawable";
import {ManiaPanel, NoteData, osuFile} from "./ManiaPanel";

export class ManiaScreen extends Box {

    constructor(gl: WebGL2RenderingContext) {
        super(gl, { 
            size: ['fill-parent', 'fill-parent']
        })

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
            mask,
            mania
        )
    }


}