import api from "@/lib/axios"
import { isAxiosError } from "axios"
import { ConfirmToken, ForgotPasswordForm, RequestConfirmationCodeForm, UserLoginForm, UserRegistrationForm, NewPasswordForm, userSchema } from "../types"


export const createAccount = async (formData: UserRegistrationForm) => {
    try {
        const { data } = await api.post<string>('/auth/create-account', formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export const confirmAccount = async (formData: ConfirmToken) => {
    try {
        const { data } = await api.post<string>('/auth/confirm-account', formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export const requestConfirmationCode = async (formData: RequestConfirmationCodeForm) => {
    try {
        const { data } = await api.post<string>('/auth/request-code', formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export const authenticateUser = async (formData: UserLoginForm) => {
    try {
        const { data } = await api.post<string>('/auth/login', formData)
        localStorage.setItem('AUTH_TOKEN',data)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export const forgetPassword = async (formData: ForgotPasswordForm) => {
    try {
        const { data } = await api.post<string>('/auth/forgot-password', formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export const validateToken = async (formData: ConfirmToken) => {
    try {
        const { data } = await api.post<string>('/auth/validate-token', formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export const updatePasswordWithToken = async ({ formData, token }: {formData:NewPasswordForm, token:ConfirmToken['token']}) => {
    try {
        const { data } = await api.put<string>(`/auth/update-password/${token}`, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export const getUser = async () => {
    try {
        const { data } = await api(`/auth/user`)
        const response = userSchema.safeParse(data)
        if(response.success){
            return response.data
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}