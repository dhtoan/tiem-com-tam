export type AudioBus = 'master' | 'music' | 'ambience' | 'sfx' | 'ui';

export class AudioMixer {
  private busVolumes: Record<AudioBus, number> = {
    master: 1.0,
    music: 1.0,
    ambience: 1.0,
    sfx: 1.0,
    ui: 1.0,
  };

  private muted = false;
  private suspended = false;
  private muteListeners = new Set<(muted: boolean) => void>();
  private volumeListeners = new Set<(bus: AudioBus, volume: number) => void>();

  constructor() {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        this.handleVisibilityChange(document.hidden);
      });
    }
  }

  public getBusVolume(bus: AudioBus): number {
    return this.busVolumes[bus];
  }

  public setBusVolume(bus: AudioBus, volume: number): void {
    const clamped = Math.max(0.0, Math.min(1.0, volume));
    this.busVolumes[bus] = clamped;
    this.volumeListeners.forEach((listener) => listener(bus, clamped));
  }

  public getEffectiveVolume(bus: AudioBus): number {
    if (this.muted || this.suspended) {
      return 0.0;
    }
    if (bus === 'master') {
      return this.busVolumes.master;
    }
    return this.busVolumes.master * this.busVolumes[bus];
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(muted: boolean): void {
    if (this.muted !== muted) {
      this.muted = muted;
      this.muteListeners.forEach((listener) => listener(muted));
    }
  }

  public isSuspended(): boolean {
    return this.suspended;
  }

  public handleVisibilityChange(hidden: boolean): void {
    this.suspended = hidden;
  }

  public onMuteChange(callback: (muted: boolean) => void): () => void {
    this.muteListeners.add(callback);
    return () => this.muteListeners.delete(callback);
  }

  public onVolumeChange(callback: (bus: AudioBus, volume: number) => void): () => void {
    this.volumeListeners.add(callback);
    return () => this.volumeListeners.delete(callback);
  }
}
