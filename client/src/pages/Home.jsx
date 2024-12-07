import { useEffect, useState, useContext, useCallback } from "react";
import ReactPaginate from "react-paginate";
import { AuthContext } from "../providers/auth-context";
import UpdatePlaylistModal from "../components/UpdatePlaylistModal";
import { joinClasses } from "../common/utils";
import * as playlistActions from "../store/actions/playlists";
import { useDispatch, useSelector } from "react-redux";
import Search from "../components/Search";
import Loader from "../components/Loader";
import PlaylistCard from "../components/PlaylistCard";

const Home = () => {
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch();
  const playlists = useSelector((state) => state.playlists.allPlaylists);
  const [pageNumber, setPageNumber] = useState(0);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [duration, setDuration] = useState(null);
  const [filteredPlaylists, setFilteredPlaylists] = useState(playlists);

  const filters = ["Rap/Hip Hop", "Rock", "Pop"];
  const playlistsPerPage = 6;
  const pagesVisited = pageNumber * playlistsPerPage;

  useEffect(() => {
    dispatch(playlistActions.getPlaylists());
  }, [dispatch]);

  useEffect(() => {
    setFilteredPlaylists(playlists);
  }, [playlists]);

  const handleFilterButtonClick = (genre) => {
    if (selectedGenres.includes(genre)) {
      let filters = selectedGenres.filter((el) => el !== genre);
      setSelectedGenres(filters);
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  useEffect(() => {
    filterPlaylists();
  }, [duration, search, selectedGenres]);

  const filterPlaylists = () => {
    let tempPlaylists = [...playlists];

    if (selectedGenres.length > 0) {
      tempPlaylists = tempPlaylists.filter((playlist) => {
        return selectedGenres.some((genre) => playlist.genres.includes(genre));
      });
    }

    if (search.length > 0) {
      tempPlaylists = tempPlaylists.filter((playlist) => {
        return playlist.title.toLowerCase().includes(search.toLowerCase());
      });
    }

    if (duration !== null && duration !== "Duration") {
      tempPlaylists = tempPlaylists.filter(
        (pl) => +pl.playtime <= Math.floor(duration.split(" ")[1] * 60 * 60)
      );
    }

    setFilteredPlaylists(tempPlaylists);
  };

  const handleRenamePlaylist = useCallback((playlist) => {
    setCurrentPlaylist(playlist);
    setModal(true);
  }, []);

  const handleDeletePlaylist = useCallback(
    (id) => {
      dispatch(playlistActions.deletePlaylist(id));
    },
    [dispatch]
  );

  const pageCount = Math.ceil(filteredPlaylists.length / playlistsPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <>
      <UpdatePlaylistModal
        openModal={modal}
        closeModal={() => setModal(false)}
        playlist={currentPlaylist}
        playlists={playlists}
      />
      <div className="filters">
        <div className="filters__container">
          {filters.map((genre, idx) => (
            <button
              className={joinClasses([
                "filters__btn",
                selectedGenres?.includes(genre) && "filters__btn--gradient",
              ])}
              onClick={() => {
                handleFilterButtonClick(genre);
              }}
              key={`filters-${idx}`}
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
              name="durations"
              defaultValue="Duration"
              id="duration-select"
              onChange={(e) => setDuration(e.target.value)}
            >
              <option>Duration</option>
              {[...Array(8)].map((e, i) => (
                <option key={i}>
                  &#60; {++i} {i === 1 ? "hour" : "hours"}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="filters__search-container">
          <Search
            search={search}
            onSearchChange={(value) => setSearch(value)}
          />
        </div>
      </div>
      {!playlists.length && !search.length && <Loader />}
      {playlists.length > 0 && (
        <>
          <div className="cards-container">
            {filteredPlaylists
              .slice(pagesVisited, pagesVisited + playlistsPerPage)
              .map((playlist) => (
                <PlaylistCard
                  key={playlist.id}
                  {...playlist}
                  playlist={playlist}
                  user={user}
                  editPlaylist={handleRenamePlaylist}
                  deletePlaylist={handleDeletePlaylist}
                />
              ))}
          </div>
          <ReactPaginate
            previousLabel={"<"}
            nextLabel={">"}
            pageCount={pageCount}
            onPageChange={changePage}
            containerClassName={"pagination-btns"}
            activeClassName={"pagination-active"}
          />
        </>
      )}
    </>
  );
};

export default Home;
