import { Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import TaskForm from './TaskForm';
import { TaskFormData } from '@/types/index';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask } from '@/api/TaskAPI';
import { toast } from 'react-toastify';

export default function AddTaskModal() {

    const navigate = useNavigate()//este es para navegar ir de una pagina a otra


    /********************************************************/
    /*url original http://localhost:5173/projects/67ca070036638cc75986331f*/
    /** url despus de darle click al boton de agregar tarea 
     * http://localhost:5173/projects/67ca070036638cc75986331f?newTask=true
     * useLocation devuelve muchos datos entre ellos search location.search
     * con URLSearchParams obtenemos lo que trae location.search que en este caso seria (search: "?newTask=true") cuando se le dio click al boton de Agregar tarea, de lo contrario el valor seria (search:null)
     * con queryParams.get('newTask') extrae el valor que tiene newTask que su valor en este caso cuando se le dio click al boton de Agregar tarea, el valor seria true
     * y en show se guarda el valor de true o false dependiendo si esta o no newTask
    */
    const location = useLocation()//devuelve la url actual y otros datos
    const queryParams = new URLSearchParams(location.search)//extra lo que hay en location.search, si hay algo lo muestra, de lo contrario dice que es 0
    const modalTask  = queryParams.get('newTask')//extrae el valor de newTask que biene de queryParams y asu vez de location
    const show = modalTask ? true: false //la variable show va tener el valor de true o false, para mostrar o ocultar el pop-up 

    //la url http://localhost:5173/projects/67ca070036638cc75986331f
    //obtenemos los parametros pasados por la url
    //params devuelve projectsId: "67ca070036638cc75986331f" donde projectsId es el id que recibe en la ruta eso se puede ver en el router.tsx y el numero es el valor de projectsId
    const params = useParams()
    const projectId = params.projectsId!
    /******************************************************* */
    const initialValues: TaskFormData = {
        name: '',
        description: ''
    }

    /*
        useForm es el hook para el manejo de formualrio y validaciones
        register sirve para registrar los campos y useForm sepa que existen
        formState:{errors} es la parte que maneja los errores
        handleSubmit el que que envia los datos capturados en el formualario
        reset resetea el formulario
    */
    const { register, handleSubmit, reset, formState:{errors}} = useForm({defaultValues:initialValues})

    //con useQueryClient() lo utilizamos para decirle que los datos deben de recargarse inmediatamente, en cuanto se agregue una nueva tarea
    const queryClient = useQueryClient()
    
    //utilizando mutate para llamar a la funcion que hace la peticion al API
    const {mutate} = useMutation({
        mutationFn:createTask,
        onError:(error) => {
            toast.error(error.message)
        },
        onSuccess:(data) => {
            queryClient.invalidateQueries({queryKey:['editProject', projectId]})
            toast.success(data)
            reset()
            navigate(location.pathname,{replace:true})
        }
    })

    //En esta parte de handleSubmit del formulario solo manejamos la obtencion de los datos del formulario y su valdiacion
    const handleCreateTask = (formData:TaskFormData) => {
        const data = {
            formData,
            projectId
        }

        //mutate solo acepta 1 parametro pero en este coso requermis dos, los datos y el id por eso se le pasa en un objeto
        //mutate biene siendo createTask() que es la funcion que hace llamado al API para crear una tarea
        //solo que mutate (TankStank - React Query) nos ayuda con la parte de errores, success y manejo de cache etc.
        //por eso se utiliza en este proyecto (TankStank - React Query)
        mutate(data)
    }

    return (
        <>
            <Transition appear show={show} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => navigate(location.pathname,{replace:true})}>
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
                                        Nueva Tarea
                                    </DialogTitle>

                                    <p className="text-xl font-bold">Llena el formulario y crea  {''}
                                        <span className="text-fuchsia-600">una tarea</span>
                                    </p>
                                <form
                                    onSubmit={handleSubmit(handleCreateTask)}
                                    className='mt-10 space-y-3'
                                    noValidate
                                >
                                    
                                    <TaskForm 
                                        errors={errors}
                                        register={register}
                                    />
                                    <input 
                                        type="submit"
                                        value='Guardar Tarea'
                                        className="bg-fuchsia-600 hover:fill-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer"
                                    />
                                </form>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}
