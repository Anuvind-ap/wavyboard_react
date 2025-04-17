import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AudioCard from '../shared/AudioCard';
import './Search.css';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [genres, setGenres] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch unique genres from the database
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const { data, error } = await supabase
          .from('songs')
          .select('genre')
          .not('genre', 'is', null)
          .order('genre');

        if (error) throw error;

        // Get unique genres and sort them
        const uniqueGenres = [...new Set(data.map(item => item.genre))]
          .filter(genre => genre) // Remove any null/empty values
          .sort();

        setGenres(uniqueGenres);
      } catch (err) {
        console.error('Error fetching genres:', err);
      }
    };

    fetchGenres();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setHasSearched(true);

    if (!searchQuery.trim() && selectedGenre === 'all') {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('songs')
        .select('*');

      if (searchQuery.trim()) {
        query = query.or(`title.ilike.%${searchQuery}%,artist.ilike.%${searchQuery}%`);
      }

      if (selectedGenre !== 'all') {
        query = query.eq('genre', selectedGenre);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      setSearchResults(data || []);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to perform search. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="search-page">
      <div className="search-container">
        <h1>Search</h1>
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or artist..."
              className="search-input"
            />
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="genre-select"
            >
              <option value="all">All Genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
            <button type="submit" className="search-button" disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {error && <div className="error-message">{error}</div>}

        <div className="search-results">
          {isLoading ? (
            <div className="loading">Searching...</div>
          ) : hasSearched ? (
            searchResults.length > 0 ? (
              <div className="results-grid">
                {searchResults.map((song) => (
                  <AudioCard key={song.id} song={song} />
                ))}
              </div>
            ) : (
              <div className="no-results">
                No results found for "{searchQuery}"
                {selectedGenre !== 'all' && ` in ${selectedGenre} genre`}
              </div>
            )
          ) : (
            null
          )}
        </div>
      </div>
    </div>
  );
};

export default Search; 