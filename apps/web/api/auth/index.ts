import axios from 'axios';
import API from '..';
import { LoginDto, RegisterDto } from './types';
import { LoginResponse, OkResponse } from '../types';

export const register = async (data: RegisterDto): Promise<OkResponse> => {
    try {
        const res = await API.post('/auth/register', data);
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return error.response?.data;
        }
        return { ok: false, errors: [{ field: 'server', message: 'Something went wrong' }] };
    }
};

export const confirmEmail = async (token: string): Promise<OkResponse> => {
    try {
        const res = await API.post(`/auth/confirm-email/${token}`);
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return error.response?.data;
        }
        return { ok: false, errors: [{ field: 'server', message: 'Something went wrong' }] };
    }
};

export const login = async (data: LoginDto): Promise<LoginResponse> => {
    try {
        const res = await API.post('/auth/login', data);
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return error.response?.data;
        }
        return { accessToken: '', errors: [{ field: 'server', message: 'Something went wrong' }] };
    }
};

export const logout = async (): Promise<OkResponse> => {
    try {
        const res = await API.post('/auth/logout');
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return error.response?.data;
        }
        return { ok: false, errors: [{ field: 'server', message: 'Something went wrong' }] };
    }
};
