import api from "@/lib/axios"
import { isAxiosError } from "axios"
import { Note, NoteFormData, Project, Task } from "../types"

type NoteAPIType = {
    formData:NoteFormData
    projectId:Project['_id']
    taskId:Task['_id']
    noteId:Note['_id']
}

export const creeateNote = async ( {formData,projectId, taskId} : Pick<NoteAPIType,'formData' | 'projectId' | 'taskId'> ) => {
    try {
        const { data } = await api.post<string>(`/project/${projectId}/task/${taskId}/notes`,formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export const deleteNote = async ( {projectId, taskId, noteId} : Pick<NoteAPIType,'projectId' | 'taskId' | 'noteId'> ) => {
    try {
        const { data } = await api.delete<string>(`/project/${projectId}/task/${taskId}/notes/${noteId}`)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error) 
        }
    }
}