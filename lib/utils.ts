import { isClerkAPIResponseError } from '@clerk/nextjs';
import { type ClassValue, clsx } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import * as z from 'zod';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function catchClerkError(err: any) {
    const unknownErr = 'Something went wrong, please try again later.';

    if (err instanceof z.ZodError) {
        const errors = err.issues.map((issue) => {
            return issue.message;
        });
        return toast(errors.join('\n'));
    } else if (isClerkAPIResponseError(err)) {
        return toast.error(err.errors[0]?.longMessage ?? unknownErr);
    } else {
        return toast.error(unknownErr);
    }
}
