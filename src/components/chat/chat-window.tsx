import MessageBox from './message-box';

export default function ChatWindow() {
    return (
        <div className="relative flex h-full min-h-[50vh] border flex-col rounded-xl bg-muted p-4 lg:col-span-2">
            <div className="flex-1">{/* {TODO: CHAT BOX} */}</div>
            <MessageBox />
        </div>
    );
}
