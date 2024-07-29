import { useEffect, useState, useContext } from "react";
import ReactPaginate from "react-paginate";
import { useHistory } from "react-router-dom";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import AuthContext from "../providers/auth-context";
import UpdatePlaylistModal from "./UpdatePlaylistModal";
import { convertHMS } from "../common/utils";
import * as playlistActions from "../store/actions/playlists";
import { useDispatch, useSelector } from "react-redux";
import Search from "./Search";
import Loader from "./Loader";

const Playlist = ({
  playlist,
  id,
  title,
  playtime,
  rank,
  created_by,
  created_on,
  user_id,
  auth,
  editPlaylist,
  deletePlaylist,
}) => {
  return (
    <article className="card">
      <div className="card__cover">
        <div className="card__cover-text">
          <h1 className="card__cover-text--title">{title}</h1>
          <h2 className="card__cover-text--subtitle">{convertHMS(playtime)}</h2>
        </div>
        <div className="btn-wrapper">
          <button
            className="btn-wrapper__view"
            onClick={() => history.push(`/playlists/${id}`)}
          >
            Tracklist
          </button>
          {(auth.isLoggedIn && auth.user.role === 1) ||
          (auth.isLoggedIn && auth.user.id === user_id) ? (
            <>
              <button
                className="btn-wrapper__edit"
                onClick={() => editPlaylist(playlist)}
              >
                <FaEdit />
              </button>
              <button
                className="btn-wrapper__delete"
                onClick={() => deletePlaylist(id)}
              >
                <FaTrashAlt />
              </button>
            </>
          ) : null}
        </div>
      </div>
      <>
        <h1 className="card__name">Ranking: {rank}</h1>
        <p className="card__about">
          Created: {new Date(created_on).toLocaleDateString("en-US")} by{" "}
          <b>{created_by}</b>
        </p>
      </>
    </article>
  );
};

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
  const [showMyPlaylists, setShowMyPlaylists] = useState(false);
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

    if (showMyPlaylists && auth.user) {
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
    showMyPlaylists,
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
              setShowMyPlaylists(false);
              setSearch("");
              setFilterRap(false);
              setFilterPop(false);
              setFilterRock(false);
            }}
          >
            All
          </button>
          <button
            className={["filters__btn", filterRap && "filters__btn--gradient"]
              .filter(Boolean)
              .join(" ")}
            onClick={() => {
              setFilterRap(true);
              setFilterPop(false);
              setFilterRock(false);
              setShowMyPlaylists(false);
            }}
          >
            Rap
          </button>
          <button
            className={["filters__btn", filterPop && "filters__btn--gradient"]
              .filter(Boolean)
              .join(" ")}
            onClick={() => {
              setFilterPop(true);
              setFilterRap(false);
              setFilterRock(false);
              setShowMyPlaylists(false);
            }}
          >
            Pop
          </button>
          <button
            className={["filters__btn", filterRock && "filters__btn--gradient"]
              .filter(Boolean)
              .join(" ")}
            onClick={() => {
              setFilterRock(true);
              setFilterRap(false);
              setFilterPop(false);
              setShowMyPlaylists(false);
            }}
          >
            Rock
          </button>
          <button
            className={[
              "filters__btn",
              showMyPlaylists && "filters__btn--gradient",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => {
              setShowMyPlaylists(true);
              setFilterRock(false);
              setFilterRap(false);
              setFilterPop(false);
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
            <option>&#60; 1 hour</option>
            <option>&#60; 2 hours</option>
            <option>&#60; 3 hours</option>
            <option>&#60; 4 hours</option>
            <option>&#60; 5 hours</option>
            <option>&#60; 6 hours</option>
            <option>&#60; 7 hours</option>
            <option>&#60; 8 hours</option>
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
                <Playlist
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
