export class GetProblemsQueryDto {
    limit?: string;
    offset?: string;
    name?: string;
    difficulty?: string;
    sortBy?: string;
    sortOrder?: string;
}

export enum ProblemDifficulty {
    EASY = 'Easy',
    MEDIUM = 'Medium',
    HARD = 'Hard',
}

export interface IProblem {
    id: number;
    title: string;
    slug: string;
    description: string;
    difficulty: ProblemDifficulty;
    acceptanceRate: string;
    totalSubmissions: number;
    totalAccepted: number;
    likes: number;
    dislikes: number;
    constraints: string;
    hints: string[];
    similarProblems: number[];
    createdById: number;
    createdAt: string;
    updatedAt: string;
    problemTags: {
        tag: {
            id: number;
            name: string;
            slug: string;
            description: string;
            createdAt: string;
        };
    }[];
}
