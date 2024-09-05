"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ModeToggle() {
    const { theme, setTheme } = useTheme();

    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true)
    }, [])

    return (mounted &&
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className='hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300'
        >
            {theme === "light" ? (
                <Sun className="h-[1.2rem] w-[1.2rem] text-indigo-600" />
            ) : (
                <Moon className="h-[1.2rem] w-[1.2rem] text-indigo-600" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
