import { AreaId } from '../types';

class SoundManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  
  private isMuted: boolean = false;
  private masterVolume: number = 0.8;
  private musicVolume: number = 0.65;
  private sfxVolume: number = 0.85;

  private currentTrack: string | null = null;
  private musicInterval: number | null = null;
  private ambienceOscillators: { stop: () => void }[] = [];

  constructor() {
    // Lazy initialize on first interaction to comply with browser autoplay policies
  }

  private initContext() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioContextClass();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.isMuted ? 0 : this.masterVolume;
    this.masterGain.connect(this.ctx.destination);

    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = this.musicVolume;
    this.musicGain.connect(this.masterGain);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = this.sfxVolume;
    this.sfxGain.connect(this.masterGain);
  }

  public enableAudio() {
    this.initContext();
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : this.masterVolume, this.ctx.currentTime);
    }
  }

  public isSoundMuted(): boolean {
    return this.isMuted;
  }

  public setVolumes(master: number, music: number, sfx: number) {
    this.masterVolume = master;
    this.musicVolume = music;
    this.sfxVolume = sfx;
    if (this.ctx && this.masterGain && this.musicGain && this.sfxGain) {
      const t = this.ctx.currentTime;
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : master, t);
      this.musicGain.gain.setValueAtTime(music, t);
      this.sfxGain.gain.setValueAtTime(sfx, t);
    }
  }

  // ---- MUSIC GENERATOR ----
  public playMusicForArea(areaId: AreaId | 'MENU' | 'BOSS' | 'ENDING') {
    if (this.currentTrack === areaId) return;
    this.currentTrack = areaId;
    this.stopMusic();

    this.initContext();
    if (!this.ctx || !this.musicGain) return;

    switch (areaId) {
      case 'MENU':
        this.startMenuMusic();
        break;
      case AreaId.VILLAGE:
        this.startVillageMusic();
        break;
      case AreaId.FOREST:
        this.startForestMusic();
        break;
      case AreaId.LAKE:
        this.startLakeMusic();
        break;
      case AreaId.CAPITAL:
        this.startCapitalMusic();
        break;
      case AreaId.TOWER:
        this.startTowerMusic();
        break;
      case 'BOSS':
        this.startBossMusic();
        break;
      case 'ENDING':
        this.startEndingMusic();
        break;
    }
  }

  public stopMusic() {
    if (this.musicInterval !== null) {
      window.clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this.ambienceOscillators.forEach(osc => {
      try { osc.stop(); } catch { /* ignore */ }
    });
    this.ambienceOscillators = [];
  }

  private playTone(freq: number, duration: number, type: OscillatorType = 'sine', gainVal: number = 0.1, delay: number = 0) {
    if (!this.ctx || !this.musicGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(gainVal, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  private startMenuMusic() {
    const chords = [
      [220, 261.63, 329.63], // Am
      [174.61, 220, 261.63], // F
      [196, 246.94, 293.66], // G
      [164.81, 196, 246.94]  // Em
    ];
    let step = 0;
    const playBar = () => {
      const chord = chords[step % chords.length];
      chord.forEach((note, i) => {
        this.playTone(note, 3.5, 'triangle', 0.08, i * 0.15);
      });
      // Arpeggiate higher melody
      const melodyNotes = [chord[2] * 2, chord[1] * 2, chord[0] * 2, chord[1] * 2];
      melodyNotes.forEach((m, idx) => {
        this.playTone(m, 0.9, 'sine', 0.05, 0.8 + idx * 0.6);
      });
      step++;
    };
    playBar();
    this.musicInterval = window.setInterval(playBar, 3400);
  }

  private startVillageMusic() {
    // Warm melancholic sunset acoustic vibe
    const chordSeq = [
      [146.83, 220, 293.66], // Dm
      [164.81, 220, 261.63], // Am/C
      [130.81, 196, 246.94], // G/B
      [116.54, 174.61, 220]  // Bb
    ];
    let step = 0;
    const loop = () => {
      const c = chordSeq[step % chordSeq.length];
      c.forEach((n, idx) => {
        this.playTone(n, 2.8, 'triangle', 0.07, idx * 0.1);
      });
      // Melodic plucking
      const pluck = [440, 523.25, 392, 349.23, 293.66];
      this.playTone(pluck[step % pluck.length], 0.7, 'sine', 0.04, 0.5);
      this.playTone(pluck[(step + 2) % pluck.length], 0.8, 'triangle', 0.03, 1.4);
      step++;
    };
    loop();
    this.musicInterval = window.setInterval(loop, 3000);
  }

  private startForestMusic() {
    // Mystical deep forest ambiance with woodwind pentatonic phrases
    const notes = [130.81, 146.83, 164.81, 196.00, 220.00, 261.63, 293.66, 329.63, 392.00];
    let step = 0;
    const loop = () => {
      // Sub bass drone
      this.playTone(65.4, 4.2, 'sine', 0.12, 0);
      // Mystical bells
      const n1 = notes[(step * 2) % notes.length];
      const n2 = notes[(step * 3 + 1) % notes.length];
      this.playTone(n1 * 1.5, 2.0, 'sine', 0.06, 0.4);
      this.playTone(n2 * 2, 1.8, 'triangle', 0.04, 1.6);
      step++;
    };
    loop();
    this.musicInterval = window.setInterval(loop, 3600);
  }

  private startLakeMusic() {
    // Serene moonlit water reflections, sparkling high bells and deep calm water tones
    const lakeChords = [
      [110, 164.81, 246.94], // Bm
      [98, 146.83, 220],     // A
      [87.31, 130.81, 196],  // G
      [73.42, 110, 164.81]   // F#m
    ];
    let step = 0;
    const loop = () => {
      const chord = lakeChords[step % lakeChords.length];
      chord.forEach(n => this.playTone(n, 3.8, 'sine', 0.08, 0));
      // Water glisten arpeggios
      for (let i = 0; i < 4; i++) {
        const glistenFreq = 659.25 + (i * 110) + ((step % 3) * 60);
        this.playTone(glistenFreq, 0.4, 'sine', 0.035, i * 0.45);
      }
      step++;
    };
    loop();
    this.musicInterval = window.setInterval(loop, 3200);
  }

  private startCapitalMusic() {
    // Dark fallen kingdom: martial brass, ominous dissonance, ruined majesty
    const darkChords = [
      [110, 138.59, 164.81], // A
      [103.83, 130.81, 155.56], // Ab dim
      [92.5, 116.54, 138.59],   // F#
      [82.41, 103.83, 123.47]   // E
    ];
    let step = 0;
    const loop = () => {
      const c = darkChords[step % darkChords.length];
      c.forEach(n => this.playTone(n, 2.6, 'sawtooth', 0.04, 0));
      this.playTone(55, 2.5, 'triangle', 0.1, 0); // Low march bass
      if (step % 2 === 0) {
        this.playTone(440, 1.2, 'sawtooth', 0.03, 0.8);
      }
      step++;
    };
    loop();
    this.musicInterval = window.setInterval(loop, 2400);
  }

  private startTowerMusic() {
    // Ancient ascending holy tower above clouds, cathedral pads & golden rays
    const towerNotes = [
      [174.61, 261.63, 349.23], // F
      [196.00, 293.66, 392.00], // G
      [220.00, 261.63, 329.63], // Am
      [261.63, 329.63, 392.00]  // C
    ];
    let step = 0;
    const loop = () => {
      const c = towerNotes[step % towerNotes.length];
      c.forEach(n => this.playTone(n, 3.2, 'triangle', 0.08, 0));
      this.playTone(523.25, 1.2, 'sine', 0.05, 0.6);
      this.playTone(659.25, 1.4, 'sine', 0.05, 1.4);
      step++;
    };
    loop();
    this.musicInterval = window.setInterval(loop, 2800);
  }

  private startBossMusic() {
    // The Dying King - Epic multi-rhythm battle theme!
    const bassline = [55, 61.74, 65.41, 73.42, 65.41, 61.74, 55, 49];
    let step = 0;
    const loop = () => {
      const bass = bassline[step % bassline.length];
      this.playTone(bass, 0.35, 'sawtooth', 0.08, 0);
      this.playTone(bass * 2, 0.25, 'triangle', 0.07, 0.2);
      
      if (step % 4 === 0) {
        this.playTone(220, 0.8, 'sawtooth', 0.07, 0);
        this.playTone(329.63, 0.8, 'sawtooth', 0.06, 0);
      }
      step++;
    };
    loop();
    this.musicInterval = window.setInterval(loop, 400);
  }

  private startEndingMusic() {
    // Radiant new dawn - triumphant, emotional closure
    const endChords = [
      [130.81, 164.81, 196.00, 261.63], // C major
      [146.83, 174.61, 220.00, 293.66], // D minor
      [164.81, 196.00, 246.94, 329.63], // E minor
      [174.61, 220.00, 261.63, 349.23], // F major
      [196.00, 246.94, 293.66, 392.00]  // G major
    ];
    let step = 0;
    const loop = () => {
      const c = endChords[step % endChords.length];
      c.forEach((n, idx) => {
        this.playTone(n, 3.6, 'triangle', 0.09, idx * 0.1);
      });
      this.playTone(523.25, 2.0, 'sine', 0.06, 0.8);
      step++;
    };
    loop();
    this.musicInterval = window.setInterval(loop, 3200);
  }

  // ---- SOUND EFFECTS ----
  public playSwordSlash(heavy: boolean = false) {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = heavy ? 'sawtooth' : 'sine';
    osc.frequency.setValueAtTime(heavy ? 280 : 420, now);
    osc.frequency.exponentialRampToValueAtTime(heavy ? 60 : 90, now + (heavy ? 0.28 : 0.16));

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(heavy ? 2200 : 3200, now);

    gain.gain.setValueAtTime(heavy ? 0.22 : 0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (heavy ? 0.3 : 0.18));

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + (heavy ? 0.32 : 0.2));
  }

  public playSwordHit(isArmor: boolean = false) {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Noise burst / impact
    const bufferSize = ctx.sampleRate * 0.12;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = isArmor ? 'highpass' : 'bandpass';
    filter.frequency.setValueAtTime(isArmor ? 1400 : 700, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(isArmor ? 0.3 : 0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(now);

    // Impact thump
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(160, now);
    subOsc.frequency.exponentialRampToValueAtTime(40, now + 0.12);
    subGain.gain.setValueAtTime(0.2, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    subOsc.connect(subGain);
    subGain.connect(this.sfxGain);
    subOsc.start(now);
    subOsc.stop(now + 0.13);
  }

  public playBlockParry() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(987.77, now); // Metallic high B5
    osc.frequency.setValueAtTime(1318.51, now + 0.04); // E6

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.36);
  }

  public playDash() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(620, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.22);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.23);
  }

  public playJump() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.14);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  public playFootstep() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(80 + Math.random() * 30, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.05);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  public playEnemyHurt() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.14);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  public playEnemyDeath() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.35);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.36);
  }

  public playBossRoar() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(60, now);
    osc.frequency.linearRampToValueAtTime(140, now + 0.3);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.8);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.86);
  }

  public playShardCollect() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.001, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.2, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);

      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.42);
    });
  }

  public playShrineRest() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const notes = [261.63, 329.63, 392.00, 523.25];
    notes.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + i * 0.12);

      gain.gain.setValueAtTime(0.18, now + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.6);

      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.65);
    });
  }

  public playMenuBeep(isConfirm: boolean = false) {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(isConfirm ? 660 : 440, now);
    if (isConfirm) {
      osc.frequency.setValueAtTime(880, now + 0.06);
    }

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (isConfirm ? 0.18 : 0.08));

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + (isConfirm ? 0.19 : 0.09));
  }
}

export const soundEngine = new SoundManager();
