export class RegisterDto {
    username: string;
    email: string;
    password: string;
}

export class FieldError {
    field: string;
    message: string;
}

export class OkResponse {
    ok: boolean;
    errors?: FieldError[];
}
