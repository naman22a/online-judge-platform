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
        compile: ['g++', '/sandbox/solution.cpp', '-o', '/sandbox/solution'],
        run: ['/sandbox/solution'],
        defaultCode: `#include<iostream>
using namespace std;

int main(){
    
    return 0;
}`,
    },

    python: {
        image: 'python:3.9',
        run: ['python3', '/sandbox/solution.py'],
        defaultCode: '',
    },

    javascript: {
        image: 'node:18',
        run: ['node', '/sandbox/solution.js'],
        defaultCode: '',
    },

    java: {
        image: 'openjdk:17',
        compile: ['javac', '/sandbox/Solution.java'],
        run: ['java', '-cp', '/sandbox', 'Solution'],
        defaultCode: `public class Solution {
    public static void main(String[] args) {
    }
}`,
    },

    go: {
        image: 'golang:1.20',
        compile: ['go', 'build', '-o', '/sandbox/solution', '/sandbox/solution.go'],
        run: ['/sandbox/solution'],
        defaultCode: `package main
func main() {
}`,
    },

    rust: {
        image: 'rust:1.69',
        compile: ['rustc', '/sandbox/solution.rs', '-o', '/sandbox/solution'],
        run: ['/sandbox/solution'],
        defaultCode: `fn main() {
}`,
    },

    csharp: {
        image: 'mcr.microsoft.com/dotnet/sdk:7.0',
        compile: ['csc', '/sandbox/Solution.cs'],
        run: ['dotnet', '/sandbox/Solution.dll'],
    },

    ruby: {
        image: 'ruby:3.2',
        run: ['ruby', '/sandbox/solution.rb'],
    },

    swift: {
        image: 'swift:5.8',
        compile: ['swiftc', '/sandbox/solution.swift', '-o', '/sandbox/solution'],
        run: ['/sandbox/solution'],
    },

    php: {
        image: 'php:8.2',
        run: ['php', '/sandbox/solution.php'],
    },

    kotlin: {
        image: 'openjdk:17',
        compile: [
            'kotlinc',
            '/sandbox/Solution.kt',
            '-include-runtime',
            '-d',
            '/sandbox/Solution.jar',
        ],
        run: ['java', '-jar', '/sandbox/Solution.jar'],
    },

    dart: {
        image: 'dart:3.0',
        compile: ['dart', 'compile', 'exe', '/sandbox/solution.dart', '-o', '/sandbox/solution'],
        run: ['/sandbox/solution'],
    },

    r: {
        image: 'r-base:latest',
        run: ['Rscript', '/sandbox/solution.R'],
    },

    perl: {
        image: 'perl:5.36',
        run: ['perl', '/sandbox/solution.pl'],
    },

    typescript: {
        image: 'node:18',
        compile: ['tsc', '/sandbox/solution.ts'],
        run: ['node', '/sandbox/solution.js'],
        defaultCode: '',
    },

    haskell: {
        image: 'haskell:9.6',
        compile: ['ghc', '/sandbox/solution.hs', '-o', '/sandbox/solution'],
        run: ['/sandbox/solution'],
    },
};
