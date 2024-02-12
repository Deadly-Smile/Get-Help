// eslint-disable-next-line react/prop-types
const WebcamStream = ({ videoRef, width, height }) => {
  return (
    <div className="absolute right-1 bottom-4">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: "scaleX(-1)",
          WebkitTransform: "scaleX(-1)",
        }}
      />
    </div>
  );
};

export default WebcamStream;
