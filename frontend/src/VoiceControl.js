import React from 'react';
import { useVoiceControl } from './hooks/useVoiceControl';
import { toast } from 'react-toastify';
import { Mic, MicOff } from 'react-feather'; // or any other icon library

const VoiceControl = () => {
  const {
    transcript,
    listening,
    toggleListening,
    browserSupportsSpeechRecognition
  } = useVoiceControl();

  if (!browserSupportsSpeechRecognition) {
    return null; // or render a message that voice control isn't supported
  }

  return (
    <div className="voice-control">
      <button
        onClick={() => {
          toggleListening();
          toast.info(listening ? 'Microphone off' : 'Microphone on - Say commands like "go to dashboard"');
        }}
        className={`voice-button ${listening ? 'listening' : ''}`}
      >
        {listening ? <MicOff size={20} /> : <Mic size={20} />}
      </button>
      {/* <div className="transcript">{transcript}</div> */}
    </div>
  );
};

export default VoiceControl;