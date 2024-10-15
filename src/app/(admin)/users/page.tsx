import accountApiRequest from '@/services/user';

import { cookies } from 'next/headers'
import React from 'react'
import { DataTable } from './data-table';
import { columns } from './column';
import { ADMIN_ROLE } from '@/type';

export default async function UsersPage() {

    const accessToken = cookies().get('accessToken');
    const result = await accountApiRequest.getAllUsers(accessToken?.value ?? '');
    const users = result.payload.data.filter((user) => (
        !user.roles.some(role => role.name === ADMIN_ROLE)
    ));

    return (
        <div className='flex flex-col space-y-10'>
            <h1 className='text-xl text-center font-bold mt-10'>User management</h1>
            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={users} />
            </div>
        </div>
    )
}
