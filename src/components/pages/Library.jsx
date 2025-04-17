import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AudioCard from '../shared/AudioCard';
import './Library.css';

const Library = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [songs, setSongs] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user's groups
  useEffect(() => {
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
      } catch (err) {
        console.error('Error fetching groups:', err);
        setError('Failed to load your groups');
      }
    };

    fetchGroups();
  }, []);

  // Fetch songs for selected group
  useEffect(() => {
    const fetchSongs = async () => {
      if (!selectedGroup) return;

      try {
        const { data, error } = await supabase
          .from('favorite_songs')
          .select(`
            song_id,
            songs: songs (
              id,
              title,
              artist,
              genre,
              duration,
              artwork_url,
              audio_url
            )
          `)
          .eq('group_id', selectedGroup.id);

        if (error) throw error;

        const formattedSongs = data.map(item => item.songs);
        setSongs(formattedSongs);
      } catch (err) {
        console.error('Error fetching songs:', err);
        setError('Failed to load songs for this group');
      }
    };

    fetchSongs();
  }, [selectedGroup]);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('favorite_groups')
        .insert([
          {
            name: newGroupName.trim(),
            user_id: user.id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setGroups(prev => [data, ...prev]);
      setNewGroupName('');
    } catch (err) {
      console.error('Error creating group:', err);
      setError('Failed to create group');
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (!confirm('Are you sure you want to delete this group?')) return;

    try {
      const { error } = await supabase
        .from('favorite_groups')
        .delete()
        .eq('id', groupId);

      if (error) throw error;

      setGroups(prev => prev.filter(group => group.id !== groupId));
      if (selectedGroup?.id === groupId) {
        setSelectedGroup(null);
        setSongs([]);
      }
    } catch (err) {
      console.error('Error deleting group:', err);
      setError('Failed to delete group');
    }
  };

  const handleAddToGroup = async (song) => {
    if (!selectedGroup) {
      alert('Please select a group first');
      return;
    }

    try {
      const { error } = await supabase
        .from('favorite_songs')
        .insert([
          {
            group_id: selectedGroup.id,
            song_id: song.id
          }
        ]);

      if (error) throw error;

      setSongs(prev => [...prev, song]);
    } catch (err) {
      console.error('Error adding song to group:', err);
      setError('Failed to add song to group');
    }
  };

  const handleRemoveFromGroup = async (songId) => {
    try {
      const { error } = await supabase
        .from('favorite_songs')
        .delete()
        .eq('group_id', selectedGroup.id)
        .eq('song_id', songId);

      if (error) throw error;

      setSongs(prev => prev.filter(song => song.id !== songId));
    } catch (err) {
      console.error('Error removing song from group:', err);
      setError('Failed to remove song from group');
    }
  };

  return (
    <div className="library-page">
      <div className="library-container">
        <h1>My Library</h1>
        
        <div className="library-content">
          <div className="groups-section">
            <form onSubmit={handleCreateGroup} className="create-group-form">
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="New group name"
                className="group-input"
              />
              <button type="submit" className="create-group-button">
                Create Group
              </button>
            </form>

            <div className="groups-list">
              {groups.map(group => (
                <div
                  key={group.id}
                  className={`group-item ${selectedGroup?.id === group.id ? 'active' : ''}`}
                  onClick={() => setSelectedGroup(group)}
                >
                  <span className="group-name">{group.name}</span>
                  <button
                    className="delete-group-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteGroup(group.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="songs-section">
            {selectedGroup ? (
              <>
                <h2>{selectedGroup.name}</h2>
                <div className="songs-grid">
                  {songs.map(song => (
                    <div key={song.id} className="song-card">
                      <AudioCard song={song} />
                      <button
                        className="remove-song-button"
                        onClick={() => handleRemoveFromGroup(song.id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="no-group-selected">
                Select a group to view its songs
              </div>
            )}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default Library; 