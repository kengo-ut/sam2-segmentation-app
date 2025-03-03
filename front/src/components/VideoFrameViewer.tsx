import React, { useState } from "react";
import { PropagatePromptsApiSegmentationPropagatePostEffect } from "@/gen/schema";
import { Prompt } from "@/gen/schema";
import { VideoFrameViewerProps } from "@/types";
import { useImageHandling } from "@/hooks/useImageHandling";
import { usePromptHandling } from "@/hooks/usePromptHandling";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import { useAPIOperations } from "@/hooks/useAPIOperations";
import FileInfoCard from "@/components/FileInfoCard";
import SegmentationControlsCard from "@/components/SegmentationControlsCard";
import FrameViewerCard from "@/components/FrameViewerCard";
import DataAndStatsTabPanel from "@/components/DataAndStatsTabPanel";

const VideoFrameViewer: React.FC<VideoFrameViewerProps> = ({
  filename,
  numFrames,
  requestedWidth,
  requestedHeight,
}) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [objectId, setObjectId] = useState(0);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [clickMode, setClickMode] = useState<0 | 1>(1); // Default to positive clicks (1)
  const [isProcessing, setIsProcessing] = useState(false);
  const [effect, setEffect] =
    useState<keyof typeof PropagatePromptsApiSegmentationPropagatePostEffect>("color");
  const [open, setOpen] = useState(false);

  // Custom hooks
  const {
    imageRef,
    imageLoaded,
    setImageLoaded,
    imageSize,
    imageVersion,
    setImageVersion,
    handleImageLoaded,
    getFramePath,
  } = useImageHandling();

  const { handleImageClick, handlePromptClick, currentFramePrompts } = usePromptHandling(
    imageRef,
    imageLoaded,
    prompts,
    setPrompts,
    currentFrame,
    objectId,
    clickMode
  );

  // Register keyboard event listeners
  useKeyboardNavigation(numFrames, currentFrame, setCurrentFrame, setImageLoaded, setClickMode);

  // API operations
  const { handleApplyPrompts, handlePropagatePrompts, handleResetState, handleExportVideo } =
    useAPIOperations(prompts, effect, setIsProcessing, setImageVersion, setImageLoaded);

  return (
    <div className="flex flex-col gap-4">
      <FileInfoCard
        filename={filename}
        requestedWidth={requestedWidth}
        requestedHeight={requestedHeight}
        imageSize={imageSize}
      />

      <div className="flex justify-center">
        <div className="w-full max-w-6xl mx-auto space-y-6">
          <FrameViewerCard
            imageRef={imageRef}
            imagePath={getFramePath(currentFrame, filename)}
            currentFramePrompts={currentFramePrompts}
            prompts={prompts}
            setPrompts={setPrompts}
            handleImageClick={handleImageClick}
            handleImageLoaded={handleImageLoaded}
            requestedWidth={requestedWidth}
            requestedHeight={requestedHeight}
            currentFrame={currentFrame}
            numFrames={numFrames}
            setCurrentFrame={setCurrentFrame}
            setImageLoaded={setImageLoaded}
            objectId={objectId}
            setObjectId={setObjectId}
            clickMode={clickMode}
            setClickMode={setClickMode}
          />

          <SegmentationControlsCard
            handleApplyPrompts={handleApplyPrompts}
            handlePropagatePrompts={handlePropagatePrompts}
            handleResetState={handleResetState}
            handleExportVideo={handleExportVideo}
            isProcessing={isProcessing}
            prompts={prompts}
            effect={effect}
            setEffect={setEffect}
            open={open}
            setOpen={setOpen}
          />

          <DataAndStatsTabPanel
            prompts={prompts}
            currentFrame={currentFrame}
            numFrames={numFrames}
            requestedWidth={requestedWidth}
            requestedHeight={requestedHeight}
            handlePromptClick={handlePromptClick}
            imageVersion={imageVersion}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoFrameViewer;
