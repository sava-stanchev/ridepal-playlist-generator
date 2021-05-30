import { HOST } from '../common/constants.js';
import {useEffect, useState} from 'react';
import ReactPaginate from "react-paginate";

const StartPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [search, setSearch] = useState('');
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);

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

  const foundPlaylists = filteredPlaylists.slice();

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

  const displayPlaylists = foundPlaylists
  .slice(pagesVisited, pagesVisited + playlistsPerPage)
  .map((playlist) => {
    return (
      <article className="card">
        <div className="cover">
          <div className="cover-text">
            <h1 className="cover-title">{playlist.playlist_name}</h1>
            <h4 className="cover-subtitle">{playlist.duration}</h4>
          </div>
          <div className="view-btn-wrapper">
            <button className="view-btn">Details</button>
          </div>
        </div>
        <div className="description">
          <h1 className="pl-name">{playlist.rank}</h1>
          <p className="pl-about">{playlist.created_on}, {playlist.created_by}</p>
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
        <button className="genre active">All</button>
        <button className="genre">Genre 1</button>
        <button className="genre">Genre 2</button>
        <button className="genre">Genre 3</button>
        <button className="genre">Genre 4</button>
        <button className="genre">Genre 5</button>
        <button className="genre">Genre 6</button>
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
