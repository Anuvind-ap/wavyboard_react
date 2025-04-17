import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import './AddToLibraryModal.css';

const AddToLibraryModal = ({ isOpen, onClose, song, onAddToGroup }) => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // First, ensure the "Favorites" group exists
        const { data: favGroup, error: favError } = await supabase
          .from('favorite_groups')
          .select('*')
          .eq('user_id', user.id)
          .eq('name', 'Favorites')
          .single();

        if (!favGroup && !favError) {
          // Create Favorites group if it doesn't exist
          const { data: newFavGroup, error: createError } = await supabase
            .from('favorite_groups')
            .insert([
              {
                name: 'Favorites',
                user_id: user.id
              }
            ])
            .select()
            .single();

          if (!createError) {
            setGroups([newFavGroup]);
          }
        }

        // Fetch all groups
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

    if (isOpen) {
      fetchGroups();
      setError(null);
      setSuccess(false);
    }
  }, [isOpen]);

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
      setSelectedGroup(data);
      setError(null);
    } catch (err) {
      console.error('Error creating group:', err);
      setError('Failed to create group');
    }
  };

  const handleAddToGroup = async () => {
    if (!selectedGroup) {
      setError('Please select a group');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check if song already exists in the group
      const { data: existingSong } = await supabase
        .from('favorite_songs')
        .select('*')
        .eq('group_id', selectedGroup.id)
        .eq('song_id', song.id)
        .single();

      if (existingSong) {
        setError('Song already exists in this group');
        setIsLoading(false);
        return;
      }

      await onAddToGroup(selectedGroup.id);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error adding song to group:', err);
      setError('Failed to add song to group');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Add to Library</h2>
        <p className="song-info">
          Adding: <strong>{song.title}</strong> by {song.artist}
        </p>

        <div className="groups-section">
          <form onSubmit={handleCreateGroup} className="create-group-form">
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Create new group"
              className="group-input"
            />
            <button type="submit" className="create-group-button">
              Create
            </button>
          </form>

          <div className="groups-list">
            {groups.map(group => (
              <div
                key={group.id}
                className={`group-item ${selectedGroup?.id === group.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedGroup(group);
                  setError(null);
                }}
              >
                <span className="group-name">{group.name}</span>
              </div>
            ))}
            {groups.length === 0 && (
              <div className="no-groups">No groups found</div>
            )}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Successfully added to {selectedGroup.name}!</div>}

        <div className="modal-actions">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="add-button" 
            onClick={handleAddToGroup}
            disabled={isLoading || !selectedGroup}
          >
            {isLoading ? 'Adding...' : 'Add to Group'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToLibraryModal; 