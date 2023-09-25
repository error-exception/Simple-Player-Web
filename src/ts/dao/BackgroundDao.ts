import { int, url } from "../Utils"
import { ResponseResult } from "../type"

class BackgroundDao {
    
    async downloadBackground(name: string): Promise<Blob | null> {
        const response = await fetch(url("/background?name=" + name))
        if (int(response.status / 100) !== 2) {
            return null
        }
        return await response.blob()
    }

    async getBackgroundList(): Promise<string[] | null> {
        const response = await fetch(url("/backgroundList"))
        const data: ResponseResult<string[]> = await response.json()
        if (!data.data) {
            return null
        }
        return data.data
    }

}

export default new BackgroundDao()