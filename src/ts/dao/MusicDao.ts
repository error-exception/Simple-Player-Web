import {url} from "../Utils";
import AudioPlayerV2 from "../player/AudioPlayer";
import {PlayerState} from "../player/PlayerState";
import {Music, ResponseResult, TimingInfo} from "../type";


class MusicDao {

    async downloadMusic(id: number): Promise<ArrayBuffer> {
        // TODO: remove below
        AudioPlayerV2.playState.value = PlayerState.STATE_DOWNLOADING
        const response = await fetch(url(`/music?id=${id}`))
        return await response.arrayBuffer()
    }

    async getMusicList(): Promise<Music[]> {
        const response = await fetch(url("/musicList"))
        return (await response.json()).data
    }

    async uploadTimingInfo(timingInfo: TimingInfo) {
        return true
        // const response: AxiosResponse<ResponseResult> = await axios.post(url(`uploadTiming`), timingInfo)
        // if (!response.data || response.data.code != 0) {
        //     console.error("request error", response.data.code, response.data.message)
        //     return false
        // } else {
        //     console.log("upload timing info success! id=", timingInfo.id)
        //     return true
        // }
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

    async getTimingById(id: number): Promise<TimingInfo | null> {
        const response = await fetch(url(`/timing?id=${id}`))
        const result = await response.json()
        if (result.code != 0) {
            return null
        }
        return result.data
    }

}

export default new MusicDao()