import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { ChangePasswordBienestarApi } from "@/my-api";

const schema = yup.object().shape({
  confirmationCode: yup
    .string()
    .required("El código de confirmación es obligatorio"),
  newPassword: yup.string().required("Por favor ingrese su nueva contraseña"),
  confirmNewPassword: yup
    .string()
    .required("Por favor confirmee su nueva contraseña"),
});

const Passwordrecover = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const ChangePasswordBienestar = useMutation((data) => ChangePasswordBienestarApi(data),
    {
      onSuccess: () => {
        alert("Contraseña cambiada correctamente");
        setLoading(false);
        router.push("/");
      },
      onError: () => {
        setLoading(false);
        alert("Error al cambiar la contraseña");
      },
    }
  );
  const onSubmit = (data) => {
    setLoading(true);
    if (data.newPassword === data.confirmNewPassword) {
      let body = {
        email: localStorage.getItem("email"),
        code: data.confirmationCode,
        password: data.newPassword,
      };
      ChangePasswordBienestar.mutate(body);
    }
  };

  return (
    <>
      <div className="w-full h-screen min-h-[700px] bg-white p-8 flex justify-center items-center">
        <div className="w-full h-full flex justify-center items-center flex-col gap-12">
          <div className="flex flex-col items-center gap-10">
            <p className="text-[18px] text-[#707070]">
              <span style={{ fontWeight: "bold" }}>
                Ingresa tu nueva contraseña
              </span>
            </p>
            <img src="img/logo-uflou.png" alt="logo" className="w-[170px]" />
          </div>
          <div className="w-[50%]">
            <div className="w-full">
              <div className="my-2 mx-auto  w-full justify-center flex flex-col gap-10 items-center">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="w-full flex flex-col gap-4"
                >
                  <div className="w-full flex flex-row-reverse justify-center">
                    <input
                      type="text"
                      className="w-full md:w-[400px] h-12 px-2 py-1 text-[15px] input-login !rounded-[15px] focus:outline-none placeholder:text-[#04BA8E]"
                      placeholder="Ingrese el código de confirmación"
                      name="confirmationCode"
                      id="confirmationCode"
                      {...register("confirmationCode")}
                    />
                  </div>
                  {errors.confirmationCode && (
                    <div className="w-full flex flex-row-reverse justify-center">
                      <p className="text-red-500 text-xs italic">
                        {errors.confirmationCode.message}
                      </p>
                    </div>
                  )}
                  <div className="w-full flex flex-row-reverse justify-center">
                    <input
                      type="text"
                      className="w-full md:w-[344px] h-12 px-2 py-1 text-[15px] input-login focus:outline-none placeholder:text-[#04BA8E] "
                      placeholder="Ingrese su nueva contraseña"
                      name="newPassword"
                      id="newPassword"
                      {...register("newPassword")}
                    />
                    <label
                      htmlFor="usuario"
                      className="flex bg-label items-center bg-gray-100 rounded-l-md justify-center w-14 h-12 text-white "
                    >
                      <img src="icons/password-lock.svg" alt="search" />
                    </label>
                  </div>
                  {errors.newPassword && (
                    <div className="w-full flex flex-row-reverse justify-center">
                      <p className="text-red-500 text-xs italic">
                        {errors.newPassword.message}
                      </p>
                    </div>
                  )}
                  <div className="w-full flex flex-row-reverse justify-center">
                    <input
                      type="text"
                      className="w-full md:w-[344px] h-12 px-2 py-1 text-[15px] input-login focus:outline-none placeholder:text-[#04BA8E] "
                      placeholder="Confirme su nueva contraseña"
                      name="confirmNewPassword"
                      id="confirmNewPassword"
                      {...register("confirmNewPassword")}
                    />
                    <label
                      htmlFor="usuario"
                      className="flex bg-label items-center bg-gray-100 rounded-l-md justify-center w-14 h-12 text-white "
                    >
                      <img src="icons/password-lock.svg" alt="search" />
                    </label>
                  </div>
                  {errors.confirmNewPassword && (
                    <div className="w-full flex flex-row-reverse justify-center">
                      <p className="text-red-500 text-xs italic">
                        {errors.confirmNewPassword.message}
                      </p>
                    </div>
                  )}
                  <input
                    type="submit"
                    value={loading ? "Cargando..." : "Ingresar"}
                    className="w-full md:w-[400px] h-14 m-auto login-button rounded-2xl text-white"
                  />
                </form>
              </div>
            </div>
          </div>
          <div className="text-center flex flex-col gap-2">
            <p className="text-[18px] text-[#707070]">
              ¿Estás interesado en hacer parte de <strong>Uflou?</strong>
            </p>
            <a
              href="https://api.whatsapp.com/send?phone=573186931271&text=Hola,uFlou"
              target="_blank"
              className="text-[18px] underline text-[#01D9AD]"
            >
              ¡Escríbenos ahora!
            </a>
          </div>
          <div className="flex flex-col gap-2 text-center">
            <div className="flex flex-row gap-4">
              <a target="_blank" href="https://www.instagram.com/uflouapp/">
                <img
                  src="icons/instagram.svg"
                  alt="google"
                  className="w-[45px] border border-[#707070] rounded-full p-2"
                />
              </a>
              <a target="_blank" href="https://www.facebook.com/uflouapp">
                <img
                  src="icons/facebook.svg"
                  alt="google"
                  className="w-[45px] border border-[#707070] rounded-full p-2"
                />
              </a>
              <a
                target="_blank"
                href="https://www.youtube.com/channel/UCiPQKFUpriLTrRFI9V963wg/videos "
              >
                <img
                  src="icons/youtube.svg"
                  alt="google"
                  className="w-[45px] border border-[#707070] rounded-full p-2"
                />
              </a>
            </div>
            <a
              href="https://www.ecoapps.com.co/"
              target="_blank"
              className="text-[18px] hover:underline text-[#8D8D8D] hover:text-[#00FFCB]"
            >
              www.ecoapps.com.co
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Passwordrecover;
