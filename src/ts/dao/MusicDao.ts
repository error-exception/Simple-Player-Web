import {url} from "../Utils";
import AudioPlayerV2 from "../player/AudioPlayer";
import {PlayerState} from "../player/PlayerState";
import {Music, ResponseResult, TimingInfo} from "../type";


class MusicDao {

    async uploadTimingInfo(timingInfo: TimingInfo) {
        return true
    }

    async getAllTimingList() {
        const response = await fetch(url("/allTimingList"))
        const data: ResponseResult<TimingInfo[]> = await response.json()
        if (data.code === 0 && data.data) {
            return data.data
        } else {
            console.log("fetch all timing failed")
        }
    }

}

export default new MusicDao()