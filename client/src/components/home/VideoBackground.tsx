import { useEffect, useRef } from "react";

interface VideoBackgroundProps {
  url: string;
}

export function VideoBackground({ url }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fadingOutRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    let currentOpacity = 0;
    container.style.opacity = "0";

    const cancelFade = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };

    const fade = (targetOpacity: number, duration: number, onComplete?: () => void) => {
      cancelFade();
      const startOpacity = currentOpacity;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        currentOpacity = startOpacity + (targetOpacity - startOpacity) * progress;
        container.style.opacity = currentOpacity.toString();

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else if (onComplete) {
          onComplete();
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handleLoadedData = () => {
      fade(1, 250);
    };

    const handleTimeUpdate = () => {
      if (!video.duration) return;
      const timeRemaining = video.duration - video.currentTime;
      
      if (timeRemaining <= 0.55 && !fadingOutRef.current) {
        fadingOutRef.current = true;
        fade(0, 250, () => {
          setTimeout(() => {
            video.currentTime = 0;
            video.play().then(() => {
              fadingOutRef.current = false;
              fade(1, 250);
            }).catch(console.error);
          }, 100);
        });
      }
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      cancelFade();
      if (video) {
        video.removeEventListener("loadeddata", handleLoadedData);
        video.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 z-0 overflow-hidden bg-black flex justify-center items-start"
    >
      <video
        ref={videoRef}
        src={url}
        autoPlay
        muted
        playsInline
        className="w-[115%] h-[115%] max-w-none origin-top object-cover object-top"
      />
    </div>
  );
}
