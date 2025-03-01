import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const FrameNavigation = ({
  currentFrame,
  totalFrames,
  setCurrentFrame,
  setImageLoaded,
}: {
  currentFrame: number;
  totalFrames: number;
  setCurrentFrame: React.Dispatch<React.SetStateAction<number>>;
  setImageLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // Handle seek bar change
  const handleSeekChange = (value: number[]) => {
    setCurrentFrame(value[0]);
    setImageLoaded(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-sm">
        <span>Frame: {currentFrame}</span>
        <span>Total: {totalFrames}</span>
      </div>
      <Slider
        min={0}
        max={totalFrames - 1}
        step={1}
        value={[currentFrame]}
        onValueChange={handleSeekChange}
      />
      <div className="flex justify-center gap-x-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setCurrentFrame(Math.max(0, currentFrame - 1));
            setImageLoaded(false);
          }}
        >
          <ChevronLeft /> Prev
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setCurrentFrame(Math.min(totalFrames - 1, currentFrame + 1));
            setImageLoaded(false);
          }}
        >
          Next <ChevronRight />
        </Button>
      </div>
    </div>
  );
};

export default FrameNavigation;
