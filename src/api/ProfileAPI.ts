import api from "@/lib/axios"
import { isAxiosError } from "axios"
import { UpdateCurrentPasswordForm, UserProfileForm } from "../types"


export const updateProfile = async (formData : UserProfileForm ) => {
    try {
        const { data } = await api.put<string>(`/auth/profile`,formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error) 
        }
    }
}

export const changePassword = async (formData : UpdateCurrentPasswordForm ) => {
    try {
        const { data } = await api.put<string>(`/auth/update-password`,formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error) 
        }
    }
}