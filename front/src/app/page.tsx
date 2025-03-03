"use client";

import { useState, useRef } from "react";
import VideoFrameViewer from "@/components/VideoFrameViewer";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Play } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { InitializeVideoApiSegmentationInitializePostParams, VideoInfo } from "@/gen/schema";
import { initializeVideoApiSegmentationInitializePost } from "@/gen/segmentation/segmentation";

export default function VideoAnnotationPage() {
  const [filename, setFilename] = useState("");
  const [isViewerActive, setIsViewerActive] = useState(false);
  const [numFrames, setNumFrames] = useState(0);
  const [requestedWidth, setRequestedWidth] = useState(640);
  const [requestedHeight, setRequestedHeight] = useState(360);

  const containerRef = useRef<HTMLDivElement>(null);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (filename.trim()) {
      const params: InitializeVideoApiSegmentationInitializePostParams = {
        filename,
      };
      const response = await initializeVideoApiSegmentationInitializePost(params);
      const videoInfo: VideoInfo = response.data;
      setRequestedWidth(videoInfo.width);
      setRequestedHeight(videoInfo.height);
      setNumFrames(videoInfo.num_frames);
      setIsViewerActive(true);
    }
  };

  return (
    <main className="container mx-auto py-6 px-4 max-w-6xl space-y-8" ref={containerRef}>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">SAM2 Segmentation App</h1>
        {isViewerActive && (
          <Button variant="outline" onClick={() => setIsViewerActive(false)} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Setup
          </Button>
        )}
      </div>

      <Separator />

      {!isViewerActive ? (
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="directoryName">Video Filename</Label>
                <Input
                  id="filename"
                  placeholder="e.g. sample_video"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Video file (.mp4) should be placed in the front/public/videos directory.
                </p>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              type="submit"
              onClick={handleSubmit}
              className="gap-2"
              disabled={!filename.trim()}
            >
              <Play className="h-4 w-4" />
              Start Viewer
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <VideoFrameViewer
          filename={filename}
          numFrames={numFrames}
          requestedWidth={requestedWidth}
          requestedHeight={requestedHeight}
        />
      )}
    </main>
  );
}
