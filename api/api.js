
import axios from './axios'

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

export default {
    register,
    login,
    refreshToken
}

