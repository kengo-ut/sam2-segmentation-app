import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Point } from "@/types";
import { Separator } from "@/components/ui/separator";

const StatsCard = ({ points, totalFrames }: { points: Point[]; totalFrames: number }) => {
  const positivePoints = points.filter((point) => point.label === 1).length;
  const negativePoints = points.filter((point) => point.label === 0).length;
  const framesWithPoints = new Set(points.map((p) => p.frameIndex)).size;

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
                  <div className="text-2xl font-bold text-green-600">{positivePoints}</div>
                  <div className="text-sm text-muted-foreground">Positive Points</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-red-600">{negativePoints}</div>
                  <div className="text-sm text-muted-foreground">Negative Points</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-2">Frames with Points</h4>
            <div className="text-sm">
              {framesWithPoints} / {totalFrames} frames
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
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
