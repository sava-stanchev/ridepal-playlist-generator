import { combineReducers } from "redux";
import playlistsReducer from "./playlists";

const rootReducer = combineReducers({
  playlists: playlistsReducer,
});

export default rootReducer;
