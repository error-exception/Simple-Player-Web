import { ref } from "vue";

export enum BackgroundType {
  Default = "default",
  Beatmap = "beatmap",
  Custom = "custom"
}

export class OSUConfig {

  public static backgroundType = ref(BackgroundType.Default);

  public static showStoryboard = ref(false);

  public static loadVideo = ref(false);

}