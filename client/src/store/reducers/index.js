import { combineReducers } from "redux";
import playlistsReducer from "./playlists";
import usersReducer from "./users";

const rootReducer = combineReducers({
  playlists: playlistsReducer,
  users: usersReducer,
});

export default rootReducer;
