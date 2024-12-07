import { joinClasses } from "../common/utils";
import Search from "./Search";

const Filters = ({ filters, onFilterChange }) => {
  const genres = ["Rap/Hip Hop", "Rock", "Pop"];

  const handleFilterButtonClick = (genre) => {
    const updatedGenres = filters.selectedGenres.includes(genre)
      ? filters.selectedGenres.filter((g) => g !== genre)
      : [...filters.selectedGenres, genre];

    onFilterChange("selectedGenres", updatedGenres);
  };

  return (
    <div className="filters">
      <div className="filters__container">
        {genres.map((genre, idx) => (
          <button
            key={`filters-${idx}`}
            className={joinClasses([
              "filters__btn",
              filters.selectedGenres.includes(genre) &&
                "filters__btn--gradient",
            ])}
            onClick={() => handleFilterButtonClick(genre)}
          >
            {genre}
          </button>
        ))}
        <div className="filters__custom-select">
          <label htmlFor="duration-select" className="visually-hidden">
            Playlist duration
          </label>
          <select
            className="filters__select"
            id="duration-select"
            onChange={(e) => onFilterChange("duration", e.target.value || null)}
            value={filters.duration || ""}
          >
            <option value="">Duration</option>
            {[...Array(8)].map((_, i) => (
              <option key={i} value={`< ${i + 1} hours`}>
                &lt; {i + 1} {i === 0 ? "hour" : "hours"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="filters__search-container">
        <Search
          search={filters.search}
          onSearchChange={(value) => onFilterChange("search", value)}
        />
      </div>
    </div>
  );
};

export default Filters;
