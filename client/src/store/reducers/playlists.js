import { GET_PLAYLISTS } from "../actions/playlists";

const initialState = {
  allPlaylists: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_PLAYLISTS: {
      return {
        ...state,
        allPlaylists: action.data,
      };
    }
    default:
      return state;
  }
};
