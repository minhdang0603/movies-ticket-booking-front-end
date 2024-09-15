import { clsx, type ClassValue } from "clsx"
import { UseFormSetError } from "react-hook-form"
import { twMerge } from "tailwind-merge"
import { toast } from "@/hooks/use-toast"
import jwt from "jsonwebtoken"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleErrorApi = ({ error, duration }: {
  error: any,
  duration?: number
}) => {
  toast({
    title: 'Error',
    description: error?.payload?.message ?? 'Lỗi không xác định',
    variant: 'destructive',
    duration: duration ?? 5000
  })
}

/**
 * Xóa đi ký tự '/' đầu tiên của path
 */
export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path;
}

export const decodeJWT = <Payload = any>(token: string) => {
  return jwt.decode(token) as Payload;
}

export const normalizeTitle = (title: string) => {
  title = title.toLowerCase();
  let words = title.split(' ');
  words = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
  return words.join(' ');
}
