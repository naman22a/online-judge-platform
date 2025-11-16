export const MICROSERVICES = {
    USERS_SERVICE: 'USERS_SERVICE',
    AUTH_SERVICE: 'AUTH_SERVICE',
    PROBLEMS_SERVICE: 'PROBLEMS_SERVICE',
    TAGS_SERVICE: 'TAGS_SERVICE',
    COMPANIES_SERVICE: 'COMPANIES_SERVICE',
    SUBMISSIONS_SERVICE: 'SUBMISSIONS_SERVICE',
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

export const SUBMISSIONS = {
    FIND_ALL: 'submissions.findAll',
    CREATE: 'submissions.create',
};

export const LANG_CONFIGS: Record<
    string,
    { image: string; compile?: string[]; run: string[]; defaultCode?: string }
> = {
    cpp: {
        image: 'gcc:latest',
        compile: ['g++', '/app/solution.cpp', '-o', '/app/solution'],
        run: ['/app/solution'],
        defaultCode: `#include<iostream>
using namespace std;

int main(){
    
    return 0;
}`,
    },
    python: {
        image: 'python:3.9',
        run: ['python3', '/app/solution.py'],
        defaultCode: '',
    },
    javascript: {
        image: 'node:18',
        run: ['node', '/app/solution.js'],
    },
    java: {
        image: 'openjdk:17',
        compile: ['javac', '/app/Solution.java'],
        run: ['java', '-cp', '/app', 'Solution'],
    },
    go: {
        image: 'golang:1.20',
        compile: ['go', 'build', '-o', '/app/solution', '/app/solution.go'],
        run: ['/app/solution'],
    },
    rust: {
        image: 'rust:1.69',
        compile: ['rustc', '/app/solution.rs', '-o', '/app/solution'],
        run: ['/app/solution'],
    },
    csharp: {
        image: 'mcr.microsoft.com/dotnet/sdk:7.0',
        compile: ['csc', '/app/Solution.cs'],
        run: ['dotnet', '/app/Solution.dll'],
    },
    ruby: {
        image: 'ruby:3.2',
        run: ['ruby', '/app/solution.rb'],
    },
    swift: {
        image: 'swift:5.8',
        compile: ['swiftc', '/app/solution.swift', '-o', '/app/solution'],
        run: ['/app/solution'],
    },
    php: {
        image: 'php:8.2',
        run: ['php', '/app/solution.php'],
    },
    kotlin: {
        image: 'openjdk:17',
        compile: ['kotlinc', '/app/Solution.kt', '-include-runtime', '-d', '/app/Solution.jar'],
        run: ['java', '-jar', '/app/Solution.jar'],
    },
    dart: {
        image: 'dart:3.0',
        compile: ['dart', 'compile', 'exe', '/app/solution.dart', '-o', '/app/solution'],
        run: ['/app/solution'],
    },
    r: {
        image: 'r-base:latest',
        run: ['Rscript', '/app/solution.R'],
    },
    perl: {
        image: 'perl:5.36',
        run: ['perl', '/app/solution.pl'],
    },
    typescript: {
        image: 'node:18',
        compile: ['tsc', '/app/solution.ts'],
        run: ['node', '/app/solution.js'],
    },
    haskell: {
        image: 'haskell:9.6',
        compile: ['ghc', '/app/solution.hs', '-o', '/app/solution'],
        run: ['/app/solution'],
    },
};
