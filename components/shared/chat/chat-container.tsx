import { Card } from '@/components/ui/card';

type Props = React.PropsWithChildren<{}>;

export default function ChatContainer({ children }: Props) {
    return <Card className="w-full h-[calc(100svh-32px)] lg:h-full p-2 flex flex-col gap-2">{children}</Card>;
}
