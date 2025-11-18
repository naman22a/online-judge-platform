import API from '..';
import type { ITag } from './types';

export const findAll = async (): Promise<ITag[]> => {
    try {
        const res = await API.get('/tags');
        return res.data;
    } catch (error) {
        console.error(error);
        return [];
    }
};
