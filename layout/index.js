import Link from 'next/link';
import React, { useEffect, useState } from 'react'

export default function index({ children }) {
    const [isActive, setActive] = useState("false");
    const [isMenu, setMenu] = useState([]);

    const ToggleClass = () => {
        setActive(!isActive);
    };

    const closeSession = () => {
        localStorage.removeItem("data_user");
        window.location.href = "/";
    };

    const [dataUser, setDataUser] = useState(null);
    useEffect(() => {
        setTimeout(() => {
            setMenu([
                {
                    id: 1,
                    name: "Dashboard",
                    icon: "/icons/dashboard.svg",
                    link: "/home",
                    active: true,
                },
                {
                    id: 4,
                    name: "Configuración",
                    icon: "/icons/registrar_administrador.svg",
                    link: "/admin",
                    active: false,
                },
            ]);
        }, 250);
    }, []);

    return (
        <div className="h-screen min-h-[700px] flex gap-4">
            <div
                className="sidebar h-full mt-3"
                style={{
                    width: isActive ? "390px" : "80px",
                    padding: isActive ? "18px 20px" : "18px 0px",
                }}
            >
                <div
                    className={
                        isActive
                            ? "justify-end icon_menu flex "
                            : "justify-center icon_menu flex "
                    }
                >
                    <button
                        className={isActive ? "hamburger" : "hamburger is-active"}
                        id="hamburger-4"
                        onClick={ToggleClass}
                    >
                        <span className="line"></span>
                        <span className="line"></span>
                        <span className="line"></span>
                    </button>
                </div>
                <div
                    className="sidebar__logo text-center pb-7 border-b border-[#d0e0d89e] mb-4 w-[80%] m-auto"
                    style={{ marginTop: isActive ? "0px" : "20px" }}
                >
                    {isActive && (
                        <h3 className="text-[#01D9AD] font-bold text-xl mb-3">NET ZERO</h3>
                    )}
                </div>
                <div className="sidebar__menu">
                    <ul className="flex flex-col gap-2 w-[85%] m-auto">
                        {isMenu.map((item) => (
                            <li
                                className={
                                    isActive
                                        ? "item-menu flex flex-row gap-2 items-center py-2 px-2 transition-all duration-100 ease-in border-l-4 rounded-sm border-[#fff] hover:bg-[#F8F8F8] hover:pl-3 hover:border-[#01D9AD]"
                                        : "item-menu flex flex-row gap-2 items-center py-2 px-1 transition-all duration-100 ease-in rounded-lg hover:bg-[#F8F8F8] justify-center"
                                }
                            >
                                <img
                                    src={item.icon}
                                    alt="home"
                                    style={{ width: isActive ? "30px" : "30px" }}
                                />
                                <Link href={item.link} className="text-[#606060] text-[15px]"
                                    style={{ display: isActive ? "block" : "none" }}>
                                    {item.name}
                                </Link>
                                <div
                                    id="tooltip-right"
                                    role="tooltip"
                                    style={{ display: isActive ? "none" : "flex" }}
                                    className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white bg-[#01D9AD] rounded-lg shadow-sm opacity-0 tooltip"
                                >
                                    <div className=" w-full text-center">{item.name}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="w-full">
                <div className="header w-full my-3">
                    <div className="content bg-white py-3 px-5 mr-3">
                        <div className="flex items-center">
                            <p className="text-[#01D9AD] text-[20px] font-bold border-r pr-2 mr-2">
                                Bienvenido
                            </p>
                            <p className="text-[#8D8D8D] text-[22px]">
                                NET ZERO USER
                            </p>
                        </div>
                        <button
                            onClick={closeSession}
                            className="logout bg-[#fff] hover:bg-[#F2F2F2] text-[#606060] text-[12px] py-2 px-4 rounded-[12px] flex items-center border transition-all duration-300 ease-in-out"
                        >
                            Cerrar sesión
                            <img
                                src="/icons/logout.svg"
                                alt="logout"
                                className="w-[20px] ml-1"
                            />
                        </button>
                    </div>
                </div>
                {children}
            </div>
        </div>
    )
}
