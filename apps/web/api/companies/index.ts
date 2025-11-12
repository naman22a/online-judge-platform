import API from '..';
import { ICompany } from './types';

export const findAll = async (): Promise<ICompany[]> => {
    try {
        const res = await API.get('/companies');
        return res.data;
    } catch (error) {
        console.error(error);
        return [];
    }
};
