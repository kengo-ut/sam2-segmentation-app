import { useRef, useState } from "react";

export const useImageHandling = () => {
  const imageRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [imageVersion, setImageVersion] = useState<number>(Date.now());

  // Generate the current frame path with version query parameter to force re-fetch
  const getFramePath = (index: number, filename: string) => {
    return `/processed/${filename}/state/${index.toString().padStart(5, "0")}.jpg?v=${imageVersion}`;
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

  return {
    imageRef,
    imageLoaded,
    setImageLoaded,
    imageSize,
    imageVersion,
    setImageVersion,
    handleImageLoaded,
    getFramePath,
  };
};
