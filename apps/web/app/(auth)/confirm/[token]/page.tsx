'use client';
import { use } from 'react';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import * as api from '@/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';

function ConfirmEmail({ params }: { params: Promise<{ token: string }> }) {
    const router = useRouter();
    const { token } = use(params);
    const { mutateAsync: confirmEmail, isPending } = useMutation({
        mutationKey: ['auth', 'confirm-email'],
        mutationFn: api.auth.confirmEmail,
    });

    const handleSubmit = async () => {
        try {
            const res = await confirmEmail(token);
            if (res.ok && !res.errors) {
                toast.success('Now you can login');
                router.push('/login');
            } else {
                throw Error(res.errors?.toString());
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong');
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen w-full">
            <h1 className="font-semibold text-4xl mb-5">ConfirmEmail</h1>
            <Button onClick={() => handleSubmit()}>{isPending && <Spinner />} Confirm Email</Button>
        </div>
    );
}

export default ConfirmEmail;
