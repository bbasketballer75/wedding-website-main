'use client';

/**
 * 🎵 AMBIENT WEDDING SOUND SYSTEM ✨
 *
 * Creates an immersive audio experience with nature sounds, gentle melodies,
 * and contextual audio feedback for user interactions throughout the wedding website.
 */

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

// Sound Library - Wedding themed ambient sounds
const SOUND_LIBRARY = {
  // Ambient Background Sounds
  GENTLE_RAIN: {
    id: 'gentle_rain',
    name: 'Gentle Rain',
    description: 'Soft rain sounds for peaceful moments',
    loop: true,
    volume: 0.3,
    category: 'ambient',
  },
  BIRDS_CHIRPING: {
    id: 'birds_chirping',
    name: 'Birds Chirping',
    description: 'Cheerful bird songs for joy',
    loop: true,
    volume: 0.25,
    category: 'ambient',
  },
  OCEAN_WAVES: {
    id: 'ocean_waves',
    name: 'Ocean Waves',
    description: 'Calming ocean waves',
    loop: true,
    volume: 0.35,
    category: 'ambient',
  },
  SOFT_PIANO: {
    id: 'soft_piano',
    name: 'Soft Piano',
    description: 'Gentle piano melody',
    loop: true,
    volume: 0.4,
    category: 'ambient',
  },

  // Interaction Sounds
  BUTTON_HOVER: {
    id: 'button_hover',
    name: 'Button Hover',
    description: 'Subtle hover sound',
    loop: false,
    volume: 0.2,
    category: 'interaction',
  },
  BUTTON_CLICK: {
    id: 'button_click',
    name: 'Button Click',
    description: 'Satisfying click sound',
    loop: false,
    volume: 0.3,
    category: 'interaction',
  },
  PAGE_TRANSITION: {
    id: 'page_transition',
    name: 'Page Transition',
    description: 'Smooth page change sound',
    loop: false,
    volume: 0.25,
    category: 'interaction',
  },

  // Special Wedding Sounds
  BELL_CHIME: {
    id: 'bell_chime',
    name: 'Wedding Bells',
    description: 'Celebratory bell chimes',
    loop: false,
    volume: 0.4,
    category: 'celebration',
  },
  HEART_BEAT: {
    id: 'heart_beat',
    name: 'Heartbeat',
    description: 'Gentle heartbeat rhythm',
    loop: true,
    volume: 0.2,
    category: 'love',
  },
  CONFETTI_POP: {
    id: 'confetti_pop',
    name: 'Confetti Pop',
    description: 'Joyful confetti sound',
    loop: false,
    volume: 0.35,
    category: 'celebration',
  },
};

// Audio Context for Sound Generation
class SoundGenerator {
  constructor() {
    this.audioContext = null;
    this.masterGain = null;
    this.sounds = new Map();
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.setValueAtTime(0.7, this.audioContext.currentTime);

      this.initialized = true;
      return true;
    } catch (error) {
      console.warn('Audio context not available:', error);
      return false;
    }
  }

  // Generate procedural ambient sounds
  createAmbientSound(type, duration = Infinity) {
    if (!this.initialized) return null;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filterNode = this.audioContext.createBiquadFilter();

    oscillator.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(this.masterGain);

    switch (type) {
      case 'gentle_rain':
        return this.createRainSound(oscillator, gainNode, filterNode, duration);
      case 'birds_chirping':
        return this.createBirdSound(oscillator, gainNode, filterNode, duration);
      case 'ocean_waves':
        return this.createOceanSound(oscillator, gainNode, filterNode, duration);
      case 'soft_piano':
        return this.createPianoSound(oscillator, gainNode, filterNode, duration);
      default:
        return this.createDefaultTone(oscillator, gainNode, duration);
    }
  }

  createRainSound(oscillator, gainNode, filterNode, duration) {
    // White noise for rain effect
    const bufferSize = this.audioContext.sampleRate * 2;
    const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.audioContext.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter for rain-like sound
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(1500, this.audioContext.currentTime);

    whiteNoise.connect(filterNode);
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);

    // Gentle volume fluctuation
    const lfo = this.audioContext.createOscillator();
    const lfoGain = this.audioContext.createGain();
    lfo.frequency.setValueAtTime(0.1, this.audioContext.currentTime);
    lfoGain.gain.setValueAtTime(0.05, this.audioContext.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(gainNode.gain);

    whiteNoise.start();
    lfo.start();

    if (duration !== Infinity) {
      whiteNoise.stop(this.audioContext.currentTime + duration);
      lfo.stop(this.audioContext.currentTime + duration);
    }

    return { source: whiteNoise, lfo };
  }

  createBirdSound(oscillator, gainNode, filterNode, duration) {
    // Chirping melody
    const frequencies = [523, 659, 784, 1047]; // C5, E5, G5, C6
    let currentFreq = 0;

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequencies[0], this.audioContext.currentTime);

    filterNode.type = 'bandpass';
    filterNode.frequency.setValueAtTime(800, this.audioContext.currentTime);
    filterNode.Q.setValueAtTime(1, this.audioContext.currentTime);

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);

    // Create chirping pattern
    const chirpDuration = 0.3;
    const pauseDuration = 2;
    const totalCycle = chirpDuration + pauseDuration;

    for (let i = 0; i < duration / totalCycle || 20; i++) {
      const startTime = this.audioContext.currentTime + i * totalCycle;
      const freq = frequencies[Math.floor(Math.random() * frequencies.length)];

      oscillator.frequency.setValueAtTime(freq, startTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        freq * 1.5,
        startTime + chirpDuration * 0.7
      );

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + chirpDuration);
    }

    oscillator.start();
    if (duration !== Infinity) {
      oscillator.stop(this.audioContext.currentTime + duration);
    }

    return { source: oscillator };
  }

  createOceanSound(oscillator, gainNode, filterNode, duration) {
    // Low frequency oscillation for waves
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(0.1, this.audioContext.currentTime);

    // Add noise for wave texture
    const bufferSize = this.audioContext.sampleRate * 2;
    const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const noise = this.audioContext.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(200, this.audioContext.currentTime);

    noise.connect(filterNode);
    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);

    // Wave motion modulation
    const waveLFO = this.audioContext.createOscillator();
    const waveGain = this.audioContext.createGain();
    waveLFO.frequency.setValueAtTime(0.05, this.audioContext.currentTime);
    waveGain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    waveLFO.connect(waveGain);
    waveGain.connect(gainNode.gain);

    noise.start();
    waveLFO.start();

    if (duration !== Infinity) {
      noise.stop(this.audioContext.currentTime + duration);
      waveLFO.stop(this.audioContext.currentTime + duration);
    }

    return { source: noise, lfo: waveLFO };
  }

  createPianoSound(oscillator, gainNode, filterNode, duration) {
    // Gentle piano chord progression
    const chords = [
      [261.63, 329.63, 392.0], // C major
      [293.66, 369.99, 440.0], // D minor
      [349.23, 440.0, 523.25], // F major
      [392.0, 493.88, 587.33], // G major
    ];

    const oscillators = [];
    const chordDuration = 4; // 4 seconds per chord

    chords.forEach((chord, chordIndex) => {
      chord.forEach((freq, noteIndex) => {
        const osc = this.audioContext.createOscillator();
        const noteGain = this.audioContext.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);

        osc.connect(noteGain);
        noteGain.connect(gainNode);

        const startTime = this.audioContext.currentTime + chordIndex * chordDuration;
        const endTime = startTime + chordDuration - 0.5;

        noteGain.gain.setValueAtTime(0, startTime);
        noteGain.gain.linearRampToValueAtTime(0.05, startTime + 0.5);
        noteGain.gain.exponentialRampToValueAtTime(0.001, endTime);

        osc.start(startTime);
        osc.stop(endTime);

        oscillators.push(osc);
      });
    });

    return { sources: oscillators };
  }

  createDefaultTone(oscillator, gainNode, duration) {
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);

    oscillator.start();
    if (duration !== Infinity) {
      oscillator.stop(this.audioContext.currentTime + duration);
    }

    return { source: oscillator };
  }

  // Quick interaction sounds
  playInteractionSound(type) {
    if (!this.initialized) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    switch (type) {
      case 'button_hover':
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
        break;
      case 'button_click':
        oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(900, this.audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15);
        break;
      case 'bell_chime':
        oscillator.frequency.setValueAtTime(1047, this.audioContext.currentTime); // C6
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 2);
        break;
      case 'confetti_pop':
        oscillator.frequency.setValueAtTime(1500, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
        break;
    }

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 2);
  }

  setMasterVolume(volume) {
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(volume, this.audioContext.currentTime);
    }
  }

  stop() {
    if (this.audioContext) {
      this.audioContext.close();
      this.initialized = false;
    }
  }
}

// Audio Context
const AudioContext = createContext();

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

// Audio Provider Component
export const AudioProvider = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [currentAmbient, setCurrentAmbient] = useState(null);
  const [volume, setVolume] = useState(0.5);
  const [isInitialized, setIsInitialized] = useState(false);

  const soundGenerator = useRef(new SoundGenerator());
  const currentSound = useRef(null);

  // Initialize audio on first user interaction
  const initializeAudio = useCallback(async () => {
    if (!isInitialized) {
      const success = await soundGenerator.current.initialize();
      if (success) {
        setIsInitialized(true);
        soundGenerator.current.setMasterVolume(volume);
      }
    }
  }, [isInitialized, volume]);

  // Handle volume changes
  useEffect(() => {
    if (isInitialized) {
      soundGenerator.current.setMasterVolume(volume);
    }
  }, [volume, isInitialized]);

  // Play ambient sound
  const playAmbient = useCallback(
    async (soundId) => {
      await initializeAudio();

      if (!isInitialized || !isEnabled) return;

      // Stop current ambient sound
      if (currentSound.current) {
        // Note: Generated sounds auto-manage their lifecycle
        currentSound.current = null;
      }

      // Start new ambient sound
      const sound = soundGenerator.current.createAmbientSound(soundId);
      if (sound) {
        currentSound.current = sound;
        setCurrentAmbient(soundId);
      }
    },
    [initializeAudio, isInitialized, isEnabled]
  );

  // Stop ambient sound
  const stopAmbient = useCallback(() => {
    if (currentSound.current) {
      currentSound.current = null;
      setCurrentAmbient(null);
    }
  }, []);

  // Play interaction sound
  const playInteraction = useCallback(
    async (soundId) => {
      await initializeAudio();

      if (!isInitialized || !isEnabled) return;

      soundGenerator.current.playInteractionSound(soundId);
    },
    [initializeAudio, isInitialized, isEnabled]
  );

  // Toggle audio on/off
  const toggleAudio = useCallback(() => {
    setIsEnabled((prev) => !prev);
    if (isEnabled && currentSound.current) {
      stopAmbient();
    }
  }, [isEnabled, stopAmbient]);

  // Auto-start ambient sound when enabled
  useEffect(() => {
    if (isEnabled && isInitialized && !currentAmbient) {
      // Default to gentle nature sounds
      playAmbient('gentle_rain');
    }
  }, [isEnabled, isInitialized, currentAmbient, playAmbient]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      soundGenerator.current.stop();
    };
  }, []);

  const value = {
    isEnabled,
    isInitialized,
    currentAmbient,
    volume,
    soundLibrary: SOUND_LIBRARY,
    toggleAudio,
    setVolume,
    playAmbient,
    stopAmbient,
    playInteraction,
    initializeAudio,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};

// Audio Control Component
export const AudioControls = ({ className = '' }) => {
  const {
    isEnabled,
    isInitialized,
    currentAmbient,
    volume,
    soundLibrary,
    toggleAudio,
    setVolume,
    playAmbient,
    stopAmbient,
    initializeAudio,
  } = useAudio();

  const ambientSounds = Object.values(soundLibrary).filter((s) => s.category === 'ambient');

  const handleFirstInteraction = async () => {
    await initializeAudio();
    if (!isEnabled) {
      toggleAudio();
    }
  };

  return (
    <div className={`audio-controls ${className}`}>
      <div className="audio-controls__header">
        <button
          className={`audio-toggle ${isEnabled ? 'audio-toggle--enabled' : ''}`}
          onClick={handleFirstInteraction}
          aria-label={isEnabled ? 'Disable ambient sounds' : 'Enable ambient sounds'}
          title={isEnabled ? 'Turn off ambient sounds' : 'Turn on ambient sounds'}
        >
          <span className="audio-icon">{isEnabled ? '🔊' : '🔇'}</span>
          <span className="audio-label">{isEnabled ? 'Audio On' : 'Audio Off'}</span>
        </button>
      </div>

      {isEnabled && isInitialized && (
        <div className="audio-controls__options">
          <div className="volume-control">
            <label htmlFor="volume-slider" className="volume-label">
              🔊 Volume
            </label>
            <input
              id="volume-slider"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="volume-slider"
              aria-label="Audio volume"
            />
            <span className="volume-value">{Math.round(volume * 100)}%</span>
          </div>

          <div className="ambient-controls">
            <label className="ambient-label">🎵 Ambient Sounds</label>
            <div className="ambient-options">
              <button
                className={`ambient-btn ${!currentAmbient ? 'ambient-btn--active' : ''}`}
                onClick={stopAmbient}
                aria-pressed={!currentAmbient}
              >
                🔇 None
              </button>
              {ambientSounds.map((sound) => (
                <button
                  key={sound.id}
                  className={`ambient-btn ${currentAmbient === sound.id ? 'ambient-btn--active' : ''}`}
                  onClick={() => playAmbient(sound.id)}
                  aria-pressed={currentAmbient === sound.id}
                  title={sound.description}
                >
                  {sound.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .audio-controls {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 12px;
          padding: 1rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .audio-controls__header {
          margin-bottom: 1rem;
        }

        .audio-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(45deg, #ff69b4, #dda0dd);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          width: 100%;
          justify-content: center;
        }

        .audio-toggle:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 105, 180, 0.4);
        }

        .audio-toggle--enabled {
          background: linear-gradient(45deg, #10b981, #059669);
        }

        .audio-icon {
          font-size: 1.2rem;
        }

        .volume-control {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .volume-label {
          font-weight: 600;
          min-width: 80px;
        }

        .volume-slider {
          flex: 1;
          height: 6px;
          background: #e5e7eb;
          border-radius: 3px;
          outline: none;
          opacity: 0.7;
          transition: opacity 0.2s;
        }

        .volume-slider:hover {
          opacity: 1;
        }

        .volume-value {
          min-width: 40px;
          text-align: right;
          font-weight: 600;
          color: #6b7280;
        }

        .ambient-controls {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .ambient-label {
          font-weight: 600;
          color: #374151;
        }

        .ambient-options {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .ambient-btn {
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(0, 0, 0, 0.1);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.875rem;
          white-space: nowrap;
        }

        .ambient-btn:hover {
          background: rgba(255, 255, 255, 0.9);
          transform: translateY(-1px);
        }

        .ambient-btn--active {
          background: linear-gradient(45deg, #dda0dd, #ffb6c1);
          color: white;
          border-color: transparent;
        }

        @media (max-width: 768px) {
          .audio-controls {
            padding: 0.75rem;
          }

          .volume-control {
            flex-direction: column;
            align-items: stretch;
            gap: 0.5rem;
          }

          .ambient-options {
            flex-direction: column;
          }

          .ambient-btn {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

// Hook for easy interaction sounds
export const useInteractionSounds = () => {
  const { playInteraction, isEnabled } = useAudio();

  return {
    playHover: () => isEnabled && playInteraction('button_hover'),
    playClick: () => isEnabled && playInteraction('button_click'),
    playBell: () => isEnabled && playInteraction('bell_chime'),
    playConfetti: () => isEnabled && playInteraction('confetti_pop'),
    playPageTransition: () => isEnabled && playInteraction('page_transition'),
  };
};

export default AudioProvider;
