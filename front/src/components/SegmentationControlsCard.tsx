import React from "react";
import { Download, ChevronsUpDown, Brush, FastForward, RotateCcw, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropagatePromptsApiSegmentationPropagatePostEffect, Prompt } from "@/gen/schema";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SegmentationControlsCardProps {
  handleApplyPrompts: () => Promise<void>;
  handlePropagatePrompts: () => Promise<void>;
  handleResetState: () => Promise<void>;
  handleExportVideo: () => Promise<void>;
  isProcessing: boolean;
  prompts: Prompt[];
  effect: keyof typeof PropagatePromptsApiSegmentationPropagatePostEffect;
  setEffect: React.Dispatch<
    React.SetStateAction<keyof typeof PropagatePromptsApiSegmentationPropagatePostEffect>
  >;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SegmentationControlsCard: React.FC<SegmentationControlsCardProps> = ({
  handleApplyPrompts,
  handlePropagatePrompts,
  handleResetState,
  handleExportVideo,
  isProcessing,
  prompts,
  effect,
  setEffect,
  open,
  setOpen,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Segmentation Controls</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            onClick={handleApplyPrompts}
            disabled={isProcessing || prompts.length === 0}
            className="gap-2"
          >
            <Brush className="w-4 h-4" />
            Apply Prompts
          </Button>

          <Button onClick={handlePropagatePrompts} disabled={isProcessing} className="gap-2">
            <FastForward className="w-4 h-4" />
            Propagate Forward
          </Button>

          <Button
            onClick={handleResetState}
            variant="destructive"
            disabled={isProcessing}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset State
          </Button>

          <Button
            onClick={handleExportVideo}
            variant="outline"
            disabled={isProcessing}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export Video
          </Button>
          <div className="flex items-center gap-2">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between"
                >
                  {PropagatePromptsApiSegmentationPropagatePostEffect[effect]}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search effect..." />
                  <CommandList>
                    <CommandEmpty>No effect found.</CommandEmpty>
                    <CommandGroup>
                      {Object.keys(PropagatePromptsApiSegmentationPropagatePostEffect).map(
                        (effectKey) => {
                          const effect =
                            PropagatePromptsApiSegmentationPropagatePostEffect[
                              effectKey as keyof typeof PropagatePromptsApiSegmentationPropagatePostEffect
                            ];
                          return (
                            <CommandItem
                              key={effectKey}
                              value={effectKey}
                              onSelect={(currentValue) => {
                                setEffect(
                                  currentValue as keyof typeof PropagatePromptsApiSegmentationPropagatePostEffect
                                );
                                setOpen(false);
                              }}
                            >
                              {effect}
                            </CommandItem>
                          );
                        }
                      )}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Effect for propagation (for application, fixed to &quot;color&quot;).</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="mt-4 p-2 bg-blue-50 text-blue-600 rounded text-center">
            Processing request, please wait...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SegmentationControlsCard;
