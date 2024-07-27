import { GET_USERS } from "../actions/users";

const initialState = {
  allUsers: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_USERS: {
      return {
        ...state,
        allUsers: action.data,
      };
    }
    default:
      return state;
  }
};
