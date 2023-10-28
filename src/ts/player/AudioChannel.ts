import AudioPlayer from "./AudioPlayer";
import OSUPlayer from "./OSUPlayer";

class AudioChannel {
  private left: Float32Array = new Float32Array(0)
  private right : Float32Array = new Float32Array(0)
  private buffer: AudioBuffer = new AudioBuffer({
    sampleRate: 48000,
    length: 1
  })
  constructor() {
    OSUPlayer.onChanged.collect(() => {
      const audioBuffer = AudioPlayer.getAudioBuffer()
      this.buffer = audioBuffer
      if (audioBuffer.numberOfChannels >= 2) {
        this.left = audioBuffer.getChannelData(0)
        this.right = audioBuffer.getChannelData(1)
      } else {
        this.left = this.right = audioBuffer.getChannelData(0)
      }
    })
  }
  private leftChannelVolume = 0
  private rightChannelVolume = 0
  public update(currentTime: number) {
    if (AudioPlayer.isPlaying()) {
      this.leftChannelVolume = calculateAmplitude(this.buffer.sampleRate, this.left, currentTime)
      this.rightChannelVolume = calculateAmplitude(this.buffer.sampleRate, this.right, currentTime)
    } else {
      this.leftChannelVolume = 0
      this.rightChannelVolume = 0
    }
  }
  public leftVolume(): number {
    return this.leftChannelVolume
  }
  public rightVolume(): number {
    return this.rightChannelVolume
  }
  public maxVolume() {
    return Math.max(this.leftChannelVolume, this.rightChannelVolume)
  }
  public get leftChannelData(): Float32Array {
    return this.left
  }
  public get rightChannelData(): Float32Array {
    return this.right
  }
}

function calculateAmplitude(sampleRate: number, channelData: Float32Array, time: number) {
  const fromTime = time;
  const toTime = time + (1 / 60) * 1000
  const fromIndex = Math.min(Math.floor(fromTime * (sampleRate / 1000)), channelData.length)
  const toIndex = Math.min(Math.floor(toTime * (sampleRate / 1000)), channelData.length)
  let max = -1, min = 1
  for (let i = fromIndex; i <= toIndex; i++) {
    const value = channelData[i]
    if (value > max) max = value
    if (value < min) min = value
  }
  // console.log(max, min)
  return (max - min) / 2
}

// // 计算指定时刻单个声道的音量（使用线性插值）
// function calculateChannelVolumeAtTime(sampleRate: number, channelData: Float32Array, time: number) {
//   // const sampleRate = audioBuffer.sampleRate;
//   // const channelData = audioBuffer.getChannelData(channelIndex);
//   const totalSamples = channelData.length;
//   // 计算指定时刻对应的采样点索引和小数部分
//   const sampleIndex = time * (sampleRate / 1000);
//   const integerIndex = Math.floor(sampleIndex);
//   const fraction = sampleIndex - integerIndex;
//
//   // 确保采样点索引不超过音频数据范围
//   const clampedIndex1 = Math.max(0, Math.min(integerIndex, totalSamples - 1));
//   const clampedIndex2 = Math.max(0, Math.min(integerIndex + 1, totalSamples - 1));
//
//   // 获取两个相邻采样点的值
//   const value1 = channelData[clampedIndex1] * 2 - 1;
//   const value2 = channelData[clampedIndex2] * 2 - 1;
//
//   // 使用线性插值计算指定时刻的音量值
//   const interpolatedValue = value1 + (value2 - value1) * fraction;
//   // const squaredValue = interpolatedValue * interpolatedValue;
//   const squaredValue = Math.max(0, Math.min(interpolatedValue * interpolatedValue, 1));
//   // 开方得到音量值
//   const rms = Math.sqrt(squaredValue);
//   return rms;
// }
//
// export function calculateRMS(sampleRate: number, data: Float32Array, currentTime: number, wind: number = 2048) {
//   const unit = sampleRate / 1000
//   const index = int(currentTime * unit)
//   let sum = 0
//   if (!ArrayUtils.inBound(data, index)) {
//     return 0
//   }
//   if (data.length - index < wind) {
//     let i = data.length - 1
//     let max = data[i]
//     for (; i > data.length - 1 - wind; i--) {
//       if (Math.abs(data[i]) > max) max = data[i]
//     }
//     i = data.length - 1
//     for (; i > data.length - 1 - wind; i--) {
//       sum += ((data[i] / max) ** 2)
//     }
//   } else {
//     let i = index
//     let max = data[i]
//     for (; i < index + wind; i++) {
//       if (Math.abs(data[i]) > max) max = data[i]
//     }
//     i = index
//     for (;i < index + wind; i++) {
//       sum += ((data[i] / max) ** 2)
//     }
//   }
//   return clamp(Math.sqrt(sum / wind), 0, 1)
// }
//

export default new AudioChannel()