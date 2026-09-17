import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, X, Check, Upload, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '../../components/common/Button';

interface PhotoCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoCaptured: (photoDataUrl: string, caption?: string) => void;
}

export const PhotoCaptureModal: React.FC<PhotoCaptureModalProps> = ({
  isOpen,
  onClose,
  onPhotoCaptured
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [isInitializing, setIsInitializing] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Start camera when modal opens in capture mode
  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera(facingMode);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode, capturedImage]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const startCamera = async (mode: 'user' | 'environment') => {
    stopCamera();
    setCameraError(null);
    setIsInitializing(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera device access is not supported in this browser environment.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setCameraError(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Camera permission was denied. You can still upload a photo memory directly from your device!'
          : 'Unable to access live camera stream. You can upload an image file from your device.'
      );
    } finally {
      setIsInitializing(false);
    }
  };

  const handleFlipCamera = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleCapture = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Flip if user-facing mirror
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    stopCamera();
    setCapturedImage(dataUrl);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        stopCamera();
        setCapturedImage(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setCaption('');
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onPhotoCaptured(capturedImage, caption.trim() || undefined);
      stopCamera();
      onClose();
    }
  };

  const handleClose = () => {
    stopCamera();
    setCapturedImage(null);
    setCaption('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#FAF8F5] border border-[#E7DFD4] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#E7DFD4] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FAF0ED] text-[#B95B3D] flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg text-[#211C15]">
                {capturedImage ? 'Review Memory Photo' : 'Capture Visual Reflection'}
              </h3>
              <p className="text-[11px] text-[#7E6D56]">
                Attach a snapshot of your sanctuary, open Bible, or daily grace.
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-full text-[#A8957C] hover:text-[#211C15] hover:bg-[#F0EBE1] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport Content */}
        <div className="p-4 sm:p-6 space-y-4">
          {!capturedImage ? (
            <div className="space-y-3">
              {/* Camera Viewfinder */}
              <div className="relative w-full aspect-4/3 bg-black rounded-2xl overflow-hidden border border-[#D2C4B1] flex items-center justify-center">
                {cameraError ? (
                  <div className="p-6 text-center space-y-3 text-white max-w-xs">
                    <AlertCircle className="w-10 h-10 text-[#E8A598] mx-auto" />
                    <p className="text-xs text-stone-200">{cameraError}</p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-[#B95B3D] hover:bg-[#A0482B] text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors inline-flex items-center gap-1.5 shadow-md"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload from Device</span>
                    </button>
                  </div>
                ) : isInitializing ? (
                  <div className="text-center text-white/80 space-y-2">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#B95B3D]" />
                    <p className="text-xs">Accessing camera...</p>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className={`w-full h-full object-cover ${facingMode === 'user' ? '-scale-x-100' : ''}`}
                    />

                    {/* Camera Control Overlay */}
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleFlipCamera}
                        className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors backdrop-blur-xs cursor-pointer"
                        title="Flip Camera"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-4">
                      {/* Shutter Button */}
                      <button
                        type="button"
                        onClick={handleCapture}
                        className="w-14 h-14 rounded-full border-4 border-white bg-[#B95B3D] hover:bg-[#A0482B] transition-transform active:scale-95 flex items-center justify-center text-white shadow-lg cursor-pointer"
                        title="Snap Photo"
                      >
                        <Camera className="w-6 h-6" />
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Upload alternative */}
              <div className="flex items-center justify-between text-xs text-[#7E6D56] pt-1">
                <span>Or select an existing photo:</span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 font-semibold text-[#B95B3D] hover:underline cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose file from device</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>
          ) : (
            /* Review Captured Photo */
            <div className="space-y-3">
              <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden border border-[#D2C4B1] bg-stone-900 shadow-inner">
                <img
                  src={capturedImage}
                  alt="Captured memory"
                  className="w-full h-full object-contain"
                />
                <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#E8C288]" />
                  Growth Memory Preview
                </span>
              </div>

              {/* Optional Caption Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#594D3C] block">
                  Memory Note / Caption (Optional)
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g. Morning quiet time with chamomile tea; prayer walk in the garden..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D2C4B1] bg-white text-xs text-[#211C15] placeholder-[#A8957C] focus:outline-none focus:border-[#B95B3D]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-[#E7DFD4] flex items-center justify-between">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-xs font-medium text-[#7E6D56] hover:text-[#211C15] cursor-pointer"
          >
            Cancel
          </button>

          {capturedImage && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRetake}
                className="px-3.5 py-2 text-xs font-semibold text-[#594D3C] bg-[#F0EBE1] hover:bg-[#E7DFD4] rounded-xl cursor-pointer transition-colors"
              >
                Retake
              </button>

              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirm}
                icon={<Check className="w-3.5 h-3.5" />}
              >
                Attach to Reflection
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
