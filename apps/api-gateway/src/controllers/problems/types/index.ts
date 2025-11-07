import { IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';

export class GetProblemsQueryDto {
    @IsOptional()
    @IsNumberString()
    limit?: string;

    @IsOptional()
    @IsNumberString()
    offset?: string;

    @IsOptional()
    @IsNotEmpty()
    name?: string;

    @IsOptional()
    @IsNotEmpty()
    difficulty?: string;

    @IsOptional()
    @IsNotEmpty()
    sortBy?: string;

    @IsOptional()
    @IsNotEmpty()
    sortOrder?: string;
}
