import React from "react";
import Image from "next/image";
import { Point } from "@/types";

const FrameDisplay = ({
  imageRef,
  imagePath,
  currentFramePoints,
  points,
  setPoints,
  handleImageClick,
  handleImageLoaded,
  requestedWidth,
  requestedHeight,
}: {
  imageRef: React.RefObject<HTMLDivElement | null>;
  imagePath: string;
  currentFramePoints: Point[];
  points: Point[];
  setPoints: React.Dispatch<React.SetStateAction<Point[]>>;
  handleImageClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleImageLoaded: () => void;
  requestedWidth: number;
  requestedHeight: number;
}) => {
  // Handle point removal
  const handlePointClick = (index: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    const newPoints = [...points];
    newPoints.splice(index, 1);
    setPoints(newPoints);
  };

  return (
    <div className="flex justify-center border-4 border-gray-200">
      <div
        ref={imageRef}
        className="relative cursor-crosshair w-fit"
        style={{ aspectRatio: `${requestedWidth}/${requestedHeight}` }}
        onClick={handleImageClick}
      >
        <Image
          src={imagePath}
          alt={`Current Frame`}
          width={requestedWidth}
          height={requestedHeight}
          className="w-full h-auto"
          onLoad={handleImageLoaded}
          priority
        />

        {currentFramePoints.map((point, index) => (
          <div
            key={index}
            className={`absolute size-2 sm:size-4 rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer border-2 ${
              point.label === 1
                ? "bg-green-500 border-green-700 hover:bg-green-600"
                : "bg-red-500 border-red-700 hover:bg-red-600"
            }`}
            style={{
              left: `${point.x * 100}%`,
              top: `${point.y * 100}%`,
            }}
            onClick={handlePointClick(
              points.findIndex(
                (p) => p.x === point.x && p.y === point.y && p.frameIndex === point.frameIndex
              )
            )}
            title={`${point.label === 1 ? "Positive" : "Negative"} Point: (${point.x.toFixed(4)}, ${point.y.toFixed(4)})`}
          />
        ))}
      </div>
    </div>
  );
};

export default FrameDisplay;
