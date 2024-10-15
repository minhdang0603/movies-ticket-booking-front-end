import React from 'react'
import LoginForm from '@/components/login-form'

export default function LoginPage() {
    return (
        <div className='mt-24'>
            <h1 className='text-xl font-semibold text-center'>
                Login page
            </h1>
            <div className='flex justify-center'>
                <LoginForm />
            </div>
        </div>
    )
}
