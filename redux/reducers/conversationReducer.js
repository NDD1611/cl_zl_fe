
import { conversationActions } from "../actions/conversationAction"

const initState = {
    conversations: [],
    conversationSelected: null
}

const reducer = (state = initState, action) => {
    switch (action.type) {
        case conversationActions.SET_CONVERSATION:
            return {
                ...state,
                conversations: action.conversations
            }
        case conversationActions.SET_SELECT_CONVERSATION:
            return {
                ...state,
                conversationSelected: action.conversationSelected
            }
        default:
            return state
    }
}

export default reducer