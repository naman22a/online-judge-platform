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

export class AccessTokenPayload {
    userId: number;
}

export class RefreshTokenPayload {
    userId: number;
    tokenVersion: number;
}
