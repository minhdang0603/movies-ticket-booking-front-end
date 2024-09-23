import React from 'react'

export default function loading() {
    return (
        <div>
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="flex flex-col items-center">
                    <div className="animate-spin mb-4 h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                    <h1 className="text-lg text-gray-700">Crawling data...</h1>
                </div>
            </div>
        </div>
    )
}
