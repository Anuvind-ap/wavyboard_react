import React, { useState, useEffect } from 'react';
import AudioCard from '../shared/AudioCard';
import { supabase } from '../../lib/supabase';
import './AudioLibrary.css';

const AudioLibrary = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('songs')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Get the public URL for each song's file
        const songsWithUrls = await Promise.all(
          data.map(async (song) => {
            const { data: { publicUrl } } = supabase
              .storage
              .from('songs')
              .getPublicUrl(song.file_path);

            return {
              ...song,
              audioUrl: publicUrl,
              coverImage: '/default-album-art.png' // Add a default cover image
            };
          })
        );

        setSongs(songsWithUrls);
      } catch (err) {
        console.error('Error fetching songs:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  if (loading) {
    return (
      <div className="audio-library">
        <h2>Audio Library</h2>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading songs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="audio-library">
        <h2>Audio Library</h2>
        <div className="error-container">
          <p>Error loading songs: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="audio-library">
      <h2>Audio Library</h2>
      <div className="library-container">
        {songs.length > 0 ? (
          songs.map((song) => (
            <AudioCard
              key={song.id}
              song={song}
            />
          ))
        ) : (
          <div className="empty-library">
            <p>No songs available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioLibrary; 