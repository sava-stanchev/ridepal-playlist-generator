import { HOST } from "../../common/constants";

export const GET_USERS = "GET_USERS";

export const getUsers = () => {
  return async (dispatch) => {
    try {
      const response = await fetch(`${HOST}/users`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          authorization: `bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      } else {
        const result = await response.json();
        dispatch({ type: GET_USERS, data: result });
      }
    } catch (error) {
      console.error(error.message);
    }
  };
};

export const deleteUser = (id) => {
  return async (dispatch, getState) => {
    try {
      const response = await fetch(`${HOST}/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      } else {
        const users = [...getState().users.allUsers];
        const result = users.filter((u) => u.id !== id);
        dispatch({ type: GET_USERS, data: result });
      }
    } catch (error) {
      console.error(error.message);
    }
  };
};

export const switchRole = (id) => {
  return async (dispatch, getState) => {
    try {
      const response = await fetch(`${HOST}/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      } else {
        const result = await response.json();
        const users = [...getState().users.allUsers];
        const updatedUser = users.map((u) => (u.id === result.id ? result : u));
        dispatch({ type: GET_USERS, data: updatedUser });
      }
    } catch (error) {
      console.error(error.message);
    }
  };
};

export const updateUser = (id, theUser) => {
  return async (dispatch, getState) => {
    try {
      const response = await fetch(`${HOST}/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(theUser),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      } else {
        const result = await response.json();
        const users = [...getState().users.allUsers];
        const updatedUser = users.map((u) => (u.id === result.id ? result : u));
        dispatch({ type: GET_USERS, data: updatedUser });
      }
    } catch (error) {
      console.error(error.message);
    }
  };
};
