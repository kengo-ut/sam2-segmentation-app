import React from "react";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Prompt } from "@/gen/schema";
import FrameDisplay from "./FrameDisplay";
import FrameNavigation from "./FrameNavigation";

interface FrameViewerCardProps {
  imageRef: React.RefObject<HTMLDivElement | null>;
  imagePath: string;
  currentFramePrompts: Prompt[];
  prompts: Prompt[];
  setPrompts: React.Dispatch<React.SetStateAction<Prompt[]>>;
  handleImageClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleImageLoaded: () => void;
  requestedWidth: number;
  requestedHeight: number;
  currentFrame: number;
  numFrames: number;
  setCurrentFrame: React.Dispatch<React.SetStateAction<number>>;
  setImageLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  objectId: number;
  setObjectId: React.Dispatch<React.SetStateAction<number>>;
  clickMode: 0 | 1;
  setClickMode: React.Dispatch<React.SetStateAction<0 | 1>>;
}

const FrameViewerCard: React.FC<FrameViewerCardProps> = ({
  imageRef,
  imagePath,
  currentFramePrompts,
  prompts,
  setPrompts,
  handleImageClick,
  handleImageLoaded,
  requestedWidth,
  requestedHeight,
  currentFrame,
  numFrames,
  setCurrentFrame,
  setImageLoaded,
  objectId,
  setObjectId,
  clickMode,
  setClickMode,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex text-xl justify-between">
          <span>Frame Viewer</span>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm">Object ID</span>
              <Input
                value={objectId}
                onChange={(e) => setObjectId(parseInt(e.target.value))}
                className="w-20"
                placeholder="Enter ID"
                type="number"
                min={0}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setClickMode(1)}
                variant={clickMode === 1 ? "default" : "outline"}
                size="sm"
                className="gap-1"
              >
                <Plus className="w-4 h-4" /> Positive
              </Button>
              <Button
                onClick={() => setClickMode(0)}
                variant={clickMode === 0 ? "destructive" : "outline"}
                size="sm"
                className="gap-1"
              >
                <Minus className="w-4 h-4" /> Negative
              </Button>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-8">
        {/* Frame display component */}
        <FrameDisplay
          imageRef={imageRef}
          imagePath={imagePath}
          currentFramePrompts={currentFramePrompts}
          prompts={prompts}
          setPrompts={setPrompts}
          handleImageClick={handleImageClick}
          handleImageLoaded={handleImageLoaded}
          requestedWidth={requestedWidth}
          requestedHeight={requestedHeight}
        />

        {/* Frame navigation controls */}
        <FrameNavigation
          currentFrame={currentFrame}
          numFrames={numFrames}
          setCurrentFrame={setCurrentFrame}
          setImageLoaded={setImageLoaded}
          setPrompts={setPrompts}
        />
      </CardContent>
    </Card>
  );
};

export default FrameViewerCard;
