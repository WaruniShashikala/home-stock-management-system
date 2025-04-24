// VoiceNavigator.js
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

const VoiceNavigator = ({ isListening }) => {
  const navigate = useNavigate();
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      message.error('Speech Recognition is not supported in this browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      message.info('Listening for navigation commands...');
    };

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase().trim();
      message.success(`Heard: "${command}"`);

      const routeMap = {
        'go to dashboard': '/dashboard',
        'open waste management': '/waste-management',
        'show inventory': '/inventory-management',
        'view budget': '/budget-management',
        'manage users': '/user-management',
        'category settings': '/category-management',
        'go home': '/',
        'back': -1,
        'logout': '/login',
      };

      if (routeMap[command] !== undefined) {
        if (routeMap[command] === -1) {
          navigate(-1);
        } else {
          navigate(routeMap[command]);
        }
      } else {
        message.warning(`Unknown command: "${command}"`);
      }
    };

    recognition.onerror = (event) => {
      message.error(`Voice error: ${event.error}`);
    };

    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => recognition.stop();
  }, [isListening, navigate]);

  return null;
};

export default VoiceNavigator;
