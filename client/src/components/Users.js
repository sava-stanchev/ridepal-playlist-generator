import { useEffect } from 'react';
import { useState } from 'react/cjs/react.development'
import { HOST } from '../common/constants';


const Users = () => {

const [users, setUsers] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

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

return(
  <div>
  <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>E-mail</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
        {
          users.map((u, i) => {
            return (
              <>
                <tr>
                  <td>{u.users_id}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.user_role}
                  </td>                 
                </tr>
              </>
            )
          })
        }
        </tbody>
      </table>
  </div>
)
}

export default Users;