export class FieldError {
    field: string;
    message: string;
}

export class OkResponse {
    ok: boolean;
    errors?: FieldError[];
}

export class LoginResponse {
    accessToken: string;
    refreshToken?: string;
    errors?: FieldError[];
}
