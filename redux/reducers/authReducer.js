
import { authActions } from "../actions/authAction"

const initState = {
    userDetails: {}
}

const reducer = (state = initState, action) => {
    switch (action.type) {
        case authActions.SET_USER_DETAIL:
            return {
                ...state,
                userDetails: action.userDetails
            }
        default:
            return state
    }
}

export default reducer