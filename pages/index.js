import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "react-query";
import { LoginApi } from "@/my-api";
import { useRouter } from "next/router";
import Link from "next/link";

const schema = yup.object().shape({
  usuario: yup.string().required("El usuario es obligatorio"),
  password: yup.string().required("La contraseña es obligatoria"),
});

export const index = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const mutation = useMutation(LoginApi, {
    onSuccess: (data) => {
      localStorage.setItem("data_user", JSON.stringify(data));
      setLoading(false);
      router.push("/home");
    },
    onError: (error) => {
      alert("Error al iniciar sesión");
      setErrorMsg(error.response.data.message);
      setLoading(false);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    setLoading(true);
    router.push("/home");
  };

  return (
    //tailwindcss
    //div que ocupe el 100% de la pantalla y que tenga un fondo de color azul
    <div className="h-screen min-h-[700px] bg-white p-8">
      <div className="flex xl:flex-row lg:lex-row flex-col items-center justify-center h-full">
        <div className="w-[40%] h-full flex justify-center items-center flex-col gap-12">
          <div className="flex flex-col items-center gap-10">
            <p className="text-[18px] text-[#707070]">
              Bienvenido a{" "}
              <span style={{ fontWeight: "bold" }}>NET ZERO</span>
            </p>
          </div>
          <div className="w-[100%]">
            <div className="w-full">
              <div className="my-2 mx-auto  w-full justify-center flex flex-col gap-10 items-center">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="w-full flex flex-col gap-4 justify-center items-center"
                >
                  <div className="w-full flex flex-row-reverse">
                    <input
                      type="text"
                      className="w-full h-12 px-2 py-1 text-[15px] input-login focus:outline-none placeholder:text-[#04BA8E] "
                      placeholder="Ingresar usuario"
                      name="usuario"
                      id="usuario"
                      {...register("usuario")}
                    />
                    <label
                      htmlFor="usuario"
                      className="flex bg-label items-center bg-gray-100 rounded-l-md  justify-center w-14 h-12 text-white "
                    >
                      <img src="icons/user.svg" alt="search" />
                    </label>
                  </div>
                  {errors.usuario && (
                    <p className="text-red-500 text-xs italic">
                      {errors.usuario.message}
                    </p>
                  )}

                  <div className="w-full flex flex-row-reverse">
                    <input
                      type="password"
                      className="w-full h-12 px-2 text-[15px] py-1 input-login focus:outline-none placeholder:text-[#04BA8E]"
                      placeholder="Contraseña"
                      name="password"
                      id="password"
                      {...register("password")}
                    />
                    <label
                      htmlFor="password"
                      className="flex bg-label items-center bg-gray-100 rounded-l-md  justify-center w-14 h-12 text-white "
                    >
                      <img src="icons/password.svg" alt="search" />
                    </label>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs italic">
                      {errors.password.message}
                    </p>
                  )}

                  <input
                    type="submit"
                    value={loading ? "Cargando..." : "Ingresar"}
                    className="w-full h-14 login-button rounded-2xl text-white"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;
