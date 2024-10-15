import React from 'react'
import RegisterForm from '@/components/register-form'

export default function RegisterPage() {
    return (
        <div className='mt-24'>
            <h1 className='text-center text-xl font-semibold'>Register Page</h1>
            <div className='flex justify-center'>
                <RegisterForm />
            </div>
        </div>
    )
}
