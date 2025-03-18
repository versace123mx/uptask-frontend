import { getTaskById } from "@/api/TaskAPI"
import { useQuery } from "@tanstack/react-query"
import { Navigate, useLocation, useParams } from "react-router-dom"
import EditTaskModal from "./EditTaskModal"

const EditTaskData = () => {

    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const taskId = queryParams.get('editTask')!


    const params = useParams()
    const projectId = params.projectsId!

    //query de proyectos, query se utiliza para obtener datos en @tanstack/react-query y este llama a la funcion getTaskById que hace un llamado al API
    //como la funcion getTaskById requiere parametros entonces lo pasamos de la siguiente forma queryFn: () => getTaskById({projectId,taskId})
    //cuando se le padan mas de 1 parametro en las funciones de useQuery se tienen que pasar como objeto
    //con enabled: !!taskId le dice si taskId tiene datos entonces es true y le dice que se ejecute useQuery, de lo contrario no hace nada
    const { data, isError } = useQuery({
        queryKey: ['task', taskId],
        queryFn: () => getTaskById({ projectId, taskId }),
        enabled: !!taskId
    })


    if (isError) return <Navigate to={'/404'} />
    if (data) return <EditTaskModal data={data} />
}

export default EditTaskData
