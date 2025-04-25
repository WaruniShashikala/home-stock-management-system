import { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

export const useVoiceControl = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const commands = [
        {
            command: 'go to dashboard',
            callback: () => navigate('/dashboard')
        },
        {
            command: 'go back',
            callback: () => navigate('/dashboard')
        },
        {
            command: 'open waste management',
            callback: () => navigate('/waste-management')
        },
        {
            command: 'open items management',
            callback: () => navigate('/list-management')
        },
        {
            command: 'open inventory',
            callback: () => navigate('/inventory-management')
        },
        {
            command: 'open budget',
            callback: () => navigate('/budget-management')
        },
        {
            command: 'open user management',
            callback: () => navigate('/user-management')
        },
        {
            command: 'open category management',
            callback: () => navigate('/category-management')
        },
        {
            command: 'go home',
            callback: () => navigate('/')
        },
        {
            command: 'logout',
            callback: () => {
                localStorage.removeItem('auth');
                navigate('/login');
                window.location.reload();
            }
        },
        {
            command: 'go to login',
            callback: () => navigate('/login')
        },
        {
            command: 'go to sign up',
            callback: () => navigate('/signup')
        },
        {
            command: 'clear',
            callback: ({ resetTranscript }) => resetTranscript()
        }
    ];

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition({ commands });

    const toggleListening = () => {
        if (listening) {
            SpeechRecognition.stopListening();
        } else {
            SpeechRecognition.startListening({ continuous: true });
        }
    };

    return {
        transcript,
        listening,
        toggleListening,
        resetTranscript,
        browserSupportsSpeechRecognition: browserSupportsSpeechRecognition
    };
};