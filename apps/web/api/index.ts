import axios from 'axios';

const API = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api`,
    withCredentials: true,
});

export default API;
export * as auth from './auth';
