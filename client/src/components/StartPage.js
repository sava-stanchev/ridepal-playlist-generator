import {HOST} from '../common/constants.js';
import {useEffect, useState} from 'react';
import ReactPaginate from "react-paginate";
import {useHistory} from "react-router-dom";

const StartPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [search, setSearch] = useState('');
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
  const [fpl, setFpl] = useState(null); //filtered playlists by genre
  const [duration, setDuration] = useState([]);

  const playlistsPerPage = 8;
  const pagesVisited = pageNumber * playlistsPerPage;

  useEffect(() => {
    setLoading(true);
    fetch(`${HOST}/playlists`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => setPlaylists(data))
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setFilteredPlaylists(
      playlists.filter(playlist => {
        return playlist.playlist_name.toLowerCase().includes(search.toLowerCase())
      })
    )
  }, [search, playlists]);

  const foundPlaylists = fpl || filteredPlaylists.slice();

  const showError = () => {
    if (error) {
      return <h4><i>An error has occured: </i>{error}</h4>
    }
  }

  const Loader = () => <div className="Loader"></div>;

  const showLoader = () => {
    if (loading) {
      return <Loader />
    }
  }

  const history = useHistory();

  const genreFilter = (genre) => {
    if (playlists !== null || playlists !== undefined) {
      setFpl(playlists.filter(track => track.deez_genres_id === genre));
    }    
    setPageNumber(0);
  };

  const myPlaylists = () => {

  };

  const displayPlaylists = foundPlaylists
  .slice(pagesVisited, pagesVisited + playlistsPerPage)
  .map((playlist) => {
    return (
      <article className="card">
        <div className="cover">
          <div className="cover-text">
            <h1 className="cover-title">{playlist.playlist_name}</h1>
            <h4 className="cover-subtitle">{Math.round(playlist.duration/60)} min.</h4>
          </div>
          <div className="view-btn-wrapper">
            <button className="view-btn" onClick = {() => history.push(`/playlists/${playlist.playlists_id}`)}>Tracklist</button>
          </div>
        </div>
        <div className="description">
          <h1 className="pl-name">Rank: {playlist.rank}</h1>
          <p className="pl-about">Created: {new Date(playlist.created_on).toLocaleDateString("en-US")} by {playlist.created_by}</p>
        </div>
      </article>
    );
  });

  const pageCount = Math.ceil(foundPlaylists.length / playlistsPerPage);
  const changePage = ({selected}) => {
    setPageNumber(selected);
  };
  
  return(
    <>
    <div className="genres">
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
      {/* /playlists/?rock=(null/? ? ? ? ) */}
      <section className="genre-section">
        <button className="genre active" onClick={() => setFpl(null)}>All</button>
        <button className="genre" onClick={() => genreFilter(129)}>Jazz</button>
        <button className="genre" onClick={() => genreFilter(132)}>Pop</button>
        <button className="genre" onClick={() => genreFilter(152)}>Rock</button>
        <button className="genre" onClick={() => genreFilter(153)}>Blues</button>
        <button className="genre" onClick={() => genreFilter(168)}>Disco</button>
        {/* show only when user is logedin */}
        <button className="genre" onClick={() => myPlaylists()}>My playlists</button>
        <div className="boxContainer">
          <table className = "elementsContainer">
            <tbody><tr>
              <td>
                <input type="text" placeholder="search by name" className="search" onChange={e => setSearch(e.target.value)}/>
              </td>
              <td>
                <>
                  <i className="material-icons">search</i>
                </>
              </td>
            </tr></tbody>
          </table>
        </div>
      </section>
    </div>
    <div className="cards-container">
      {showLoader()}
      {showError()}
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
  )    
};

export default StartPage;
