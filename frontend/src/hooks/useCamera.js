import { useState, useRef, useCallback } from 'react';

export function useCamera() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = useCallback(async (constraints = {}) => {
    try {
      const defaultConstraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        ...constraints,
      };

      const stream = await navigator.mediaDevices.getUserMedia(defaultConstraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
        setError(null);
      }
    } catch (err) {
      setError(err.message);
      console.error('Camera error:', err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  const capturePhoto = useCallback((options = {}) => {
    if (!videoRef.current) return null;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    const { mimeType = 'image/jpeg', quality = 0.85 } = options;
    return canvas.toBlob((blob) => blob, mimeType, quality);
  }, []);

  return {
    videoRef,
    isStreaming,
    error,
    startCamera,
    stopCamera,
    capturePhoto,
  };
}