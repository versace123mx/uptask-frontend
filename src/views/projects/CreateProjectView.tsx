import { createProject } from "@/api/ProjectAPI"
import ProjectForm from "@/components/projects/ProjectForm"
import { ProjectFormData } from "@/types/index"
import { useForm } from "react-hook-form"
import { toast } from 'react-toastify'
import { Link, useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"


const CreateProjectView = () => {

    //Para la redireccion entre paginas
    const navigate = useNavigate()

    //valores iniciales es un objeto
    const initialValues: ProjectFormData = {
        projectName: "",
        clientenName: "",
        description: ""
    }

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })


    //vercion con React Query - utilizando mutation
    //createProject es la funcion que llama a nuestra peticion API para crear el proyecto, las llamadas al API estan en ProjectAPI.ts
    //Los errores de la peticion al API se pueden manejar en onError, siempre y cuando lleguen desde el API
    //en el API hay dos errores, 1 cuando el error cae en la parte del API y los errores que envia como respuesta al Front, los del Front son los que trabajamos con onError
    const { mutate } = useMutation({
        mutationFn: createProject,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            navigate('/')
        }
    })

    const handleForm = (formData: ProjectFormData) => mutate(formData)


    //handleSubmit(handleForm) le pasa dos datos de los input a handleForm
    //vercion sin utilizar react query - mutation
    //const handleForm = async (formData:ProjectFormData) => {
    //    const data = await createProject(formData)
    //    toast.success(data)
    //    navigate('/')
    //}

    return (
        <>
            <div className="max-w-3xl mx-auto">


                <h1 className="text-5xl font-black">Crear Proyectos</h1>
                <p className="text-2xl font-light text-gray-500 mt-5">Llena el siguiente formulario para crear un proyecto</p>
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
                        value='Crear Proyecto'
                        className="bg-fuchsia-600 hover:fill-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer"
                    />
                </form>
            </div>
        </>
    )
}


export default CreateProjectView
