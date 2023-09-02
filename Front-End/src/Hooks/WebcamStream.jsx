import { useEffect, useRef, useState } from "react";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaPhone,
} from "react-icons/fa";

const WebcamStream = () => {
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

  // Update videoSize based on window size when the window is resized
  useEffect(() => {
    const handleResize = () => {
      setVideoSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Listen for window resize events
    window.addEventListener("resize", handleResize);

    // Initial size on component mount
    handleResize();

    // Cleanup event listener on component unmount
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
    <div>
      <h1>Webcam and Microphone Stream</h1>
      <div className="relative w-full pb-9/16">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="absolute top-0 left-0 w-full h-full"
          style={{
            width: `${videoSize.width}px`,
            height: `${videoSize.height}px`,
            transform: "scaleX(-1)",
            WebkitTransform: "scaleX(-1)",
          }}
        />
        <div className="absolute bottom-0 left-0 w-full bg-opacity-60 bg-black py-2 mt-5">
          <div className="flex justify-center space-x-4">
            <button onClick={toggleMute} className="meet-button">
              {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
            </button>
            <button onClick={toggleCamera} className="meet-button">
              {isCameraOff ? <FaVideoSlash /> : <FaVideo />}
            </button>
            <button onClick={endCall} className="meet-button">
              <FaPhone />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebcamStream;
