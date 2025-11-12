import axios from 'axios';
import API, { companies } from '..';
import { GetProblemsQueryDto, IProblem } from './types';
import { CreateProblemDto, OkResponse } from '@leetcode/types';

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

export const findOne = async (slug: string): Promise<OkResponse | IProblem> => {
    try {
        const res = await API.get(`/problems/{slug}`);
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) return error.response?.data;
        return {
            ok: false,
            errors: [{ field: 'server', message: 'Something went wrong' }],
        };
    }
};

export const create = async (data: any): Promise<IProblem | null> => {
    try {
        const res = await API.post('/problems', {
            ...data,
            companies: undefined,
            tags: undefined,
            problemTags: data.tags.map((tag: number) => ({ tagId: tag })),
            problemCompanies: data.companies.map((company: any) => ({ ...company })),
        });
        return res.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};
