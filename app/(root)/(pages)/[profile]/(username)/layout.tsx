'use client';
import { UserProfile } from '@clerk/nextjs';
import { useParams } from 'next/navigation';

interface PagesLayoutProps {
    children: React.ReactNode;
}

export default function ProfileLayout({ children }: PagesLayoutProps) {
    const params = useParams();
    const profile = params.profile as string;
    const username = decodeURIComponent(profile).substring(1);

    return;
}
