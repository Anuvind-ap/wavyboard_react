import React, { createContext, useContext, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef(null);

  const getSignedUrl = async (filePath) => {
    try {
      if (!filePath) {
        console.error('No file path provided');
        return null;
      }

      console.log('Requesting signed URL for:', {
        bucket: 'songs',
        filePath,
        userRole: (await supabase.auth.getUser()).data.user ? 'authenticated' : 'anon'
      });
      
      const { data, error } = await supabase
        .storage
        .from('songs')
        .createSignedUrl(filePath, 3600);

      if (error) {
        console.error('Error getting signed URL:', error);
        return null;
      }

      const signedUrl = data.signedUrl;
      const urlObj = new URL(signedUrl);
      const token = urlObj.searchParams.get('token');

      return { signedUrl, token };
    } catch (error) {
      console.error('Unexpected error in getSignedUrl:', error);
      return null;
    }
  };

  const playSong = async (song) => {
    try {
      if (!song?.file_path) {
        console.error('Invalid song data:', song);
        return;
      }

      // If it's the same song, just toggle play/pause
      if (currentSong?.id === song.id) {
        togglePlayPause();
        return;
      }

      // It's a new song, get the signed URL
      const urlData = await getSignedUrl(song.file_path);
      if (!urlData) {
        console.error('Could not get signed URL for song:', song.title);
        return;
      }

      // Update the current song
      setCurrentSong({ 
        ...song, 
        signedUrl: urlData.signedUrl,
        token: urlData.token 
      });
    } catch (error) {
      console.error('Error in playSong:', error);
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (!playerRef.current?.audio?.current) return;

    if (isPlaying) {
      playerRef.current.audio.current.pause();
    } else {
      playerRef.current.audio.current.play();
    }
  };

  const seekTo = (time) => {
    if (!playerRef.current?.audio?.current) return;
    
    try {
      const audio = playerRef.current.audio.current;
      const wasPlaying = !audio.paused;
      
      // Pause before seeking to prevent glitches
      audio.pause();
      
      // Set the new time
      audio.currentTime = time;
      
      // Resume playback if it was playing before
      if (wasPlaying) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Playback successfully resumed
              setIsPlaying(true);
            })
            .catch(error => {
              console.error('Error resuming playback after seek:', error);
              setIsPlaying(false);
            });
        }
      }
    } catch (error) {
      console.error('Error during seek:', error);
      setIsPlaying(false);
    }
  };

  const value = {
    currentSong,
    isPlaying,
    setIsPlaying,
    playSong,
    playerRef,
    togglePlayPause,
    seekTo
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}; 