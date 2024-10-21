import React, { useState } from 'react';
import axios from 'axios';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/search?q=${query}`, {
        headers: { Authorization: token }
      });
      setResults([...response.data.tenants, ...response.data.landlords, ...response.data.properties]);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="flex-grow p-2 border rounded-l"
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white p-2 rounded-r">
          Search
        </button>
      </div>
      {results.length > 0 && (
        <ul className="mt-2 bg-white border rounded p-2">
          {results.map((result, index) => (
            <li key={index} className="mb-1">
              {result.name} ({result.type})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;