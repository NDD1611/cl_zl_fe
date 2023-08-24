import { maintabActions } from "../actions/maintabAction"

const initState = {
    maintabSelect: 'chat',
    countAnnounceMessage: 0,
}

const reducer = (state = initState, action) => {
    switch (action.type) {
        case maintabActions.SET_MAIN_TAB:
            return {
                ...state,
                maintabSelect: action.maintabSelect
            }
        case maintabActions.SET_COUNT_ANNOUNCE_MESSAGE:
            return {
                ...state,
                countAnnounceMessage: action.countAnnounceMessage
            }
        default:
            return state
    }
}

export default reducer