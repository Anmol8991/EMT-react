import fetchApi from './api.config'
import { CLOCK_EVENTS_URL, GET_TIME_URL, GET_CLOCK_STATUS_URL, GET_ATTENDANCE_URL, REGULARIZE_URL, REQUESTED_REGULARIZE_URL, UPDATE_REGULARIZE_URL, DELETE_REGULARIZE_URL, GET_AVAILABLE_LEAVE_URL, AVAILABLE_LEAVE_URL, APPLY_LEAVE_URL, REQUESTED_LEAVE_URL, UPDATE_LEAVE_URL, 
    DELETE_LEAVE_URL } from './apiUrls'

export const apiGetClockStatus = async (config) => {
    return fetchApi.get(GET_CLOCK_STATUS_URL, config)
}

export const apiGetTime = async (config) => {
    return fetchApi.get(GET_TIME_URL, config)
}
export const apiClockEvents = async (payload) => {
    return fetchApi.post(CLOCK_EVENTS_URL, payload )
}
export const apiGetAttendance = async (config) => {
    return fetchApi.get(GET_ATTENDANCE_URL, config)
}
export const apiGetAvailableLeaves = async (config) => {
    return fetchApi.get(GET_AVAILABLE_LEAVE_URL, config)
}
export const apiRegularize = async (payload) => {
    return fetchApi.post(REGULARIZE_URL, payload )
}
export const apiRequestedRegularized = async (config) => {
    return fetchApi.get(REQUESTED_REGULARIZE_URL, config )
}
export const apiUpdateRegularize = async (payload) => {
    return fetchApi.post(UPDATE_REGULARIZE_URL, payload )
}
export const apiDeleteRegularize = async (payload) => {
    return fetchApi.post(DELETE_REGULARIZE_URL, payload )
}
export const apiAvailableLeaves = async (payload) => {
    return fetchApi.post(AVAILABLE_LEAVE_URL, payload )
}
export const apiApplyLeave = async (payload) => {
    return fetchApi.post(APPLY_LEAVE_URL, payload )
}

export const apiGetLeaves = async (config) => {
    return fetchApi.get(REQUESTED_LEAVE_URL, config )
}
export const apiUpdateLeaves = async (payload) => {
    return fetchApi.post(UPDATE_LEAVE_URL, payload )
}
export const apiDeleteLeaves = async (payload) => {
    return fetchApi.post(DELETE_LEAVE_URL, payload )
}