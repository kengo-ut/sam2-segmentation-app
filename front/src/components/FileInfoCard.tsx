import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface FileInfoCardProps {
  filename: string;
  requestedWidth: number;
  requestedHeight: number;
  imageSize: { width: number; height: number };
}

const FileInfoCard: React.FC<FileInfoCardProps> = ({
  filename,
  requestedWidth,
  requestedHeight,
  imageSize,
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold flex items-center justify-between">
          <span>File: {filename}</span>
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
  );
};

export default FileInfoCard;
