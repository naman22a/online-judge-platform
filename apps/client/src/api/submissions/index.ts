import API from '..';
import type { ISubmission } from './types';

export const findAll = async (problemId: number): Promise<ISubmission[]> => {
    try {
        const res = await API.get(`/submissions/${problemId}`);
        return res.data;
    } catch (error) {
        console.error(error);
        return [];
    }
};
