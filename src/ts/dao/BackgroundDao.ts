import { int, url } from "../Utils"
import { ResponseResult } from "../type"
import bg1 from '../../../public/background/menu-background-1.jpg'
import bg2 from '../../../public/background/menu-background-2.jpg'
import bg3 from '../../../public/background/menu-background-3.jpg'
import bg4 from '../../../public/background/menu-background-4.jpg'
import bg5 from '../../../public/background/menu-background-5.jpg'
import bg6 from '../../../public/background/menu-background-6.jpg'
import bg7 from '../../../public/background/menu-background-7.jpg'
import {PLAYER} from "../build";

class BackgroundDao {
    
    async downloadBackground(name: string): Promise<Blob | null> {
        let response: Response
        if (PLAYER) {
            response = await fetch(url("/background?name=" + name))
        } else {
            response = await fetch(name)
        }
        if (int(response.status / 100) !== 2) {
            return null
        }
        return await response.blob()

    }

    async getBackgroundList(): Promise<string[] | null> {
        if (PLAYER) {
            const response = await fetch(url("/backgroundList"))
            const data: ResponseResult<string[]> = await response.json()
            if (!data.data) {
                return null
            }
            return data.data
        } else {
            return [bg1, bg2, bg3, bg4, bg5, bg6, bg7]
        }
    }

}

export default new BackgroundDao()