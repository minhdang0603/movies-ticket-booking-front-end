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
import { handleErrorApi } from "@/lib/utils";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { CheckCircleIcon } from "lucide-react";


function LoginForm() {

    const [loading, setLoading] = useState(false);
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
                ),
                duration: 5000,
            });
            location.href = '/my-info';
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
                                <Input placeholder="Password" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="!mt-8 w-full">Login</Button>
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
