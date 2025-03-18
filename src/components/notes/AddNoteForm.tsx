import { NoteFormData } from "@/types/index"
import { useForm } from "react-hook-form"
import ErrorMessage from "../ErrorMessage"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { creeateNote } from '@/api/NoteAPI'
import { useLocation, useParams } from "react-router-dom"


const AddNoteForm = () => {

    const params = useParams()
    const location = useLocation()

    const queryParams = new URLSearchParams(location.search)

    const projectId = params.projectsId!
    const taskId = queryParams.get('viewTask')!

    const initialValues:NoteFormData = {
        content: ''
    }

    /**
     * Como nota de recordatorio register, handleSubmit, reset, formState:{errors} son de useForm que es de react-hook-form
     */
    const { register, handleSubmit, reset, formState:{errors} } = useForm({defaultValues:initialValues})

    //con useQueryClient() lo utilizamos para decirle que los datos deben de recargarse inmediatamente, en cuanto se agregue una nueva tarea
    const queryClient = useQueryClient()

    const {mutate} = useMutation({
        mutationFn: creeateNote,
        onError:(error)=>{
            toast.error(error.message)
        },
        onSettled:(data)=>{
            queryClient.invalidateQueries({queryKey:['task', taskId]})
            toast.success(data)
            reset()
        }
    })
    const handleAddNote = (formData:NoteFormData) => {
        const data = {
            formData,
            projectId,
            taskId
        }
        mutate(data)
        
    }
    return (
        <form
            onSubmit={handleSubmit(handleAddNote)}
            className="space-y-3"
            noValidate
        >
            <div className="flex flex-col gap-2">
                <label className="font-bold" htmlFor="content">Crear Nota</label>
                <input
                    type="text"
                    id="content"
                    placeholder="Contenido de la nota"
                    className="w-full p-3 border border-gray-300"
                    {...register("content", {
                        required: "La Nota no puede esta vacia",
                    })}
                />
                {errors.content && (
                    <ErrorMessage>{errors.content.message}</ErrorMessage>
                )}
            </div>
            <input
                type="submit"
                value='Crear Nota'
                className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-2 text-white font-black cursor-pointer"
            />
        </form>
    )
}

export default AddNoteForm
