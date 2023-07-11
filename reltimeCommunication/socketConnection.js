
import { io } from 'socket.io-client'
import { logout } from '../utils/auth'
import api from '../api/api'
import store from '../redux/store'
import { authActions } from '../redux/actions/authAction'

export const socketConnectToServer = (userDetails) => {
    const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
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
            console.log('refresh token')
            const userDetails = JSON.parse(localStorage.getItem('userDetails'))
            const response = await api.refreshToken({ userDetails })
            localStorage.setItem('userDetails', JSON.stringify(response.data))
            store.dispatch({
                type: authActions.SET_USER_DETAIL,
                userDetails: response.data
            })
            socketConnectToServer(userDetails)
        } else {
            alert('Có lỗi xảy ra. Vui lòng đăng nhập lại.')
            logout()
        }
    });
}