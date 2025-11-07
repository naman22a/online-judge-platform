import { Difficulty } from '@leetcode/database';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsDateString,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Matches,
    Max,
    Min,
    ValidateNested,
} from 'class-validator';

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

export class CreateProblemDto {
    @IsNotEmpty()
    title: string;

    @IsString()
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: 'Slug must be lowercase alphanumeric characters separated by hyphens.',
    })
    slug: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsEnum(Difficulty)
    difficulty: Difficulty;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Max(100)
    acceptanceRate?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    totalSubmissions?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    totalAccepted?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    likes?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    dislikes?: number;

    @IsOptional()
    @IsBoolean()
    isPremium?: boolean;

    @IsOptional()
    @IsString()
    constraints?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    hints?: string[];

    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    similarProblems?: number[];

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateProblemTagDto)
    problemTags?: CreateProblemTagDto[];

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateProblemCompanyDto)
    problemCompanies?: CreateProblemCompanyDto[];

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateTestCaseDto)
    testCases?: CreateTestCaseDto[];
}

export class CreateTestCaseDto {
    @IsString()
    @IsNotEmpty()
    input: string;

    @IsString()
    @IsNotEmpty()
    expectedOutput: string;

    @IsOptional()
    @IsBoolean()
    isSample?: boolean;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsString()
    explanation?: string;
}

export class CreateProblemTagDto {
    @IsInt()
    tagId: number;
}

export class CreateProblemCompanyDto {
    @IsInt()
    companyId: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    frequency?: number;

    @IsOptional()
    @IsString()
    lastAskedDate?: string;
}

export class UpdateProblemDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    slug?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsEnum(Difficulty)
    difficulty?: Difficulty;

    @IsOptional()
    @IsBoolean()
    isPremium?: boolean;

    @IsOptional()
    @IsString()
    constraints?: string;

    @IsOptional()
    @IsArray()
    hints?: string[];

    @IsOptional()
    @IsArray()
    similarProblems?: number[];

    @IsOptional()
    @IsNumber()
    createdById?: number;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ProblemTagInput)
    problemTags?: ProblemTagInput[];

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ProblemCompanyInput)
    problemCompanies?: ProblemCompanyInput[];

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => TestCaseInput)
    testCases?: TestCaseInput[];
}

export class ProblemTagInput {
    @IsNumber()
    tagId: number;
}

export class ProblemCompanyInput {
    @IsNumber()
    companyId: number;

    @IsOptional()
    @IsNumber()
    frequency?: number;

    @IsOptional()
    @IsDateString()
    lastAskedDate?: string;
}

export class TestCaseInput {
    @IsString()
    input: string;

    @IsString()
    expectedOutput: string;

    @IsOptional()
    @IsBoolean()
    isSample?: boolean;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsString()
    explanation?: string;
}
