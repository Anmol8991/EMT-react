import fetchApi from './api.config'
import { LOGIN_URL, GOOGLE_LOGIN_URL, LOGOUT_URL } from './apiUrls'

export const apiLogin = async (credentials) => {
    return fetchApi.post(LOGIN_URL, credentials )
}
export const apiGoogleLogin = async (credentials) => {
    return fetchApi.post(GOOGLE_LOGIN_URL, credentials )
}

export const apiLogout = async () => {
    return fetchApi.post(LOGOUT_URL)
}

export const apiForgotPassword = async (payload) => {
    const config= {
        contentType: 'formdata',
    }
    return fetchApi.post('/forget-password', payload, config)
}