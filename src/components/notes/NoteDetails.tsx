import { deleteNote } from "@/api/NoteAPI"
import { useAuth } from "@/hooks/useAuth"
import { Note } from "@/types/index"
import { formatDate } from "@/utils/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import { useLocation, useParams } from "react-router-dom"
import { toast } from "react-toastify"

type NoteDetailsProps = {
    note: Note
}
const NoteDetails = ({ note }: NoteDetailsProps) => {

    const { data, isLoading } = useAuth()
    const canDelete = useMemo(() => note.createdBy._id === data?._id, [data])



    /********************************************************/
        const location = useLocation()//devuelve la url actual y otros datos
        const queryParams = new URLSearchParams(location.search)//extra lo que hay en location.search, si hay algo lo muestra, de lo contrario dice que es 0
        const taskId = queryParams.get('viewTask')!//extrae el valor de viewTask que biene de queryParams y asu vez de location

        const params = useParams()
        const projectId = params.projectsId!
        /******************************************************* */




    //con useQueryClient() lo utilizamos para decirle que los datos deben de recargarse inmediatamente, en cuanto se agregue una nueva tarea
    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: deleteNote,
        onError: (error) => {
            toast.error(error.message)
        },
        onSettled: (data) => {
            queryClient.invalidateQueries({ queryKey: ['task', taskId] }); // Invalida la consulta del modal
            toast.success(data)
        }
    })



    if (isLoading) return 'Cargando...'
    return (
        <div className="p-3 flex justify-between items-center">
            <div>
                <p>
                    {note.content} por: <span className="font-bold">{note.createdBy.name}</span>
                </p>
                <p className="text-xs text-slate-500">
                    {formatDate(note.createdAt)}
                </p>
            </div>
            {canDelete && (

                <button
                    type="button"
                    className="bg-red-400 rounded-2xl hover:bg-red-500 p-2 text-xs text-white font-bold cursor-pointer"
                    onClick={() => mutate({projectId,taskId,noteId:note._id})}
                >
                    Eliminar
                </button>
            )}
        </div>
    )
}

export default NoteDetails
