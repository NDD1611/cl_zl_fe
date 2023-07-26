
import { io } from 'socket.io-client'
import { logout } from '../utils/auth'
import api from '../api/api'
import store from '../redux/store'
import { authActions } from '../redux/actions/authAction'
import { friendActions } from '../redux/actions/friendAction'
import { conversationActions } from '../redux/actions/conversationAction'

let socket = null
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
        // console.log(err.message)
        if (err.message === 'TokenExpire') {
            // console.log('refresh token')
            const userDetails = JSON.parse(localStorage.getItem('userDetails'))
            const response = await api.refreshToken({ userDetails })
            console.log(response)
            localStorage.setItem('userDetails', JSON.stringify(response.data))
            store.dispatch({
                type: authActions.SET_USER_DETAIL,
                userDetails: response.data
            })
            socketConnectToServer(userDetails)
        } else if (err.message !== 'UserConnected') {
            // alert('Vui lòng đăng nhập lại.')
            logout()
        }
        // else if (err.message === 'UserConnected') {
        //     alert('Bạn đã đăng nhập ở một nơi khác')
        //     logout()
        // }
    });

    socket.on('update-friend-invitation', (data) => {
        console.log('update invitation')
        const { pendingInvitations } = data
        store.dispatch({
            type: friendActions.SET_PENDING_INVITATION,
            pendingInvitations: pendingInvitations
        })
    })

    socket.on('update-conversation', (data) => {
        console.log('update conversation', data)
        const { conversations } = data
        store.dispatch({
            type: conversationActions.SET_CONVERSATION,
            conversations: conversations
        })
    })
}

export const sendMessage = (data) => {
    console.log(data, '=====')
    socket.emit('send-message', data)
}