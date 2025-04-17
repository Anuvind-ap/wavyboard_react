import React, { useEffect, useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from 'react-icons/fa';
import AudioPlayer from 'react-h5-audio-player';
import './Player.css';

const defaultSong = {
  id: 'default',
  title: 'Welcome to Wavyboard',
  artist: 'Wavyboard Team',
  cover_image: '/default-album-art.jpg',
  signedUrl: 'https://example.com/default-audio.mp3' // Replace with your default audio URL
};

const Player = () => {
  const { 
    currentSong,
    isPlaying,
    playerRef,
    setIsPlaying,
    togglePlayPause,
    seekTo
  } = usePlayer();

  const [displaySong, setDisplaySong] = useState(defaultSong);

  useEffect(() => {
    if (currentSong) {
      setDisplaySong(currentSong);
    } else {
      setDisplaySong(defaultSong);
    }
  }, [currentSong]);

  const handlePlayPause = () => {
    if (!currentSong) {
      // If no song is selected, use the default song
      setDisplaySong(defaultSong);
    }
    togglePlayPause();
  };

  // Debug logging
  useEffect(() => {
    if (currentSong) {
      console.log('Current song:', {
        ...currentSong,
        signedUrl: currentSong.signedUrl,
        token: currentSong.token
      });
    }
  }, [currentSong]);

  if (!displaySong) return null;

  // Ensure we have a valid URL with token
  const audioUrl = displaySong.signedUrl;
  if (!audioUrl) return null;

  return (
    <div className="vertical-player">
      <div className="player-content">
        <div className="song-artwork">
          <img 
            src={displaySong.cover_image || '/default-album-art.jpg'} 
            alt={displaySong.title}
          />
        </div>

        <div className="song-info">
          <h3>{displaySong.title}</h3>
          <p>{displaySong.artist}</p>
        </div>

        <div className="player-controls">
          <div className="control-buttons">
            <button className="control-btn">
              <FaStepBackward />
            </button>
            <button 
              className="control-btn play-pause"
              onClick={handlePlayPause}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button className="control-btn">
              <FaStepForward />
            </button>
          </div>

          <AudioPlayer
            ref={playerRef}
            src={audioUrl}
            showJumpControls={false}
            customControlsSection={[]}
            customProgressBarSection={['CURRENT_TIME', 'PROGRESS_BAR', 'DURATION']}
            className="custom-audio-player"
            layout="horizontal"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onClickPrevious={null}
            onClickNext={null}
            onListen={null}
            onSeeked={(e) => {
              const audio = e.target;
              // Only update if the difference is significant
              if (Math.abs(audio.currentTime - playerRef.current?.audio?.current?.currentTime) > 1) {
                seekTo(audio.currentTime);
              }
            }}
            onLoadedMetadata={(e) => {
              console.log('Audio metadata loaded');
              // Ensure audio is ready to play
              if (playerRef.current?.audio?.current) {
                playerRef.current.audio.current.play()
                  .then(() => {
                    if (!isPlaying) {
                      playerRef.current.audio.current.pause();
                    }
                  })
                  .catch(error => console.error('Playback error:', error));
              }
            }}
            onError={(e) => {
              console.error('Audio Player Error:', e);
              console.log('Failed URL:', audioUrl);
              setIsPlaying(false);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Player; 