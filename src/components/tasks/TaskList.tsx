import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { Task, TaskStatus } from "@/types/index"
import TaskCard from "./TaskCard"
import { statusTranslations } from "@/locales/es"
import DropTask from "./DropTask"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { updateStatus } from '@/api/TaskAPI'

type TaskListProps = {
    tasks: Task[]
    canEdit: boolean
}

type GroupedTask = {
    [key: string]: Task[]
}

const initialStatusGroups: GroupedTask = {
    pending: [],
    onHold: [],
    inProgress: [],
    underReview: [],
    completed: [],
}

const statusColorTranslations: { [key: string]: string } = {
    pending: 'border-t-slate-500',
    onHold: 'border-t-red-500',
    inProgress: 'border-t-blue-500',
    underReview: 'border-t-yellow-500',
    completed: 'border-t-green-500',
}


const TaskList = ({ tasks, canEdit }: TaskListProps) => {

    const params = useParams()
    const projectId = params.projectsId!

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
            }
        })
        
    //Este es el codigo que agrupa las tareas
    const groupedTasks = tasks.reduce((acc, task) => {
        let currentGroup = acc[task.status] ? [...acc[task.status]] : [];
        currentGroup = [...currentGroup, task]
        return { ...acc, [task.status]: currentGroup };
    }, initialStatusGroups);

    const handleDragEnd = (e: DragEndEvent) => {
        const { over, active } = e

        if(over && over.id){
            const taskId = active.id.toString()
            const status = over.id as TaskStatus

            mutate({projectId, taskId, status})

            queryClient.setQueryData(['project', projectId],(prevData) => {
                const updatedTasks = prevData.tasks.map((task:Task) => {
                    if(task._id === taskId){
                        return {
                            ...task,
                            status
                        }
                    }
                    return task
                })
                return {
                    ...prevData,
                    task: updatedTasks
                }
            })
        }
    }

    return (
        <>
            <h2 className="text-5xl font-black my-10">Tareas</h2>

            <div className='flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32'>

                <DndContext onDragEnd={handleDragEnd}>
                    {Object.entries(groupedTasks).map(([status, tasks]) => (
                        <div key={status} className='min-w-[300px] 2xl:min-w-0 2xl:w-1/5'>

                            <h3 className={`capitalize text-xl font-light border ${statusColorTranslations[status]} bg-white p-3 border-t-8`}>
                                {statusTranslations[status]}
                            </h3>

                            <DropTask status={status} />

                            <ul className='mt-5 space-y-5'>
                                {tasks.length === 0 ? (
                                    <li className="text-gray-500 text-center pt-3">No Hay tareas</li>
                                ) : (
                                    tasks.map(task => <TaskCard key={task._id} task={task} canEdit={canEdit} />)
                                )}
                            </ul>
                        </div>
                    ))}
                </DndContext>

            </div>
        </>
    )
}

export default TaskList
