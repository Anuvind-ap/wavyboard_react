import React, { useState } from 'react';
import { config } from '../../config/env';
import './TextToSpeech.css';

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [language, setLanguage] = useState('en-us');
  const [error, setError] = useState('');

  const languages = [
    { code: 'en-us', name: 'English (US)' },
    { code: 'en-gb', name: 'English (UK)' },
    { code: 'fr-fr', name: 'French' },
    { code: 'de-de', name: 'German' },
    { code: 'es-es', name: 'Spanish' },
    { code: 'it-it', name: 'Italian' },
    { code: 'ja-jp', name: 'Japanese' },
    { code: 'ko-kr', name: 'Korean' },
    { code: 'zh-cn', name: 'Chinese' },
    { code: 'ru-ru', name: 'Russian' }
  ];

  const generateSpeech = () => {
    if (!text.trim()) return;
    
    try {
      if (!config.voiceRssApiKey) {
        throw new Error('VoiceRSS API key is not configured');
      }

      const url = `https://api.voicerss.org/?key=${config.voiceRssApiKey}&hl=${language}&src=${encodeURIComponent(text)}&c=MP3`;
      setAudioUrl(url);
      setIsPlaying(true);
      setError('');
    } catch (err) {
      console.error('Error generating speech:', err);
      setError('Failed to generate speech. Please try again later.');
      setIsPlaying(false);
    }
  };

  const handlePlay = () => {
    if (!audioUrl) {
      generateSpeech();
    } else {
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    setAudioUrl(''); // Reset audio when text changes
    setError(''); // Clear any previous errors
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    setAudioUrl(''); // Reset audio when language changes
    setError(''); // Clear any previous errors
  };

  return (
    <div className="text-to-speech-container">
      <h2>Text to Speech</h2>
      
      <div className="input-group">
        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder="Enter text to convert to speech..."
          rows="4"
          className="text-input"
        />
      </div>

      <div className="controls">
        <select 
          value={language}
          onChange={handleLanguageChange}
          className="language-select"
        >
          {languages.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>

        <button 
          className="speech-button"
          onClick={isPlaying ? handlePause : handlePlay}
          disabled={!text.trim()}
          title={isPlaying ? "Pause Speech" : "Play Speech"}
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 5v14l8-7z" />
              <path d="M14 5v14l8-7z" />
            </svg>
          )}
          <span>{isPlaying ? "Pause" : "Speak"}</span>
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {audioUrl && (
        <audio
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={(e) => {
            console.error('Audio playback error:', e);
            setError('Failed to play audio. Please try again.');
            setIsPlaying(false);
          }}
          autoPlay={isPlaying}
        />
      )}
    </div>
  );
};

export default TextToSpeech; 