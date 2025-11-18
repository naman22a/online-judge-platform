export interface FieldError {
    field: string;
    message: string;
}

export interface OkResponse {
    ok: boolean;
    errors?: FieldError[];
}

export interface LoginResponse {
    accessToken: string;
    refreshToken?: string;
    errors?: FieldError[];
}
