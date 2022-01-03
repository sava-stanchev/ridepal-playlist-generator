import { useEffect, useState } from "react";
import { FaTrashAlt, FaEdit, FaCrown } from "react-icons/fa";
import UpdateUserModal from "./UpdateUserModal";
import * as userActions from "../store/actions/users";
import { useDispatch, useSelector } from "react-redux";

const Users = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const users = useSelector((state) => state.users.allUsers);

  useEffect(() => {
    setLoading(true);
    dispatch(userActions.getUsers());
    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) => {
        return user.username.toLowerCase().includes(search.toLowerCase());
      })
    );
  }, [search, users]);

  let foundUsers = filteredUsers;

  const deleteUser = (id) => {
    dispatch(userActions.deleteUser(id));
  };

  const switchRole = (id) => {
    dispatch(userActions.switchRole(id));
  };

  const editFunction = (user) => {
    setCurrentUser(user);
    setIsOpen(true);
  };

  const Loader = () => <div className="Loader"></div>;

  const showLoader = () => {
    if (loading) {
      return <Loader />;
    }
  };

  const displayUsers = foundUsers.map((user) => {
    return (
      <tbody key={user.id}>
        <tr style={{ outline: "#202027 thin solid" }}>
          <td>{user.username}</td>
          <td>{user.email}</td>
          <td>
            <div className="inline-td">
              {user.role}
              <button
                className="role-btn-users"
                onClick={() => switchRole(user.id)}
              >
                <FaCrown
                  style={
                    user.role === "admin"
                      ? { color: "#FFD700" }
                      : { color: "white" }
                  }
                />
              </button>
            </div>
          </td>
          <td>
            <div className="inline-td">
              <button
                className="edit-btn-users"
                onClick={() => editFunction(user)}
              >
                <FaEdit />
              </button>
              <button
                className="delete-btn-users"
                onClick={() => deleteUser(user.id)}
              >
                <FaTrashAlt />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    );
  });

  return (
    <>
      <UpdateUserModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        user={currentUser}
        users={users}
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />
      <section className="genre-section">
        <div className="boxContainer">
          <table className="elementsContainer">
            <tbody>
              <tr>
                <td>
                  <input
                    type="text"
                    placeholder="search by username"
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
      <br />
      <div className="songs-container-main-section">
        {showLoader()}
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th colSpan="4">List of Users</th>
              </tr>
            </thead>
            {displayUsers}
          </table>
        </div>
      </div>
    </>
  );
};

export default Users;
