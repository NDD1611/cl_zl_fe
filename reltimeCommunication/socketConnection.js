
import { io } from 'socket.io-client'
import { logout } from '../utils/auth'
import api from '../api/api'
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
            // const userDetails = JSON.parse(localStorage.getItem('userDetails'))
            // const response = await api.refreshToken({ userDetails })
            // localStorage.setItem('userDetails', JSON.stringify(response.data))
            // store.dispatch({
            //     type: authActions.SET_USER_DETAIL,
            //     userDetails: response.data
            // })
            // socketConnectToServer(userDetails)
        } else if (err.message !== 'UserConnected') {
            // alert('Vui lòng đăng nhập lại.')
            logout()
        }
    });

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
}

export const sendMessage = (data) => {
    socket.emit('send-message', data)
}