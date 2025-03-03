export interface Point {
  x: number;
  y: number;
  frameIndex: number;
  label: 0 | 1; // 0 for negative, 1 for positive
}

export interface VideoFrameViewerProps {
  filename: string;
  numFrames: number;
  requestedWidth: number;
  requestedHeight: number;
}
