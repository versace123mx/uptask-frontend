import { Fragment } from 'react';
import { Dialog, DialogTitle, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { Task, TaskFormData } from '@/types/index';
import { useForm } from 'react-hook-form';
import TaskForm from './TaskForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask } from '@/api/TaskAPI';
import { toast } from 'react-toastify';


type EditTaskModalProps = {
    data: Task
}

export default function EditTaskModal({ data }: EditTaskModalProps) {

    //console.log(data)

    const navigate = useNavigate()//este es para navegar ir de una pagina a otra



    /********************************************************/
    //la url http://localhost:5173/projects/67ca070036638cc75986331f
    //obtenemos los parametros pasados por la url
    //params devuelve projectsId: "67ca070036638cc75986331f" donde projectsId es el id que recibe en la ruta eso se puede ver en el router.tsx y el numero es el valor de projectsId
    const params = useParams()
    const projectId = params.projectsId!
    /******************************************************* */


    /**
     * Aqui no se utilizo la forma de obtener los parametros por la url como se tubo que hacer con el modal de AddTaskModal.tsx
     * donde show={true} le tuvimos que pasar una variable para que abriera o no el model y en base a ese estado se abria o cerraba.
     * por que aqui no se hizo de la misma forma. pues por que en el comonente padre de este modal que es EditTaskData en el useQuery no se carga nada si no hay
     * datos en taskId y como enabled: !!taskId valida si hay datos o no, entonces cuando no hay datos este componente nunca se enderiza, si hay datos entonces
     * si se renderisa, con datos me refiero a que en taskId tenga el id de la tarea a editar y a su vez useQuery haga la consulta y este le retorne los datos a data
     * que si hay datos en data entonces este modal si se renderiza, por eso no se utilizo la misma logica que en AddTaskModal.tsx
     * url si abrir el modal http://localhost:5173/projects/67ca070036638cc75986331f
     * url con el modal abierto http://localhost:5173/projects/67ca070036638cc75986331f?editTask=67cb15dc9b45d3916f063774
     * en el onClose le pasamos navigate(location.pathname, { replace: true }) y este navigate nos traera http://localhost:5173/projects/67ca070036638cc75986331f
     * por lo tanto como taskId no exite, no se muestra este modal
     */



    /******************************************************************************/
    /**Esto es para el manejo del formulario**/
    const initialValues: TaskFormData = {
        name: data.name,
        description: data.description
    }

    /*
        useForm es el hook para el manejo de formualrio y validaciones
        register sirve para registrar los campos y useForm sepa que existen
        formState:{errors} es la parte que maneja los errores
        handleSubmit el que que envia los datos capturados en el formualario
        reset resetea el formulario
    */
    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues })

    /******************************************************************************/


    //Para refrescar los datos y traiga dotos nuevos
    const queryClient = useQueryClient()

    //Agregando la mutacion de @tanstack/react-query, que es la que se conecta con la funcion que hace la peticion via axios
    const { mutate } = useMutation({
        mutationFn: updateTask,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey:['project', projectId]})//Invalida la parte principal de las tareas del proyecto cuando hubo un cambio y se renderiza de nuevo
            queryClient.invalidateQueries({ queryKey: ['task', taskId] }); // Invalida la consulta del modal
            toast.success(data)
            reset()
            navigate(location.pathname,{replace:true})
        }
    })
    
    const taskId = data._id

    const handleEditTask = (formData: TaskFormData) => {
        
        const data = {
            projectId,
            taskId,
            formData
        }

        mutate(data)
    }

    return (
        <Transition appear show={true} as={Fragment}>
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
                                <DialogTitle
                                    as="h3"
                                    className="font-black text-4xl  my-5"
                                >
                                    Editar Tarea
                                </DialogTitle>

                                <p className="text-xl font-bold">Realiza cambios a una tarea en {''}
                                    <span className="text-fuchsia-600">este formulario</span>
                                </p>

                                <form
                                    onSubmit={handleSubmit(handleEditTask)}
                                    className="mt-10 space-y-3"
                                    noValidate
                                >

                                    <TaskForm
                                        errors={errors}
                                        register={register}
                                    />

                                    <input
                                        type="submit"
                                        className=" bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
                                        value='Guardar Tarea'
                                    />
                                </form>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
