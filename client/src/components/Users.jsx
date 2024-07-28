import { useEffect, useState } from "react";
import { FaTrashAlt, FaEdit, FaCrown } from "react-icons/fa";
import UpdateUserModal from "./UpdateUserModal";
import * as userActions from "../store/actions/users";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";
import Search from "./Search";

const User = ({
  user,
  username,
  email,
  role,
  id,
  switchRole,
  editUser,
  deleteUser,
}) => {
  return (
    <tr className="users__table-row">
      <td>{username}</td>
      <td>{email}</td>
      <td>
        <div className="users__table-buttons">
          {role}
          <button
            className="users__table-buttons--role"
            onClick={() => switchRole(id)}
          >
            <FaCrown
              style={{ color: role === "admin" ? "#FFD700" : "white" }}
            />
          </button>
        </div>
      </td>
      <td>
        <div className="users__table-buttons">
          <button
            className="users__table-buttons--edit"
            onClick={() => editUser(user)}
          >
            <FaEdit />
          </button>
          <button
            className="users__table-buttons--delete"
            onClick={() => deleteUser(id)}
          >
            <FaTrashAlt />
          </button>
        </div>
      </td>
    </tr>
  );
};

const Users = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const editUser = (user) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  return (
    <>
      <section className="filters__container">
        <Search setSearch={setSearch} />
      </section>
      {!foundUsers.length && !search.length && <Loader />}
      {foundUsers.length > 0 && (
        <>
          <UpdateUserModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            user={currentUser}
            users={users}
          />
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
                <tbody>
                  {foundUsers.map((user) => (
                    <User
                      key={user.id}
                      {...user}
                      user={user}
                      switchRole={switchRole}
                      editUser={editUser}
                      deleteUser={deleteUser}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Users;
