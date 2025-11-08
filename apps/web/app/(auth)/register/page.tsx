'use client';
import z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import * as api from '@/api';
import { toast } from 'sonner';

const registerSchema = z.object({
    username: z.string().min(1),
    email: z.email(),
    password: z.string().min(6),
});

function Register() {
    const { mutateAsync: register } = useMutation({
        mutationKey: ['auth', 'register'],
        mutationFn: api.auth.register,
    });

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
    });

    async function onSubmit(data: z.infer<typeof registerSchema>) {
        try {
            const res = await register(data);
            if (res.ok && !res.errors) {
                toast.success('Check your email');
            } else if (res.errors) {
                for (let error of res.errors) {
                    form.setError(error.field as any, {
                        message: error.message,
                    });
                }
            } else {
                throw new Error('Network Error');
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong');
        }
    }

    return (
        <div className="min-h-screen w-full flex justify-center items-center">
            <Card className="w-full sm:max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-4xl">Register</CardTitle>
                </CardHeader>
                <CardContent>
                    <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Controller
                                name="username"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="username">Username</FieldLabel>
                                        <Input
                                            {...field}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Username"
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="email">Email</FieldLabel>
                                        <Input
                                            {...field}
                                            type="email"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Email"
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="password">Password</FieldLabel>
                                        <Input
                                            {...field}
                                            type="password"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Password"
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter>
                    <Button type="submit" form="register-form">
                        {form.formState.isSubmitting ? 'Loading...' : 'Register'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

export default Register;
