import { Difficulty } from '@leetcode/database';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    ArrayMinSize,
    IsArray,
    IsBoolean,
    IsDateString,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
    Length,
    Matches,
    Max,
    MaxLength,
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

export class CreateTagDto {
    @ApiProperty({
        example: 'Dynamic Programming',
        description: 'Human-readable name of the tag.',
    })
    @IsString()
    @IsNotEmpty()
    @Length(2, 50, { message: 'Tag name must be between 2 and 50 characters long.' })
    name: string;

    @ApiProperty({
        example: 'dynamic-programming',
        description: 'URL-friendly slug used for the tag.',
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: 'Slug must be lowercase and use hyphens (e.g., "binary-search").',
    })
    slug: string;

    @ApiProperty({
        example: 'Problems involving overlapping subproblems and optimal substructure.',
        description: 'Optional description of the tag.',
        required: false,
    })
    @IsString()
    @IsOptional()
    @Length(0, 255)
    description?: string;
}

export class BulkCreateTagsDto {
    @ApiProperty({
        description: 'Array of tags to create in bulk.',
        type: [CreateTagDto],
        example: [
            {
                name: 'Array',
                slug: 'array',
                description: 'Problems involving manipulation and traversal of arrays.',
            },
            {
                name: 'Hash Table',
                slug: 'hash-table',
                description: 'Problems using hash maps or dictionaries for fast lookups.',
            },
        ],
    })
    @ValidateNested({ each: true })
    @Type(() => CreateTagDto)
    @ArrayMinSize(1, { message: 'At least one tag must be provided.' })
    tags: CreateTagDto[];
}

export class CreateCompanyDto {
    @ApiProperty({
        description: 'The name of the company.',
        example: 'Google',
    })
    @IsString()
    @IsNotEmpty({ message: 'Company name must not be empty.' })
    @MaxLength(100, { message: 'Company name must not exceed 100 characters.' })
    name: string;

    @ApiProperty({
        description: 'Unique slug identifier for the company (used in URLs).',
        example: 'google',
    })
    @IsString()
    @IsNotEmpty({ message: 'Slug must not be empty.' })
    @MaxLength(100, { message: 'Slug must not exceed 100 characters.' })
    slug: string;

    @ApiProperty({
        description: 'Optional logo URL for the company.',
        example: 'https://logo.clearbit.com/google.com',
        required: false,
    })
    @IsString()
    @IsOptional()
    @IsUrl({}, { message: 'Logo URL must be a valid URL.' })
    @MaxLength(500, { message: 'Logo URL must not exceed 500 characters.' })
    logoUrl?: string;
}

export class BulkCreateCompaniesDto {
    @ApiProperty({
        description: 'Array of companies to create in bulk.',
        type: [CreateCompanyDto],
        example: [
            { name: 'Google', slug: 'google', logoUrl: 'https://logo.clearbit.com/google.com' },
            { name: 'Amazon', slug: 'amazon', logoUrl: 'https://logo.clearbit.com/amazon.com' },
        ],
    })
    @ValidateNested({ each: true })
    @Type(() => CreateCompanyDto)
    @ArrayMinSize(1, { message: 'At least one company must be provided.' })
    companies: CreateCompanyDto[];
}
