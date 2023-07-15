import { maintabActions } from "../actions/maintabAction"

const initState = {
    maintabSelect: 'chat'
}

const reducer = (state = initState, action) => {
    switch (action.type) {
        case maintabActions.SET_MAIN_TAB:
            return {
                ...state,
                maintabSelect: action.maintabSelect
            }
        default:
            return state
    }
}

export default reducer