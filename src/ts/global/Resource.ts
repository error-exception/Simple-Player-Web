import {FileProvider, type OFile} from "../file/OFile";

export class Resource {

  public static Background: OFile

  public static Beatmap: OFile

  public static async init() {
    try {
      //@ts-ignore
      const handle = await window.showDirectoryPicker();
      FileProvider.init(handle)
      this.Background = await FileProvider.getFileByPath('/Background')
      this.Beatmap = await FileProvider.getFileByPath('/Beatmap')
      return true
    } catch (e) {
      return false
    }
  }

}