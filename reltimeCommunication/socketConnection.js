import { io } from 'socket.io-client'
import { logout } from '../utils/auth'
import store from '../redux/store'
import { authActions } from '../redux/actions/authAction'
import { friendActions } from '../redux/actions/friendAction'
import { conversationActions } from '../redux/actions/conversationAction'

export let socket = null
export const socketConnectToServer = (userDetails) => {
    socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
        auth: {
            token: userDetails.token,
            userDetails: userDetails
        }
    })
    console.log('connect socket server')
    socket.on('connect', () => {
        console.log(socket.id)
    })
    socket.on("connect_error", async (err) => {
        if (err.message === 'TokenExpire') {
            logout()
        } else if (err.message !== 'UserConnected') {
            // alert('Vui lòng đăng nhập lại.')
            logout()
        }
    })
    socket.on('update-friend-invitation', (data) => {
        const { pendingInvitations } = data
        store.dispatch({
            type: friendActions.SET_PENDING_INVITATION,
            pendingInvitations: pendingInvitations
        })
    })
    socket.on('update-conversation', (data) => {
        const { conversations } = data
        store.dispatch({
            type: conversationActions.SET_CONVERSATION,
            conversations: conversations
        })
    })
    socket.on('update-list-friend', (data) => {
        const { listFriends } = data
        store.dispatch({
            type: friendActions.SET_LIST_FRIEND,
            listFriends: listFriends
        })
    })
    socket.on('update-watched-status-message-in-redux-store', (data) => {
        const { senderId, receiverId, conversationId } = data
        store.dispatch({
            type: conversationActions.SET_STATUS_WATCHED_FOR_MESSAGES,
            senderId,
            receiverId,
            conversationId
        })
    })
    socket.on('update-sent-status-message-in-redux-store', (data) => {
        const { senderId, receiverId, conversationId } = data
        store.dispatch({
            type: conversationActions.SET_STATUS_SENT_FOR_MESSAGES,
            senderId,
            receiverId,
            conversationId
        })
    })
    socket.on('update-received-status-message-in-redux-store', (data) => {
        const { senderId, receiverId, conversationId } = data
        store.dispatch({
            type: conversationActions.SET_STATUS_RECEIVED_FOR_MESSAGES,
            senderId,
            receiverId,
            conversationId
        })
    })
    socket.on('all-active-user', (data) => {
        const { activeUsers } = data
        store.dispatch({
            type: authActions.SET_ACTIVE_USER,
            activeUsers: activeUsers
        })
    })
}

export const sendMessage = (data) => {
    socket.emit('send-message', data)
}

export const updateStatusMessage = ({ receiverId, senderId, conversationId }) => {
    socket.emit('message-watched', {
        receiverId,
        senderId,
        conversationId
    })
}
export const updateReceivedMessageStatus = ({ receiverId, senderId, conversationId }) => {
    socket.emit('message-received', {
        receiverId,
        senderId,
        conversationId
    })
}