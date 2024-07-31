import { useEffect, useState, useContext } from "react";
import ReactPaginate from "react-paginate";
import { useHistory } from "react-router-dom";
import AuthContext from "../providers/auth-context";
import UpdatePlaylistModal from "./UpdatePlaylistModal";
import { joinClasses } from "../common/utils";
import * as playlistActions from "../store/actions/playlists";
import { useDispatch, useSelector } from "react-redux";
import Search from "./Search";
import Loader from "./Loader";
import PlaylistCard from "./PlaylistCard";

const Home = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const dispatch = useDispatch();
  const [pageNumber, setPageNumber] = useState(0);
  const [search, setSearch] = useState("");
  const [returnedPlaylists, setReturnedPlaylists] = useState([]);
  const [duration, setDuration] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [filterMyPlaylists, setFilterMyPlaylists] = useState(false);
  const [filterRap, setFilterRap] = useState(false);
  const [filterRock, setFilterRock] = useState(false);
  const [filterPop, setFilterPop] = useState(false);
  const playlists = useSelector((state) => state.playlists.allPlaylists);

  const playlistsPerPage = 6;
  const pagesVisited = pageNumber * playlistsPerPage;

  useEffect(() => {
    dispatch(playlistActions.getPlaylists());
  }, [history, dispatch]);

  useEffect(() => {
    let result = [...playlists];

    if (search.length > 0) {
      result = result.filter((playlist) => {
        return playlist.title.toLowerCase().includes(search.toLowerCase());
      });
    }

    if (duration !== null && duration !== "Duration") {
      result = result.filter(
        (pl) => +pl.playtime <= Math.floor(duration.split(" ")[1] * 60 * 60)
      );
    }

    if (filterMyPlaylists && auth.user) {
      result = result.filter((pl) => pl.user_id === auth.user.id);
    }

    if (filterRap) {
      result = result.filter((pl) => pl.genres.includes("Rap/Hip Hop"));
    }

    if (filterPop) {
      result = result.filter((pl) => pl.genres.includes("Pop"));
    }

    if (filterRock) {
      result = result.filter((pl) => pl.genres.includes("Rock"));
    }

    setPageNumber(0);
    setReturnedPlaylists(result);
  }, [
    auth.user,
    search,
    playlists,
    filterMyPlaylists,
    filterRock,
    filterPop,
    filterRap,
    duration,
  ]);

  const deletePlaylist = (id) => {
    dispatch(playlistActions.deletePlaylist(id));
  };

  const editPlaylist = (playlist) => {
    setCurrentPlaylist(playlist);
    setIsOpen(true);
  };

  const pageCount = Math.ceil(returnedPlaylists.length / playlistsPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const setActiveFilter = (setFilter) => {
    const filterOptions = [
      setFilterPop,
      setFilterRap,
      setFilterRock,
      setFilterMyPlaylists,
    ];

    filterOptions.forEach((currSetFilter) =>
      currSetFilter === setFilter ? currSetFilter(true) : currSetFilter(false)
    );
  };

  return (
    <>
      <UpdatePlaylistModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        playlist={currentPlaylist}
        playlists={playlists}
      />
      <div className="filters">
        <section className="filters__container">
          <button
            className="filters__btn"
            onClick={() => {
              document.getElementById("dropdown").selectedIndex = 0;
              setDuration(null);
              setSearch("");
              setFilterRap(false);
              setFilterPop(false);
              setFilterRock(false);
              setFilterMyPlaylists(false);
            }}
          >
            All
          </button>
          <button
            className={joinClasses([
              "filters__btn",
              filterRap && "filters__btn--gradient",
            ])}
            onClick={() => {
              setActiveFilter(setFilterRap);
            }}
          >
            Rap
          </button>
          <button
            className={joinClasses([
              "filters__btn",
              filterPop && "filters__btn--gradient",
            ])}
            onClick={() => {
              setActiveFilter(setFilterPop);
            }}
          >
            Pop
          </button>
          <button
            className={joinClasses([
              "filters__btn",
              filterRock && "filters__btn--gradient",
            ])}
            onClick={() => {
              setActiveFilter(setFilterRock);
            }}
          >
            Rock
          </button>
          <button
            className={joinClasses([
              "filters__btn",
              filterMyPlaylists && "filters__btn--gradient",
            ])}
            onClick={() => {
              setActiveFilter(setFilterMyPlaylists);
            }}
          >
            My playlists
          </button>
          <select
            className="filters__select"
            name="durations"
            defaultValue="Duration"
            id="dropdown"
            onChange={(e) => setDuration(e.target.value)}
          >
            <option>Duration</option>
            {[...Array(8)].map((e, i) => (
              <option key={i}>
                &#60; {++i} {i === 1 ? "hour" : "hours"}
              </option>
            ))}
          </select>
          <Search setSearch={setSearch} />
        </section>
      </div>
      {!playlists.length && !search.length && <Loader />}
      {playlists.length > 0 && (
        <>
          <div className="cards-container">
            {returnedPlaylists
              .slice(pagesVisited, pagesVisited + playlistsPerPage)
              .map((playlist) => (
                <PlaylistCard
                  key={playlist.id}
                  {...playlist}
                  playlist={playlist}
                  auth={auth}
                  editPlaylist={editPlaylist}
                  deletePlaylist={deletePlaylist}
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
