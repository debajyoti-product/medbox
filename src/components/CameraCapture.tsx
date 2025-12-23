import { useRef, useEffect, useState } from "react";
import { X, Camera, Flashlight, FlashlightOff } from "lucide-react";

interface CameraCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageData: string) => void;
}

const CameraCapture = ({ isOpen, onClose, onCapture }: CameraCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Check if torch is supported
      const track = mediaStream.getVideoTracks()[0];
      const capabilities = track.getCapabilities?.() as MediaTrackCapabilities & { torch?: boolean };
      if (capabilities?.torch) {
        setTorchSupported(true);
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setError("Unable to access camera. Please allow camera permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setTorchOn(false);
    setTorchSupported(false);
  };

  const toggleTorch = async () => {
    if (!stream) return;
    
    const track = stream.getVideoTracks()[0];
    try {
      await track.applyConstraints({
        advanced: [{ torch: !torchOn } as MediaTrackConstraintSet & { torch: boolean }],
      });
      setTorchOn(!torchOn);
    } catch (err) {
      console.error("Torch toggle error:", err);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg", 0.8);
        onCapture(imageData);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Top controls */}
      <div className="absolute top-6 left-0 right-0 z-10 flex justify-between items-center px-6">
        {/* Torch button */}
        {torchSupported && (
          <button
            onClick={toggleTorch}
            className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center text-white transition-all active:scale-95"
          >
            {torchOn ? (
              <Flashlight className="w-6 h-6 text-yellow-400" />
            ) : (
              <FlashlightOff className="w-6 h-6" />
            )}
          </button>
        )}
        {!torchSupported && <div className="w-12" />}
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center text-white transition-all active:scale-95"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Camera view */}
      <div className="flex-1 relative overflow-hidden">
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center text-white text-center p-6">
            <p>{error}</p>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* Corner brackets overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-72 h-96 relative">
                {/* Top left corner */}
                <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                {/* Top right corner */}
                <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                {/* Bottom left corner */}
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                {/* Bottom right corner */}
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-primary rounded-br-lg" />
              </div>
            </div>
            <p className="absolute bottom-32 left-0 right-0 text-center text-white/80 text-sm">
              Align your prescription or medicine within the frame
            </p>
          </>
        )}
      </div>

      {/* Capture button */}
      <div className="h-32 bg-black flex items-center justify-center">
        <button
          onClick={capturePhoto}
          disabled={!!error}
          className="w-20 h-20 rounded-full bg-white flex items-center justify-center transition-transform active:scale-95 disabled:opacity-50"
        >
          <div className="w-16 h-16 rounded-full bg-white border-4 border-black/20" />
        </button>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;
