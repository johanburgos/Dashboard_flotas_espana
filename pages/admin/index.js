import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Layout from "../../layout";
import { useMutation, useQuery } from 'react-query';
import { getEmpresasApi, registerAdminApi } from '@/my-api';

const schema = yup.object().shape({
    usuario: yup.string().required('Usuario es requerido'),
    password: yup.string().required('Contraseña es requerida'),
    type: yup.string().required('Tipo de Administrador es requerido'),
    empresa: yup.string().required('Empresa es requerida'),
});

const Form = () => {
    const { register, handleSubmit, formState: { errors }, reset
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(1000);



    // Query
    const {
        data: dataUser,
        isLoading: isLoadingDataUser,
        isError: isErrorDataUser,
        refetch: refetchDataUser,
    } = useQuery(["dataCompanies", {
        page: page + 1,
        limit: rowsPerPage,
    }], () => getEmpresasApi({
        page: page + 1,
        limit: rowsPerPage,
    }));
    //mutation
    const mutation = useMutation((data) => registerAdminApi(data), {
        onSuccess: () => {
            alert("Usuario creado correctamente");
            reset();
        },
        onError: (error) => {
            alert("Error al crear usuario");
        }
    });


    const onSubmit = (data) => {
       
    };

    return (
        <Layout>
            <div className="max-w-md mx-auto">

                <form onSubmit={handleSubmit(onSubmit)}>
                    <h2 className="text-2xl text-center">
                        Datos Principales
                    </h2>
                    <hr />
                    <div className="mb-5">
                        <label
                            htmlFor="name"
                            className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
                        >
                            Usuario
                        </label>
                        <input
                            type="text"
                            name="usuario"
                            id="usuario"
                            placeholder="Usuario"
                            {...register('usuario')}
                            className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                        />
                        {errors.usuario && (
                            <span className="text-red-500 text-xs">
                                {errors.usuario.message}
                            </span>
                        )}
                    </div>
                    <div className="mb-5">
                        <label
                            htmlFor="email"
                            className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
                        >
                            Contraseña
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Contraseña"
                            {...register('password')}
                            className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                        />
                        {errors.password && (
                            <span className="text-red-500 text-xs">
                                {errors.password.message}
                            </span>
                        )}
                    </div>
                    <div className="mb-5">
                        <label
                            htmlFor="message"
                            className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
                        >
                            Tipo de Administrador
                        </label>

                        <select
                            name="type"
                            id="type"
                            {...register('type')}
                            className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                        >
                            <option value="" disabled selected>Seleccione una opción</option>
                            <option value="super">Super</option>
                            <option value="empresa">Empresa</option>
                        </select>
                        {errors.type && (
                            <span className="text-red-500 text-xs">
                                {errors.type.message}
                            </span>
                        )}
                    </div>
                    <div className="mb-5">
                        <label
                            htmlFor="message"
                            className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
                        >
                            Empresa
                        </label>

                        <select
                            name="empresa"
                            id="empresa"
                            {...register('empresa')}
                            className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                        >
                            <option value="" disabled selected>Seleccione una opción</option>
                            {Array.isArray(dataUser?.usuarios) && dataUser?.usuarios.map((item) => (
                                <option value={item._id}>{item.nombre}</option>
                            ))}
                        </select>
                        {errors.empresa && (
                            <span className="text-red-500 text-xs">
                                {errors.empresa.message}
                            </span>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="block w-full px-4 py-2 mt-2 text-base font-medium text-white transition duration-500 ease-in-out transform bg-[#01D9AD] border-[#01D9AD] rounded-md hover:bg-green-700 hover:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-green-200"
                    >
                        Registrar
                    </button>
                </form>
            </div>
        </Layout>
    );
};

export default Form;
