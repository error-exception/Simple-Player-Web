import buttonHover from '../../assets/sound/ui/button-hover.wav';
import buttonSelect from '../../assets/sound/ui/button-select.wav';
import buttonSidebarHover from '../../assets/sound/ui/button-sidebar-hover.wav';
import buttonSidebarSelect from '../../assets/sound/ui/button-sidebar-select.wav';
import checkOff from '../../assets/sound/ui/check-off.wav';
import checkOn from '../../assets/sound/ui/check-on.wav';
import cursorTap from '../../assets/sound/ui/cursor-tap.wav';
import defaultHover from '../../assets/sound/ui/default-hover.wav';
import defaultSelectDisabled from '../../assets/sound/ui/default-select-disabled.wav';
import defaultSelect from '../../assets/sound/ui/default-select.wav';
import dialogCancelSelect from '../../assets/sound/ui/dialog-cancel-select.wav';
import dialogDangerousSelect from '../../assets/sound/ui/dialog-dangerous-select.wav';
import dialogDangerousTick from '../../assets/sound/ui/dialog-dangerous-tick.wav';
import dialogOkSelect from '../../assets/sound/ui/dialog-ok-select.wav';
import dialogPopIn from '../../assets/sound/ui/dialog-pop-in.wav';
import dialogPopOut from '../../assets/sound/ui/dialog-pop-out.wav';
import dropdownClose from '../../assets/sound/ui/dropdown-close.wav';
import dropdownOpen from '../../assets/sound/ui/dropdown-open.wav';
import genericError from '../../assets/sound/ui/generic-error.wav';
import itemSwap from '../../assets/sound/ui/item-swap.wav';
import metronomeLatch from '../../assets/sound/ui/metronome-latch.wav';
import metronomeTickDownbeat from '../../assets/sound/ui/metronome-tick-downbeat.wav';
import metronomeTick from '../../assets/sound/ui/metronome-tick.wav';
import noclickHover from '../../assets/sound/ui/noclick-hover.wav';
import noclickSelect from '../../assets/sound/ui/noclick-select.wav';
import notchTick from '../../assets/sound/ui/notch-tick.wav';
import notificationCancel from '../../assets/sound/ui/notification-cancel.wav';
import notificationDefault from '../../assets/sound/ui/notification-default.wav';
import notificationDone from '../../assets/sound/ui/notification-done.wav';
import notificationError from '../../assets/sound/ui/notification-error.wav';
import notificationMention from '../../assets/sound/ui/notification-mention.wav';
import nowPlayingPopIn from '../../assets/sound/ui/now-playing-pop-in.wav';
import nowPlayingPopOut from '../../assets/sound/ui/now-playing-pop-out.wav';
import osdChange from '../../assets/sound/ui/osd-change.wav';
import osdOff from '../../assets/sound/ui/osd-off.wav';
import osdOn from '../../assets/sound/ui/osd-on.wav';
import osuLogoSelect from '../../assets/sound/menu/osu-logo-select.wav'
import osuLogoHeartbeat from '../../assets/sound/menu/osu-logo-heartbeat.wav'
import osuLogoDownbeat from '../../assets/sound/menu/osu-logo-downbeat.wav'
import overlayBigPopIn from '../../assets/sound/ui/overlay-big-pop-in.wav';
import overlayBigPopOut from '../../assets/sound/ui/overlay-big-pop-out.wav';
import overlayPopIn from '../../assets/sound/ui/overlay-pop-in.wav';
import overlayPopOut from '../../assets/sound/ui/overlay-pop-out.wav';
import rulesetSelectFruits from '../../assets/sound/ui/ruleset-select-fruits.wav';
import rulesetSelectMania from '../../assets/sound/ui/ruleset-select-mania.wav';
import rulesetSelectOsu from '../../assets/sound/ui/ruleset-select-osu.wav';
import rulesetSelectTaiko from '../../assets/sound/ui/ruleset-select-taiko.wav';
import screenBack from '../../assets/sound/ui/screen-back.wav';
import scrolltotopSelect from '../../assets/sound/ui/scrolltotop-select.wav';
import settingsPopIn from '../../assets/sound/ui/settings-pop-in.wav';
import shutter from '../../assets/sound/ui/shutter.wav';
import softHitwhistle from '../../assets/sound/ui/soft-hitwhistle.wav';
import submitSelect from '../../assets/sound/ui/submit-select.wav';
import tabselectSelect from '../../assets/sound/ui/tabselect-select.wav';
import toolbarHover from '../../assets/sound/ui/toolbar-hover.wav';
import toolbarSelect from '../../assets/sound/ui/toolbar-select.wav';
import wavePopIn from '../../assets/sound/ui/wave-pop-in.wav';
import wavePopOut from '../../assets/sound/ui/wave-pop-out.wav';

export type SoundName = string |
  'ButtonHover' |
  'ButtonSelect' |
  'ButtonSidebarHover' |
  'ButtonSidebarSelect' |
  'CheckOff' |
  'CheckOn' |
  'CursorTap' |
  'DefaultHover' |
  'DefaultSelectDisabled' |
  'DefaultSelect' |
  'DialogCancelSelect' |
  'DialogDangerousSelect' |
  'DialogDangerousTick' |
  'DialogOkSelect' |
  'DialogPopIn' |
  'DialogPopOut' |
  'DropdownClose' |
  'DropdownOpen' |
  'GenericError' |
  'ItemSwap' |
  'MetronomeLatch' |
  'MetronomeTickDownbeat' |
  'MetronomeTick' |
  'NoclickHover' |
  'NoclickSelect' |
  'NotchTick' |
  'NotificationCancel' |
  'NotificationDefault' |
  'NotificationDone' |
  'NotificationError' |
  'NotificationMention' |
  'NowPlayingPopIn' |
  'NowPlayingPopOut' |
  'OsdChange' |
  'OsdOff' |
  'OsdOn' |
  'OsuLogoSelect' |
  'OsuLogoDownbeat' |
  'OsuLogoHeartbeat' |
  'OverlayBigPopIn' |
  'OverlayBigPopOut' |
  'OverlayPopIn' |
  'OverlayPopOut' |
  'RulesetSelectFruits' |
  'RulesetSelectMania' |
  'RulesetSelectOsu' |
  'RulesetSelectTaiko' |
  'ScreenBack' |
  'ScrolltotopSelect' |
  'SettingsPopIn' |
  'Shutter' |
  'SoftHitwhistle' |
  'SubmitSelect' |
  'TabselectSelect' |
  'ToolbarHover' |
  'ToolbarSelect' |
  'WavePopIn' |
  'WavePopOut'

interface SoundSrc {
  name: SoundName
  url: string
}
export const SoundEffectMap: SoundSrc[] = [
  {
    name: 'ButtonHover',
    url: buttonHover
  },
  {
    name: 'ButtonSelect',
    url: buttonSelect
  },
  {
    name: 'ButtonSidebarHover',
    url: buttonSidebarHover
  },
  {
    name: 'ButtonSidebarSelect',
    url: buttonSidebarSelect
  },
  {
    name: 'CheckOff',
    url: checkOff
  },
  {
    name: 'CheckOn',
    url: checkOn
  },
  {
    name: 'CursorTap',
    url: cursorTap
  },
  {
    name: 'DefaultHover',
    url: defaultHover
  },
  {
    name: 'DefaultSelectDisabled',
    url: defaultSelectDisabled
  },
  {
    name: 'DefaultSelect',
    url: defaultSelect
  },
  {
    name: 'DialogCancelSelect',
    url: dialogCancelSelect
  },
  {
    name: 'DialogDangerousSelect',
    url: dialogDangerousSelect
  },
  {
    name: 'DialogDangerousTick',
    url: dialogDangerousTick
  },
  {
    name: 'DialogOkSelect',
    url: dialogOkSelect
  },
  {
    name: 'DialogPopIn',
    url: dialogPopIn
  },
  {
    name: 'DialogPopOut',
    url: dialogPopOut
  },
  {
    name: 'DropdownClose',
    url: dropdownClose
  },
  {
    name: 'DropdownOpen',
    url: dropdownOpen
  },
  {
    name: 'GenericError',
    url: genericError
  },
  {
    name: 'ItemSwap',
    url: itemSwap
  },
  {
    name: 'MetronomeLatch',
    url: metronomeLatch
  },
  {
    name: 'MetronomeTickDownbeat',
    url: metronomeTickDownbeat
  },
  {
    name: 'MetronomeTick',
    url: metronomeTick
  },
  {
    name: 'NoclickHover',
    url: noclickHover
  },
  {
    name: 'NoclickSelect',
    url: noclickSelect
  },
  {
    name: 'NotchTick',
    url: notchTick
  },
  {
    name: 'NotificationCancel',
    url: notificationCancel
  },
  {
    name: 'NotificationDefault',
    url: notificationDefault
  },
  {
    name: 'NotificationDone',
    url: notificationDone
  },
  {
    name: 'NotificationError',
    url: notificationError
  },
  {
    name: 'NotificationMention',
    url: notificationMention
  },
  {
    name: 'NowPlayingPopIn',
    url: nowPlayingPopIn
  },
  {
    name: 'NowPlayingPopOut',
    url: nowPlayingPopOut
  },
  {
    name: 'OsdChange',
    url: osdChange
  },
  {
    name: 'OsdOff',
    url: osdOff
  },
  {
    name: 'OsdOn',
    url: osdOn
  },
  {
    name: 'OsuLogoSelect',
    url: osuLogoSelect
  },
  {
    name: "OsuLogoDownbeat",
    url: osuLogoDownbeat
  },
  {
    name: "OsuLogoHeartbeat",
    url: osuLogoHeartbeat
  },
  {
    name: 'OverlayBigPopIn',
    url: overlayBigPopIn
  },
  {
    name: 'OverlayBigPopOut',
    url: overlayBigPopOut
  },
  {
    name: 'OverlayPopIn',
    url: overlayPopIn
  },
  {
    name: 'OverlayPopOut',
    url: overlayPopOut
  },
  {
    name: 'RulesetSelectFruits',
    url: rulesetSelectFruits
  },
  {
    name: 'RulesetSelectMania',
    url: rulesetSelectMania
  },
  {
    name: 'RulesetSelectOsu',
    url: rulesetSelectOsu
  },
  {
    name: 'RulesetSelectTaiko',
    url: rulesetSelectTaiko
  },
  {
    name: 'ScreenBack',
    url: screenBack
  },
  {
    name: 'ScrolltotopSelect',
    url: scrolltotopSelect
  },
  {
    name: 'SettingsPopIn',
    url: settingsPopIn
  },
  {
    name: 'Shutter',
    url: shutter
  },
  {
    name: 'SoftHitwhistle',
    url: softHitwhistle
  },
  {
    name: 'SubmitSelect',
    url: submitSelect
  },
  {
    name: 'TabselectSelect',
    url: tabselectSelect
  },
  {
    name: 'ToolbarHover',
    url: toolbarHover
  },
  {
    name: 'ToolbarSelect',
    url: toolbarSelect
  },
  {
    name: 'WavePopIn',
    url: wavePopIn
  },
  {
    name: 'WavePopOut',
    url: wavePopOut
  },
]