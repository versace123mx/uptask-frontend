import { getProjectById } from "@/api/ProjectAPI"
import EditProjectForm from "@/components/projects/EditProjectForm"
import { useQuery } from "@tanstack/react-query"
import { Navigate, useParams } from "react-router-dom"

const EditProjectView = () => {

    const params = useParams()
    const projectId = params.projectsId!

    //se utiliza queryFn: () => getProjectById, un callback () => por que se le pasa un parametro
    const { data, isError, isLoading } = useQuery({
        queryKey: ['editProject',projectId],
        queryFn: () => getProjectById(projectId)
    })

    if(isLoading) return 'Cargando.....'
    if(isError) return <Navigate to='/404' />
    if(data) return <EditProjectForm data={data} projectId={projectId}/>


}

export default EditProjectView
