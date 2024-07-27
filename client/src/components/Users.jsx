import { useEffect, useState } from "react";
import { FaTrashAlt, FaEdit, FaCrown, FaSearch } from "react-icons/fa";
import UpdateUserModal from "./UpdateUserModal";
import * as userActions from "../store/actions/users";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";

const Users = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const users = useSelector((state) => state.users.allUsers);

  useEffect(() => {
    dispatch(userActions.getUsers());
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

  const displayUsers = foundUsers.map((user) => {
    return (
      <tbody key={user.id}>
        <tr className="users__table-row">
          <td>{user.username}</td>
          <td>{user.email}</td>
          <td>
            <div className="users__table-buttons">
              {user.role}
              <button
                className="users__table-buttons--role"
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
            <div className="users__table-buttons">
              <button
                className="users__table-buttons--edit"
                onClick={() => editFunction(user)}
              >
                <FaEdit />
              </button>
              <button
                className="users__table-buttons--delete"
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
      {!foundUsers.length && <Loader />}
      {foundUsers.length > 0 && (
        <>
          <UpdateUserModal
            open={isOpen}
            onClose={() => setIsOpen(false)}
            user={currentUser}
            users={users}
          />
          <section className="filters__container">
            <div className="search">
              <table className="search__container">
                <tbody>
                  <tr>
                    <td>
                      <input
                        type="text"
                        placeholder="search by username"
                        className="search__input"
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </td>
                    <td>
                      <FaSearch />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          <div className="users">
            <div className="users__container">
              <table className="users__table">
                <thead>
                  <tr>
                    <th className="users__table-header" colSpan="4">
                      List of Users
                    </th>
                  </tr>
                </thead>
                {displayUsers}
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Users;
