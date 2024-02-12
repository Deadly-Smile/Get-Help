import { useEffect, useRef, useState } from "react";
import WebcamStream from "./WebcamStream";
import { RealTimeChatButtons } from "./RealTimeChatButtons";
import { ForeginFeed } from "./ForeginFeed";

export const VideoChat = () => {
  const videoRef = useRef(null);
  const [videoSize, setVideoSize] = useState({ width: 640, height: 480 }); // Set initial size
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const audioTrackRef = useRef(null);
  const videoTrackRef = useRef(null);

  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        videoRef.current.srcObject = stream;
        audioTrackRef.current = stream.getAudioTracks()[0];
        videoTrackRef.current = stream.getVideoTracks()[0];
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };

    startWebcam();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setVideoSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleMute = () => {
    setIsMuted((prevMuted) => {
      const muted = !prevMuted;
      audioTrackRef.current.enabled = !muted;
      return muted;
    });
  };

  const toggleCamera = () => {
    setIsCameraOff((prevCameraOff) => {
      const cameraOff = !prevCameraOff;
      videoTrackRef.current.enabled = !cameraOff;
      return cameraOff;
    });
  };

  const endCall = () => {
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
  };
  return (
    <div className="mx-3">
      <ForeginFeed width={videoSize.width} height={videoSize.height} />
      <WebcamStream videoRef={videoRef} width={240} height={120} />
      <RealTimeChatButtons
        toggleCamera={toggleCamera}
        toggleMute={toggleMute}
        endCall={endCall}
        isMuted={isMuted}
        isCameraOff={isCameraOff}
      />
    </div>
  );
};
