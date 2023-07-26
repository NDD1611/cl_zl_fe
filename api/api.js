
import axios from './axios'
import { logout } from '../utils/auth'

const register = async (data) => {
    try {
        let response = await axios.post('/auth/register', data)
        return response
    } catch (exception) {
        return {
            err: true,
            exception
        }
    }
}

const login = async (data) => {
    try {
        let response = await axios.post('/auth/login', data)
        return response
    } catch (exception) {
        return {
            err: true,
            exception
        }
    }
}

const refreshToken = async (data) => {
    try {
        let response = await axios.post('/auth/refresh-token', data)
        return response
    } catch (exception) {
        return {
            err: true,
            exception
        }
    }
}



//secure router
const uploadAvatar = async (data) => {
    try {
        let response = await axios.post('/user/upload-avatar', data)
        return response
    } catch (exception) {
        checkErr(exception)
        return {
            err: true,
            exception
        }
    }
}

const updateUserInfo = async (data) => {
    try {
        let response = await axios.post('/user/update-info', data)
        return response
    } catch (exception) {
        checkErr(exception)
        return {
            err: true,
            exception
        }
    }
}

const friendInvitation = async (data) => {
    try {
        let response = await axios.post('/friend/friend-invitation', data)
        return response
    } catch (exception) {
        checkErr(exception)
        return {
            err: true,
            exception
        }
    }
}
const rejectInvitation = async (data) => {
    try {
        let response = await axios.post('/friend/reject-invitation', data)
        return response
    } catch (exception) {
        checkErr(exception)
        return {
            err: true,
            exception
        }
    }
}
const acceptInvitation = async (data) => {
    try {
        let response = await axios.post('/friend/accept-invitation', data)
        return response
    } catch (exception) {
        checkErr(exception)
        return {
            err: true,
            exception
        }
    }
}

const checkErr = (exception) => {
    const errCode = exception?.response?.status
    if (errCode === 401 || errCode === 403) {
        logout()
    }
}

export default {
    register, login, refreshToken,
    uploadAvatar, updateUserInfo,
    friendInvitation, rejectInvitation, acceptInvitation
}

