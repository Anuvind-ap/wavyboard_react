import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { supabase } from '../../lib/supabase';
import AddToLibraryModal from './AddToLibraryModal';
import './AudioCard.css';

const AudioCard = ({ song, showAddToLibrary = true }) => {
  const { playSong } = usePlayer();
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePlay = () => {
    playSong(song);
  };

  const handleAddToLibrary = async (groupId) => {
    try {
      const { error } = await supabase
        .from('favorite_songs')
        .insert([
          {
            group_id: groupId,
            song_id: song.id
          }
        ]);

      if (error) throw error;
    } catch (err) {
      console.error('Error adding song to library:', err);
      throw err;
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!song) return null;

  return (
    <>
      <div
        className="audio-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="audio-card-image" onClick={handlePlay}>
          <img src={ '/default-album-art.jpg'} alt={song.title} />
          {isHovered && (
            <div className="play-overlay">
              <button className="play-button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </button>
            </div>
          )}
        </div>
        <div className="audio-card-info">
          <h3 className="audio-card-title">{song.title}</h3>
          <p className="audio-card-artist">{song.artist}</p>
          {song.genre && <p className="audio-card-genre">{song.genre}</p>}
          <span className="duration">{formatDuration(song.duration)}</span>
        </div>
        {showAddToLibrary && (
          <button 
            className="add-to-library-button" 
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        )}
      </div>

      <AddToLibraryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        song={song}
        onAddToGroup={handleAddToLibrary}
      />
    </>
  );
};

export default AudioCard; 