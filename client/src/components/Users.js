import { useEffect } from 'react';
import { useState } from 'react/cjs/react.development'
import { HOST } from '../common/constants';
import {FaTrashAlt, FaEdit} from "react-icons/fa";
import UpdateUserModal from './UpdateUserModal.js';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState('');

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

  useEffect(() => {
    setFilteredUsers(users.filter(user => {
      return user.username.toLowerCase().includes(search.toLowerCase())
    }));

  }, [search, users]);

  let foundUsers = filteredUsers;

  const deleteUser = (id) => {
    fetch(`${HOST}/users/${id}`, {
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
  };


  const displayUsers = foundUsers.map((user) => {
    return (
      <tr className="song" key={user.users_id}>
        <td className="song-album-cover"><h5>{user.username}</h5></td>
        <td className="user-email"><h5>{user.email}</h5></td>
        <td className="user-role"><h5>{user.role}</h5></td>
        <td className="song-length">
          <button className="edit-btn-users" onClick={() => editFunction(user)}><FaEdit/></button>
        </td>
        <td className="song-length">
          <button className="delete-btn-users" onClick={() => deleteUser(user.users_id)}><FaTrashAlt/></button>
        </td>
      </tr>
    )
  });
  // console.log(currentUser);
  // console.log(users);

  return(
    <>
      <UpdateUserModal open={isOpen} onClose={() => setIsOpen(false)} user={currentUser} users={users} setUsers={setUsers}/>
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
      <section className="genre-section">
        <div className="boxContainer">
          <table className = "elementsContainer">
            <tbody><tr>
              <td>
                <input type="text" placeholder="search by username" className="search" onChange={e => setSearch(e.target.value)}/>
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
      <br/>
      <div className="songs-container-main-section">
        {showError()}
        {showLoader()}
        <div className="songs-container">
          <div className="playlist-header">
            <h5 className="playlist-title">List of Users</h5>
          </div>
          <table className="playlist-list">
            {displayUsers}
          </table>
        </div>
      </div>
    </>
  )
}

export default Users;
