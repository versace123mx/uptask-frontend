import { Fragment, useEffect } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getTaskById, updateStatus } from '@/api/TaskAPI';
import { toast } from 'react-toastify';
import { formatDate } from '@/utils/utils';
import { statusTranslations } from '@/locales/es';
import { TaskStatus } from '@/types/index';
import NotesPanel from '../notes/NotesPanel';


export default function TaskModalDetails() {

    const navigate = useNavigate()//este es para navegar ir de una pagina a otra


    /********************************************************/
    /*url original http://localhost:5173/projects/67ca070036638cc75986331f*/
    /** url despus de darle click al boton de ver tarea 
     * http://localhost:5173/projects/67ca070036638cc75986331f?viewTask=67cb15dc9b45d3916f063774
     * useLocation devuelve muchos datos entre ellos search location.search
     * con URLSearchParams obtenemos lo que trae location.search que en este caso seria (search: "?viewTask=67cb15dc9b45d3916f063774") cuando se le dio click al boton de ver tarea, de lo contrario el valor seria (search:null)
     * con queryParams.get('viewTask') extrae el valor que tiene viewTask que su valor en este caso cuando se le dio click al boton de ver tarea, el valor seria 67cb15dc9b45d3916f063774
     * y en show se guarda el valor de true o false dependiendo si esta o no viewTask
    */
    const location = useLocation()//devuelve la url actual y otros datos
    const queryParams = new URLSearchParams(location.search)//extra lo que hay en location.search, si hay algo lo muestra, de lo contrario dice que es 0
    const taskId = queryParams.get('viewTask')!//extrae el valor de viewTask que biene de queryParams y asu vez de location
    const show = taskId ? true : false //la variable show va tener el valor de true o false, para mostrar o ocultar el pop-up 

    //la url http://localhost:5173/projects/67ca070036638cc75986331f
    //obtenemos los parametros pasados por la url
    //params devuelve projectsId: "67ca070036638cc75986331f" donde projectsId es el id que recibe en la ruta eso se puede ver en el router.tsx y el numero es el valor de projectsId
    const params = useParams()
    const projectId = params.projectsId!
    /******************************************************* */


    //cada queryKey tiene que tener un identificador para saber que project es
    //se utiliza queryFn: () => getProjectById, un callback () => por que se le pasa un parametro, en caso de pasarle mas de 1 parametro hay que hacerlo como objeto
    //mas de un parametro queryFn: () => getProjectById({param1,param2})
    //useQuery se utiliza para obtener datos un get
    //con enabled: !!taskId le dice si taskId tiene datos entonces es true y le dice que se ejecute useQuery, de lo contrario no hace nada
    //retry:false sirve para que no haga peticiones intentando encontrar el recurso en caso de que este no exita, si no que la respuesta sea inmediata
    const { data, isError, error, isLoading } = useQuery({
        queryKey: ['task', taskId],
        queryFn: () => getTaskById({ projectId, taskId }),
        enabled: !!taskId, //esta consulta solo se lanzara si task id tiene un valor, con esto evitamos que marque un error, ya que este componente se renderiza desde ProjectDetailsView.tsx y siempre esta activo ya que no hay una condicion previa que evite que se renderice
        retry: false
    })


    //con esto estamos asiendo que si alguien cambia la url de la tarea buscada, y hace refresh, entonces detectamos el error, mandamos el mensaje con el toast y redireccionamo a la url previa
    useEffect(() => {
        if (isError) {
            toast.error(error.message, { toastId: "error" })
            navigate(`/projects/${projectId}`)
        }
    }, [isError])



    //Aqui aplicaremos la mutacion para el cambio de estatus desde el select
    //Para refrescar los datos y traiga dotos nuevos
    const queryClient = useQueryClient()

    //Agregando la mutacion de @tanstack/react-query, que es la que se conecta con la funcion que hace la peticion via axios
    const { mutate } = useMutation({
        mutationFn: updateStatus,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({ queryKey: ['project', projectId] })
            queryClient.invalidateQueries({ queryKey: ['task', taskId] }); // Invalida la consulta del modal
        }
    })

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const status = e.target.value as TaskStatus
        const data = { projectId, taskId, status }

        mutate(data)
    }



    if (isLoading) return 'Cargando.....'

    if (data) return (
        <>
            <Transition appear show={show} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => navigate(location.pathname, { replace: true })}>
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60" />
                    </TransitionChild>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                                    <p className='text-sm text-slate-400'>Agregada el: {formatDate(data.createdAt)}</p>
                                    <p className='text-sm text-slate-400'>Última actualización: {formatDate(data.updatedAt)}</p>
                                    <DialogTitle
                                        as="h3"
                                        className="font-black text-4xl text-slate-600 my-5"
                                    >
                                        {data.name}
                                    </DialogTitle>
                                    <p className='text-lg text-slate-500 mb-2'>Descripción:{data.description}</p>

                                    {data.completeBy.length >= 1 && (

                                    <>
                                    <p className='text-lg text-slate-500 mb-2'>Historial de Cambios</p>
                                    <ul className=' list-decimal text-sm ml-3.5'>
                                        {data.completeBy.map(activityLog => (

                                            <li key={activityLog._id}>
                                                <span className='font-bold text-slate-600'>
                                                    {statusTranslations[activityLog.status]}
                                                </span>
                                                {' '} - {' '}
                                                {activityLog.user.name}
                                            </li>

                                        ))}
                                    </ul>
                                    </>
                                    )}


                                    <div className='my-5 space-y-3'>
                                        <label className='font-bold'>Estado Actual:</label>
                                        <select
                                            className='w-full p-3 bg-white border border-gray-300'
                                            defaultValue={data.status}
                                            onChange={handleChange}
                                        >
                                            {Object.entries(statusTranslations).map(([key, value]) => (
                                                <option value={key} key={key}>{value}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <NotesPanel 
                                        notes={data.notes}
                                    />

                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}
