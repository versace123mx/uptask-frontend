import api from "@/lib/axios"
import { isAxiosError } from "axios"
import { Project, TeamMember, TeamMemberForm, teamMembersSchema } from "../types"

export const findUserByEmail = async ( {projectId, formData} : {projectId:Project['_id'], formData: TeamMemberForm}) => {
    try {
        const { data } = await api.post(`/project/${projectId}/team/find`, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export const addUserToProject = async ( {projectId, id} : {projectId:Project['_id'], id: TeamMember['_id']}) => {
    try {
        const { data } = await api.post<string>(`/project/${projectId}/team`, {id})
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export const getProjectTeam = async ( projectId:Project['_id'] ) => {
    try {
        const { data } = await api(`/project/${projectId}/team`)
        const response = teamMembersSchema.safeParse(data)
        if(response.success){
            return response.data
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export const removeUserFromProject = async ( {projectId, id} : {projectId:Project['_id'], id: TeamMember['_id']} ) => {
    try {
        const { data } = await api.delete<string>(`/project/${projectId}/team/${id}`)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}