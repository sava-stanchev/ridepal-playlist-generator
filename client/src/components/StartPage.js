import { useEffect, useState, useContext } from "react";
import ReactPaginate from "react-paginate";
import { useHistory } from "react-router-dom";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import AuthContext from "../providers/auth-context";
import UpdatePlaylistModal from "./UpdatePlaylistModal";
import { convertHMS } from "../common/utils";
import * as playlistActions from "../store/actions/playlists";
import { useDispatch, useSelector } from "react-redux";

const StartPage = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    dispatch(playlistActions.getPlaylists());
    setLoading(false);
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

    if (showMyPlaylists === true && auth.user) {
      result = result.filter((pl) => pl.user_id === auth.user.id);
    }

    if (filterRap === true) {
      result = result.filter((pl) => pl.genres.includes("Rap/Hip Hop"));
    }

    if (filterPop === true) {
      result = result.filter((pl) => pl.genres.includes("Pop"));
    }

    if (filterRock === true) {
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

  const Loader = () => <div className="Loader"></div>;

  const showLoader = () => {
    if (loading) {
      return <Loader />;
    }
  };

  const deletePlaylist = (id) => {
    dispatch(playlistActions.deletePlaylist(id));
  };

  const editFunction = (playlist) => {
    setCurrentPlaylist(playlist);
    setIsOpen(true);
  };

  const displayPlaylists = returnedPlaylists
    .slice(pagesVisited, pagesVisited + playlistsPerPage)
    .map((playlist) => {
      return (
        <article className="card" key={playlist.id}>
          <div className="cover">
            <div className="cover-text">
              <h1 className="cover-title">{playlist.title}</h1>
              <h4 className="cover-subtitle">
                {convertHMS(playlist.playtime)}
              </h4>
            </div>
            <div className="view-btn-wrapper">
              <button
                className="view-btn"
                onClick={() => history.push(`/playlists/${playlist.id}`)}
              >
                Tracklist
              </button>
              {(auth.isLoggedIn && auth.user.role === 1) ||
              (auth.isLoggedIn && auth.user.id === playlist.user_id) ? (
                <>
                  <button
                    className="edit-btn"
                    onClick={() => editFunction(playlist)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deletePlaylist(playlist.id)}
                  >
                    <FaTrashAlt />
                  </button>
                </>
              ) : null}
            </div>
          </div>
          <>
            <h1 className="pl-name">Ranking: {playlist.rank}</h1>
            <p className="pl-about">
              Created:{" "}
              {new Date(playlist.created_on).toLocaleDateString("en-US")} by{" "}
              <b>{playlist.created_by}</b>
            </p>
          </>
        </article>
      );
    });

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
      <div className="genres">
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <section className="genre-section">
          <button
            className="genre"
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
            className="genre"
            onClick={() => {
              setFilterRap(true);
              setFilterPop(false);
              setFilterRock(false);
            }}
          >
            Rap
          </button>
          <button
            className="genre"
            onClick={() => {
              setFilterPop(true);
              setFilterRap(false);
              setFilterRock(false);
            }}
          >
            Pop
          </button>
          <button
            className="genre"
            onClick={() => {
              setFilterRock(true);
              setFilterRap(false);
              setFilterPop(false);
            }}
          >
            Rock
          </button>
          <button className="btn-grad" onClick={() => setShowMyPlaylists(true)}>
            My playlists
          </button>
          <select
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
          <div className="boxContainer">
            <table className="elementsContainer">
              <tbody>
                <tr>
                  <td>
                    <input
                      type="text"
                      placeholder="search by name"
                      className="search"
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </td>
                  <td>
                    <>
                      <i className="material-icons">search</i>
                    </>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <div className="cards-container">
        {showLoader()}
        {displayPlaylists}
      </div>
      <ReactPaginate
        previousLabel={"<"}
        nextLabel={">"}
        pageCount={pageCount}
        onPageChange={changePage}
        containerClassName={"paginationBttns"}
        previousLinkClassName={"previousBttn"}
        nextLinkClassName={"nextBttn"}
        disabledClassName={"paginationDisabled"}
        activeClassName={"paginationActive"}
      />
    </>
  );
};

export default StartPage;
