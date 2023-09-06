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
        case conversationActions.SEND_NEW_MESSAGE:
            let copyConversation = [...state.conversations]
            let newConversation = action.newConversation
            for (let index in copyConversation) {
                if (copyConversation[index]._id === newConversation._id) {
                    copyConversation[index] = newConversation
                }
            }
            return {
                ...state,
                conversations: copyConversation
            }
        case conversationActions.SET_STATUS_WATCHED_FOR_MESSAGES:
            var { senderId, receiverId, conversationId } = action
            var conversationsCopy = [...state.conversations]
            for (let index in conversationsCopy) {
                if (conversationsCopy[index]._id === conversationId) {
                    for (let i in conversationsCopy[index].messages) {
                        let message = conversationsCopy[index].messages[i]
                        if (message.senderId === senderId && message.receiverId === receiverId) {
                            if (message.status == 1 || message.status == 0 || message.status == 2) {
                                conversationsCopy[index].messages[i].status = 3
                            }
                        }
                    }
                }
            }
            return {
                ...state,
                conversations: conversationsCopy
            }
        case conversationActions.SET_STATUS_SENT_FOR_MESSAGES:
            var { senderId, receiverId, conversationId } = action
            var conversationsCopy = [...state.conversations]
            for (let index in conversationsCopy) {
                if (conversationsCopy[index]._id === conversationId) {
                    for (let i in conversationsCopy[index].messages) {
                        let message = conversationsCopy[index].messages[i]
                        if (message.senderId === senderId && message.receiverId === receiverId) {
                            if (message.status == 0) {
                                conversationsCopy[index].messages[i].status = 1
                            }
                        }
                    }
                }
            }
            return {
                ...state,
                conversations: conversationsCopy
            }
        case conversationActions.SET_STATUS_RECEIVED_FOR_MESSAGES:
            var { senderId, receiverId, conversationId } = action
            var conversationsCopy = [...state.conversations]
            for (let index in conversationsCopy) {
                if (conversationsCopy[index]._id === conversationId) {
                    for (let i in conversationsCopy[index].messages) {
                        let message = conversationsCopy[index].messages[i]
                        if (message.senderId === senderId && message.receiverId === receiverId) {
                            if (message.status == 1 || message.status == 0) {
                                conversationsCopy[index].messages[i].status = 2
                            }
                        }
                    }
                }
            }
            return {
                ...state,
                conversations: conversationsCopy
            }
        default:
            return state
    }
}

export default reducer