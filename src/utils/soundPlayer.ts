// Sound player utility for Service Crew
// Plays sound effects from the public/sounds directory with preloading support

const BASE_URL = "/service-crew/";

// Cache for preloaded sound elements
const soundCache = new Map<string, HTMLAudioElement | HTMLVideoElement>();

/**
 * Preloads a sound file into memory for instant playback
 * @param filename - The name of the sound file (e.g., "done.mp3", "borr.mov")
 * @returns Promise that resolves when the sound is loaded
 */
export function preloadSound(filename: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if already cached
    if (soundCache.has(filename)) {
      resolve();
      return;
    }

    try {
      const soundPath = `${BASE_URL}sounds/${filename}`;
      const extension = filename.split(".").pop()?.toLowerCase();

      // Create appropriate media element
      const element =
        extension === "mov"
          ? document.createElement("video")
          : new Audio();

      element.src = soundPath;
      element.preload = "auto";
      element.volume = 0.7; // Default volume

      // Wait for media to be loaded enough to play
      element.addEventListener(
        "loadeddata",
        () => {
          soundCache.set(filename, element);
          resolve();
        },
        { once: true },
      );

      element.addEventListener(
        "error",
        (e) => {
          console.warn(`Failed to preload sound ${filename}:`, e);
          reject(e);
        },
        { once: true },
      );

      // Start loading
      element.load();
    } catch (error) {
      console.warn(`Error preloading sound ${filename}:`, error);
      reject(error);
    }
  });
}

/**
 * Plays a sound effect from the sounds directory
 * Uses preloaded sounds if available, otherwise loads and plays
 * @param filename - The name of the sound file (e.g., "done.mp3", "borr.mov")
 * @param volume - Volume level between 0 and 1 (default: 0.7)
 * @returns Promise that resolves when playback starts (or fails gracefully)
 */
export function playSound(
  filename: string,
  volume: number = 0.7,
): Promise<void> {
  return new Promise((resolve) => {
    try {
      // Try to use cached element first for instant playback
      const cached = soundCache.get(filename);
      if (cached) {
        // Clone the cached element to allow multiple simultaneous playbacks
        const clone = cached.cloneNode(true) as
          | HTMLAudioElement
          | HTMLVideoElement;
        clone.volume = Math.max(0, Math.min(1, volume));

        // Clean up element after playback
        clone.addEventListener(
          "ended",
          () => {
            clone.src = "";
            clone.load();
          },
          { once: true },
        );

        // Play immediately (cached sounds should play without delay)
        clone
          .play()
          .then(() => resolve())
          .catch((error) => {
            console.warn(`Failed to play cached sound ${filename}:`, error);
            resolve(); // Don't break on sound failure
          });
        return;
      }

      // Sound not cached - create new element and try playing
      const soundPath = `${BASE_URL}sounds/${filename}`;
      const extension = filename.split(".").pop()?.toLowerCase();

      const element =
        extension === "mov"
          ? document.createElement("video")
          : new Audio();

      element.src = soundPath;
      element.volume = Math.max(0, Math.min(1, volume));

      // Clean up element after playback
      element.addEventListener(
        "ended",
        () => {
          element.src = "";
          element.load();
        },
        { once: true },
      );

      // Try immediate playback (may work if browser cached the file)
      element
        .play()
        .then(() => {
          resolve();
        })
        .catch(() => {
          // Immediate play failed - wait for loadeddata and retry
          element.addEventListener(
            "loadeddata",
            () => {
              element
                .play()
                .then(() => resolve())
                .catch((error) => {
                  console.warn(`Failed to play sound ${filename}:`, error);
                  resolve(); // Don't break on sound failure
                });
            },
            { once: true },
          );

          element.addEventListener(
            "error",
            (e) => {
              console.warn(`Error loading sound ${filename}:`, e);
              resolve(); // Don't break on sound failure
            },
            { once: true },
          );

          // Start loading
          element.load();
        });
    } catch (error) {
      // Silently fail - don't break the app if sound fails
      console.warn(`Error playing sound ${filename}:`, error);
      resolve();
    }
  });
}
