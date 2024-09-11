import accountApiRequest from '@/apiRequests/user';
import ProfileForm from '@/components/profile-form';
import { cookies } from 'next/headers';
import React from 'react'

export default async function MyInfoPage() {
  const accessToken = cookies().get('accessToken');
  const result = await accountApiRequest.myInfo(accessToken?.value ?? '');

  return (
    <div className='space-y-24'>
      <h2 className='text-center text-3xl mt-10'>My info</h2>
      <div className='flex justify-center'>
        <ProfileForm profile={result.payload.data} />
      </div>
    </div>
  )
}
