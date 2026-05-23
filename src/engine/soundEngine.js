// --- PROCEDURAL SOUND ENGINE ---
// Generates all audio using Web Audio API — no external files needed
import { PLAYER_FULL_NAMES } from '../data/players';

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.ambientSource = null;
    this.enabled = true;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.6;
      this.masterGain.connect(this.ctx.destination);
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio API not available:', e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setEnabled(val) {
    this.enabled = val;
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(val ? 0.6 : 0, this.ctx.currentTime, 0.1);
    }
  }

  // --- BID RAISE DING ---
  playBidDing(pitch = 1.0) {
    if (!this.enabled || !this.ctx) return;
    this.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = 880 * pitch;
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  // --- ESCALATING BID DING (higher pitch as price rises) ---
  playBidEscalate(bidCount) {
    const pitch = 1.0 + (bidCount * 0.08);
    this.playBidDing(Math.min(pitch, 2.5));
  }

  // --- GAVEL SLAM ---
  playGavel() {
    if (!this.enabled || !this.ctx) return;
    this.resume();

    // Deep thud
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.6, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);

    // Impact noise
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.1));
    }
    const noise = this.ctx.createBufferSource();
    const noiseGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    noise.buffer = buffer;
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    noiseGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noise.start();
  }

  // --- UNSOLD BUZZER ---
  playUnsold() {
    if (!this.enabled || !this.ctx) return;
    this.resume();

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.value = 200;
    osc2.type = 'sawtooth';
    osc2.frequency.value = 150;

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);
    osc1.start();
    osc2.start();
    osc1.stop(this.ctx.currentTime + 0.6);
    osc2.stop(this.ctx.currentTime + 0.6);
  }

  // --- CROWD CHEER (for big buys) ---
  playCrowdCheer() {
    if (!this.enabled || !this.ctx) return;
    this.resume();

    const bufferSize = this.ctx.sampleRate * 1.5;
    const buffer = this.ctx.createBuffer(2, bufferSize, this.ctx.sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      for (let i = 0; i < bufferSize; i++) {
        const t = i / this.ctx.sampleRate;
        // Shaped white noise that swells and fades
        const envelope = Math.sin(Math.PI * t / 1.5) * Math.exp(-t * 0.8);
        data[i] = (Math.random() * 2 - 1) * envelope * 0.3;
      }
    }

    const source = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    source.buffer = buffer;
    filter.type = 'bandpass';
    filter.frequency.value = 2000;
    filter.Q.value = 0.5;
    gain.gain.value = 0.35;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    source.start();
  }

  // --- COUNTDOWN TICK ---
  playTick() {
    if (!this.enabled || !this.ctx) return;
    this.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 1200;
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  // --- TENSION DRONE (builds during countdown) ---
  playTensionDrone(duration = 3) {
    if (!this.enabled || !this.ctx) return;
    this.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(80, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(200, this.ctx.currentTime + duration);
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + duration * 0.7);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  // --- PLAYER REVEAL WHOOSH ---
  playReveal() {
    if (!this.enabled || !this.ctx) return;
    this.resume();

    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const t = i / this.ctx.sampleRate;
      data[i] = (Math.random() * 2 - 1) * Math.exp(-t * 8) * 0.3;
    }

    const source = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    source.buffer = buffer;
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(200, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(4000, this.ctx.currentTime + 0.3);
    gain.gain.value = 0.4;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    source.start();
  }

  // --- AMBIENT CROWD MURMUR ---
  startAmbient() {
    if (!this.enabled || !this.ctx || this.ambientSource) return;
    this.resume();

    const bufferSize = this.ctx.sampleRate * 4;
    const buffer = this.ctx.createBuffer(2, bufferSize, this.ctx.sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      for (let i = 0; i < bufferSize; i++) {
        const t = i / this.ctx.sampleRate;
        // Layered noise for crowd murmur effect
        data[i] = (
          (Math.random() * 2 - 1) * 0.02 +
          Math.sin(t * 120 + Math.random() * 6) * 0.005 +
          Math.sin(t * 80 + Math.random() * 4) * 0.003
        );
      }
    }

    this.ambientSource = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    this.ambientSource.buffer = buffer;
    this.ambientSource.loop = true;
    filter.type = 'bandpass';
    filter.frequency.value = 400;
    filter.Q.value = 0.3;
    gain.gain.value = 0.12;

    this.ambientSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    this.ambientSource.start();
  }

  stopAmbient() {
    if (this.ambientSource) {
      try { this.ambientSource.stop(); } catch(e) {}
      this.ambientSource = null;
    }
  }

  destroy() {
    this.stopAmbient();
    if (this.ctx) {
      this.ctx.close();
    }
  }
}

// Singleton
export const soundEngine = new SoundEngine();

// --- PRONUNCIATION DICTIONARY FOR IPL PLAYERS ---
const PRONUNCIATION_MAP = PLAYER_FULL_NAMES;

// Voice cache
let cachedVoices = [];
const loadVoices = () => {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    cachedVoices = window.speechSynthesis.getVoices();
  }
};
if (typeof window !== 'undefined' && window.speechSynthesis) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

const selectBestVoice = () => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  // Prefer en-IN voices
  const enIN = voices.filter(v => v.lang.toLowerCase().replace('_', '-') === 'en-in');
  if (enIN.length > 0) return enIN.find(v => v.name.toLowerCase().includes('google')) || enIN[0];

  // Then premium English voices
  const preferred = ['natural', 'google uk english', 'google us english', 'daniel', 'samantha'];
  for (const sub of preferred) {
    const found = voices.find(v => v.name.toLowerCase().includes(sub) && v.lang.toLowerCase().startsWith('en'));
    if (found) return found;
  }

  const english = voices.filter(v => v.lang.toLowerCase().startsWith('en'));
  return english.length > 0 ? english[0] : voices[0] || null;
};

// --- ENHANCED SPEECH SYNTHESIS ---
const AUCTIONEER_PHRASES = {
  playerIntro: [
    (name, price, setName) => `And now, ladies and gentlemen, from ${setName}... ${name}! Base price, ${price} crores.`,
    (name, price, setName) => `Next on the block. ${name}. Starting at ${price} crores. Who wants this player?`,
    (name, price, setName) => `The spotlight falls on ${name}. Base price ${price} crores. Let's see those paddles!`,
    (name, price) => `A premium pick now. ${name}, available at ${price} crores. Franchises, ready your bids!`,
  ],
  bidRaise: [
    (team, price) => `${team} enters the fray! ${price} crores!`,
    (team, price) => `${team} raises the paddle! ${price} crores!`,
    (team, price) => `A confident bid from ${team}. ${price} crores on the board!`,
    (team, price) => `${team} is in! The bid climbs to ${price} crores!`,
  ],
  biddingWar: [
    () => `We have a bidding war! Multiple franchises locked in battle!`,
    () => `The temperature is rising! Who will blink first?`,
    () => `Intense competition here! The paddles keep going up!`,
  ],
  goingOnce: [
    (team, price) => `Going once at ${price} crores to ${team}...`,
    (team, price) => `${price} crores with ${team}. Going once...`,
  ],
  goingTwice: [
    (team, price) => `Going twice! ${price} crores. Last chance, franchises!`,
    (team, price) => `Going twice to ${team}! Any more takers?`,
  ],
  sold: [
    (name, team, price) => `And the hammer drops! ${name} sold to ${team} for ${price} crores!`,
    (name, team, price) => `SOLD! ${name} goes to ${team}. ${price} crores. What a pickup!`,
  ],
  soldBig: [
    (name, team, price) => `WHAT A SALE! ${name} goes to ${team} for a massive ${price} crores! The crowd erupts!`,
  ],
  unsold: [
    (name) => `No takers. ${name} goes unsold. Moving on.`,
    (name) => `The paddle stays down. ${name} is unsold.`,
  ],
  setChange: [
    (setName) => `We now move to a new category. ${setName}. Fresh talent on the block!`,
  ],
};

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const getAuctioneerLine = (type, ...args) => {
  // Translate any player name parameters to full spoken names
  const processedArgs = args.map(arg => {
    if (typeof arg === 'string' && PRONUNCIATION_MAP[arg]) {
      return PRONUNCIATION_MAP[arg];
    }
    return arg;
  });

  const phrases = AUCTIONEER_PHRASES[type];
  if (!phrases) return '';
  const phrase = pickRandom(phrases);
  return typeof phrase === 'function' ? phrase(...processedArgs) : phrase;
};

export const speakText = (text, enabled, cancelPrevious = true) => {
  if (!enabled || !window.speechSynthesis) return;
  if (cancelPrevious) window.speechSynthesis.cancel();
  
  const msg = new SpeechSynthesisUtterance(text);
  msg.rate = 1.02; // Slightly more deliberate rate for clear understanding
  msg.pitch = 0.95;
  
  const bestVoice = selectBestVoice();
  if (bestVoice) {
    msg.voice = bestVoice;
  }
  
  window.speechSynthesis.speak(msg);
};
