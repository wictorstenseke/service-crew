// Sound player utility for Service Crew
// Plays sound effects from the public/sounds directory

const BASE_URL = "/service-crew/";

/**
 * Plays a sound effect from the sounds directory
 * @param filename - The name of the sound file (e.g., "done.mp3", "borr.mov")
 * @param volume - Volume level between 0 and 1 (default: 0.7)
 */
export function playSound(filename: string, volume: number = 0.7): void {
  try {
    const soundPath = `${BASE_URL}sounds/${filename}`;
    const extension = filename.split(".").pop()?.toLowerCase();

    // Handle .mov files (video format) - try as video element
    if (extension === "mov") {
      const video = document.createElement("video");
      video.src = soundPath;
      video.volume = Math.max(0, Math.min(1, volume));
      video.play().catch((error) => {
        console.warn(`Failed to play sound ${filename}:`, error);
      });
      return;
    }

    // Handle audio files (.mp3, etc.) - use Audio element
    const audio = new Audio(soundPath);
    audio.volume = Math.max(0, Math.min(1, volume));
    audio.play().catch((error) => {
      console.warn(`Failed to play sound ${filename}:`, error);
    });
  } catch (error) {
    // Silently fail - don't break the app if sound fails
    console.warn(`Error playing sound ${filename}:`, error);
  }
}
