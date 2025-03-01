"use client";

import { useState, useRef } from "react";
import VideoFrameViewer from "@/components/VideoFrameViewer";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Play } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { FetchVideoInfoApiVideoInfoGetParams, VideoInfo } from "@/gen/schema";
import { fetchVideoInfoApiVideoInfoGet } from "@/gen/video/video";

export default function VideoAnnotationPage() {
  const [directoryName, setDirectoryName] = useState("");
  const [isViewerActive, setIsViewerActive] = useState(false);
  const [totalFrames, setTotalFrames] = useState(0);
  const [requestedWidth, setRequestedWidth] = useState(640);
  const [requestedHeight, setRequestedHeight] = useState(360);

  const containerRef = useRef<HTMLDivElement>(null);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (directoryName.trim()) {
      const params: FetchVideoInfoApiVideoInfoGetParams = {
        dirname: directoryName,
      };
      const response = await fetchVideoInfoApiVideoInfoGet(params);
      console.log(response);
      const videoInfo: VideoInfo = response.data;
      setTotalFrames(videoInfo.total);
      setRequestedWidth(videoInfo.width);
      setRequestedHeight(videoInfo.height);
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
                <Label htmlFor="directoryName">Directory Name</Label>
                <Input
                  id="directoryName"
                  placeholder="e.g. sample_video"
                  value={directoryName}
                  onChange={(e) => setDirectoryName(e.target.value)}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  JPEG images should be stored in the public/[directoryName]/frames/ directory.
                </p>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              type="submit"
              onClick={handleSubmit}
              className="gap-2"
              disabled={!directoryName.trim()}
            >
              <Play className="h-4 w-4" />
              Start Viewer
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <VideoFrameViewer
          directoryName={directoryName}
          totalFrames={totalFrames}
          requestedWidth={requestedWidth}
          requestedHeight={requestedHeight}
        />
      )}
    </main>
  );
}
