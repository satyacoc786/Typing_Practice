import { SwitchSound } from '../types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundProfile: SwitchSound = 'thock';
  private volume: number = 0.4;
  private isMuted: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setSound(sound: SwitchSound) {
    this.soundProfile = sound;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public playKey(isSpace: boolean = false) {
    if (this.soundProfile === 'off' || this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(this.volume, now);
      masterGain.connect(this.ctx.destination);

      switch (this.soundProfile) {
        case 'thock':
          this.playThock(now, masterGain, isSpace);
          break;
        case 'clicky':
          this.playClicky(now, masterGain, isSpace);
          break;
        case 'tactile':
          this.playTactile(now, masterGain, isSpace);
          break;
        case 'typewriter':
          this.playTypewriter(now, masterGain, isSpace);
          break;
        case 'bubble':
          this.playBubble(now, masterGain, isSpace);
          break;
      }
    } catch {
      // Audio fallback silent
    }
  }

  private playThock(now: number, dest: GainNode, isSpace: boolean) {
    if (!this.ctx) return;
    const baseFreq = isSpace ? 110 : 160 + (Math.random() * 30 - 15);

    // Deep low body oscillator
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.06);

    oscGain.gain.setValueAtTime(0.7, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

    // Filtered noise snap
    const bufferSize = this.ctx.sampleRate * 0.04;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(isSpace ? 450 : 650, now);
    filter.Q.setValueAtTime(2.5, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.45, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(dest);

    osc.connect(oscGain);
    oscGain.connect(dest);

    osc.start(now);
    whiteNoise.start(now);
    osc.stop(now + 0.07);
    whiteNoise.stop(now + 0.05);
  }

  private playClicky(now: number, dest: GainNode, isSpace: boolean) {
    if (!this.ctx) return;
    const pitch = isSpace ? 2100 : 2800 + (Math.random() * 400 - 200);

    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.015);

    oscGain.gain.setValueAtTime(0.5, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

    // Secondary subtle release click
    const osc2 = this.ctx.createOscillator();
    const osc2Gain = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(pitch * 0.6, now + 0.02);
    osc2.frequency.exponentialRampToValueAtTime(400, now + 0.035);
    osc2Gain.gain.setValueAtTime(0.3, now + 0.02);
    osc2Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(oscGain);
    oscGain.connect(dest);
    osc2.connect(osc2Gain);
    osc2Gain.connect(dest);

    osc.start(now);
    osc.stop(now + 0.025);
    osc2.start(now + 0.02);
    osc2.stop(now + 0.045);
  }

  private playTactile(now: number, dest: GainNode, isSpace: boolean) {
    if (!this.ctx) return;
    const baseFreq = isSpace ? 190 : 240 + (Math.random() * 20 - 10);
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.04);

    oscGain.gain.setValueAtTime(0.5, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(oscGain);
    oscGain.connect(dest);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  private playTypewriter(now: number, dest: GainNode, isSpace: boolean) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(isSpace ? 700 : 1200 + Math.random() * 200, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.03);

    oscGain.gain.setValueAtTime(0.5, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(oscGain);
    oscGain.connect(dest);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  private playBubble(now: number, dest: GainNode, isSpace: boolean) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    const start = isSpace ? 350 : 550 + Math.random() * 100;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(start, now);
    osc.frequency.exponentialRampToValueAtTime(start * 2.2, now + 0.05);

    oscGain.gain.setValueAtTime(0.6, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(oscGain);
    oscGain.connect(dest);

    osc.start(now);
    osc.stop(now + 0.07);
  }

  public playError() {
    if (this.soundProfile === 'off' || this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

      gain.gain.setValueAtTime(this.volume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Audio fallback silent
    }
  }

  public playStreakChime(streakCount: number) {
    if (this.soundProfile === 'off' || this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const baseNote = streakCount >= 100 ? 880 : streakCount >= 50 ? 659.25 : 523.25;

      const notes = [baseNote, baseNote * 1.25, baseNote * 1.5];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const noteStart = now + idx * 0.04;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);
        gain.gain.setValueAtTime(this.volume * 0.35, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.16);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(noteStart);
        osc.stop(noteStart + 0.18);
      });
    } catch {
      // Audio fallback
    }
  }

  public playFinish(isPb: boolean = false) {
    if (this.soundProfile === 'off' || this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const chords = isPb
        ? [523.25, 659.25, 783.99, 1046.5] // C Major fanfare
        : [440, 554.37, 659.25]; // A Major chime

      chords.forEach((freq, i) => {
        if (!this.ctx) return;
        const noteStart = now + i * 0.06;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(this.volume * 0.45, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(noteStart);
        osc.stop(noteStart + 0.4);
      });
    } catch {
      // Audio fallback
    }
  }
}

export const soundEngine = new SoundEngine();
