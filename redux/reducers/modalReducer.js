import { modalActions } from "../actions/modalActions"

const initState = {
    showModalAddFriend: false,
    showModalInfo: false,
    showModalUpdateInfo: false
}

const reducer = (state = initState, action) => {
    switch (action.type) {
        case modalActions.SET_SHOW_MODAL_ADD_FRIEND:
            return {
                ...state,
                showModalAddFriend: true
            }
        case modalActions.SET_HIDE_MODAL_ADD_FRIEND:
            return {
                ...state,
                showModalAddFriend: false
            }
        case modalActions.SET_SHOW_MODAL_INFO:
            return {
                ...state,
                showModalInfo: true
            }
        case modalActions.SET_HIDE_MODAL_INFO:
            return {
                ...state,
                showModalInfo: false
            }
        case modalActions.SET_SHOW_MODAL_UPDATE_INFO:
            return {
                ...state,
                showModalUpdateInfo: true
            }
        case modalActions.SET_HIDE_MODAL_UPDATE_INFO:
            return {
                ...state,
                showModalUpdateInfo: false
            }
        default:
            return state
    }
}

export default reducer