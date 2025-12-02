import { useState } from "react";
import { Mic, X, Pause, Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VoiceRecording = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(true);
  const [transcript, setTranscript] = useState("");

  const handleClose = () => {
    setIsRecording(false);
    navigate("/home");
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex flex-col items-center justify-between p-6 pb-12">
      {/* Main content area */}
      <div className="flex-1 w-full max-w-2xl flex flex-col items-center justify-center space-y-8">
        {/* Animated voice circles */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Outer circle - lightest */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 via-primary/15 to-primary/10 backdrop-blur-xl liquid-sphere"></div>
          
          {/* Inner circle - slightly darker */}
          <div className="absolute inset-16 rounded-full bg-gradient-to-br from-primary/30 via-primary/20 to-primary/15 backdrop-blur-lg liquid-sphere-reverse"></div>
          
          {/* Mic icon - 3D effect */}
          <div className="relative z-10 w-20 h-20 flex items-center justify-center">
            <Mic className="w-16 h-16 fill-primary stroke-none drop-shadow-[0_4px_12px_rgba(0,122,158,0.5)]" />
          </div>
        </div>

        {/* Transcript text */}
        <div className="w-full text-center space-y-4 px-6">
          {transcript ? (
            <p className="text-foreground text-lg leading-relaxed">
              {transcript}
            </p>
          ) : (
            <p className="text-muted-foreground text-base">
              Listening...
            </p>
          )}
        </div>
      </div>

      {/* Bottom controls */}
      <div className="w-full max-w-2xl flex items-center justify-between px-6">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
        >
          <X className="w-6 h-6 text-foreground" />
        </button>

        {/* Waveform visualization */}
        <div className="flex items-center gap-1">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`w-1 rounded-full bg-primary transition-all ${
                isRecording ? 'animate-pulse' : ''
              }`}
              style={{
                height: isRecording 
                  ? `${Math.random() * 32 + 8}px` 
                  : '8px',
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>

        {/* Record/Pause button */}
        <button
          onClick={toggleRecording}
          className={`w-12 h-12 flex items-center justify-center rounded-full transition-all ${
            isRecording 
              ? 'bg-destructive hover:bg-destructive/90' 
              : 'bg-primary hover:bg-primary/90'
          }`}
        >
          {isRecording ? (
            <Pause className="w-6 h-6 text-white fill-white" />
          ) : (
            <Circle className="w-6 h-6 text-white fill-white" />
          )}
        </button>
      </div>
    </div>
  );
};

export default VoiceRecording;
