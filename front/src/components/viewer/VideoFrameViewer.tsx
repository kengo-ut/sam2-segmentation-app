import React, { useEffect, useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FrameDisplay from "./FrameDisplay";
import FrameNavigation from "./FrameNavigation";
import PointsDataTable from "./PointDataTable";
import StatsCard from "./StatsCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Point, VideoFrameViewerProps } from "@/types";

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
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  // Generate the current frame path
  const getFramePath = (index: number) => {
    return `/videos/${directoryName}/frames/${index.toString().padStart(5, "0")}.jpg`;
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

  // Update image size on resize
  useEffect(() => {
    const updateImageSize = () => {
      if (imageRef.current) {
        const rect = imageRef.current.getBoundingClientRect();
        setImageSize({ width: rect.width, height: rect.height });
      }
    };

    // Call once after image loads
    if (imageLoaded && imageRef.current) {
      updateImageSize();
    }

    // Add resize event listener
    window.addEventListener("resize", updateImageSize);
    return () => {
      window.removeEventListener("resize", updateImageSize);
    };
  }, [imageLoaded]);

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

  // Handle image loaded event
  const handleImageLoaded = () => {
    setImageLoaded(true);
    // Update image size when loaded
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      setImageSize({ width: rect.width, height: rect.height });
    }
  };

  // Get current frame points
  const currentFramePoints = points.filter((point) => point.frameIndex === currentFrame);

  return (
    <div className="flex flex-col gap-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center justify-between">
            <span>Directory: {directoryName}</span>
            <div className="flex flex-col items-end space-y-1">
              <span className="text-sm font-normal text-muted-foreground">
                {requestedWidth} x {requestedHeight} <span className="text-xs">(original)</span>
              </span>
              <span className="text-sm font-normal text-muted-foreground">
                {imageSize.width.toFixed(0)} x {imageSize.height.toFixed(0)}{" "}
                <span className="text-xs">(resized)</span>
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
              {/* Frame display component */}
              <FrameDisplay
                imageRef={imageRef}
                imagePath={getFramePath(currentFrame)}
                currentFramePoints={currentFramePoints}
                points={points}
                setPoints={setPoints}
                handleImageClick={handleImageClick}
                handleImageLoaded={handleImageLoaded}
                requestedWidth={requestedWidth}
                requestedHeight={requestedHeight}
              />

              {/* Frame navigation controls */}
              <FrameNavigation
                currentFrame={currentFrame}
                totalFrames={totalFrames}
                setCurrentFrame={setCurrentFrame}
                setImageLoaded={setImageLoaded}
              />
            </CardContent>
          </Card>

          {/* Points data and stats */}
          <Tabs defaultValue="data" className="flex flex-col gap-1">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="data">Point Data</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>

            <TabsContent value="data">
              <PointsDataTable
                points={points}
                currentFrame={currentFrame}
                requestedWidth={requestedWidth}
                requestedHeight={requestedHeight}
                exportPoints={exportPoints}
                handlePointClick={handlePointClick}
              />
            </TabsContent>

            <TabsContent value="stats">
              <StatsCard points={points} totalFrames={totalFrames} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default VideoFrameViewer;
