'use client';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import authApiRequest from "@/apiRequests/auth";
import { decodeJWT, handleErrorApi } from "@/lib/utils";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { CheckCircleIcon, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { ADMIN_ROLE, PayloadJWT, USER_ROLE } from "@/type";
import { clientAccessToken } from "@/lib/http";


function LoginForm() {

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordValue, setPasswordValue] = useState('');

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState)
    }

    // 1. Define your form.
    const form = useForm<LoginBodyType>({
        resolver: zodResolver(LoginBody),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: LoginBodyType) {
        if (loading) return;
        setLoading(true);
        try {
            const res = await authApiRequest.login(values);
            await authApiRequest.auth({ accessToken: res.payload.data.token });
            toast({
                description: (
                    <div className="flex items-center">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" /> {/* Success icon */}
                        <span>Login successful</span>
                    </div>
                )
            });
            const jwtPayload = decodeJWT<PayloadJWT>(clientAccessToken.value);
            const userRole = jwtPayload.scope.split('ROLE_')[1];
            console.log(userRole);

            if (userRole === ADMIN_ROLE) {
                location.href = '/dashboard';
            }

            if (userRole === USER_ROLE) {
                location.href = '/';
            }
        } catch (error: any) {
            handleErrorApi({
                error
            })
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 max-w-[400px] flex-shrink w-full  ">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="Email" type="email" formNoValidate {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        placeholder="Password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={passwordValue}
                                        onChange={e => {
                                            field.onChange(e)
                                            setPasswordValue(e.target.value)
                                        }}
                                    />
                                    {passwordValue && <span
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:cursor-pointer me-2"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </span>}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    className="!mt-8 w-full"
                    disabled={loading}  // Disable the button while loading
                >
                    {loading ? (
                        <svg
                            className="animate-spin h-5 w-5 mr-3 text-inherit inline-block"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                        </svg>
                    ) : (
                        'Login'
                    )}
                </Button>
                <div className="text-center">
                    <span>Don't have an account?</span>
                    <Link href="/register" passHref>
                        <Button variant={'link'}>
                            Sign up
                        </Button>
                    </Link>
                </div>
            </form>
        </Form>
    )
}

export default LoginForm
