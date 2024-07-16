/*
 * In this file we will create all endpoints for consume the API
 * We will use the next libraries:
 *   - axios
 */

import axios from 'axios';
export const urlBase = 'https://api.uflou.com.co/api';

export const getToken = () => {
    const data = JSON.parse(localStorage.getItem('data_user') || '{}');
    const token = data.token;

    return token;
};

//WithOut Token Routers

/*
 * Login
 * @param body: {id: string, password: string, uuid: string, platform: string, model: string, version: string, app_version: string}
 * @return {token: string, user: {id: number, name: string, email: string, phone: string, avatar: string, created_at: string, updated_at: string}}
 */
const LoginApi = async (body) => {
    const { data } = await axios.post(`${urlBase}/auth/login`, body);
    return data;
};

/*
 * recover-password-bienestar
 * @param body: {email: string}
 * @return {message: string}
 * @description: Send email to recover password
 */
const RecoverPasswordBienestarApi = async (body) => {
    const { data } = await axios.post(`${urlBase}/auth/recover-password-bienestar`, body);
    return data;
};

/*
 * change-password-bienestar
 * @param body: {email: string, password: string, code: string}
 * @return {message: string}
 * @description: Change password
 */
const ChangePasswordBienestarApi = async (body) => {
    const { data } = await axios.post(`${urlBase}/auth/change-password-bienestar`, body);
    return data;
};

//dashboard

/*
 * get-admin-dashboard
 * @return {message: string}
 * @description: Get data for dashboard
*/

const GetAdminDashboardApi = async (filters) => {
    let dataUser = JSON.parse(localStorage.getItem("data_user"));
    let rol = dataUser.user.tipo;
    if (rol == "super") {
        const { data } = await axios.post(`${urlBase}/dashboard/bienestar_admin`,filters, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return data;
    } else {
        let idEmpresa = dataUser.user.empresaId._id;
        const { data } = await axios.post(`${urlBase}/dashboard/bienestar_user/${idEmpresa}`,filters, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return data;
    };
};

const getUsersApi = async (filters) => {
    console.log(filters);
    let dataUser = JSON.parse(localStorage.getItem("data_user"));
    let rol = dataUser.user.tipo;
    if (rol == "super") {
        filters = {
            ...filters,
            userId: 0
        }
    } else {
        filters = {
            ...filters,
            userId: dataUser.user.empresaId._id
        }
    }

    const { data } = await axios.post(`${urlBase}/users/GetBienestar`, filters, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });
    return data;
    
};

const getEmpresasApi = async (filters) => {
    const { data } = await axios.post(`${urlBase}/companies/GetBienestar`, filters, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });
    return data;
}

const getComunidadesApi = async (filters) => {
    let dataUser = JSON.parse(localStorage.getItem("data_user"));
    let rol = dataUser.user.tipo;
    if (rol == "super") {
        filters = {
            ...filters,
            userId: 0
        }
    } else {
        filters = {
            ...filters,
            userId: dataUser.user.empresaId._id
        }
    }
    const { data } = await axios.post(`${urlBase}/communities/GetBienestar`, filters, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });
    return data;
}

const registerAdminApi = async (body) => {
    const { data } = await axios.post(`${urlBase}/auth/create-admin`, body);
    return data;
};

const registerCompanyApi = async (body) => {
    const { data } = await axios.post(`${urlBase}/companies/bienestar`, body, 
    {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    return data;
};


const registerComunidadApi = async (body) => {
    let dataUser = JSON.parse(localStorage.getItem("data_user"));
    let rol = dataUser.user.tipo;
    if (rol == "super") {
        body = {
            ...body,
            userId: 0
        }
    } else {
        body = {
            ...body,
            userId: dataUser.user.empresaId._id
        }
        
    }
    const { data } = await axios.post(`${urlBase}/communities/create`, body,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });

    return data;
};

const deleteComunidadApi = async (body) => {
    let keyword = body.keyword;
    let dataUser = JSON.parse(localStorage.getItem("data_user"));
    let id = dataUser.user.empresaId._id;
    const { data } = await axios.delete(`${urlBase}/communities/delete/${id}/${keyword}`,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });

    return data;
};


export {
    LoginApi,
    RecoverPasswordBienestarApi,
    ChangePasswordBienestarApi,
    GetAdminDashboardApi,
    getUsersApi,
    getEmpresasApi,
    getComunidadesApi,
    registerAdminApi,
    registerCompanyApi,
    registerComunidadApi,
    deleteComunidadApi
};



