import React from "react";
import { Button } from "@/components/ui/button";
import { Prompt } from "@/gen/schema";
import { Slider } from "@/components/ui/slider";
import { Eraser } from "lucide-react";

interface FrameNavigationProps {
  currentFrame: number;
  numFrames: number;
  setCurrentFrame: React.Dispatch<React.SetStateAction<number>>;
  setImageLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  setPrompts?: React.Dispatch<React.SetStateAction<Prompt[]>>;
}

const FrameNavigation: React.FC<FrameNavigationProps> = ({
  currentFrame,
  numFrames,
  setCurrentFrame,
  setImageLoaded,
  setPrompts,
}) => {
  return (
    <div className="flex flex-col items-center gap-5">
      <Slider
        min={0}
        max={numFrames - 1}
        step={1}
        value={[currentFrame]}
        onValueChange={(value) => {
          setCurrentFrame(value[0]);
          setImageLoaded(false);
        }}
      />
      <div className="flex flex-col md:flex-row items-center gap-x-20 gap-y-2">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setCurrentFrame(0);
              setImageLoaded(false);
            }}
            disabled={currentFrame === 0}
            variant="outline"
            size="sm"
          >
            First
          </Button>
          <Button
            onClick={() => {
              setCurrentFrame((prev) => Math.max(0, prev - 10));
              setImageLoaded(false);
            }}
            disabled={currentFrame === 0}
            variant="outline"
            size="sm"
          >
            -10
          </Button>
          <Button
            onClick={() => {
              setCurrentFrame((prev) => Math.max(0, prev - 1));
              setImageLoaded(false);
            }}
            disabled={currentFrame === 0}
            variant="outline"
            size="sm"
          >
            Prev
          </Button>
        </div>
        <div className="text-center text-sm">
          Frame {currentFrame + 1} of {numFrames}
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setCurrentFrame((prev) => Math.min(numFrames - 1, prev + 1));
              setImageLoaded(false);
            }}
            disabled={currentFrame === numFrames - 1}
            variant="outline"
            size="sm"
          >
            Next
          </Button>
          <Button
            onClick={() => {
              setCurrentFrame((prev) => Math.min(numFrames - 1, prev + 10));
              setImageLoaded(false);
            }}
            disabled={currentFrame >= numFrames - 10}
            variant="outline"
            size="sm"
          >
            +10
          </Button>
          <Button
            onClick={() => {
              setCurrentFrame(numFrames - 1);
              setImageLoaded(false);
            }}
            disabled={currentFrame === numFrames - 1}
            variant="outline"
            size="sm"
          >
            Last
          </Button>
        </div>
      </div>
      {setPrompts && (
        <Button
          onClick={() => {
            setPrompts([]);
          }}
          variant="destructive"
        >
          <Eraser className="w-4 h-4" />
          Clear Prompts
        </Button>
      )}
    </div>
  );
};

export default FrameNavigation;
