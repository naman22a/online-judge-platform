import API from '..';
import type { IUser } from './types';

export const me = async (): Promise<IUser> => {
    const res = await API.get('/users/me');
    return res.data;
};
