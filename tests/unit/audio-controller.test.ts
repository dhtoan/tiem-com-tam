import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AudioMixer, type AudioBus } from '../../src/client/audio/AudioMixer';
import { GrillAudioController } from '../../src/client/audio/GrillAudioController';
import { AUDIO_TRACKS } from '../../src/client/data/audioManifest';

describe('Production Audio System & Controllers', () => {
  let mixer: AudioMixer;

  beforeEach(() => {
    mixer = new AudioMixer();
  });

  describe('AudioMixer Buses & Volume Clamping', () => {
    it('initializes with default volume 1.0 for all 5 buses', () => {
      const buses: AudioBus[] = ['master', 'music', 'ambience', 'sfx', 'ui'];
      for (const bus of buses) {
        expect(mixer.getBusVolume(bus)).toBe(1.0);
        expect(mixer.getEffectiveVolume(bus)).toBe(1.0);
      }
      expect(mixer.isMuted()).toBe(false);
    });

    it('clamps volume inputs between 0.0 and 1.0', () => {
      mixer.setBusVolume('sfx', 1.5);
      expect(mixer.getBusVolume('sfx')).toBe(1.0);

      mixer.setBusVolume('sfx', -0.5);
      expect(mixer.getBusVolume('sfx')).toBe(0.0);

      mixer.setBusVolume('sfx', 0.65);
      expect(mixer.getBusVolume('sfx')).toBe(0.65);
    });

    it('computes effective volume based on master * bus volume', () => {
      mixer.setBusVolume('master', 0.8);
      mixer.setBusVolume('music', 0.5);
      expect(mixer.getEffectiveVolume('music')).toBeCloseTo(0.4);
    });

    it('returns zero effective volume when muted and restores on unmute', () => {
      mixer.setBusVolume('ui', 0.7);
      mixer.setMuted(true);
      expect(mixer.isMuted()).toBe(true);
      expect(mixer.getEffectiveVolume('ui')).toBe(0.0);

      mixer.setMuted(false);
      expect(mixer.isMuted()).toBe(false);
      expect(mixer.getEffectiveVolume('ui')).toBeCloseTo(0.7);
    });

    it('handles visibility change pause and resume properly', () => {
      const visibilityListener = vi.fn();
      mixer.onMuteChange(visibilityListener);

      // Simulate tab backgrounding
      mixer.handleVisibilityChange(true); // isHidden = true
      expect(mixer.isSuspended()).toBe(true);

      // Simulate tab foregrounding
      mixer.handleVisibilityChange(false); // isHidden = false
      expect(mixer.isSuspended()).toBe(false);
    });
  });

  describe('GrillAudioController Singular Loop', () => {
    it('manages a single sizzle intensity loop rather than per-meat instances', () => {
      const grillAudio = new GrillAudioController(mixer);
      expect(grillAudio.getIntensity()).toBe(0.0);
      expect(grillAudio.isLoopActive()).toBe(false);

      // 1 steak on grill -> modest sizzle
      grillAudio.setMeatCount(1);
      expect(grillAudio.isLoopActive()).toBe(true);
      expect(grillAudio.getIntensity()).toBeGreaterThan(0.0);
      const intensity1 = grillAudio.getIntensity();

      // 4 steaks on grill -> higher sizzle intensity, still singular loop
      grillAudio.setMeatCount(4);
      expect(grillAudio.isLoopActive()).toBe(true);
      expect(grillAudio.getIntensity()).toBeGreaterThan(intensity1);

      // 0 steaks -> loop stops or drops to 0 intensity
      grillAudio.setMeatCount(0);
      expect(grillAudio.getIntensity()).toBe(0.0);
      expect(grillAudio.isLoopActive()).toBe(false);
    });

    it('clamps intensity between 0.0 and 1.0 even with large meat count', () => {
      const grillAudio = new GrillAudioController(mixer);
      grillAudio.setMeatCount(20);
      expect(grillAudio.getIntensity()).toBe(1.0);
    });
  });

  describe('Audio Manifest & Licenses', () => {
    it('registers essential audio tracks with license metadata', () => {
      expect(AUDIO_TRACKS.length).toBeGreaterThanOrEqual(5);

      const requiredTrackIds = [
        'music_stall_theme',
        'ambience_street_day',
        'sfx_grill_sizzle',
        'sfx_order_bell',
        'sfx_cash_register',
      ];

      for (const trackId of requiredTrackIds) {
        const track = AUDIO_TRACKS.find((t) => t.id === trackId);
        expect(track, `Missing track ${trackId}`).toBeDefined();
        expect(track?.license).toBeTruthy();
        expect(track?.path).toBeTruthy();
        expect(['music', 'ambience', 'sfx', 'ui']).toContain(track?.bus);
      }
    });
  });
});
