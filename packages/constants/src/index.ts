export const MICROSERVICES = {
    USERS_SERVICE: 'USERS_SERVICE',
    AUTH_SERVICE: 'AUTH_SERVICE',
    PROBLEMS_SERVICE: 'PROBLEMS_SERVICE',
    TAGS_SERVICE: 'TAGS_SERVICE',
    COMPANIES_SERVICE: 'COMPANIES_SERVICE',
};

export const COOKIE_NAME = 'jid';

export const USERS = {
    FIND_ALL: 'users.findAll',
    CURRENT: 'users.current',
    FIND_ONE: 'users.findOne',
    UPDATE: 'users.update',
};

export const AUTH = {
    REGISTER: 'auth.register',
    CONFIRM_EMAIL: 'auth.confirmEmail',
    LOGIN: 'auth.login',
    LOGOUT: 'auth.logout',
    REFRESH_TOKEN: 'auth.refreshToken',
    FORGOT_PASSWORD: 'auth.forgotPassword',
    RESET_PASSWORD: 'auth.resetPassword',
};

export const PROBLEMS = {
    FIND_ALL: 'problems.findAll',
    FIND_ONE: 'problems.findOne',
    CREATE: 'problems.create',
    DELETE: 'problems.delete',
    UPDATE: 'problems.update',
};

export const TAGS = {
    FIND_ALL: 'tags.findAll',
    FIND_ONE: 'tags.findOne',
    CREATE: 'tags.create',
};

export const COMPANIES = {
    FIND_ALL: 'companies.findAll',
    FIND_ONE: 'companies.findOne',
    CREATE: 'companies.create',
};
