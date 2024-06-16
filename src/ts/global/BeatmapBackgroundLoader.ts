import OSUPlayer from "../player/OSUPlayer";

class BeatmapBackgroundLoader {

  public async init() {}

  public getBackground(): ImageBitmap {
    const osz = OSUPlayer.currentOSZFile.value
    const osu = OSUPlayer.currentOSUFile.value
    const background = osu.Events?.imageBackground!
    return osz.getImageBitmap(background)!
  }

}

export default new BeatmapBackgroundLoader()