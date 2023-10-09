
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

const refreshToken = async (userDetails) => {
    try {
        let response = await axios.post('/auth/refresh-token', { userDetails: userDetails })
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
        let response = await axios.post('/file/upload-avatar', data)
        return response
    } catch (exception) {
        checkErr(exception)
        return {
            err: true,
            exception
        }
    }
}

const uploadImageMessage = async (data) => {
    try {
        let response = await axios.post('/file/upload-image-message', data)
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
const findFriend = async (data) => {
    try {
        let response = await axios.post('/friend/find', data)
        return response
    } catch (exception) {
        checkErr(exception)
        return {
            err: true,
            exception
        }
    }
}

const deleteFriend = async (data) => {
    try {
        let response = await axios.post('/friend/delete', data)
        return response
    } catch (exception) {
        checkErr(exception)
        return {
            err: true,
            exception
        }
    }
}

let createNewConversation = async (data) => {
    try {
        let response = await axios.post('/conversation/create', data)
        return response
    } catch (exception) {
        checkErr(exception)
        return {
            err: true,
            exception
        }
    }
}

let uploadFile = async (data) => {
    try {
        let response = await axios.post('/file/upload-file-message', data)
        return response
    } catch (exception) {
        checkErr(exception)
        return {
            err: true,
            exception
        }
    }
}

let downLoadFile = async (data) => {
    try {
        let response = await axios.post('/file/download', data, {
            headers: {
                responseType: 'arraybuffer'
            }
        })
        return response
    } catch (exception) {
        checkErr(exception)
        return {
            err: true,
            exception
        }
    }
}

export default {
    register, login, refreshToken, uploadFile,
    uploadAvatar, updateUserInfo, uploadImageMessage,
    friendInvitation, rejectInvitation, acceptInvitation,
    findFriend, deleteFriend, createNewConversation, downLoadFile
}

