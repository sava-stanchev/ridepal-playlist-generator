import { HOST } from "../../common/constants";

export const GET_PLAYLISTS = "GET_PLAYLISTS";

export const getPlaylists = () => {
  return async (dispatch) => {
    try {
      const response = await fetch(`${HOST}/playlists`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      } else {
        const result = await response.json();
        dispatch({ type: GET_PLAYLISTS, data: result });
      }
    } catch (error) {
      console.error(error.message);
    }
  };
};

export const deletePlaylist = (id) => {
  return async (dispatch, getState) => {
    try {
      const response = await fetch(`${HOST}/playlists/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      } else {
        const playlists = [...getState().playlists.allPlaylists];
        const result = playlists.filter((p) => p.id !== id);
        dispatch({ type: GET_PLAYLISTS, data: result });
      }
    } catch (error) {
      console.error(error.message);
    }
  };
};

export const updatePlaylist = (id, newPlaylistName) => {
  return async (dispatch, getState) => {
    try {
      const response = await fetch(`${HOST}/playlists/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ newPlaylistName }),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      } else {
        const result = await response.json();
        const playlists = [...getState().playlists.allPlaylists];
        const editedPlaylist = playlists.map((p) =>
          p.id === result.id ? result : p
        );
        dispatch({ type: GET_PLAYLISTS, data: editedPlaylist });
      }
    } catch (error) {
      console.error(error.message);
    }
  };
};
