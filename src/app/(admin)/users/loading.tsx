import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Loading() {
    return (
        <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin w-10 h-10 text-primary" />
        </div>
    )
}
