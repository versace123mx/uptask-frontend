import { addUserToProject } from "@/api/TeamAPI";
import { TeamMember } from "@/types/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

type SearchResultProps = {
    user: TeamMember
    reset: () => void
}
const SearchResult = ({ user, reset }: SearchResultProps) => {

    const params = useParams()
    const projectId = params.projectsId!

    //con useQueryClient() lo utilizamos para decirle que los datos deben de recargarse inmediatamente, en cuanto se agregue una nueva tarea
    const queryClient = useQueryClient()
    
    //utilizando mutate para llamar a la funcion que hace la peticion al API
    const {mutate} = useMutation({
        mutationFn:addUserToProject,
        onError:(error) => {
            toast.error(error.message)
        },
        onSuccess:(data) => {
            queryClient.invalidateQueries({queryKey:['projectTeam',projectId]})
            toast.success(data)
            reset()
        }
    })

    const handleAddUserToProject = () => {
        const data = {
            projectId,
            id: user._id
        }
        mutate(data)
    }

    return (
        <>
            <p className="mt-10 text-center font-bold">Resultado:</p>
            <div className="flex justify-between items-center">
                <p>{user.name}</p>
                <button
                    className="text-purple-600 hover:bg-purple-100 px-10 py-3 font-bold cursor-pointer"
                    onClick={handleAddUserToProject}
                >
                    Agregar al Proyecto
                </button>
            </div>
        </>
    )
}

export default SearchResult
