export type IUser = {
    id: number;
    username: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    bio: string | null;
    github_url: string | null;
    linkedin_url: string | null;
    website_url: string | null;
    is_admin: boolean;
    created_at: Date;
    updated_at: Date;
} | null;
