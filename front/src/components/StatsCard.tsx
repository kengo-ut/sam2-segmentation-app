import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Prompt } from "@/gen/schema";

const StatsCard = ({
  prompts,
  numFrames,
  imageVersion,
}: {
  prompts: Prompt[];
  numFrames: number;
  imageVersion: number;
}) => {
  const positivePrompts = prompts.filter((p) => p.label === 1).length;
  const negativePrompts = prompts.filter((p) => p.label === 0).length;
  const framesWithPrompts = new Set(prompts.map((p) => p.frame_idx)).size;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-green-600">{positivePrompts}</div>
                  <div className="text-sm text-muted-foreground">Positive Prompts</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-red-600">{negativePrompts}</div>
                  <div className="text-sm text-muted-foreground">Negative Prompts</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-2">Frames with Prompts</h4>
            <div className="text-sm">
              {framesWithPrompts} / {numFrames} frames
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Keyboard Shortcuts</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">P</kbd> Positive Mode
              </div>
              <div>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">N</kbd> Negative Mode
              </div>
              <div>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">←</kbd> Previous Frame
              </div>
              <div>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">→</kbd> Next Frame
              </div>
            </div>
          </div>
          <div>
            <div className="text-sm">
              Last segmented:{" "}
              {new Date(imageVersion)
                .toLocaleString("ja-JP", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                })
                .replace(/\//g, "-")}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
