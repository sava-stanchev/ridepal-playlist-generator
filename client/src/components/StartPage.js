import {HOST} from '../common/constants.js';
import {useEffect, useState, useContext} from 'react';
import ReactPaginate from "react-paginate";
import {useHistory} from "react-router-dom";
import {FaTrashAlt, FaEdit} from "react-icons/fa";
import AuthContext from '../providers/auth-context';
import UpdatePlaylistModal from './UpdatePlaylistModal.js';

const StartPage = () => {
  const auth = useContext(AuthContext);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [search, setSearch] = useState('');
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
  const [filteredGenres, setFilteredGenres] = useState(null);
  const [timePl, setTimePl] = useState(null);
  const [myPlaylists, setMyPlaylists] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);

  const playlistsPerPage = 6;
  const pagesVisited = pageNumber * playlistsPerPage;

  useEffect(() => {
    setLoading(true);
    fetch(`${HOST}/playlists`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => data.length?setPlaylists(data):setPlaylists([]))
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, []);

  let reducedPlaylists = [];

  if (playlists.length !== 0) {
    reducedPlaylists = playlists.reduce((acc, pl) => acc
    .some(el => el.playlists_id === pl.playlists_id) ? acc : [...acc, pl], []);
  }    

  useEffect(() => {
    setFilteredPlaylists(reducedPlaylists.filter(playlist => {
      return playlist.playlist_name.toLowerCase().includes(search.toLowerCase())
    }));
  }, [search, playlists]);

  const filterByDuration = (reducedPlaylists, duration) => {
    console.log(duration);
    if (duration === 'Duration') {
      return;
    }
    if (playlists !== null || playlists !== undefined) {
      setTimePl(reducedPlaylists.filter(pl => +pl.duration <= Math.floor(duration.split(' ')[0]*60)))
    }
  };

  let foundPlaylists = myPlaylists || timePl || filteredGenres || filteredPlaylists;

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
      setFilteredGenres(playlists.filter(track => track.deez_genres_id === genre));
    }    
    setPageNumber(0);
  };

  const showMyPlaylists = (reducedPlaylists) => {
    if (playlists !== null || playlists !== undefined) {
      setMyPlaylists(reducedPlaylists.filter(pl => pl.user_id === auth.user.users_id));
    }
  };
  
  const deletePlaylist = (id) => {
    fetch(`${HOST}/playlists/${id}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${localStorage.getItem('token')}`
      },
    })
    .then((res) => res.json())
    .then(() => setPlaylists(playlists.filter(p => p.playlists_id !== id)))
    .catch((error) => setError(error.message));
  };

  const editFunction = (playlist) => {
    setCurrentPlaylist(playlist);
    setIsOpen(true);
  }
  
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
            {
              (auth.isLoggedIn && auth.user.user_role === 1) || (auth.isLoggedIn && auth.user.users_id === playlist.user_id)
              ?
              <>
              <button className="edit-btn" onClick={() => editFunction(playlist)}><FaEdit/></button>
              <button className="delete-btn" onClick={() => deletePlaylist(playlist.playlists_id)}><FaTrashAlt/></button>
              </>
              :
              <></>
            }
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
    <UpdatePlaylistModal open={isOpen} onClose={() => setIsOpen(false)} playlist={currentPlaylist} playlists={playlists} setPlaylists={setPlaylists}/>
    <div className="genres">
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
      <section className="genre-section">
        <button className="genre" onClick={() => {setFilteredGenres(null); setTimePl(null); setMyPlaylists(null); setSearch('')}}>All</button>
        <button className="genre" onClick={() => {genreFilter(129); setTimePl(null)}}>Jazz</button>
        <button className="genre" onClick={() => {genreFilter(132); setTimePl(null)}}>Pop</button>
        <button className="genre" onClick={() => {genreFilter(152); setTimePl(null)}}>Rock</button>
        <button className="genre" onClick={() => {genreFilter(153); setTimePl(null)}}>Blues</button>
        <button className="genre" onClick={() => {genreFilter(168); setTimePl(null)}}>Disco</button>
        <button className="genre" onClick={() => showMyPlaylists(reducedPlaylists)}>My playlists</button>
        <select name="durations" defaultValue="Duration" onChange={e => filterByDuration(reducedPlaylists, e.target.value)}>
            <option>Duration</option>
            <option>100 min.</option>
            <option>200 min.</option>
            <option>300 min.</option>
            <option>400 min.</option>
            <option>500 min.</option>
        </select>
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
