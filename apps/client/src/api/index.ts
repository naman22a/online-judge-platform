import axios from 'axios';
import { getAccessToken, setAccessToken } from '../global';

const API = axios.create({
    baseURL: `${import.meta.env.VITE_API_ENDPOINT}/api`,
    withCredentials: true,
});

API.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers['authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

API.interceptors.response.use(
    (res) => {
        return res;
    },
    async (err) => {
        const originalConfig = err.config;

        if (originalConfig.url !== '/login' && err.response) {
            // Access Token was expired
            if (err.response.status === 401 && !originalConfig._retry) {
                originalConfig._retry = true;

                try {
                    const res = await API.post('/auth/refresh_token');

                    const { accessToken } = res.data;
                    setAccessToken(accessToken);

                    return API(originalConfig);
                } catch (_error) {
                    return Promise.reject(_error);
                }
            }
        }

        return Promise.reject(err);
    },
);

export default API;
export * as auth from './auth';
export * as users from './users';
export * as problems from './problems';
export * as companies from './companies';
export * as tags from './tags';
export * as submissions from './submissions';
