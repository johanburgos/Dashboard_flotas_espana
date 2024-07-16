import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Layout from "../../../layout";
import { useMutation } from 'react-query';
import { registerCompanyApi } from '@/my-api';

const schema = yup.object().shape({
    nombre: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    num_contacto: yup.string().required('Message is required'),
    pais: yup.string().required('Country is required'),
});

const Form = () => {
    const { register, handleSubmit, formState: { errors }, reset
    } = useForm({
        resolver: yupResolver(schema),
    });

    //mutation
    const mutation = useMutation((data) => registerCompanyApi(data), {
        onSuccess: () => {
            alert("Empresa creada correctamente");
            reset();
        },
        onError: (error) => {
            alert("Error al crear empresa");
            console.log(error);
        }
    });

    const onSubmit = (data) => {
        console.log(data);
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
                            Nombre
                        </label>
                        <input
                            type="text"
                            name="nombre"
                            id="nombre"
                            {...register('nombre')}
                            placeholder="Nombre"
                            className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                        />
                        {errors.nombre && (
                            <span className="text-red-500 text-xs">
                                {errors.nombre.message}
                            </span>
                        )}
                    </div>
                    <div className="mb-5">
                        <label
                            htmlFor="name"
                            className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
                        >
                            País
                        </label>
                        <select
                            name="pais"
                            id="pais"
                            {...register('pais')}
                            className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                        >
                            <option value="" disabled selected>País</option>
                            <option value="Colombia">Colombia</option>
                            <option value="España">España</option>
                        </select>
                    </div>
                    <h2 className="text-2xl text-center">
                        Información de Contacto
                    </h2>
                    <hr />
                    <div className="mb-5">
                        <label
                            htmlFor="email"
                            className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
                        >
                            Correo
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            {...register('email')}
                            placeholder="Correo"
                            className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                        />
                        {errors.email && (
                            <span className="text-red-500 text-xs">
                                {errors.email.message}
                            </span>
                        )}
                    </div>
                    <div className="mb-5">
                        <label
                            htmlFor="message"
                            className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
                        >
                            Número
                        </label>

                        <input
                            type="number"
                            name="num_contacto"
                            id="num_contacto"
                            {...register('num_contacto')}
                            placeholder="Número"
                            className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                        />
                        {errors.num_contacto && (
                            <span className="text-red-500 text-xs">
                                {errors.num_contacto.message}
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
