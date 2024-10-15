import roleApiRequest from '@/services/role';
import accountApiRequest from '@/services/user';
import ProfileForm from '@/components/profile-form';
import { cookies } from 'next/headers';
import React from 'react'

export default async function EditUserPage({ params }: { params: { id: string } }) {

    const accessToken = cookies().get('accessToken');
    const userId = params.id
    const result = await accountApiRequest.getUserById(accessToken?.value ?? '', userId);
    const user = result.payload.data;
    const roles = (await roleApiRequest.getAllRoles(accessToken?.value ?? '')).payload.data;


    return (
        <div className='space-y-24'>
            <h2 className='text-center text-3xl mt-10'>Edit user</h2>
            <div className='flex justify-center'>
                <ProfileForm profile={user} roles={roles} />
            </div>
        </div>
    )
}
