'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { handleErrorApi } from "@/lib/utils";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { CheckCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { AccountResType, UpdateMeBody, UpdateMeBodyType } from "@/schemaValidations/user.schema";
import accountApiRequest from "@/services/user";
import { RoleType } from "@/schemaValidations/common.schema";

type Profile = AccountResType['data'];

function ProfileForm({ profile, roles }: {
    profile: Profile,
    roles?: RoleType[]
}) {

    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // 1. Define your form.
    const form = useForm<UpdateMeBodyType>({
        resolver: zodResolver(UpdateMeBody),
        defaultValues: {
            userId: profile.userId,
            email: profile.email,
            name: profile.name,
            phone: profile.phone,
            roles: profile.roles.map(role => role.name)
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: UpdateMeBodyType) {
        if (loading) return;
        setLoading(true);
        try {
            console.log(values);

            await accountApiRequest.updateUser(values);
            router.refresh();
            toast({
                description: (
                    <div className="flex items-center">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" /> {/* Success icon */}
                        <span>Update successful</span>
                    </div>
                )
            });
        } catch (error: any) {
            handleErrorApi({
                error
            });
        } finally {
            setLoading(false);
        }
    };


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 max-w-[500px] flex-shrink w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                    <Input
                        placeholder="Email"
                        type="email"
                        value={profile.email}
                        readOnly
                    />
                </FormControl>
                <FormMessage />
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full name</FormLabel>
                            <FormControl>
                                <Input placeholder="Name" type="text" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone number</FormLabel>
                            <FormControl>
                                <Input placeholder="Phone number" type="text" formNoValidate {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {roles &&
                    <FormField
                        control={form.control}
                        name="roles"
                        render={({ field }) => (
                            <FormItem>
                                <div className="mb-4">
                                    <FormLabel className="text-base">Roles</FormLabel>
                                </div>
                                {roles.map((role) => (
                                    <FormField
                                        key={role.name}
                                        control={form.control}
                                        name="roles"
                                        render={({ field }) => {
                                            return (
                                                <FormItem
                                                    key={role.name}
                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                >
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value?.includes(role.name)}
                                                            onCheckedChange={(checked) => {
                                                                return checked
                                                                    ? field.onChange([...field.value, role.name])
                                                                    : field.onChange(
                                                                        field.value?.filter(
                                                                            (value) => value !== role.name
                                                                        )
                                                                    )
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        {role.description}
                                                    </FormLabel>
                                                </FormItem>
                                            )
                                        }}
                                    />
                                ))}
                                <FormMessage />
                            </FormItem>
                        )}
                    />}
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
                        'Update'
                    )}
                </Button>
            </form>
        </Form>
    );
}

export default ProfileForm;
