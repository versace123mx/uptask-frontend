import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

/**
 * Utilizamos un interceptor para evitar estar poniendo siempre la cabecera de autorizacion en todas
 * las peticiones al API, asi evitamos colocar mucho codigo repetido
 * Nuestra peticion siempre tiene que llebar header autorization
 * const Auth = localStorage.getItem('AUTH_TOKEN')
        const { data } = await api('/project',{
            headers:{
                'Authorization': `Bearer ${Auth}`
            }
        })
    con el interceptor evitamos hacer sipre esto en nuestro endpoint o peticion al api
 */

    api.interceptors.request.use( config => {
        const Auth = localStorage.getItem('AUTH_TOKEN')
        if(Auth){
            config.headers.Authorization = `Bearer ${Auth}`
        } 
        return config
    })

export default api