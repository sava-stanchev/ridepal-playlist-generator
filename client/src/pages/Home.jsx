import { useEffect, useState, useContext, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AuthContext } from "../providers/AuthContext";
import { getPlaylists, deletePlaylist } from "../store/actions/playlists";
import ReactPaginate from "react-paginate";
import UpdatePlaylistModal from "../components/UpdatePlaylistModal";
import Loader from "../components/Loader";
import PlaylistCard from "../components/PlaylistCard";
import Filters from "../components/Filters";

const Home = () => {
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch();
  const playlists = useSelector((state) => state.playlists.allPlaylists);

  const [filters, setFilters] = useState({
    search: "",
    selectedGenres: [],
    duration: null,
  });

  const [pageNumber, setPageNumber] = useState(0);
  const [modal, setModal] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);

  useEffect(() => {
    dispatch(getPlaylists());
  }, [dispatch]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredPlaylists = useMemo(() => {
    let tempPlaylists = [...playlists];

    if (filters.selectedGenres.length > 0) {
      tempPlaylists = tempPlaylists.filter((playlist) =>
        filters.selectedGenres.some((genre) => playlist.genres.includes(genre))
      );
    }

    if (filters.search) {
      tempPlaylists = tempPlaylists.filter((playlist) =>
        playlist.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.duration) {
      const maxDuration = Math.floor(filters.duration.split(" ")[1] * 60 * 60);
      tempPlaylists = tempPlaylists.filter((pl) => +pl.playtime <= maxDuration);
    }

    return tempPlaylists;
  }, [filters, playlists]);

  const handleRenamePlaylist = useCallback((playlist) => {
    setCurrentPlaylist(playlist);
    setModal(true);
  }, []);

  const handleDeletePlaylist = useCallback(
    (id) => {
      dispatch(deletePlaylist(id));
    },
    [dispatch]
  );

  const playlistsPerPage = 6;
  const pageCount = Math.ceil(filteredPlaylists.length / playlistsPerPage);
  const currentPagePlaylists = filteredPlaylists.slice(
    pageNumber * playlistsPerPage,
    (pageNumber + 1) * playlistsPerPage
  );

  return (
    <>
      <UpdatePlaylistModal
        openModal={modal}
        closeModal={() => setModal(false)}
        playlist={currentPlaylist}
        playlists={playlists}
      />
      <Filters filters={filters} onFilterChange={handleFilterChange} />
      {playlists.length === 0 && !filters.search ? (
        <Loader />
      ) : (
        <>
          <div className="cards-container">
            {currentPagePlaylists.map((playlist) => (
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
          {pageCount > 1 && (
            <ReactPaginate
              previousLabel={"<"}
              nextLabel={">"}
              pageCount={pageCount}
              onPageChange={({ selected }) => setPageNumber(selected)}
              containerClassName={"pagination-btns"}
              activeClassName={"pagination-active"}
            />
          )}
        </>
      )}
    </>
  );
};

export default Home;
