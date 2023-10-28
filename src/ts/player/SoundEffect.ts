import {runTask} from "../notify/OsuNotification";
import {Icon} from "../icon/Icon";
import {SoundEffectMap, SoundName} from "./SoundEffectMap";

const audioContext = new AudioContext()

export const Sound: Record<SoundName, AudioBuffer> = {}

export async function loadSoundEffect() {
  await runTask("downloading sound effect", async task => {
    let buffer: ArrayBuffer
    task.progress.value = 0
    let length = SoundEffectMap.length, i = 0
    for (let soundSrc of SoundEffectMap) {
      buffer = await downloadSound(soundSrc.url)
      try {
        Sound[soundSrc.name] = await audioContext.decodeAudioData(buffer)
      } catch (e) {

      }
      task.progress.value = (++i) / length
    }
    task.progress.value = 1
    task.finish("sound effect ok", Icon.Check)
  })
}

async function downloadSound(url: string) {
  const response = await fetch(url)
  return response.arrayBuffer()
}

export function playSound(buffer: AudioBuffer) {
  const source = audioContext.createBufferSource()
  source.buffer = buffer
  source.connect(audioContext.destination)
  source.start()
  source.onended = () => {
    source.stop()
    source.disconnect()
  }
}