import { memo } from "react";
import { FaTrashAlt, FaEdit, FaCrown } from "react-icons/fa";

const User = memo(
  ({ id, username, email, role, onSwitchRole, onEditUser, onDeleteUser }) => (
    <tr className="users__table-row">
      <td>{username}</td>
      <td>{email}</td>
      <td>
        <div className="users__table-buttons">
          {role}
          <button
            className="users__table-buttons--role"
            onClick={() => onSwitchRole(id)}
            aria-label="Role"
          >
            <FaCrown
              className={
                role === "admin"
                  ? "users__crown-icon--admin"
                  : "users__crown-icon--user"
              }
            />
          </button>
        </div>
      </td>
      <td>
        <div className="users__table-buttons">
          <button
            className="users__table-buttons--edit"
            onClick={() => onEditUser({ id, username, email, role })}
            aria-label="Edit user"
          >
            <FaEdit />
          </button>
          <button
            className="users__table-buttons--delete"
            onClick={() => onDeleteUser(id)}
            aria-label="Delete user"
          >
            <FaTrashAlt />
          </button>
        </div>
      </td>
    </tr>
  )
);

export default User;
