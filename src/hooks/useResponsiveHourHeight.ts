// Hook to calculate responsive hour height based on viewport
import { useState, useEffect } from "react";

export const useResponsiveHourHeight = () => {
  const [hourHeight, setHourHeight] = useState(72);

  useEffect(() => {
    const calculateHeight = () => {
      const viewportHeight = window.innerHeight;
      
      // Reserve space for navigation, padding, and controls
      // Approximate: 100px for top nav/controls + 100px for bottom padding
      const reservedSpace = 200;
      const availableHeight = viewportHeight - reservedSpace;
      
      // Total working hours (7am to 5pm = 11 hours)
      const totalHours = 11;
      
      // Calculate ideal height that fits the viewport
      const calculatedHeight = Math.floor(availableHeight / totalHours);
      
      // Clamp between minimum (48px for balanced) and maximum (72px for desktop)
      // Desktop priority: prefer larger sizes
      let newHeight: number;
      
      if (viewportHeight >= 1080) {
        // Large desktop screens: use full 72px
        newHeight = 72;
      } else if (viewportHeight >= 900) {
        // Standard laptop: scale between 64-72px
        newHeight = Math.max(64, Math.min(calculatedHeight, 72));
      } else if (viewportHeight >= 768) {
        // Smaller laptop/tablet: scale between 56-64px
        newHeight = Math.max(56, Math.min(calculatedHeight, 64));
      } else {
        // Small screens: use minimum 48px
        newHeight = Math.max(48, Math.min(calculatedHeight, 56));
      }
      
      setHourHeight(newHeight);
    };

    // Calculate on mount
    calculateHeight();

    // Recalculate on resize
    window.addEventListener("resize", calculateHeight);
    
    return () => {
      window.removeEventListener("resize", calculateHeight);
    };
  }, []);

  return hourHeight;
};
