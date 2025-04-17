import React, { useState } from 'react';
import { config } from '../../config/env';
import './TextToSpeech.css';

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTextChange = (e) => {
    setText(e.target.value);
    setError('');
    setAudioUrl('');
  };

  const handleConvertToSpeech = () => {
    if (!text.trim()) {
      setError('Please enter some text first');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (!config.voiceRssApiKey) {
        throw new Error('VoiceRSS API key is not configured');
      }

      const url = `https://api.voicerss.org/?key=${config.voiceRssApiKey}&hl=en-us&src=${encodeURIComponent(text)}&c=MP3`;
      setAudioUrl(url);
    } catch (err) {
      console.error('Error generating speech:', err);
      setError('Failed to convert text to speech. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-speech">
      <h2>Get Audio version of any Book of Your Choice</h2>
      
      <div className="text-input-container">
        <textarea
          id="text-input"
          placeholder="Enter the text of the book"
          value={text}
          onChange={handleTextChange}
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="controls">
        <button 
          id="convert-btn" 
          onClick={handleConvertToSpeech}
          disabled={isLoading || !text.trim()}
        >
          {isLoading ? 'Converting...' : 'Convert to Speech'}
        </button>
      </div>

      {audioUrl && (
        <div className="audio-player-container">
          <audio 
            controls 
            src={audioUrl}
            className="audio-player"
            onError={() => {
              setError('Failed to load audio. Please try again.');
              setAudioUrl('');
            }}
          >
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default TextToSpeech; 