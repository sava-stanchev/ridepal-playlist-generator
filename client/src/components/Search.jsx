import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

const Search = ({ search, onSearchChange }) => {
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearchChange(searchInput);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput, onSearchChange]);

  return (
    <div className="search">
      <div className="search__container">
        <input
          type="text"
          placeholder="search by name"
          className="search__input"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <FaSearch />
      </div>
    </div>
  );
};

export default Search;
