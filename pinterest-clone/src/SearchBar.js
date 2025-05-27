import React, { useState } from 'react';
import './SearchBar.css';
import { Search } from 'lucide-react';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="search-header">
      <form className="search-bar" onSubmit={handleSubmit}>
        <Search size={20} className="icon" />
        <input
          type="text"
          placeholder="Buscar"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
    </div>
  );
}

export default SearchBar;
