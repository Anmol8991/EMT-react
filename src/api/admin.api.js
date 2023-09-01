import fetchApi from './api.config'
import { ALL_EMPLOYEES_URL, EMPLOYEES_ACTIVE_TODAY_URL, EMPLOYEE_INFO_URL, UPDATE_EMPLOYEE_INFO_URL, DELETE_EMPLOYEE_URL, ROLES_URL, STATUS_URL, DESIGNATION_URL, ADD_EMPLOYEE_URL, ADMIN_REQUESTED_REGULARIZE_URL, ADMIN_UPDATE_REGULARIZE_URL, ADMIN_REQUESTED_LEAVE_URL, ADMIN_UPDATE_LEAVE_URL, SETTINGS_URL, UPDATE_SETTINGS_URL  } from './apiUrls'

export const apiGetEmployees = async (config) => {
    return fetchApi.get(ALL_EMPLOYEES_URL, config)
}
export const apiGetActiveEmployees = async (config) => {
    return fetchApi.get(EMPLOYEES_ACTIVE_TODAY_URL, config)
}
export const apiGetEmployeeInfo = async (payload, config) => {
    return fetchApi.post(EMPLOYEE_INFO_URL, payload, config)
}
export const apiUpdateEmployeeInfo = async (payload) => {
    return fetchApi.post(UPDATE_EMPLOYEE_INFO_URL, payload)
}
export const apiDeleteEmployee = async (payload) => {
    return fetchApi.post(DELETE_EMPLOYEE_URL, payload)
}
export const apiRoles = async (config) => {
    return fetchApi.get(ROLES_URL, config)
}

export const apiStatus = async (config) => {
    return fetchApi.get(STATUS_URL, config)
}

export const apiDesignation = async (config) => {
    return fetchApi.get(DESIGNATION_URL, config)
}

export const apiAddEmployee = async (payload) => {
    return fetchApi.post(ADD_EMPLOYEE_URL, payload)
}
export const apiRequestedRegularized = async (payload) => {
    return fetchApi.post(ADMIN_REQUESTED_REGULARIZE_URL, payload )
}
export const apiUpdateRegularize = async (payload) => {
    return fetchApi.put(ADMIN_UPDATE_REGULARIZE_URL, payload )
}
export const apiRequestedLeave = async (payload) => {
    return fetchApi.post(ADMIN_REQUESTED_LEAVE_URL, payload )
}
export const apiUpdateLeave = async (payload) => {
    return fetchApi.put(ADMIN_UPDATE_LEAVE_URL, payload )
}

export const apiSettings = async (config) => {
    return fetchApi.get(SETTINGS_URL, config)
}

export const apiUpdateSettings = async (payload) => {
    return fetchApi.put(UPDATE_SETTINGS_URL, payload)
}