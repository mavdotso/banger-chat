import Sidebar from '@/components/nav/sidebar';
import Header from '@/components/nav/header';
import ChatPage from '@/components/chat/chat-page';
import PrivyProviderWrapper from '@/components/providers/privy-provider';

export default function Home() {
    return (
        <div className="grid h-screen w-full pl-[56px]">
            <Sidebar />
            <div className="flex flex-col">
                <Header />
                <PrivyProviderWrapper>
                    <ChatPage />
                </PrivyProviderWrapper>
            </div>
        </div>
    );
}
