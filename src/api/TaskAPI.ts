import api from "@/lib/axios"
import { isAxiosError } from "axios"
import { Project, Task, TaskFormData, taskShema } from "../types"

//Este es un type generico para las tareas
type TaskAPI = {
    formData: TaskFormData
    projectId: Project['_id']
    taskId: Task['_id']
    status:Task['status']
}

//Como el type es generico con Pick solo obtenemos lo que requerimos de los types
export const createTask = async ({ formData, projectId }: Pick<TaskAPI, 'formData' | 'projectId'>) => {
    try {
        const { data } = await api.post<string>(`/project/${projectId}/task`, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

//Como el type es generico con Pick solo obtenemos lo que requerimos de los types
export const getTaskById = async ({ projectId, taskId }:Pick<TaskAPI,'projectId'| 'taskId'>) => {

    try {
        const { data } = await api(`/project/${projectId}/task/${taskId}`)
        const response = taskShema.safeParse(data)
        if(response.success){
            return response.data
        }
        //return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }

}


export const updateTask = async ({ projectId, taskId, formData }: Pick<TaskAPI, 'projectId' | 'taskId' | 'formData'>) => {
    try {
        const { data } = await api.put<string>(`/project/${projectId}/task/${taskId}`, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}


export const deliteTask = async ({ projectId, taskId }: Pick<TaskAPI, 'projectId' | 'taskId'>) => {
    try {

        const { data } = await api.delete<string>(`/project/${projectId}/task/${taskId}`)
        return data

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export const updateStatus = async ({ projectId, taskId, status }: Pick<TaskAPI, 'projectId' | 'taskId' | 'status'>) => {
    try {

        const { data } = await api.post<string>(`/project/${projectId}/task/${taskId}/status`,{status})
        return data

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}