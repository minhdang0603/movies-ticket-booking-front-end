import React from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation';
import accountApiRequest from '@/apiRequests/user';
import { toast } from '@/hooks/use-toast';
import { CheckCircleIcon } from 'lucide-react';

export default function DeleteUserButton({ userId }: {
    userId: string
}) {

    const router = useRouter();

    const handleDeleteUser = async (userId: string) => {
        const res = await accountApiRequest.deleteUser(userId);
        router.refresh();
        toast({
            description: (
                <div className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" /> {/* Success icon */}
                    <span>{res.payload.message}</span>
                </div>
            )
        });
    }

    return (
        <Button
            onClick={() => handleDeleteUser(userId)}
            variant={'destructive'}
            size={'sm'}
        >
            Delete user
        </Button>
    )
}
