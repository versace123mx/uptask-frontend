import { Link, useNavigate } from "react-router-dom"
import ProjectForm from "@/components/projects/ProjectForm"
import { Project, ProjectFormData } from "@/types/index"
import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProject } from "@/api/ProjectAPI"
import { toast } from 'react-toastify'

type EditProjectFormProps = {
    data: ProjectFormData
    projectId:Project['_id']
}


const EditProjectForm = ({ data, projectId }:EditProjectFormProps) => {

    //Para la redireccion entre paginas
    const navigate = useNavigate()
    
    
    //valores iniciales es un objeto y se le pasan a defaultValues para que llene en automatico el formulario por que
    //register registra los campos ejemplo imput con el mismo nombre projectName
    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: {
        projectName: data.projectName,
        clientenName: data.clientenName,
        description: data.description
    } })

    
    //este hook le dice que debe de refrescar los datos nuevo del key, para que haga otra peticion al API y sincronice los datos nuevos
    const queryClient = useQueryClient()

    //vercion con React Query - utilizando mutation
    //updateProject es la funcion que llama a nuestra peticion al API para editar proyecto, las llamadas al API estan en ProjectAPI.ts
    //Los errores de la peticion al API se pueden manejar en onError, siempre y cuando lleguen desde el API
    //en el API hay dos errores, 1 cuando el error cae en la parte del API y los errores que envia como respuesta al Front, los del Front son los que trabajamos con onError
    const { mutate } = useMutation({
        mutationFn: updateProject,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey:['projects']})
            queryClient.invalidateQueries({queryKey:['editProject',projectId]})
            toast.success(data)
            navigate('/')
        }
    })

    const handleForm = (formData: ProjectFormData) => {
        //En este caso requerimos pasarle dos parametros al mutate, pero solo acepta 1 por eso se le pasan los datos como objetos
        //formData son lod parametros que recibe handleForm, recordar que esta es una libreria y tiene su forma de mandarle los datos del formulario
        //nosotros solamente nos limitamos a pasarle ese dato que sera el valor de los datos del formulario
        const data = {
            formData,
            projectId
        }
        mutate(data)
    }


    //handleSubmit(handleForm) le pasa dos datos de los input a handleForm
    //vercion sin utilizar react query - mutation
    //const handleForm = async (formData:ProjectFormData) => {
    //    const data = await updateProject(formData,projectId)
    //    toast.success(data)
    //    navigate('/')
    //}


    return (
        <>
            <div className="max-w-3xl mx-auto">


                <h1 className="text-5xl font-black">Editar Proyecto</h1>
                <p className="text-2xl font-light text-gray-500 mt-5">Llena el siguiente formulario para editar el proyecto</p>
                <nav className="my-5">
                    <Link
                        to={'/'}
                        className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
                    >
                        Volver a Proyectos
                    </Link>
                </nav>

                <form
                    className="mt-10 bg-white shadow-lg p-10 rounded-lg"
                    onSubmit={handleSubmit(handleForm)}
                    noValidate
                >

                    <ProjectForm
                        errors={errors}
                        register={register}
                    />

                    <input
                        type="submit"
                        value='Editar Proyecto'
                        className="bg-fuchsia-600 hover:fill-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer"
                    />
                </form>


            </div>
        </>
    )
}

export default EditProjectForm
