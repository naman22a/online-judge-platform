import { IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class UpdateUserDetails {
    @IsOptional()
    @IsNotEmpty()
    username?: string;

    @IsOptional()
    @IsNotEmpty()
    full_name?: string;

    @IsOptional()
    @IsUrl()
    avatar_url?: string;

    @IsOptional()
    @IsNotEmpty()
    bio?: string;

    @IsOptional()
    @IsUrl()
    github_url?: string;

    @IsOptional()
    @IsUrl()
    linkedin_url?: string;

    @IsOptional()
    @IsUrl()
    website_url?: string;
}
