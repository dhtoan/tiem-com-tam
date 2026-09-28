import type { AudioMixer } from './AudioMixer';

export class GrillAudioController {
  private mixer: AudioMixer;
  private meatCount = 0;
  private intensity = 0.0;
  private loopActive = false;

  constructor(mixer: AudioMixer) {
    this.mixer = mixer;
  }

  public setMeatCount(count: number): void {
    this.meatCount = Math.max(0, count);
    if (this.meatCount === 0) {
      this.intensity = 0.0;
      this.loopActive = false;
    } else {
      this.loopActive = true;
      // 1 piece = 0.35 intensity, 4+ pieces = 1.0
      this.intensity = Math.min(1.0, Math.max(0.0, this.meatCount * 0.25 + 0.1));
    }
  }

  public getIntensity(): number {
    return this.intensity;
  }

  public isLoopActive(): boolean {
    return this.loopActive;
  }

  public getVolume(): number {
    return this.intensity * this.mixer.getEffectiveVolume('sfx');
  }
}
