import fetchApi from './api.config'
import { FETCH_PROFILE_INFO_URL, UPDATE_PROFILE_INFO_URL, VALIDATE_PASSWORD_URL, UPDATE_PASSWORD_URL } from './apiUrls'

export const apiGetInfo = async (config) => {
    return fetchApi.get(FETCH_PROFILE_INFO_URL, config)
}
export const apiUpdateInfo = async (payload) => {
    return fetchApi.post(UPDATE_PROFILE_INFO_URL, payload )
}

export const apiValidatePassword = async (payload) => {
    return fetchApi.post(VALIDATE_PASSWORD_URL, payload )
}

export const apiUpdatePassword = async (payload) => {
    return fetchApi.post(UPDATE_PASSWORD_URL, payload)
}