import {
  ExportVideoApiSegmentationExportPostParams,
  PropagatePromptsApiSegmentationPropagatePostParams,
  PropagatePromptsApiSegmentationPropagatePostEffect,
  Prompt,
} from "@/gen/schema";
import {
  applyPromptsApiSegmentationApplyPost,
  exportVideoApiSegmentationExportPost,
  propagatePromptsApiSegmentationPropagatePost,
  resetStateApiSegmentationResetPut,
} from "@/gen/segmentation/segmentation";

export const useAPIOperations = (
  prompts: Prompt[],
  effect: keyof typeof PropagatePromptsApiSegmentationPropagatePostEffect,
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>,
  setImageVersion: React.Dispatch<React.SetStateAction<number>>,
  setImageLoaded: React.Dispatch<React.SetStateAction<boolean>>,
  setPrompts: React.Dispatch<React.SetStateAction<Prompt[]>>,
  setCanPropagate: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const handleApplyPrompts = async () => {
    try {
      setIsProcessing(true);
      await applyPromptsApiSegmentationApplyPost(prompts);
      setCanPropagate(true);
      // Increment image version to force re-render
      setImageVersion(Date.now());
      setImageLoaded(false);
    } catch (error) {
      console.error("Error applying prompts:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePropagatePrompts = async () => {
    try {
      setIsProcessing(true);
      const params: PropagatePromptsApiSegmentationPropagatePostParams = {
        effect,
      };
      await propagatePromptsApiSegmentationPropagatePost(params);
      setPrompts([]);
      setCanPropagate(false);
      // Increment image version to force re-render
      setImageVersion(Date.now());
      setImageLoaded(false);
    } catch (error) {
      console.error("Error propagating prompts:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetState = async () => {
    if (window.confirm("Are you sure you want to reset the state? This action cannot be undone.")) {
      try {
        setIsProcessing(true);
        await resetStateApiSegmentationResetPut();
        setCanPropagate(false);
        // Increment image version to force re-render
        setImageVersion(Date.now());
        setImageLoaded(false);
      } catch (error) {
        console.error("Error resetting state:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleExportVideo = async () => {
    try {
      setIsProcessing(true);
      const outFilename = window.prompt("Enter the output filename:", "output");
      if (!outFilename) {
        setIsProcessing(false);
        return;
      }
      const params: ExportVideoApiSegmentationExportPostParams = {
        filename: outFilename,
      };
      await exportVideoApiSegmentationExportPost(params);
    } catch (error) {
      console.error("Error exporting video:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    handleApplyPrompts,
    handlePropagatePrompts,
    handleResetState,
    handleExportVideo,
  };
};
