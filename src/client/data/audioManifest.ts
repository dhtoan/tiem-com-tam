import type { AudioBus } from '../audio/AudioMixer';

export interface AudioTrackDefinition {
  id: string;
  name: string;
  path: string;
  bus: AudioBus;
  loop: boolean;
  license: string;
  description: string;
}

export const AUDIO_TRACKS: AudioTrackDefinition[] = [
  {
    id: 'music_stall_theme',
    name: 'Daytime Stall Theme (Carefree)',
    path: '/audio/music/carefree.mp3',
    bus: 'music',
    loop: true,
    license: 'CC-BY 3.0 Kevin MacLeod (incompetech.com)',
    description: 'Upbeat daytime acoustic background music for the broken rice stall',
  },
  {
    id: 'ambience_street_day',
    name: 'Saigon Street Daytime Ambience',
    path: '/audio/ambience/street_day.mp3',
    bus: 'ambience',
    loop: true,
    license: 'Royalty-Free Open Audio License',
    description: 'Subtle street ambience with distant motorbikes and street murmurs',
  },
  {
    id: 'sfx_grill_sizzle',
    name: 'Charcoal Pork Sizzle Loop',
    path: '/audio/sfx/grill_sizzle.mp3',
    bus: 'sfx',
    loop: true,
    license: 'Royalty-Free Open Audio License',
    description: 'Continuous charcoal searing sizzle sound modulated by grill meat count',
  },
  {
    id: 'sfx_order_bell',
    name: 'Order Bell Chime',
    path: '/audio/sfx/order_bell.mp3',
    bus: 'sfx',
    loop: false,
    license: 'Royalty-Free Open Audio License',
    description: 'Pleasant metal bell chime played on successful customer order completion',
  },
  {
    id: 'sfx_cash_register',
    name: 'Cash Register Coin Clink',
    path: '/audio/sfx/cash_register.mp3',
    bus: 'ui',
    loop: false,
    license: 'Royalty-Free Open Audio License',
    description: 'Satisfying mechanical cash drawer sound on receiving payment',
  },
];
