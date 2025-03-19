import api from "@/lib/axios"
import { dashboardProjectSchema, editProjectSchema, Project, ProjectFormData, projectSchema } from "../types"
import { isAxiosError } from "axios"

//ya solo se manda a llamar a api por que esa constante ya llama a axios en la carpeta lib

//data es lo que siempre devuelve axios

/**
 * Implementando JWT para a autentificacion requerimos pasar la autorizacion en una cabecera como
 * const Auth = localStorage.getItem('AUTH_TOKEN')
        const { data } = await api('/project',{
            headers:{
                'Authorization': `Bearer ${Auth}`
            }
        })
 * donde extraemos lo que esta en localstorage y luego lo mandamos en el header de la peticion
    esto lo tenemos que hacer en todas las peticiones que hagamos al api, ya que nuestra api
    tiene seguridad con la parte del JWT, para evitar estar duplicando codigo y estas colocando
    en todos los endpoint la configuracion antes mencionada, utilizamos interceptors que esto
    son una especie de capa antes donde en la configuracion agregamos la parte de codigo
    que se encarga de tomar el token y luego pasarlo en la cabecera, entonces el interceptor hace esto
    se le pasa una sola vez y el ya se encarga de procesarlo siempre que se haga una peticion al API.
    Con esto ya nos evitamos de estar duplicando demaciado codigo.

    A un que en nuestro codigo en este archivo no veamos esa configuracion de cabeceras si vamos al
    archivo de lib/axios.ts donde tenemos nuestra configuracion ahi agregamos la configuracion del
    interceptor que extiende del objeto api que se creo en ese archivo y hace uso de axios.
 * 
 */
export const createProject = async (formData:ProjectFormData) => {
    try {
        const { data } = await api.post('/project',formData)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export const getProjects = async () => {
    try {
        const { data } = await api('/project')
        const response = dashboardProjectSchema.safeParse(data) //se valida los datos que nos regrega el API
        if(response.success){
            return response.data
        }
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export const getProjectById = async (id:Project['_id']) => {
    try {
        const { data } = await api(`/project/${id}`)
        const response = editProjectSchema.safeParse(data)
        if(response.success){
            return response.data
        }

    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export const getFullProject = async (id:Project['_id']) => {
    try {
        const { data } = await api(`/project/${id}`)
        const response = projectSchema.safeParse(data)
        if(response.success){
            console.log(response.data)
            return response.data
        }

    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}


type ProjectAPIType = {
    formData:ProjectFormData,
    projectId:Project['_id']
}
export const updateProject = async ({ formData,projectId }:ProjectAPIType) => {
    try {
        const { data } = await api.put<string>(`/project/${projectId}`,formData)
        return data

    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}


export const deleteProject = async (id:Project['_id']) => {
    try {
        const { data } = await api.delete<string>(`/project/${id}`)
        return data

    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}