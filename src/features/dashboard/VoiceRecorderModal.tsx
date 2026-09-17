import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Check, X, Volume2, Sparkles, AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '../../components/common/Button';

interface VoiceRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTranscript: (text: string, targetField: 'gratitude' | 'challenge' | 'takeaway') => void;
  defaultTargetField?: 'gratitude' | 'challenge' | 'takeaway';
}

export const VoiceRecorderModal: React.FC<VoiceRecorderModalProps> = ({
  isOpen,
  onClose,
  onApplyTranscript,
  defaultTargetField = 'gratitude'
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [targetField, setTargetField] = useState<'gratitude' | 'challenge' | 'takeaway'>(defaultTargetField);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    setTargetField(defaultTargetField);
  }, [defaultTargetField]);

  // Check speech recognition support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setSpeechSupported(false);
      }
    }
  }, []);

  // Cleanup on unmount or close
  useEffect(() => {
    if (!isOpen) {
      stopRecording();
      setTranscript('');
      setRecordingSeconds(0);
      setErrorMessage(null);
    }
  }, [isOpen]);

  const startRecording = () => {
    setErrorMessage(null);
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      setIsRecording(true);
      // Run fallback simulated dictation for demonstration if browser doesn't have API
      startFallbackTimer();
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
        setRecordingSeconds(0);
        timerRef.current = setInterval(() => {
          setRecordingSeconds(prev => prev + 1);
        }, 1000);
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const currentText = finalTranscript || interimTranscript;
        if (currentText) {
          setTranscript(prev => {
            if (!prev) return currentText;
            // Append cleanly if new final clause
            return `${prev} ${currentText}`.replace(/\s+/g, ' ').trim();
          });
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMessage('Microphone access was denied. Please allow microphone permissions to speak.');
        } else if (event.error === 'no-speech') {
          // ignore transient silence
        } else {
          setErrorMessage(`Speech recognition error (${event.error}).`);
        }
        stopRecording();
      };

      recognition.onend = () => {
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      setErrorMessage('Could not initialize microphone. Please check your browser audio settings.');
      setIsRecording(false);
    }
  };

  const startFallbackTimer = () => {
    setRecordingSeconds(0);
    timerRef.current = setInterval(() => {
      setRecordingSeconds(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
  };

  const handleToggleRecord = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleApply = () => {
    stopRecording();
    if (transcript.trim()) {
      onApplyTranscript(transcript.trim(), targetField);
      onClose();
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#FAF8F5] border border-[#E7DFD4] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#E7DFD4] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
              isRecording ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-[#FAF0ED] text-[#B95B3D]'
            }`}>
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg text-[#211C15]">Voice-to-Text Reflection</h3>
              <p className="text-[11px] text-[#7E6D56]">
                Speak your heart freely during busy moments; words are transcribed directly.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopRecording();
              onClose();
            }}
            className="p-1.5 rounded-full text-[#A8957C] hover:text-[#211C15] hover:bg-[#F0EBE1] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          {/* Target Section Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#594D3C] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#B95B3D]" />
              Insert Spoken Words Into:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTargetField('gratitude')}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                  targetField === 'gratitude'
                    ? 'bg-[#B95B3D] text-white border-[#B95B3D] shadow-2xs'
                    : 'bg-white text-[#594D3C] border-[#D2C4B1] hover:border-[#B95B3D]'
                }`}
              >
                Gratitude Note
              </button>

              <button
                type="button"
                onClick={() => setTargetField('challenge')}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                  targetField === 'challenge'
                    ? 'bg-[#5D7052] text-white border-[#5D7052] shadow-2xs'
                    : 'bg-white text-[#594D3C] border-[#D2C4B1] hover:border-[#5D7052]'
                }`}
              >
                Challenge Edge
              </button>

              <button
                type="button"
                onClick={() => setTargetField('takeaway')}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                  targetField === 'takeaway'
                    ? 'bg-[#C49746] text-white border-[#C49746] shadow-2xs'
                    : 'bg-white text-[#594D3C] border-[#D2C4B1] hover:border-[#C49746]'
                }`}
              >
                Prayer / Anchor
              </button>
            </div>
          </div>

          {/* Recording Status & Microphone Circle */}
          <div className="flex flex-col items-center justify-center p-5 bg-white rounded-2xl border border-[#E7DFD4] space-y-3 text-center">
            <div className="relative">
              {isRecording && (
                <div className="absolute -inset-2.5 rounded-full bg-[#B95B3D]/20 animate-ping" />
              )}
              <button
                type="button"
                onClick={handleToggleRecord}
                className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-md cursor-pointer ${
                  isRecording
                    ? 'bg-red-500 hover:bg-red-600 text-white scale-105'
                    : 'bg-[#B95B3D] hover:bg-[#A0482B] text-white hover:scale-105'
                }`}
              >
                {isRecording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
              </button>
            </div>

            <div className="space-y-0.5">
              <span className={`text-xs font-bold tracking-wider uppercase ${isRecording ? 'text-red-600' : 'text-[#594D3C]'}`}>
                {isRecording ? `Listening... (${formatTime(recordingSeconds)})` : 'Click Microphone to Start Speaking'}
              </span>
              <p className="text-[11px] text-[#7E6D56]">
                {isRecording
                  ? 'Speak naturally at your own pace. Click again when finished.'
                  : 'Great for when your hands are busy caring for children or preparing meals.'}
              </p>
            </div>

            {/* Simulated Animated Waveform while recording */}
            {isRecording && (
              <div className="flex items-center gap-1 h-5 pt-1">
                {[12, 20, 16, 24, 14, 22, 10, 18, 26, 12, 20].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 bg-[#B95B3D] rounded-full animate-pulse"
                    style={{
                      height: `${h}px`,
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: '0.8s'
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Error notice if any */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Transcript Preview Area */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#594D3C] flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-[#5D7052]" />
                Spoken Words Transcript:
              </label>
              {transcript && (
                <button
                  type="button"
                  onClick={() => setTranscript('')}
                  className="text-[11px] text-[#A8957C] hover:text-[#B95B3D] flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Clear
                </button>
              )}
            </div>

            <textarea
              rows={4}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Your transcribed words will appear here in real-time as you speak..."
              className="w-full p-3.5 rounded-xl border border-[#D2C4B1] bg-white text-sm text-[#211C15] placeholder-[#A8957C] focus:outline-none focus:border-[#B95B3D] leading-relaxed resize-y"
            />
          </div>

          {/* Sample sentence presets if browser doesn't have mic or user wants a starter */}
          {!isRecording && !transcript && (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#A8957C] tracking-wider">
                Quick voice prompts to speak:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  '“Lord, I am thankful for unhurried peace today...”',
                  '“I felt overwhelmed this afternoon and need Your grace...”',
                  '“Teach me to release control and trust Your plan tonight...”'
                ].map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTranscript(sample.replace(/^“|”$/g, ''))}
                    className="text-[11px] px-2.5 py-1 bg-white hover:bg-[#FAF0ED] text-[#594D3C] hover:text-[#B95B3D] rounded-lg border border-[#E7DFD4] transition-colors cursor-pointer text-left"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#E7DFD4] flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              stopRecording();
              onClose();
            }}
            className="px-4 py-2 text-xs font-medium text-[#7E6D56] hover:text-[#211C15] cursor-pointer"
          >
            Cancel
          </button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleApply}
            disabled={!transcript.trim()}
            icon={<Check className="w-3.5 h-3.5" />}
          >
            Insert into {targetField === 'gratitude' ? 'Gratitude' : targetField === 'challenge' ? 'Challenge' : 'Takeaway'}
          </Button>
        </div>
      </div>
    </div>
  );
};
