import { HOST } from "../../common/constants";

export const GET_USERS = "GET_USERS";

export const getUsers = () => {
  return async (dispatch) => {
    const result = await fetch(`${HOST}/users`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        authorization: `bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => res.json());

    dispatch({ type: GET_USERS, data: result });
  };
};

export const deleteUser = (id) => {
  return async (dispatch, getState) => {
    await fetch(`${HOST}/users/${id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        authorization: `bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => res.json());

    const users = [...getState().users.allUsers];
    const result = users.filter((u) => u.id !== id);
    dispatch({ type: GET_USERS, data: result });
  };
};

export const switchRole = (id) => {
  return async (dispatch) => {
    const result = await fetch(`${HOST}/users/${id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        authorization: `bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => res.json());

    dispatch({ type: GET_USERS, data: result });
  };
};

export const updateUser = (id, theUser) => {
  return async (dispatch, getState) => {
    const editedUser = await fetch(`${HOST}/users/${id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(theUser),
    }).then((res) => res.json());

    const users = [...getState().users.allUsers];
    const result = users.map((u) => (u.id === editedUser.id ? editedUser : u));
    dispatch({ type: GET_USERS, data: result });
  };
};
