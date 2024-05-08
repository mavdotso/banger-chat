import ChatWindow from '@/components/chat/chat-window';
import ChatList from '@/components/chat/chat-list';
import Sidebar from '@/components/nav/sidebar';
import Header from '@/components/nav/header';

export default function Home() {
    return (
        <div className="grid h-screen w-full pl-[56px]">
            <Sidebar />
            <div className="flex flex-col">
                <Header />
                <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
                    <ChatList />
                    <ChatWindow />
                </main>
            </div>
        </div>
    );
}
