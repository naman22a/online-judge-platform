import axios from 'axios';
import API from '..';
import { GetProblemsQueryDto, IProblem } from './types';

export const getProblems = async (
    params: GetProblemsQueryDto,
): Promise<{
    total: number;
    limit: number;
    offset: number;
    data: IProblem[];
}> => {
    try {
        const res = await API.get('/problems', { params });
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) return error.response?.data;
        return {
            total: 0,
            limit: 0,
            offset: 0,
            data: [],
        };
    }
};
