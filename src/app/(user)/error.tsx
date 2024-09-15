'use client'
import { HttpError } from "@/lib/http"

// Error boundaries must be Client Components

export default function GlobalError({
    error,
}: {
    error: HttpError & { digest?: string }
}) {
    console.log(error.message);

    return (
        // global-error must include html and body tags
        <html>
            <body>
                <div className="space-y-10 text-4xl text-center mt-28">
                    <h2>404 | This page could not be found</h2>
                    <a href="/">Go to home page</a>
                </div>
            </body>
        </html>
    )
}