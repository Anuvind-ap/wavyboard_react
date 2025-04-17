import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AudioCard from '../shared/AudioCard';
import './YourLib.css';

const YourLib = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchSongsForGroup(selectedGroup.id);
    }
  }, [selectedGroup]);

  const fetchGroups = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('favorite_groups')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setGroups(data || []);
      // Automatically select Favorites group if it exists
      const favoritesGroup = data?.find(group => group.name === 'Favorites');
      if (favoritesGroup) {
        setSelectedGroup(favoritesGroup);
      } else if (data && data.length > 0) {
        setSelectedGroup(data[0]);
      }
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError('Failed to load your library groups');
    } finally {
      setLoading(false);
    }
  };

  const fetchSongsForGroup = async (groupId) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('favorite_songs')
        .select(`
          song_id,
          songs:song_id (*)
        `)
        .eq('group_id', groupId);

      if (error) throw error;

      const songsData = data.map(item => item.songs);
      setSongs(songsData);
    } catch (err) {
      console.error('Error fetching songs:', err);
      setError('Failed to load songs');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="your-lib">
      <h1>Your Library</h1>
      
      <div className="library-content">
        <div className="groups-sidebar">
          <h2>Groups</h2>
          <div className="groups-list">
            {groups.map(group => (
              <button
                key={group.id}
                className={`group-button ${selectedGroup?.id === group.id ? 'active' : ''}`}
                onClick={() => setSelectedGroup(group)}
              >
                {group.name}
              </button>
            ))}
          </div>
        </div>

        <div className="songs-container">
          {selectedGroup && (
            <h2>{selectedGroup.name}</h2>
          )}
          
          {loading ? (
            <div className="loading">Loading...</div>
          ) : songs.length > 0 ? (
            <div className="songs-grid">
              {songs.map(song => (
                <AudioCard
                  key={song.id}
                  song={song}
                  showAddToLibrary={false}
                />
              ))}
            </div>
          ) : (
            <div className="no-songs">
              No songs in this group yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YourLib; 