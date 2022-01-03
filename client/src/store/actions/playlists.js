import { HOST } from "../../common/constants";

export const GET_PLAYLISTS = "GET_PLAYLISTS";

export const getPlaylists = () => {
  return async (dispatch) => {
    const result = await fetch(`${HOST}/playlists`, {
      method: "GET",
    }).then((response) => response.json());

    dispatch({ type: GET_PLAYLISTS, data: result });
  };
};

export const deletePlaylist = (id) => {
  return async (dispatch, getState) => {
    await fetch(`${HOST}/playlists/${id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        authorization: `bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => res.json());

    const playlists = [...getState().playlists.allPlaylists];
    const result = playlists.filter((p) => p.id !== id);
    dispatch({ type: GET_PLAYLISTS, data: result });
  };
};

export const updatePlaylist = (id, thePlaylist) => {
  return async (dispatch, getState) => {
    const editedPlaylist = await fetch(`${HOST}/playlists/${id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(thePlaylist),
    }).then((res) => res.json());

    const playlists = [...getState().playlists.allPlaylists];
    const result = playlists.map((p) =>
      p.id === editedPlaylist.id ? editedPlaylist : p
    );
    dispatch({ type: GET_PLAYLISTS, data: result });
  };
};
