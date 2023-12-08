import logo from  '../../../assets/logo.png'
import cursor from '../../../assets/cursor.png'
import backIcon from '../../../assets/back_white_48.png'
import approachCircle from '../../../assets/approachcircle.png'
import star from '../../../assets/Star.png'
import whiteRound from '../../../assets/white_round.png'
import ripple from '../../../assets/ripple_new.png'
import legacyLogo from '../../../assets/legacy_logo.png'
import stdNoteCircle from '../../../assets/hitcircleoverlay.png'
import bar from '../../../assets/bar.png'
import borderBar from '../../../assets/border_bar.png'
import square from '../../../assets/square.png'

export type ImageName = string |
  'Logo' |
  'Ripple' |
  'LegacyLogo' |
  'BackIcon' |
  'StdNoteCircle' |
  'ApproachCircle' |
  'Star' |
  'WhiteRound' |
  'Cursor' |
  'Bar' |
  'BorderBar' |
  'Square'

interface ImageSrc {
  name: ImageName,
  url: string
}

export const ImageResourceMap: ImageSrc[] = [
  {
    name: "Logo",
    url: logo
  },
  {
    name: "Ripple",
    url: ripple
  },
  {
    name: "LegacyLogo",
    url: legacyLogo
  },
  {
    name: "Cursor",
    url: cursor
  },
  {
    name: "ApproachCircle",
    url: approachCircle
  },
  {
    name: "StdNoteCircle",
    url: stdNoteCircle
  },
  {
    name: "BackIcon",
    url: backIcon
  },
  {
    name: "WhiteRound",
    url: whiteRound
  },
  {
    name: "Star",
    url: star
  },
  {
    name: "Bar",
    url: bar
  },
  {
    name: "BorderBar",
    url: borderBar
  },
  {
    name: "Square",
    url: square
  }
]