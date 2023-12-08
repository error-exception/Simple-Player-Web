import {Color} from "../../base/Color";
import {Transform} from "../../base/Transform";

export interface IEntry {
  color: Color
  transform: Transform
  verticalFlip: boolean
  horizontalFlip: boolean
  additiveBlend: boolean
}