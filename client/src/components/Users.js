import { useEffect } from 'react';
import { useState } from 'react/cjs/react.development'
import { HOST } from '../common/constants';
import ReactPaginate from "react-paginate";
import {FaTrashAlt, FaEdit} from "react-icons/fa";
import UpdateUserModal from './UpdateUserModal.js';


const Users = () => {

const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [isOpen, setIsOpen] = useState(false);
const [pageNumber, setPageNumber] = useState(0);
const [currentUser, setCurrentUser] = useState(null);
const [search, setSearch] = useState('');

const usersPerPage = 6;
const pagesVisited = pageNumber * usersPerPage;

useEffect(() => {
  setLoading(true);
  fetch(`${HOST}/users`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'authorization': `bearer ${localStorage.getItem('token')}`
    },
  })
  .then(res => res.json())
  .then(data => setUsers(data))
  .then(() => setLoading(false))
  .catch(error => setError(error.massage))
}, []);


const deletePlaylist = (id) => {
  fetch(`${HOST}/playlists/${id}`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      'authorization': `bearer ${localStorage.getItem('token')}`
    },
  })
  .then((res) => res.json())
  .then(() => setUsers(users.filter(u => u.users_id !== id)))
  .catch((error) => setError(error.message));
};

const editFunction = (user) => {
  setCurrentUser(user);
  setIsOpen(true);
}


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

const displayUser = users
  .slice(pagesVisited, pagesVisited + usersPerPage)
  .map((user) => {
    return (
      <article className="card">
        <div className="cover">
          <div className="cover-text">
            <h1 className="cover-title">{user.username}</h1>
          </div>
          <div className="view-btn-wrapper">
            <button className="edit-btn" onClick={() => editFunction(user)}><FaEdit/></button>
            <button className="delete-btn" onClick={() => deletePlaylist(user.users_id)}><FaTrashAlt/></button>
          </div>
        </div>
        
      </article>
    );
  });

  const pageCount = Math.ceil(users.length / usersPerPage);
  const changePage = ({selected}) => {
    setPageNumber(selected);
  };

return(
  <>
    <UpdateUserModal open={isOpen} onClose={() => setIsOpen(false)} user={currentUser}/>
      <div className="users">
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
        <section className="genre-section">
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
        {displayUser}
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
}

export default Users;