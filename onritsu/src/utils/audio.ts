// Web Audio API Synthesizer for authentic Japanese Zen audio textures.
// Fully self-contained, offline-first, avoiding external asset dependency.

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play an elegant Zen wind chime sound (combining 4 harmonic pentatonic frequencies)
 * representing successful drawing validation.
 */
export function playSuccessChime() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Elegant pentatonic wind chime series (C6, D6, F6, G6, A6)
    const frequencies = [1046.50, 1174.66, 1396.91, 1567.98, 1760.00];
    
    // Play with small delays for a shimmering, cascading effect
    frequencies.forEach((freq, idx) => {
      const delay = idx * 0.04;
      const playTime = now + delay;

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, playTime);
      
      // High-register resonance
      gainNode.gain.setValueAtTime(0, playTime);
      gainNode.gain.linearRampToValueAtTime(0.08, playTime + 0.015);
      // Exponential beautiful long decay
      gainNode.gain.exponentialRampToValueAtTime(0.0001, playTime + 1.2);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(playTime);
      osc.stop(playTime + 1.3);
    });
  } catch (error) {
    console.warn("Audio Context block or error", error);
  }
}

/**
 * Play a low, resonant, damped bamboo wood hit or quiet copper bowl strike,
 * representing a drawing mistake, with zero-harshness.
 */
export function playFailureGong() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Main base frequency for the bowl
    const baseFreq = 180;
    
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(baseFreq, now);

    // Inharmonic overtones for copper-like resonance
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(baseFreq * 2.21, now);

    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    
    osc1.stop(now + 0.5);
    osc2.stop(now + 0.5);
  } catch (e) {
    console.warn("Audio error", e);
  }
}

/**
 * Play a short, soft brush stroke splash sound when drawing.
 * Debounced to avoid audio pile-ups.
 */
let lastStrokeSoundTime = 0;
export function playBrushScribble() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Throttle stroke noise triggers
    if (now - lastStrokeSoundTime < 0.12) return;
    lastStrokeSoundTime = now;

    // Buffer creation for white-noise based brush friction
    const bufferSize = ctx.sampleRate * 0.06; // short duration (60ms)
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Fill buffer with noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = buffer;

    // Filter to make it sound soft like ink brush on paper
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, now);
    filter.Q.setValueAtTime(1.5, now);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.02, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

    noiseNode.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noiseNode.start(now);
    noiseNode.stop(now + 0.06);
  } catch (e) {
    // Fail silently
  }
}

/**
 * Played when a letter is opened - representing dipping brush in ink.
 */
export function playInkDip() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
 
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
 
    osc.type = 'sine';
    // Frequency sweeps down simulating a dip
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.15);
 
    gainNode.gain.setValueAtTime(0.08, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
 
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
 
    osc.start(now);
    osc.stop(now + 0.18);
  } catch (e) {}
}

/**
 * Speaks a Japanese character out loud using standard Web Speech synthesis.
 */
export function speakJapanese(char: string) {
  try {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(char);
      utterance.lang = 'ja-JP';
      
      // Attempt to pick a high-quality Japanese voice if preloaded
      const voices = window.speechSynthesis.getVoices();
      const jaVoice = voices.find(v => v.lang === 'ja-JP' || v.lang.startsWith('ja_') || v.lang.includes('JP'));
      if (jaVoice) {
        utterance.voice = jaVoice;
      }
      utterance.rate = 0.85;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  } catch (error) {
    console.warn("Speech synthesis failed", error);
  }
}

