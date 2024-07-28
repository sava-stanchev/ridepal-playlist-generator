import { FaSearch } from "react-icons/fa";

export default function Search({ setSearch }) {
  return (
    <div className="search">
      <div className="search__container">
        <input
          type="text"
          placeholder="search by name"
          className="search__input"
          onChange={(e) => setSearch(e.target.value)}
        />
        <FaSearch />
      </div>
    </div>
  );
}
