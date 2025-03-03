import { useEffect } from "react";

export const useKeyboardNavigation = (
  numFrames: number,
  currentFrame: number,
  setCurrentFrame: React.Dispatch<React.SetStateAction<number>>,
  setImageLoaded: React.Dispatch<React.SetStateAction<boolean>>,
  setClickMode: React.Dispatch<React.SetStateAction<0 | 1>>
) => {
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setCurrentFrame((prev) => Math.max(0, prev - 1));
        setImageLoaded(false);
      } else if (e.key === "ArrowRight") {
        setCurrentFrame((prev) => Math.min(numFrames - 1, prev + 1));
        setImageLoaded(false);
      } else if (e.key === "p" || e.key === "P") {
        // Switch to positive click mode
        setClickMode(1);
      } else if (e.key === "n" || e.key === "N") {
        // Switch to negative click mode
        setClickMode(0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [numFrames, setCurrentFrame, setImageLoaded, setClickMode]);
};
