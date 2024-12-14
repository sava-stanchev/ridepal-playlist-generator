import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, switchRole, deleteUser } from "../store/actions/users";
import UpdateUserModal from "../components/UpdateUserModal";
import Loader from "../components/Loader";
import Search from "../components/Search";
import User from "../components/User";

const Users = () => {
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [search, setSearch] = useState("");
  const users = useSelector((state) => state.users.allUsers);

  const fetchUsers = useCallback(() => {
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  const handleSwitchRole = useCallback(
    (id) => {
      dispatch(switchRole(id));
    },
    [dispatch]
  );

  const handleEditUser = useCallback((user) => {
    setCurrentUser(user);
    setModal(true);
  }, []);

  const handleDeleteUser = useCallback(
    (id) => {
      dispatch(deleteUser(id));
    },
    [dispatch]
  );

  const handleSearchChange = useCallback((value) => {
    setSearch(value);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModal(false);
  }, []);

  return (
    <>
      <section className="filters__container">
        <Search search={search} onSearchChange={handleSearchChange} />
      </section>
      {users.length === 0 && !search.length ? (
        <Loader />
      ) : (
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
                {filteredUsers.map((user) => (
                  <User
                    key={user.id}
                    {...user}
                    user={user}
                    onSwitchRole={handleSwitchRole}
                    onEditUser={handleEditUser}
                    onDeleteUser={handleDeleteUser}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {modal && (
        <UpdateUserModal
          openModal={modal}
          closeModal={handleCloseModal}
          user={currentUser}
          users={users}
        />
      )}
    </>
  );
};

export default Users;
