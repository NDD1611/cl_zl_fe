
import { friendActions } from "../actions/friendAction"

const initState = {
    selectItem: 'listFriend',
    pendingInvitations: []
}

const reducer = (state = initState, action) => {
    switch (action.type) {
        case friendActions.SET_SELECT_ITEM_TAB_TWO:
            return {
                ...state,
                selectItem: action.selectItem
            }
        case friendActions.SET_PENDING_INVITATION:
            return {
                ...state,
                pendingInvitations: action.pendingInvitations
            }
        default:
            return state
    }
}

export default reducer