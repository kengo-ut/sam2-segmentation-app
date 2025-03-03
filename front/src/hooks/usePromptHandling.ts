import { RefObject } from "react";
import { Point, Prompt } from "@/gen/schema";

export const usePromptHandling = (
  imageRef: RefObject<HTMLDivElement | null>,
  imageLoaded: boolean,
  prompts: Prompt[],
  setPrompts: React.Dispatch<React.SetStateAction<Prompt[]>>,
  currentFrame: number,
  objectId: number,
  clickMode: 0 | 1
) => {
  // Handle image click to capture coordinates
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || !imageLoaded) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate normalized coordinates (0-1)
    const relativeX = x / rect.width;
    const relativeY = y / rect.height;

    const point: Point = { x: relativeX, y: relativeY };
    const newPrompt: Prompt = {
      point: point,
      label: clickMode,
      frame_idx: currentFrame,
      obj_id: objectId,
    };
    setPrompts((prev) => [...prev, newPrompt]);

    console.log(
      `Added ${clickMode === 1 ? "positive" : "negative"} prompt at frame ${currentFrame}: x=${relativeX.toFixed(
        4
      )}, y=${relativeY.toFixed(4)}`
    );
  };

  // Remove a prompt when clicked
  const handlePromptClick = (index: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    const newPrompts = [...prompts];
    newPrompts.splice(index, 1);
    setPrompts(newPrompts);
  };

  // Get current frame prompts
  const currentFramePrompts = prompts.filter((prompt) => prompt.frame_idx === currentFrame);

  return {
    handleImageClick,
    handlePromptClick,
    currentFramePrompts,
  };
};
