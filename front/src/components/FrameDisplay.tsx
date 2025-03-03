import React from "react";
import { Prompt } from "@/gen/schema";
import Image from "next/image";
import { Circle, Square, Triangle } from "lucide-react";

interface FrameDisplayProps {
  imageRef: React.RefObject<HTMLDivElement | null>;
  imagePath: string;
  currentFramePrompts: Prompt[];
  prompts: Prompt[];
  setPrompts: React.Dispatch<React.SetStateAction<Prompt[]>>;
  handleImageClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleImageLoaded: () => void;
  requestedWidth: number;
  requestedHeight: number;
}

const FrameDisplay: React.FC<FrameDisplayProps> = ({
  imageRef,
  imagePath,
  currentFramePrompts,
  prompts,
  setPrompts,
  handleImageClick,
  handleImageLoaded,
  requestedWidth,
  requestedHeight,
}) => {
  console.log(imagePath);
  return (
    <div
      ref={imageRef}
      className="relative cursor-crosshair w-fit"
      style={{ aspectRatio: `${requestedWidth}/${requestedHeight}` }}
      onClick={handleImageClick}
    >
      <Image
        src={imagePath}
        alt="Video Frame"
        className="w-full h-auto"
        width={requestedWidth}
        height={requestedHeight}
        onLoad={handleImageLoaded}
        priority
      />

      {/* Render points */}
      {currentFramePrompts.map((prompt, index) => {
        // Scale coordinates to displayed image size
        const x = prompt.point.x * 100;
        const y = prompt.point.y * 100;

        const shapeIndex = prompt.obj_id % 3;
        const isPositive = prompt.label === 1;

        return (
          <div
            key={index}
            className="absolute size-2 sm:size-4 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer flex items-center justify-center"
            style={{
              left: `${x}%`,
              top: `${y}%`,
            }}
            onClick={(e) => {
              e.stopPropagation();
              const newPrompts = [...prompts];
              const indexToRemove = prompts.findIndex(
                (p) =>
                  p.frame_idx === prompt.frame_idx &&
                  p.point.x === prompt.point.x &&
                  p.point.y === prompt.point.y &&
                  p.obj_id === prompt.obj_id
              );
              if (indexToRemove !== -1) {
                newPrompts.splice(indexToRemove, 1);
                setPrompts(newPrompts);
              }
            }}
            title={`Object ${prompt.obj_id}: ${
              isPositive ? "Positive" : "Negative"
            } Point: (${prompt.point.x.toFixed(4)}, ${prompt.point.y.toFixed(4)})`}
          >
            {shapeIndex === 0 && (
              <Circle
                className={`${isPositive ? "fill-green-500 stroke-green-800" : "fill-red-500 stroke-red-800"}`}
              />
            )}
            {shapeIndex === 1 && (
              <Triangle
                className={`${isPositive ? "fill-green-500 stroke-green-800" : "fill-red-500 stroke-red-800"}`}
              />
            )}
            {shapeIndex === 2 && (
              <Square
                className={`${isPositive ? "fill-green-500 stroke-green-800" : "fill-red-500 stroke-red-800"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FrameDisplay;
