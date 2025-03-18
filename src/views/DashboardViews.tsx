import { Fragment } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { deleteProject, getProjects } from "@/api/ProjectAPI"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { toast } from 'react-toastify'
import { useAuth } from '@/hooks/useAuth'
import { isManager } from '@/utils/polices'

const DashboardViews = () => {

    //para hacer la validacion del usuario y del team dependiendo sus acciones aqui hayq ue traer el user que esta logeado
    //este custom hook hace la peticion al api y verifica si esta logueado, si no esta logueado redireccionamos al login
    //se coloca aqui por que esta es la pagina raiz, por que aqui tenemos el outle y aqui se renderiza lo de cualquier otra pagina
    //con esto aseguramos que si no hay datos no cargamos nada y redireccionamos a login
    const { data: user, isLoading: authLoading } = useAuth()


    //query de proyectos, query se utiliza para obtener datos en @tanstack/react-query y este llama a la funcion getProjects que hace un llamado al API
    //en caso de que la funcion getProjects requiriera parametros este se pasaria como un callback ejemplo:
    //queryFn: () => getProjects(parametros)
    const { data, isLoading } = useQuery({
        queryKey: ['projects'],
        queryFn: getProjects
    })

    //Para refrescar los datos y traiga dotos nuevos
    const queryClient = useQueryClient()

    //Agregando la mutacion de @tanstack/react-query, que es la que se conecta con la funcion que hace la peticion via axios
    const { mutate } = useMutation({
        mutationFn: deleteProject,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({ queryKey: ['projects'] })
        }
    })


    if (isLoading && authLoading) return 'Cargando...'

    //el if(data) es como dice react-query que se maneje
    if (data && user) return (

        <>

            <h1 className="text-5xl font-black">Mis Proyectos</h1>
            <p className="text-2xl font-light text-gray-500 mt-5">Maneja y administra tus proyectos</p>

            <nav className="my-5">
                <Link
                    to={'/projects/create'}
                    className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
                >
                    Nuevo Proyecto
                </Link>
            </nav>


            {data.length ? (



                <ul role="list" className="divide-y divide-gray-100 border border-gray-100 mt-10 bg-white shadow-lg">
                    {data.map((project) => (
                        <li key={project._id} className="flex justify-between gap-x-6 px-5 py-10">
                            <div className="flex min-w-0 gap-x-4">
                                <div className="min-w-0 flex-auto space-y-2">

                                    <div className='mb-2'>
                                        {isManager(project.manger, user._id) ?
                                            <p
                                                className='font-bold text-xs uppercase bg-indigo-50 text-indigo-500 border-2 border-indigo-500 rounded-lg inline-block py-1 px-5'
                                            >
                                                Manager
                                            </p>
                                            :
                                            <p
                                                className='font-bold text-xs uppercase bg-yellow-50 text-yellow-500 border-2 border-yellow-500 rounded-lg inline-block py-1 px-5'
                                            >
                                                Colaborador
                                            </p>
                                        }
                                    </div>

                                    <Link to={`/projects/${project._id}`}
                                        className="text-gray-600 cursor-pointer hover:underline text-3xl font-bold"
                                    >
                                        {project.projectName}
                                    </Link>
                                    <p className="text-sm text-gray-400">
                                        Cliente: {project.clientenName}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        {project.description}
                                    </p>
                                </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-x-6">
                                <Menu as="div" className="relative flex-none">
                                    <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                                        <span className="sr-only">opciones</span>
                                        <EllipsisVerticalIcon className="h-9 w-9" aria-hidden="true" />
                                    </MenuButton>
                                    <Transition as={Fragment} enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95">
                                        <MenuItems
                                            className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
                                        >
                                            <MenuItem>
                                                <Link to={`/projects/${project._id}`}
                                                    className='block px-3 py-1 text-sm leading-6 text-gray-900'>
                                                    Ver Proyecto
                                                </Link>
                                            </MenuItem>


                                            {isManager(project.manger, user._id) &&
                                                <>
                                                    <MenuItem>
                                                        <Link to={`/projects/${project._id}/edit`}
                                                            className='block px-3 py-1 text-sm leading-6 text-gray-900'>
                                                            Editar Proyecto
                                                        </Link>
                                                    </MenuItem>
                                                    <MenuItem>
                                                        <button
                                                            type='button'
                                                            className='block px-3 py-1 text-sm leading-6 text-red-500 hover:cursor-pointer'
                                                            onClick={() => mutate(project._id)}
                                                        >
                                                            Eliminar Proyecto
                                                        </button>
                                                    </MenuItem>
                                                </>
                                            }


                                        </MenuItems>
                                    </Transition>
                                </Menu>
                            </div>
                        </li>
                    ))}
                </ul>



            ) : (
                <p className="text-center py-20">
                    No hay proyectos aun {''}
                    <Link
                        to={'/projects/create'}
                        className="text-fuchsia-500 font-bold"
                    >
                        Crea un Proyecto
                    </Link>
                </p>
            )}
        </>

    )
}

export default DashboardViews
