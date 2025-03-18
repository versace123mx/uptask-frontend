import { Fragment } from 'react'
import { Task } from "@/types/index"
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react"
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deliteTask } from '@/api/TaskAPI'
import { toast } from 'react-toastify'

type TaskCardProps = {
    task: Task
    canEdit: boolean
}
const TaskCard = ({ task, canEdit }: TaskCardProps) => {
    //console.log(task)
    const navigate = useNavigate()


    //Para refrescar los datos y traiga dotos nuevos
    const queryClient = useQueryClient()

    //Agregando la mutacion de @tanstack/react-query, que es la que se conecta con la funcion que hace la peticion via axios
    const { mutate } = useMutation({
        mutationFn: deliteTask,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({ queryKey: ['project', projectId] })
        }
    })


    //obtenemos los parametros pasados por la url
    const params = useParams()
    const projectId = params.projectsId!
    const taskId = task._id

    return (

        <li className="p-5 bg-white border border-slate-300 flex justify-between gap-3">
            <div className="min-w-0 flex flex-col gap-y-4">
                <button
                    type="button"
                    className="text-xl font-bold text-slate-600 text-left hover:cursor-pointer hover:text-slate-900"
                    onClick={() => navigate(location.pathname + `?viewTask=${task._id}`)}
                >
                    {task.name}
                </button>
                <p className="text-slate-500">{task.description}</p>
            </div>


            <div className="flex shrink-0  gap-x-6">
                <Menu as="div" className="relative flex-none">
                    <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                        <span className="sr-only">opciones</span>
                        <EllipsisVerticalIcon className="h-9 w-9" aria-hidden="true" />
                    </MenuButton>
                    <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                        <MenuItems
                            className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                            <MenuItem>
                                <button
                                    type='button'
                                    className='block px-3 py-1 text-sm leading-6 text-gray-900'
                                    onClick={() => navigate(location.pathname + `?viewTask=${task._id}`)}
                                >
                                    Ver Tarea
                                </button>
                            </MenuItem>

                            {canEdit &&
                                <>
                                    <MenuItem>
                                        <button
                                            type='button'
                                            className='block px-3 py-1 text-sm leading-6 text-gray-900'
                                            onClick={() => navigate(location.pathname + `?editTask=${task._id}`)}
                                        >
                                            Editar Tarea
                                        </button>
                                    </MenuItem>

                                    <MenuItem>
                                        <button
                                            type='button'
                                            className='block px-3 py-1 text-sm leading-6 text-red-500'
                                            onClick={() => mutate({ projectId, taskId })}
                                        >
                                            Eliminar Tarea
                                        </button>
                                    </MenuItem>
                                </>
                            }


                        </MenuItems>
                    </Transition>
                </Menu>
            </div>

        </li>
    )
}

export default TaskCard
