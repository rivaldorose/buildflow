import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/api/supabaseClient';

export default function VoiceNoteInput({
  value,
  onChange,
  onSave,
  placeholder = 'Type or speak to add notes...',
  language = 'nl',
}) {
  // States
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [interimText, setInterimText] = useState('');
  
  // Refs
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  // Initialize browser speech recognition (for preview)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Check for browser support
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language === 'nl' ? 'nl-NL' : 'en-US';

    recognition.onresult = (event) => {
      let interim = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (!event.results[i].isFinal) {
          interim += transcript;
        }
      }

      setInterimText(interim);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        // User stopped speaking, but we'll wait for manual stop
      } else if (event.error === 'audio-capture') {
        toast.error('Microphone not found');
      } else if (event.error === 'not-allowed') {
        toast.error('Microphone permission denied');
      }
    };

    recognition.onend = () => {
      // Auto-restart if still listening
      if (isListening && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          // Already started or error
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, isListening]);

  // Start listening
  const startListening = async () => {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        }
      });

      streamRef.current = stream;

      // Start browser speech recognition (for preview)
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          // Already started
        }
      }

      // Start recording audio (for Whisper)
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });
      
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }

        // Stop preview recognition
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }

        // Send to Whisper if we have audio chunks
        if (audioChunksRef.current.length > 0) {
          await transcribeWithWhisper();
        }
      };

      mediaRecorder.start(1000); // Collect data every second
      mediaRecorderRef.current = mediaRecorder;

      setIsListening(true);
      setInterimText('');
      toast.success('🎤 Listening... Start speaking!');

    } catch (error) {
      console.error('Microphone error:', error);
      if (error.name === 'NotAllowedError') {
        toast.error('Microphone permission denied. Please allow access in browser settings.');
      } else if (error.name === 'NotFoundError') {
        toast.error('No microphone found. Please connect a microphone.');
      } else {
        toast.error('Could not access microphone');
      }
    }
  };

  // Stop listening
  const stopListening = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    setIsListening(false);
    setInterimText('');
  };

  // Transcribe with Whisper API
  const transcribeWithWhisper = async () => {
    setIsProcessing(true);

    try {
      // Create audio blob
      const audioBlob = new Blob(audioChunksRef.current, { 
        type: 'audio/webm' 
      });

      // Check if blob is empty
      if (audioBlob.size === 0) {
        toast.error('No audio recorded');
        setIsProcessing(false);
        return;
      }

      // Convert blob to base64 for Supabase Edge Function
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      const base64Audio = await new Promise((resolve, reject) => {
        reader.onloadend = () => {
          const base64String = reader.result.split(',')[1]; // Remove data:audio/webm;base64, prefix
          resolve(base64String);
        };
        reader.onerror = reject;
      });

      // Call Whisper API via Supabase Edge Function
      try {
        const { data, error } = await supabase.functions.invoke('transcribe-audio', {
          body: {
            audio: base64Audio,
            audioType: 'audio/webm',
            language: language,
          },
        });

        if (error) {
          throw error;
        }

        // Update text with accurate transcription
        const newText = value + (value ? ' ' : '') + data.text;
        onChange(newText);
        
        toast.success('✅ Transcription complete!');
      } catch (supabaseError) {
        // Fallback: Use interim text if Whisper fails
        console.warn('Supabase Edge Function not available, using browser transcription:', supabaseError);
        
        if (interimText) {
          onChange(value + (value ? ' ' : '') + interimText);
          toast.info('Using browser transcription (Whisper API not configured)');
        } else {
          throw new Error('Transcription failed. Please check your Supabase Edge Function configuration.');
        }
      }
    } catch (error) {
      console.error('Whisper error:', error);
      toast.error('Transcription failed: ' + (error.message || 'Unknown error'));
      
      // Final fallback: use interim text if available
      if (interimText) {
        onChange(value + (value ? ' ' : '') + interimText);
        toast.info('Using browser transcription as fallback');
      }
    } finally {
      setIsProcessing(false);
      audioChunksRef.current = [];
      setInterimText('');
    }
  };

  // Toggle listening
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Keyboard shortcut (Cmd/Ctrl + Shift + V)
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'v') {
        e.preventDefault();
        toggleListening();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  return (
    <div className="space-y-3">
      {/* Listening Indicator */}
      {isListening && (
        <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="relative">
            {/* Pulse animation */}
            <div className="absolute inset-0 animate-ping opacity-75">
              <div className="h-3 w-3 rounded-full bg-red-400" />
            </div>
            <div className="h-3 w-3 rounded-full bg-red-500" />
          </div>
          
          <div className="flex-1">
            <p className="text-sm font-medium text-red-700">
              Recording...
            </p>
            <p className="text-xs text-red-600">
              Press Cmd+Shift+V or click button to stop
            </p>
          </div>

          <Button
            onClick={stopListening}
            size="sm"
            variant="destructive"
          >
            <MicOff className="h-4 w-4 mr-2" />
            Stop
          </Button>
        </div>
      )}

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          <p className="text-sm text-blue-700">
            Processing with Whisper AI...
          </p>
        </div>
      )}

      {/* Textarea with interim text */}
      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[200px] resize-none pr-12"
          disabled={isListening || isProcessing}
        />

        {/* Voice Button (floating inside textarea) */}
        <Button
          onClick={toggleListening}
          size="icon"
          variant={isListening ? 'destructive' : 'outline'}
          disabled={isProcessing}
          className={`
            absolute bottom-3 right-3
            ${isListening ? 'animate-pulse' : ''}
          `}
          type="button"
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isListening ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </Button>

        {/* Interim text overlay (real-time preview) */}
        {isListening && interimText && (
          <div className="absolute inset-0 pointer-events-none p-3">
            <div className="h-full overflow-auto">
              {/* Existing text (hidden) */}
              <span className="opacity-0">{value}</span>
              
              {/* Interim text (visible, gray, italic) */}
              <span className="text-gray-400 italic">
                {value ? ' ' : ''}{interimText}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Info footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {value.split(' ').filter(Boolean).length} words
        </span>
        
        <span>
          Press <kbd className="px-1.5 py-0.5 bg-gray-100 border rounded">
            Cmd+Shift+V
          </kbd> to start voice input
        </span>
      </div>

      {/* Save button (if provided) */}
      {onSave && (
        <Button 
          onClick={onSave}
          className="w-full"
          disabled={!value.trim()}
        >
          <Check className="h-4 w-4 mr-2" />
          Save Note
        </Button>
      )}
    </div>
  );
}

