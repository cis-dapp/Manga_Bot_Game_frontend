/**
 * Sound utility for Manga Bot Game
 * Manages audio playback with caching to avoid overlapping chaos
 */

// Cache for Audio instances - one per sound file
const soundCache = new Map();

/**
 * Play a sound effect
 * @param {string} fileName - Name of the sound file (e.g., 'click.mp3', 'whoosh.wav')
 * @param {number} volume - Volume level from 0.0 to 1.0 (default: 0.4)
 * @returns {Promise<void>} - Resolves when sound starts playing or rejects on error
 */
export function playSound(fileName, volume = 0.4) {
  return new Promise((resolve, reject) => {
    try {
      // Get or create Audio instance for this sound
      let audio = soundCache.get(fileName);

      if (!audio) {
        // Create new Audio instance
        audio = new Audio(`/assets/sounds/${fileName}`);

        // Handle load errors gracefully
        audio.addEventListener('error', (e) => {
          console.warn(`[Sound] Failed to load: ${fileName}`, e);
          soundCache.delete(fileName); // Remove from cache if failed
        });

        // Cache the audio instance
        soundCache.set(fileName, audio);
      }

      // Stop current playback if already playing (rewind to start)
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }

      // Set volume (clamp between 0 and 1)
      audio.volume = Math.max(0, Math.min(1, volume));

      // Play the sound
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            resolve();
          })
          .catch((error) => {
            // Handle play interruption or browser autoplay policy
            console.warn(`[Sound] Play failed for: ${fileName}`, error.message);
            reject(error);
          });
      } else {
        resolve();
      }

    } catch (error) {
      console.warn(`[Sound] Error playing: ${fileName}`, error);
      reject(error);
    }
  });
}

/**
 * Preload a sound file into the cache
 * @param {string} fileName - Name of the sound file to preload
 * @returns {Promise<void>}
 */
export function preloadSound(fileName) {
  return new Promise((resolve, reject) => {
    try {
      if (soundCache.has(fileName)) {
        resolve();
        return;
      }

      const audio = new Audio(`/assets/sounds/${fileName}`);

      audio.addEventListener('canplaythrough', () => {
        soundCache.set(fileName, audio);
        resolve();
      }, { once: true });

      audio.addEventListener('error', (e) => {
        console.warn(`[Sound] Preload failed: ${fileName}`, e);
        reject(e);
      }, { once: true });

      // Start loading
      audio.load();

    } catch (error) {
      console.warn(`[Sound] Preload error: ${fileName}`, error);
      reject(error);
    }
  });
}

/**
 * Preload multiple sounds at once
 * @param {string[]} fileNames - Array of sound file names
 * @returns {Promise<void>}
 */
export function preloadSounds(fileNames) {
  return Promise.all(fileNames.map(preloadSound));
}

/**
 * Clear the sound cache (useful for cleanup)
 */
export function clearSoundCache() {
  soundCache.forEach((audio) => {
    audio.pause();
    audio.src = '';
  });
  soundCache.clear();
}

/**
 * Stop a currently playing sound
 * @param {string} fileName - Name of the sound file to stop
 */
export function stopSound(fileName) {
  const audio = soundCache.get(fileName);
  if (audio && !audio.paused) {
    audio.pause();
    audio.currentTime = 0;
  }
}

export default {
  playSound,
  preloadSound,
  preloadSounds,
  clearSoundCache,
  stopSound
};
