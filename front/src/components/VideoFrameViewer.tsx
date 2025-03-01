"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, Download, Plus, Minus, Trash2 } from "lucide-react";

interface Point {
  x: number;
  y: number;
  frameIndex: number;
  label: 0 | 1; // 0 for negative, 1 for positive
}

interface VideoFrameViewerProps {
  directoryName: string;
  totalFrames: number;
  requestedWidth: number;
  requestedHeight: number;
}

const VideoFrameViewer: React.FC<VideoFrameViewerProps> = ({
  directoryName,
  totalFrames,
  requestedWidth,
  requestedHeight,
}) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [points, setPoints] = useState<Point[]>([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [clickMode, setClickMode] = useState<0 | 1>(1); // Default to positive clicks (1)
  const imageRef = useRef<HTMLDivElement>(null);

  // Generate the current frame path
  const getFramePath = (index: number) => {
    return `/videos/${directoryName}/frames/${index.toString().padStart(5, "0")}.jpg`;
  };

  // Handle seek bar change
  const handleSeekChange = (value: number[]) => {
    setCurrentFrame(value[0]);
    setImageLoaded(false);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setCurrentFrame((prev) => Math.max(0, prev - 1));
        setImageLoaded(false);
      } else if (e.key === "ArrowRight") {
        setCurrentFrame((prev) => Math.min(totalFrames - 1, prev + 1));
        setImageLoaded(false);
      } else if (e.key === "p" || e.key === "P") {
        // Switch to positive click mode
        setClickMode(1);
      } else if (e.key === "n" || e.key === "N") {
        // Switch to negative click mode
        setClickMode(0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [totalFrames]);

  // Handle image click to capture coordinates
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || !imageLoaded) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate normalized coordinates (0-1)
    const relativeX = x / rect.width;
    const relativeY = y / rect.height;

    const newPoint: Point = {
      x: relativeX,
      y: relativeY,
      frameIndex: currentFrame,
      label: clickMode,
    };

    setPoints([...points, newPoint]);

    console.log(
      `Added ${clickMode === 1 ? "positive" : "negative"} point at frame ${currentFrame}: x=${relativeX.toFixed(
        4
      )}, y=${relativeY.toFixed(4)}`
    );
  };

  // Remove a point when clicked
  const handlePointClick = (index: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    const newPoints = [...points];
    newPoints.splice(index, 1);
    setPoints(newPoints);
  };

  // Export points data
  const exportPoints = () => {
    const dataStr = JSON.stringify(points, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportLink = document.createElement("a");
    exportLink.setAttribute("href", dataUri);
    exportLink.setAttribute("download", `${directoryName}-coordinates.json`);
    document.body.appendChild(exportLink);
    exportLink.click();
    document.body.removeChild(exportLink);
  };

  // Get current frame points
  const currentFramePoints = points.filter((point) => point.frameIndex === currentFrame);

  // Get points stats
  const positivePoints = points.filter((point) => point.label === 1).length;
  const negativePoints = points.filter((point) => point.label === 0).length;

  return (
    <div className="space-y-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center justify-between">
            <span>Directory: {directoryName}</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-normal text-muted-foreground">
                {requestedWidth} x {requestedHeight}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="flex justify-center">
        <div className="w-full max-w-6xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex text-xl items-center justify-between">
                <span>Frame Viewer</span>
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
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Frame display with aspect ratio preservation */}
              <div className="flex justify-center">
                <div
                  ref={imageRef}
                  className="relative cursor-crosshair w-fit border border-muted"
                  style={{ aspectRatio: `${requestedWidth}/${requestedHeight}` }}
                  onClick={handleImageClick}
                >
                  {/* Display the current frame */}
                  <Image
                    src={getFramePath(currentFrame)}
                    alt={`Frame ${currentFrame}`}
                    width={requestedWidth}
                    height={requestedHeight}
                    className="w-full h-auto"
                    priority
                  />

                  {/* Display points with different colors based on label */}
                  {imageLoaded &&
                    currentFramePoints.map((point, index) => (
                      <div
                        key={index}
                        className={`absolute size-2 sm:size-1 rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer border-2 ${
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
                            (p) =>
                              p.x === point.x &&
                              p.y === point.y &&
                              p.frameIndex === point.frameIndex
                          )
                        )}
                        title={`${point.label === 1 ? "Positive" : "Negative"} Point: (${point.x.toFixed(4)}, ${point.y.toFixed(4)})`}
                      />
                    ))}
                </div>
              </div>

              {/* Frame navigation controls */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Frame: {currentFrame}</span>
                  <span>Total: {totalFrames}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Slider
                    min={0}
                    max={totalFrames - 1}
                    step={1}
                    value={[currentFrame]}
                    onValueChange={handleSeekChange}
                  />
                </div>
                <div className="flex justify-center space-x-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentFrame(Math.max(0, currentFrame - 1))}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentFrame(Math.min(totalFrames - 1, currentFrame + 1))}
                  >
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Points data and stats */}
          <Tabs defaultValue="data">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="data">Point Data</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>

            <TabsContent value="data" className="mt-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>Coordinates</span>
                    <Button onClick={exportPoints} variant="outline" size="sm" className="gap-1">
                      <Download className="w-4 h-4" /> Export
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64 rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Frame</TableHead>
                          <TableHead>X</TableHead>
                          <TableHead>Y</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {points.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground">
                              No points added yet. Click on the image to add points.
                            </TableCell>
                          </TableRow>
                        ) : (
                          points.map((point, index) => (
                            <TableRow
                              key={index}
                              className={point.frameIndex === currentFrame ? "bg-accent/50" : ""}
                            >
                              <TableCell>{point.frameIndex}</TableCell>
                              <TableCell>{(point.x * requestedWidth).toFixed(0)}</TableCell>
                              <TableCell>{(point.y * requestedHeight).toFixed(0)}</TableCell>
                              <TableCell>
                                <Badge variant={point.label === 1 ? "default" : "destructive"}>
                                  {point.label === 1 ? "Positive" : "Negative"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={handlePointClick(index)}
                                  className="h-8 w-8"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
                <CardFooter className="flex justify-between border-t px-6 py-3">
                  <div className="text-sm text-muted-foreground">Total points: {points.length}</div>
                  <div className="text-sm text-muted-foreground">
                    Current frame: {currentFramePoints.length} points
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="mt-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {positivePoints}
                            </div>
                            <div className="text-sm text-muted-foreground">Positive Points</div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
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
                        {Array.from(new Set(points.map((p) => p.frameIndex))).length} /{" "}
                        {totalFrames} frames
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default VideoFrameViewer;
