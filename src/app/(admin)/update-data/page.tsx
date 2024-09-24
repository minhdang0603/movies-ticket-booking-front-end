import UpdateDataForm from '@/components/update-data-form';
import React from 'react'

export default function UpdateData() {

    return (
        <div className='space-y-24'>
            <h2 className='text-center text-3xl mt-10'>Update data</h2>
            <div>
                <UpdateDataForm />
            </div>
        </div>
    )
}
