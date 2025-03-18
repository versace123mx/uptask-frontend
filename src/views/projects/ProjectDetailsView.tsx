import { getProjectById } from "@/api/ProjectAPI"
import AddTaskModal from "@/components/tasks/AddTaskModal"
import EditTaskData from "@/components/tasks/EditTaskData"
import TaskList from "@/components/tasks/TaskList"
import TaskModalDetails from "@/components/tasks/TaskModalDetails"
import { useAuth } from "@/hooks/useAuth"
import { isManager } from "@/utils/polices"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"

const ProjectDetailsView = () => {

    const navigate = useNavigate()

    //para hacer la validacion del usuario y del team dependiendo sus acciones aqui hayq ue traer el user que esta logeado
    //este custom hook hace la peticion al api y verifica si esta logueado, si no esta logueado redireccionamos al login
    //se coloca aqui por que esta es la pagina raiz, por que aqui tenemos el outle y aqui se renderiza lo de cualquier otra pagina
    //con esto aseguramos que si no hay datos no cargamos nada y redireccionamos a login
    const { data: user, isLoading: authLoading } = useAuth()

    //obtenemos los parametros pasados por la url
    const params = useParams()
    const projectId = params.projectsId!

    //cada queryKey tiene que tener un identificador para saber que project es
    //se utiliza queryFn: () => getProjectById, un callback () => por que se le pasa un parametro, en caso de pasarle mas de 1 parametro hay que hacerlo como objeto
    //mas de un parametro queryFn: () => getProjectById({param1,param2})
    //useQuery se utiliza para obtener datos un get
    const { data, isError, isLoading } = useQuery({
        queryKey: ['project', projectId],
        queryFn: () => getProjectById(projectId),
        retry: false
    })

    /*verificamos si es el manager para poder editar y eliminar
    *data?.manager biene de useQuery y user?._id biene de useAuth
    */
    const canEdit = useMemo(() => data?.manger === user?._id,[data,user])


    if (isLoading && authLoading) return 'Cargando.....'
    if (isError) return <Navigate to='/404' />
    if (data && user) return (
        <>
            <h1 className="text-5xl font-black">{data.projectName}</h1>
            <p className="text-2xl font-light text-gray-500 mt-5">{data.description}</p>

            { isManager(data.manger, user._id) && (
                <nav className="my-5 flex gap-3">
                    <button
                        className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
                        onClick={() => navigate(location.pathname + '?newTask=true')}
                    >
                        Agregar Tarea
                    </button>
                    <Link
                        to={'team'}
                        className="bg-fuchsia-600 hover:bg-fuchsia-700 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
                    >
                        Colaboradores
                    </Link>
                </nav>
            )}


            <TaskList
                tasks={data.task}
                canEdit={canEdit}
            />
            <AddTaskModal />
            <EditTaskData />
            <TaskModalDetails />
        </>
    )

}

export default ProjectDetailsView
