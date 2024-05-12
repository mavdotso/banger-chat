import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { generateUsername } from './_actions/generate-username';
import AccountSetupForm from './_components/account-setup-form';

export default async function AccountPage() {
    const user = await currentUser();

    if (!user) redirect('/login');

    const username = (await generateUsername(user)) ?? '';

    return (
        <div className="mx-auto flex h-[95vh] w-full max-w-lg flex-col items-center justify-center gap-6">
            <AccountSetupForm username={username} />
        </div>
    );
}
