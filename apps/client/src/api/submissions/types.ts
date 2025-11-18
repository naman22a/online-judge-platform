export interface ISubmission {
    id: number;
    userId: number;
    problemId: number;
    language: string;
    code: string;
    status: string;
    submittedAt: string;
}
